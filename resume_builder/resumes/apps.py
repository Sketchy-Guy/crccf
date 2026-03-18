"""Application config for resumes."""

from django.apps import AppConfig


class ResumesConfig(AppConfig):
    """Configuration for the resumes app."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "resumes"

    def ready(self) -> None:
        """Register signal handlers when the app is ready."""
        from . import signals  # noqa: F401
