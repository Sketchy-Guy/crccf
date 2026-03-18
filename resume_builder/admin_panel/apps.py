"""Application config for the admin panel."""

from django.apps import AppConfig


class AdminPanelConfig(AppConfig):
    """Configuration for the admin panel app."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "admin_panel"
