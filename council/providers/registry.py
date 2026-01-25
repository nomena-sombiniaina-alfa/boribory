from dataclasses import dataclass
from typing import Callable

from django.conf import settings

from .openai_compat import OpenAICompatProvider
from .base import Provider


@dataclass
class ModelRoute:
    key: str                   # settings.PROVIDER_KEYS lookup
    base_url: str              # OpenAI-compatible base URL
    remote_model: str          # model name on that provider
    extra_headers: dict[str, str] | None = None


# Endpoints & remote names — ajuste si un provider change.
_ROUTES: dict[str, ModelRoute] = {
    # -------- GitHub Models --------
    # Endpoint migré en 2025 vers models.github.ai (ancien : models.inference.ai.azure.com).
    # Les modèles utilisent désormais le préfixe publisher (openai/, meta/, etc.).
    "gpt-4o": ModelRoute(
        key="github_models",
        base_url="https://models.github.ai/inference",
        remote_model="openai/gpt-4o",
    ),
    "gpt-4o-mini": ModelRoute(
        key="github_models",
        base_url="https://models.github.ai/inference",
        remote_model="openai/gpt-4o-mini",
    ),
    "o1-mini": ModelRoute(
        key="github_models",
        base_url="https://models.github.ai/inference",
        remote_model="openai/o1-mini",
    ),
    # -------- Google Gemini (OpenAI-compatible endpoint) --------
    "gemini-2.5-flash": ModelRoute(
        key="google",
        base_url="https://generativelanguage.googleapis.com/v1beta/openai",
        remote_model="gemini-2.5-flash",
    ),
    "gemini-2.5-pro": ModelRoute(
        key="google",
        base_url="https://generativelanguage.googleapis.com/v1beta/openai",
        remote_model="gemini-2.5-pro",
    ),
    # -------- Groq --------
    "llama-3.3-70b": ModelRoute(
        key="groq",
        base_url="https://api.groq.com/openai/v1",
        remote_model="llama-3.3-70b-versatile",
    ),
    # -------- Mistral --------
    "mistral-large": ModelRoute(
        key="mistral",
        base_url="https://api.mistral.ai/v1",
        remote_model="mistral-large-latest",
    ),
    # -------- Cohere (compatibility endpoint) --------
    "command-r-plus": ModelRoute(
        key="cohere",
        base_url="https://api.cohere.ai/compatibility/v1",
        remote_model="command-r-plus",
    ),
    # -------- DeepSeek (direct) --------
    "deepseek-v3": ModelRoute(
        key="deepseek",
        base_url="https://api.deepseek.com/v1",
        remote_model="deepseek-chat",
    ),
    # -------- OpenRouter (free tier) --------
    "deepseek-r1": ModelRoute(
        key="openrouter",
        base_url="https://openrouter.ai/api/v1",
        remote_model="deepseek/deepseek-r1:free",
        extra_headers={
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "Boribory",
        },
    ),
    "qwen-2.5-72b": ModelRoute(
        key="openrouter",
        base_url="https://openrouter.ai/api/v1",
        remote_model="qwen/qwen-2.5-72b-instruct:free",
        extra_headers={
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "Boribory",
        },
    ),
}


def get_route(model_id: str) -> ModelRoute:
    if model_id not in _ROUTES:
        raise ValueError(f"modèle inconnu : {model_id}")
    return _ROUTES[model_id]


def build_provider(route: ModelRoute) -> Provider:
    return OpenAICompatProvider(
        base_url=route.base_url,
        api_key=settings.PROVIDER_KEYS.get(route.key, ""),
        extra_headers=route.extra_headers,
    )


ProviderFactory = Callable[[], Provider]  # kept for clarity in views
