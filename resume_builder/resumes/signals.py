"""Signal handlers for automatic and custom activity logging."""

from django.db.models.signals import post_save
from django.dispatch import Signal, receiver

from .models import ActivityLog, Resume

resume_action_signal = Signal()


@receiver(post_save, sender=Resume)
def log_resume_save(sender, instance: Resume, created: bool, **kwargs) -> None:
    """Create activity rows whenever a resume is created or updated."""
    ActivityLog.objects.create(
        resume=instance,
        action="created" if created else "updated",
        metadata={"resume_id": instance.resume_id},
    )


@receiver(resume_action_signal)
def log_resume_action(sender, resume: Resume, action: str, metadata=None, **kwargs) -> None:
    """Persist custom resume activity emitted by services and views."""
    ActivityLog.objects.create(
        resume=resume,
        action=action,
        metadata=metadata or {},
    )


def emit_resume_activity(resume: Resume, action: str, metadata=None) -> None:
    """Send a structured activity event without exposing signal details to views."""
    resume_action_signal.send(sender=Resume, resume=resume, action=action, metadata=metadata or {})
