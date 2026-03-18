"""Validation helpers for resume payloads."""

import re

from rest_framework.exceptions import ValidationError


PHONE_PATTERN = re.compile(r"^(?:\+91)?[6-9]\d{9}$")


def validate_indian_phone(phone_number: str) -> str:
    """Validate and normalize Indian phone numbers."""
    compact_phone = phone_number.replace(" ", "").replace("-", "")
    if not PHONE_PATTERN.match(compact_phone):
        raise ValidationError("Please enter a valid Indian phone number.")
    return compact_phone


def validate_required_resume_fields(data: dict) -> None:
    """Ensure critical resume fields are present before saving."""
    required_fields = ["full_name", "email", "phone", "dob"]
    missing_fields = [field for field in required_fields if not data.get(field)]
    if missing_fields:
        raise ValidationError({field: "This field is required." for field in missing_fields})


def validate_content_limits(data: dict) -> None:
    """Apply simple content-size checks so payloads remain manageable."""
    summary = data.get("summary", "") or ""
    if len(summary) > 1500:
        raise ValidationError({"summary": "Summary must be under 1500 characters."})

    list_limits = {"experience": 10, "education": 8, "skills": 30, "projects": 8}
    for field_name, max_items in list_limits.items():
        items = data.get(field_name, []) or []
        if len(items) > max_items:
            raise ValidationError({field_name: f"Maximum {max_items} items are allowed."})
