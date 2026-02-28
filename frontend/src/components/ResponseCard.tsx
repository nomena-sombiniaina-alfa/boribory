import { Loader2, AlertCircle } from "lucide-react";
import type { ResponseChunk } from "../types";
import { getModel } from "../data/models";

export function ResponseCard({ chunk }: { chunk: ResponseChunk }) {
  const model = getModel(chunk.modelId);

  return (
    <article className="bg-surface border border-ink-200 rounded-xl overflow-hidden flex flex-col h-full min-h-[280px]">
      <header className="px-4 py-2.5 border-b border-ink-200 flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{model.label}</div>
          <div className="text-xs text-ink-500 truncate">
            {model.providerLabel}
          </div>
        </div>
        {chunk.latencyMs !== undefined && chunk.status === "done" && (
          <span className="text-xs text-ink-500 tabular-nums">
            {chunk.latencyMs}ms
          </span>
        )}
      </header>

      <div className="px-4 py-3 flex-1 text-sm leading-relaxed text-ink-700 whitespace-pre-wrap">
        {chunk.status === "pending" && (
          <div className="flex items-center gap-2 text-ink-500">
            <Loader2 size={14} className="animate-spin" />
            En attente…
          </div>
        )}
        {chunk.status === "streaming" && (
          <>
            {chunk.content}
            <span className="inline-block w-1.5 h-4 ml-0.5 bg-ink-500 align-middle animate-pulse" />
          </>
        )}
        {chunk.status === "done" && chunk.content}
        {chunk.status === "error" && (
          <div className="flex items-start gap-2 text-red-600">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{chunk.error ?? "Erreur du modèle"}</span>
          </div>
        )}
      </div>
    </article>
  );
}
