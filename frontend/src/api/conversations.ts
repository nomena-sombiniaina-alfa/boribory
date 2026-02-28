import { api } from "./client";
import type { Conversation, ModelId, Turn } from "../types";

export type ConversationListItem = Omit<Conversation, "turns">;

export function listConversations() {
  return api<ConversationListItem[]>("/conversations/");
}

export function fetchConversation(id: string) {
  return api<Conversation>(`/conversations/${id}/`);
}

export function createConversation(selectedModels: ModelId[]) {
  return api<Conversation>("/conversations/", {
    method: "POST",
    body: JSON.stringify({ selectedModels, title: "Nouvelle discussion" }),
  });
}

export function updateConversation(
  id: string,
  patch: { selectedModels?: ModelId[]; title?: string },
) {
  return api<Conversation>(`/conversations/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export function askQuestion(id: string, question: string) {
  return api<Turn>(`/conversations/${id}/ask/`, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}

export function deleteConversation(id: string) {
  return api<void>(`/conversations/${id}/`, { method: "DELETE" });
}
