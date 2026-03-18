"""Serializers for admin APIs."""

from rest_framework import serializers

from resumes.models import ActivityLog, Resume, ShareHistory
from resumes.serializers import ResumeSerializer
from .models import AdminConfig


class ActivityLogSerializer(serializers.ModelSerializer):
    """Serializer for activity log rows."""

    resume_id = serializers.CharField(source="resume.resume_id", read_only=True)

    class Meta:
        model = ActivityLog
        fields = ["id", "resume_id", "action", "timestamp", "metadata"]


class AdminShareHistorySerializer(serializers.ModelSerializer):
    """Serializer for admin share history output."""

    class Meta:
        model = ShareHistory
        fields = ["id", "method", "recipient", "timestamp"]


class AdminResumeSerializer(ResumeSerializer):
    """Adds nested admin analytics to resume output."""

    share_history = AdminShareHistorySerializer(many=True, read_only=True)
    activity_logs = ActivityLogSerializer(many=True, read_only=True)

    class Meta(ResumeSerializer.Meta):
        fields = ResumeSerializer.Meta.fields + ["share_history", "activity_logs"]


class AdminConfigSerializer(serializers.ModelSerializer):
    """Serializer for feature toggle management."""

    class Meta:
        model = AdminConfig
        fields = ["id", "feature", "is_enabled"]
