"""Admin-facing models for configuration."""

from django.db import models


class AdminConfig(models.Model):
    """Feature toggle used by the admin panel and frontend action bar."""

    FEATURE_CHOICES = [
        ("download", "Download"),
        ("print", "Print"),
        ("email", "Email"),
        ("whatsapp", "WhatsApp"),
        ("password_protection", "Password Protection"),
    ]

    feature = models.CharField(max_length=50, choices=FEATURE_CHOICES, unique=True)
    is_enabled = models.BooleanField(default=True)

    class Meta:
        ordering = ["feature"]

    def __str__(self) -> str:
        """Readable label for the feature row."""
        return f"{self.feature}: {'enabled' if self.is_enabled else 'disabled'}"
