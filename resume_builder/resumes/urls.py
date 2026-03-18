"""API routes for resume operations."""

from django.urls import path

from .views import (
    DownloadResumeView,
    GeneratePDFView,
    ResumeDetailView,
    ResumeListCreateView,
    SendEmailView,
    SendWhatsAppView,
    SessionStatusView,
    ShareHistoryView,
)

urlpatterns = [
    path("resumes/", ResumeListCreateView.as_view(), name="resume-list-create"),
    path("resumes/<str:resume_id>/", ResumeDetailView.as_view(), name="resume-detail"),
    path("resumes/<str:resume_id>/session-status/", SessionStatusView.as_view(), name="resume-session-status"),
    path("resumes/<str:resume_id>/generate-pdf/", GeneratePDFView.as_view(), name="resume-generate-pdf"),
    path("resumes/<str:resume_id>/send-email/", SendEmailView.as_view(), name="resume-send-email"),
    path("resumes/<str:resume_id>/send-whatsapp/", SendWhatsAppView.as_view(), name="resume-send-whatsapp"),
    path("resumes/<str:resume_id>/share-history/", ShareHistoryView.as_view(), name="resume-share-history"),
    path("download/<str:token>/", DownloadResumeView.as_view(), name="resume-download"),
]
