"""Email delivery helpers for resume sharing."""

from pathlib import Path

from django.conf import settings
from django.core.mail import EmailMessage


def send_resume_email(recipient_email: str, pdf_path: str, password: str, resume_id: str) -> None:
    """Send the generated PDF and password to the requested email address."""
    if settings.USE_MOCK_EMAIL or not settings.EMAIL_HOST_USER or not settings.EMAIL_HOST_PASSWORD:
        mock_directory = Path(settings.MEDIA_ROOT) / "mock_deliveries"
        mock_directory.mkdir(parents=True, exist_ok=True)
        mock_file = mock_directory / f"{resume_id}_email.txt"
        mock_file.write_text(
            "\n".join(
                [
                    f"Mock email delivery for {resume_id}",
                    f"Recipient: {recipient_email}",
                    f"PDF Path: {pdf_path}",
                    f"Password: {password}",
                ]
            ),
            encoding="utf-8",
        )
        return

    email_message = EmailMessage(
        subject=f"Resume PDF - {resume_id}",
        body=(
            "Your resume PDF is attached.\n\n"
            f"Password: {password}\n"
            "Keep this password safe because the PDF is encrypted."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[recipient_email],
    )
    email_message.attach_file(pdf_path)
    email_message.send(fail_silently=False)
