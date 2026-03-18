"""Admin API routes."""

from django.urls import path

from .views import (
    ActivityLogListView,
    AdminConfigDetailView,
    AdminConfigListView,
    AdminResumeDetailView,
    AdminResumeListView,
)

urlpatterns = [
    path("resumes/", AdminResumeListView.as_view(), name="admin-resume-list"),
    path("resumes/<str:resume_id>/", AdminResumeDetailView.as_view(), name="admin-resume-detail"),
    path("activity-logs/", ActivityLogListView.as_view(), name="admin-activity-logs"),
    path("config/", AdminConfigListView.as_view(), name="admin-config-list"),
    path("config/<str:feature>/", AdminConfigDetailView.as_view(), name="admin-config-detail"),
]
