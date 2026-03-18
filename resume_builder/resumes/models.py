"""Database models for resume management."""

from datetime import timedelta
import uuid

from django.db import models
from django.utils import timezone


class Resume(models.Model):
    """Stores the structured content used to build a resume."""

    resume_id = models.CharField(max_length=20, unique=True, editable=False)
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    dob = models.DateField()
    summary = models.TextField(blank=True)
    experience = models.JSONField(default=list, blank=True)
    education = models.JSONField(default=list, blank=True)
    skills = models.JSONField(default=list, blank=True)
    projects = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    download_count = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-updated_at"]

    def save(self, *args, **kwargs):
        """Assign a readable business identifier before the first save."""
        if not self.resume_id:
            from .utils.id_generator import generate_resume_id

            self.resume_id = generate_resume_id()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        """Return the resume identifier for admin views and logs."""
        return f"{self.resume_id} - {self.full_name}"


class ShareHistory(models.Model):
    """Tracks email and WhatsApp sharing events for a resume."""

    METHOD_EMAIL = "email"
    METHOD_WHATSAPP = "whatsapp"
    METHOD_CHOICES = [
        (METHOD_EMAIL, "Email"),
        (METHOD_WHATSAPP, "WhatsApp"),
    ]

    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name="share_history")
    method = models.CharField(max_length=20, choices=METHOD_CHOICES)
    recipient = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self) -> str:
        """Readable label for the share history row."""
        return f"{self.resume.resume_id} via {self.method} to {self.recipient}"


class ActivityLog(models.Model):
    """Stores auditable actions performed against a resume."""

    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name="activity_logs")
    action = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self) -> str:
        """Readable label for the activity row."""
        return f"{self.resume.resume_id} - {self.action}"


class ResumeSession(models.Model):
    """Tracks the 20-minute editing window for a resume."""

    resume = models.OneToOneField(Resume, on_delete=models.CASCADE, related_name="session")
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(blank=True)
    is_expired = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        """Calculate expiry time on the first save and keep the state in sync."""
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=20)
        self.is_expired = timezone.now() >= self.expires_at
        super().save(*args, **kwargs)

    def remaining_seconds(self) -> int:
        """Return the number of seconds left in the active session window."""
        if timezone.now() >= self.expires_at:
            return 0
        return int((self.expires_at - timezone.now()).total_seconds())


class DownloadLink(models.Model):
    """Represents a secure download link for a generated resume PDF."""

    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name="download_links")
    token = models.CharField(max_length=64, unique=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(blank=True)
    download_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        """Apply the default 24-hour expiry window for new links."""
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(hours=24)
        super().save(*args, **kwargs)

    def has_expired(self) -> bool:
        """Check whether the download token is still valid."""
        return timezone.now() >= self.expires_at
