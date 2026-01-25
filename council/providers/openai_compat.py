import time
import httpx

from .base import LLMMessage, LLMResult, ProviderError


class OpenAICompatProvider:
    """Covers GitHub Models, Groq, Mistral, Cohere (compat), DeepSeek, OpenRouter,
    and Gemini via its OpenAI-compatible endpoint. All of them accept the same
    POST /chat/completions payload."""

    def __init__(
        self,
        base_url: str,
        api_key: str,
        extra_headers: dict[str, str] | None = None,
        timeout: float = 60.0,
    ) -> None:
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.extra_headers = extra_headers or {}
        self.timeout = timeout

    def call(self, messages: list[LLMMessage], model_name: str) -> LLMResult:
        if not self.api_key:
            raise ProviderError("clé API non configurée")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            **self.extra_headers,
        }
        body = {
            "model": model_name,
            "messages": [{"role": m.role, "content": m.content} for m in messages],
            "stream": False,
        }

        start = time.perf_counter()
        try:
            with httpx.Client(timeout=self.timeout) as client:
                r = client.post(
                    f"{self.base_url}/chat/completions", headers=headers, json=body
                )
        except httpx.HTTPError as e:
            raise ProviderError(f"réseau : {e}") from e

        elapsed_ms = int((time.perf_counter() - start) * 1000)

        if r.status_code >= 400:
            snippet = r.text[:300].replace("\n", " ")
            raise ProviderError(f"HTTP {r.status_code} — {snippet}")

        try:
            data = r.json()
            content = data["choices"][0]["message"]["content"] or ""
        except (KeyError, ValueError, IndexError) as e:
            raise ProviderError(f"réponse inattendue : {e}") from e

        return LLMResult(content=content, latency_ms=elapsed_ms)
