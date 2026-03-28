from rest_framework import serializers
from .models import Conversation, Turn, Response


class ResponseSerializer(serializers.ModelSerializer):
    modelId = serializers.CharField(source="model_id")
    latencyMs = serializers.IntegerField(source="latency_ms", allow_null=True)

    class Meta:
        model = Response
        fields = ["id", "modelId", "status", "content", "latencyMs", "error"]


class TurnSerializer(serializers.ModelSerializer):
    responses = ResponseSerializer(many=True, read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    parentTurnId = serializers.PrimaryKeyRelatedField(
        source="parent_turn", read_only=True, allow_null=True
    )

    class Meta:
        model = Turn
        fields = [
            "id",
            "question",
            "order",
            "createdAt",
            "responses",
            "parentTurnId",
        ]


class ConversationSerializer(serializers.ModelSerializer):
    turns = TurnSerializer(many=True, read_only=True)
    selectedModels = serializers.ListField(
        source="selected_models", child=serializers.CharField()
    )
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = Conversation
        fields = ["id", "title", "selectedModels", "createdAt", "turns"]


class ConversationListSerializer(serializers.ModelSerializer):
    selectedModels = serializers.ListField(
        source="selected_models", child=serializers.CharField()
    )
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = Conversation
        fields = ["id", "title", "selectedModels", "createdAt"]
