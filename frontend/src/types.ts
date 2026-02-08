export type ModelId =
  | "gpt-4o"
  | "gpt-4o-mini"
  | "o1-mini"
  | "gemini-2.5-flash"
  | "gemini-2.5-pro"
  | "llama-3.3-70b"
  | "mistral-large"
  | "command-r-plus"
  | "deepseek-v3"
  | "deepseek-r1"
  | "qwen-2.5-72b";

export type Provider =
  | "github-models"
  | "google"
  | "groq"
  | "mistral"
  | "cohere"
  | "openrouter"
  | "deepseek";

export interface ModelInfo {
  id: ModelId;
  label: string;
  company: string;
  companyCountry: string;
  released: string;
  contextWindow: string;
  paramsLabel: string;
  arenaElo: number | null;
  arenaNote?: string;
  highlights: string[];
  provider: Provider;
  providerLabel: string;
  accent: string;
  dailyQuota: string;
}

export interface ResponseChunk {
  modelId: ModelId;
  content: string;
  status: "pending" | "streaming" | "done" | "error";
  latencyMs?: number;
  error?: string;
}

export interface Turn {
  id: string;
  question: string;
  responses: ResponseChunk[];
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  turns: Turn[];
  selectedModels: ModelId[];
  createdAt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}
