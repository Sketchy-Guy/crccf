"""Business identifier helpers for resumes."""

from django.db.models import Max
from django.utils import timezone


def generate_resume_id() -> str:
    """Create a sequential business ID like RES-2026-1001."""
    from resumes.models import Resume

    current_year = timezone.now().year
    year_prefix = f"RES-{current_year}-"
    latest_resume_id = (
        Resume.objects.filter(resume_id__startswith=year_prefix)
        .aggregate(max_value=Max("resume_id"))
        .get("max_value")
    )
    if latest_resume_id:
        latest_counter = int(str(latest_resume_id).split("-")[-1])
        next_counter = latest_counter + 1
    else:
        next_counter = 1001
    return f"{year_prefix}{next_counter}"
