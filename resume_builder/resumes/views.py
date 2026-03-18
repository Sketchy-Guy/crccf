"""API views for resume operations."""

from pathlib import Path

from django.conf import settings
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from admin_panel.models import AdminConfig
from .models import DownloadLink, Resume, ResumeSession, ShareHistory
from .serializers import (
    DownloadLinkSerializer,
    ResumeDetailSerializer,
    ResumeSerializer,
    ResumeSessionSerializer,
    SendEmailSerializer,
    SendWhatsAppSerializer,
    ShareHistorySerializer,
)
from .signals import emit_resume_activity
from .utils.email_service import send_resume_email
from .utils.pdf_generator import generate_resume_pdf
from .utils.whatsapp_service import send_resume_whatsapp


def feature_enabled(feature: str) -> bool:
    """Return whether a feature toggle is enabled, defaulting to enabled."""
    config = AdminConfig.objects.filter(feature=feature).first()
    return True if config is None else config.is_enabled


def ensure_default_admin_config() -> None:
    """Create default feature toggles the first time the API is used."""
    for feature_name in ["download", "print", "email", "whatsapp", "password_protection"]:
        AdminConfig.objects.get_or_create(feature=feature_name, defaults={"is_enabled": True})


class ResumeListCreateView(APIView):
    """Create resumes and list active resumes."""

    def get(self, request):
        """Return the list of active resumes."""
        ensure_default_admin_config()
        serializer = ResumeDetailSerializer(Resume.objects.filter(is_active=True), many=True)
        return Response(serializer.data)

    def post(self, request):
        """Create a new resume and start its 20-minute session."""
        ensure_default_admin_config()
        serializer = ResumeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        resume = serializer.save()
        ResumeSession.objects.create(resume=resume)
        return Response(ResumeDetailSerializer(resume).data, status=status.HTTP_201_CREATED)


