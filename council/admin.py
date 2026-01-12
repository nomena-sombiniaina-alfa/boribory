from django.contrib import admin
from .models import Conversation, Turn, Response


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ("title", "created_at", "updated_at")
    search_fields = ("title",)


@admin.register(Turn)
class TurnAdmin(admin.ModelAdmin):
    list_display = ("conversation", "order", "created_at")


@admin.register(Response)
class ResponseAdmin(admin.ModelAdmin):
    list_display = ("turn", "model_id", "status", "latency_ms", "created_at")
    list_filter = ("model_id", "status")
