"""WhatsApp delivery helpers using Twilio."""

from pathlib import Path

from django.conf import settings
from twilio.base.exceptions import TwilioRestException
from twilio.rest import Client


def send_resume_whatsapp(phone_number: str, resume_id: str, download_url: str, password: str) -> None:
    """Send a WhatsApp message with the resume download link and password."""
    if settings.USE_MOCK_WHATSAPP or not all(
        [settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN, settings.TWILIO_WHATSAPP_NUMBER]
    ):
        mock_directory = Path(settings.MEDIA_ROOT) / "mock_deliveries"
        mock_directory.mkdir(parents=True, exist_ok=True)
        mock_file = mock_directory / f"{resume_id}_whatsapp.txt"
        mock_file.write_text(
            "\n".join(
                [
                    f"Mock WhatsApp delivery for {resume_id}",
                    f"Recipient: {phone_number}",
                    f"Download URL: {download_url}",
                    f"Password: {password}",
                ]
            ),
            encoding="utf-8",
        )
        return

    if not all([settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN, settings.TWILIO_WHATSAPP_NUMBER]):
        raise ValueError("Twilio credentials are not configured.")

    twilio_client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    try:
        twilio_client.messages.create(
            from_=settings.TWILIO_WHATSAPP_NUMBER,
            to=f"whatsapp:{phone_number}" if not phone_number.startswith("whatsapp:") else phone_number,
            body=(
                f"Your resume {resume_id} is ready.\n"
                f"Download: {download_url}\n"
                f"Password: {password}"
            ),
        )
    except TwilioRestException as exc:
        raise ValueError(f"Unable to send WhatsApp message: {exc.msg}") from exc
