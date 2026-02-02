from concurrent.futures import ThreadPoolExecutor, as_completed

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response as DRFResponse

from .models import Conversation, Turn, Response
from .providers.base import LLMMessage, ProviderError
from .providers.registry import build_provider, get_route
from .serializers import (
    ConversationSerializer,
    ConversationListSerializer,
    TurnSerializer,
)


def _build_messages_for_model(
    conv: Conversation, new_question: str, model_id: str
) -> list[LLMMessage]:
    """Each model sees its own conversation: every past user question + its own
    past answers. Responses from other models are not injected (keeps context
    small and avoids cross-contamination)."""
    messages: list[LLMMessage] = []
    for turn in conv.turns.all().order_by("order"):
        messages.append(LLMMessage(role="user", content=turn.question))
        own = turn.responses.filter(model_id=model_id, status="done").first()
        if own and own.content:
            messages.append(LLMMessage(role="assistant", content=own.content))
    messages.append(LLMMessage(role="user", content=new_question))
    return messages


def _call_one_model(model_id: str, messages: list[LLMMessage]) -> dict:
    try:
        route = get_route(model_id)
        provider = build_provider(route)
        result = provider.call(messages, route.remote_model)
        return {
            "model_id": model_id,
            "status": "done",
            "content": result.content,
            "latency_ms": result.latency_ms,
            "error": "",
        }
    except ProviderError as e:
        return {
            "model_id": model_id,
            "status": "error",
            "content": "",
            "latency_ms": None,
            "error": str(e),
        }
    except Exception as e:  # filet de sécurité
        return {
            "model_id": model_id,
            "status": "error",
            "content": "",
            "latency_ms": None,
            "error": f"erreur inattendue : {e}",
        }


class ConversationViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == "list":
            return ConversationListSerializer
        return ConversationSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"], url_path="ask")
    def ask(self, request, pk=None):
        conv = self.get_object()
        question = (request.data.get("question") or "").strip()
        if not question:
            return DRFResponse(
                {"detail": "question requise"}, status=status.HTTP_400_BAD_REQUEST
            )
        if not conv.selected_models:
            return DRFResponse(
                {"detail": "aucun modèle sélectionné"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Contexte par modèle, calculé AVANT de créer le nouveau turn.
        per_model_messages = {
            mid: _build_messages_for_model(conv, question, mid)
            for mid in conv.selected_models
        }

        order = conv.turns.count()
        turn = Turn.objects.create(conversation=conv, question=question, order=order)
        response_rows = {
            mid: Response.objects.create(turn=turn, model_id=mid, status="pending")
            for mid in conv.selected_models
        }

        # Appels parallèles. max_workers = nombre de modèles (≤ 6).
        with ThreadPoolExecutor(max_workers=max(1, len(conv.selected_models))) as ex:
            futures = {
                ex.submit(_call_one_model, mid, msgs): mid
                for mid, msgs in per_model_messages.items()
            }
            for f in as_completed(futures):
                res = f.result()
                row = response_rows[res["model_id"]]
                row.status = res["status"]
                row.content = res["content"]
                row.latency_ms = res["latency_ms"]
                row.error = res["error"]
                row.save()

        if order == 0 and conv.title == "Nouvelle discussion":
            conv.title = question[:60] + ("…" if len(question) > 60 else "")
            conv.save(update_fields=["title"])

        turn.refresh_from_db()
        return DRFResponse(
            TurnSerializer(turn).data, status=status.HTTP_201_CREATED
        )
