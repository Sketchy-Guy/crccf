"""Admin registrations for admin panel models."""

from django.contrib import admin

from .models import AdminConfig

admin.site.register(AdminConfig)
