"""Admin registrations for resume models."""

from django.contrib import admin

from .models import ActivityLog, DownloadLink, Resume, ResumeSession, ShareHistory

admin.site.register(Resume)
admin.site.register(ShareHistory)
admin.site.register(ActivityLog)
admin.site.register(ResumeSession)
admin.site.register(DownloadLink)
