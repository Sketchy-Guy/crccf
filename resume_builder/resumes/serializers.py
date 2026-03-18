"""Serializers for resume APIs."""

from rest_framework import serializers

from admin_panel.models import AdminConfig
from .models import DownloadLink, Resume, ResumeSession, ShareHistory
from .utils.validators import (
    validate_content_limits,
    validate_indian_phone,
    validate_required_resume_fields,
)


class ResumeSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating resumes."""

    class Meta:
        model = Resume
        fields = [
            "resume_id",
            "full_name",
            "email",
            "phone",
            "dob",
            "summary",
            "experience",
            "education",
            "skills",
            "projects",
            "created_at",
            "updated_at",
            "download_count",
            "is_active",
        ]
        read_only_fields = ["resume_id", "created_at", "updated_at", "download_count"]

    def validate_phone(self, value: str) -> str:
        """Validate Indian phone numbers in a consistent place."""
        return validate_indian_phone(value)

    def validate(self, attrs):
        """Apply business validation rules to the full payload."""
        source_data = {}
        if self.instance:
            for field_name in self.Meta.fields:
                source_data[field_name] = getattr(self.instance, field_name, None)
        merged_data = {**source_data, **attrs}
        validate_required_resume_fields(merged_data)
        validate_content_limits(merged_data)
        return attrs


class ResumeDetailSerializer(ResumeSerializer):
    """Extends the resume serializer with feature toggle metadata."""

    feature_config = serializers.SerializerMethodField()

    class Meta(ResumeSerializer.Meta):
        fields = ResumeSerializer.Meta.fields + ["feature_config"]

    def get_feature_config(self, obj: Resume) -> dict:
        """Return feature toggle state on every resume read."""
        return {config.feature: config.is_enabled for config in AdminConfig.objects.all()}


class ResumeSessionSerializer(serializers.ModelSerializer):
    """Serializer for the current session state."""

    valid = serializers.SerializerMethodField()
    remaining_seconds = serializers.SerializerMethodField()

    class Meta:
        model = ResumeSession
        fields = ["valid", "remaining_seconds", "created_at", "expires_at", "is_expired"]

    def get_valid(self, obj: ResumeSession) -> bool:
        """Expose whether the session is still active."""
        return not obj.is_expired and obj.remaining_seconds() > 0

    def get_remaining_seconds(self, obj: ResumeSession) -> int:
        """Expose remaining seconds without repeating time logic in the view."""
        return obj.remaining_seconds()


class ShareHistorySerializer(serializers.ModelSerializer):
    """Serializer for share history events."""

    class Meta:
        model = ShareHistory
        fields = ["id", "method", "recipient", "timestamp"]


class DownloadLinkSerializer(serializers.ModelSerializer):
    """Serializer for generated download links."""

    download_url = serializers.SerializerMethodField()

    class Meta:
        model = DownloadLink
        fields = ["token", "created_at", "expires_at", "download_count", "download_url"]

    def get_download_url(self, obj: DownloadLink) -> str:
        """Build the public API route for this download token."""
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(f"/api/download/{obj.token}/")
        return f"/api/download/{obj.token}/"


class SendEmailSerializer(serializers.Serializer):
    """Payload for email delivery."""

    recipient_email = serializers.EmailField()


class SendWhatsAppSerializer(serializers.Serializer):
    """Payload for WhatsApp delivery."""

    phone_number = serializers.CharField(max_length=20)

    def validate_phone_number(self, value: str) -> str:
        """Reuse the same Indian phone validation as the resume form."""
        return validate_indian_phone(value)
