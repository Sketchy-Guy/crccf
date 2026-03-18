"""Admin APIs for managing resumes and feature toggles."""

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from resumes.models import ActivityLog, Resume
from resumes.serializers import ResumeSerializer
from .models import AdminConfig
from .serializers import ActivityLogSerializer, AdminConfigSerializer, AdminResumeSerializer


def ensure_admin_config() -> None:
    """Seed default admin config rows if they are missing."""
    for feature_name in ["download", "print", "email", "whatsapp", "password_protection"]:
        AdminConfig.objects.get_or_create(feature=feature_name, defaults={"is_enabled": True})


class AdminResumeListView(APIView):
    """List all resumes with summary stats for the dashboard."""

    def get(self, request):
        """Return all resumes for the admin dashboard."""
        ensure_admin_config()
        return Response(AdminResumeSerializer(Resume.objects.all(), many=True).data)


class AdminResumeDetailView(APIView):
    """View, edit, and delete one resume from the admin panel."""

    def get_object(self, resume_id: str) -> Resume:
        """Load a resume by its business ID for admin operations."""
        return get_object_or_404(Resume, resume_id=resume_id)

    def get(self, request, resume_id: str):
        """Return one resume with logs and sharing details."""
        return Response(AdminResumeSerializer(self.get_object(resume_id)).data)

    def put(self, request, resume_id: str):
        """Allow admins to edit a resume regardless of session status."""
        resume = self.get_object(resume_id)
        serializer = ResumeSerializer(resume, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(AdminResumeSerializer(resume).data)

    def delete(self, request, resume_id: str):
        """Delete a resume permanently from the admin dashboard."""
        self.get_object(resume_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ActivityLogListView(APIView):
    """List all activity logs across resumes."""

    def get(self, request):
        """Return the full activity log feed."""
        return Response(ActivityLogSerializer(ActivityLog.objects.select_related("resume"), many=True).data)


class AdminConfigListView(APIView):
    """View all feature toggles."""

    def get(self, request):
        """Return all feature toggle rows."""
        ensure_admin_config()
        return Response(AdminConfigSerializer(AdminConfig.objects.all(), many=True).data)


class AdminConfigDetailView(APIView):
    """Update a single feature toggle by feature name."""

    def put(self, request, feature: str):
        """Toggle a feature on or off."""
        ensure_admin_config()
        config = get_object_or_404(AdminConfig, feature=feature)
        serializer = AdminConfigSerializer(config, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