class ResumeDetailView(APIView):
    """Read, update, and soft-delete a resume."""

    def get_object(self, resume_id: str) -> Resume:
        """Load a resume using its business identifier."""
        return get_object_or_404(Resume, resume_id=resume_id, is_active=True)

    def get(self, request, resume_id: str):
        """Return a single resume with feature config."""
        return Response(ResumeDetailSerializer(self.get_object(resume_id)).data)

    def put(self, request, resume_id: str):
        """Update a resume if its session has not expired."""
        resume = self.get_object(resume_id)
        if hasattr(resume, "session"):
            resume.session.save()
            if resume.session.is_expired:
                return Response({"detail": "Resume editing session has expired."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ResumeSerializer(resume, data=request.data)
        serializer.is_valid(raise_exception=True)
        updated_resume = serializer.save()
        return Response(ResumeDetailSerializer(updated_resume).data)

    def delete(self, request, resume_id: str):
        """Soft-delete a resume."""
        resume = self.get_object(resume_id)
        resume.is_active = False
        resume.save(update_fields=["is_active", "updated_at"])
        emit_resume_activity(resume, "deleted", {"soft_delete": True})
        return Response(status=status.HTTP_204_NO_CONTENT)


class SessionStatusView(APIView):
    """Expose the 20-minute resume session status."""

    def get(self, request, resume_id: str):
        """Return session validity and remaining time."""
        resume = get_object_or_404(Resume, resume_id=resume_id, is_active=True)
        session = get_object_or_404(ResumeSession, resume=resume)
        session.save()
        return Response(ResumeSessionSerializer(session).data)


class GeneratePDFView(APIView):
    """Generate encrypted PDFs for a resume."""

    def post(self, request, resume_id: str):
        """Create a fresh PDF and a 24-hour download token."""
        try:
            ensure_default_admin_config()
            if not feature_enabled("download"):
                return Response({"detail": "PDF download is currently disabled."}, status=status.HTTP_403_FORBIDDEN)

            resume = get_object_or_404(Resume, resume_id=resume_id, is_active=True)
            enable_password = feature_enabled("password_protection")
            pdf_path, password = generate_resume_pdf(resume, enable_password_protection=enable_password)
            if not Path(pdf_path).exists():
                return Response({"detail": "PDF generation failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            download_link = DownloadLink.objects.create(resume=resume)
            emit_resume_activity(
                resume,
                "pdf_generated",
                {"token": str(download_link.token), "expires_at": download_link.expires_at.isoformat()},
            )
            serialized_link = DownloadLinkSerializer(download_link, context={"request": request})
            return Response(
                {
                    "download_url": serialized_link.data["download_url"],
                    "password": password if enable_password else "",
                    "expires_in": "24 hours",
                }
            )
        except Exception as exc:
            return Response({"detail": f"Unable to generate PDF: {exc}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DownloadResumeView(APIView):
    """Serve generated PDFs using a temporary token."""

    authentication_classes = []
    permission_classes = []

    def get(self, request, token: str):
        """Validate the token, increment counters, and stream the PDF file."""
        download_link = get_object_or_404(DownloadLink, token=token)
        if download_link.has_expired():
            return Response(
                {"error": "This resume link has expired. Please generate again."},
                status=status.HTTP_410_GONE,
            )

        pdf_path = Path(settings.MEDIA_ROOT) / "pdfs" / f"{download_link.resume.resume_id}.pdf"
        if not pdf_path.exists():
            return Response({"error": "PDF file was not found. Please generate again."}, status=status.HTTP_404_NOT_FOUND)

        download_link.download_count += 1
        download_link.save(update_fields=["download_count"])
        download_link.resume.download_count += 1
        download_link.resume.save(update_fields=["download_count"])
        emit_resume_activity(download_link.resume, "downloaded", {"token": token})

        return FileResponse(open(pdf_path, "rb"), as_attachment=True, filename=f"{download_link.resume.resume_id}.pdf")


class SendEmailView(APIView):
    """Send encrypted PDFs over email."""

    def post(self, request, resume_id: str):
        """Generate the PDF if needed and email it to the recipient."""
        try:
            if not feature_enabled("email"):
                return Response({"detail": "Email sharing is currently disabled."}, status=status.HTTP_403_FORBIDDEN)

            resume = get_object_or_404(Resume, resume_id=resume_id, is_active=True)
            serializer = SendEmailSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            pdf_path, password = generate_resume_pdf(resume, enable_password_protection=feature_enabled("password_protection"))
            send_resume_email(
                recipient_email=serializer.validated_data["recipient_email"],
                pdf_path=pdf_path,
                password=password,
                resume_id=resume.resume_id,
            )
            ShareHistory.objects.create(
                resume=resume,
                method=ShareHistory.METHOD_EMAIL,
                recipient=serializer.validated_data["recipient_email"],
            )
            emit_resume_activity(resume, "email_sent", {"recipient": serializer.validated_data["recipient_email"]})
            return Response({"detail": "Resume sent successfully over email."})
        except Exception as exc:
            return Response({"detail": f"Unable to send email: {exc}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SendWhatsAppView(APIView):
    """Send resume links over WhatsApp."""

    def post(self, request, resume_id: str):
        """Block duplicate sends to the same number and send a fresh token."""
        try:
            if not feature_enabled("whatsapp"):
                return Response({"detail": "WhatsApp sharing is currently disabled."}, status=status.HTTP_403_FORBIDDEN)

            resume = get_object_or_404(Resume, resume_id=resume_id, is_active=True)
            serializer = SendWhatsAppSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            phone_number = serializer.validated_data["phone_number"]

            if ShareHistory.objects.filter(
                resume=resume,
                method=ShareHistory.METHOD_WHATSAPP,
                recipient=phone_number,
            ).exists():
                return Response(
                    {"detail": "This resume has already been sent to the given WhatsApp number."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            _, password = generate_resume_pdf(resume, enable_password_protection=feature_enabled("password_protection"))
            download_link = DownloadLink.objects.create(resume=resume)
            download_url = request.build_absolute_uri(f"/api/download/{download_link.token}/")
            send_resume_whatsapp(phone_number, resume.resume_id, download_url, password)
            ShareHistory.objects.create(
                resume=resume,
                method=ShareHistory.METHOD_WHATSAPP,
                recipient=phone_number,
            )
            emit_resume_activity(resume, "whatsapp_sent", {"recipient": phone_number})
            return Response({"detail": "Resume sent successfully over WhatsApp.", "download_url": download_url})
        except Exception as exc:
            return Response({"detail": f"Unable to send WhatsApp message: {exc}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ShareHistoryView(APIView):
    """List share history entries for a resume."""

    def get(self, request, resume_id: str):
        """Return all email and WhatsApp share events for the resume."""
        resume = get_object_or_404(Resume, resume_id=resume_id, is_active=True)
        serializer = ShareHistorySerializer(resume.share_history.all(), many=True)
        return Response(serializer.data)
