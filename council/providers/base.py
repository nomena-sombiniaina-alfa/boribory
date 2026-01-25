from dataclasses import dataclass
from typing import Protocol


@dataclass
class LLMMessage:
    role: str  # "system" | "user" | "assistant"
    content: str


@dataclass
class LLMResult:
    content: str
    latency_ms: int


class ProviderError(Exception):
    """Raised when a provider call fails in a way we want to surface to the user."""


class Provider(Protocol):
    def call(self, messages: list[LLMMessage], model_name: str) -> LLMResult: ...
