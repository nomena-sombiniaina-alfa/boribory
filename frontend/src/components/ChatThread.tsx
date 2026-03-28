import { useEffect, useMemo, useRef } from "react";
import type { ModelId, ResponseChunk, Turn } from "../types";
import { ResponseCard } from "./ResponseCard";
import { useLang } from "../contexts/LanguageContext";

export interface FollowUp {
  id: string;
  question: string;
  response: ResponseChunk;
}

interface Props {
  turns: Turn[];
  onReplyToModel?: (
    modelId: ModelId,
    question: string,
    parentTurnId: string,
  ) => void;
}

function formatLastLines(text: string, n: number): string {
  const lines = text.split("\n");
  if (lines.length <= n) return text;
  return "…\n" + lines.slice(-n).join("\n");
}

export function ChatThread({ turns, onReplyToModel }: Props) {
  const lastSectionRef = useRef<HTMLElement>(null);
  const { t } = useLang();

  const { roots, followUpsByRoot } = useMemo(() => {
    const roots: Turn[] = [];
    const followUpsByRoot = new Map<string, Map<ModelId, FollowUp[]>>();

    for (const t of turns) {
      if (!t.parentTurnId) {
        roots.push(t);
        continue;
      }
      const parentKey = t.parentTurnId;
      const byModel =
        followUpsByRoot.get(parentKey) ?? new Map<ModelId, FollowUp[]>();
      followUpsByRoot.set(parentKey, byModel);
      // A follow-up turn targets exactly one model; use its single response.
      const r = t.responses[0];
      if (!r) continue;
      const list = byModel.get(r.modelId) ?? [];
      list.push({ id: t.id, question: t.question, response: r });
      byModel.set(r.modelId, list);
    }

    return { roots, followUpsByRoot };
  }, [turns]);

  useEffect(() => {
    lastSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [roots.length]);

  if (roots.length === 0) {
    return (
      <div className="h-full grid place-items-center text-center px-6">
        <div className="max-w-md">
          <h1 className="text-3xl font-semibold tracking-tight mb-3 text-ink-900">
            {t("chat.emptyTitle")}
          </h1>
          <p className="text-ink-500 leading-relaxed">
            {t("chat.emptySubtitle")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-4 space-y-10">
      {roots.map((turn, idx) => {
        const isLast = idx === roots.length - 1;
        const byModel = followUpsByRoot.get(turn.id);
        return (
          <section
            key={turn.id}
            ref={isLast ? lastSectionRef : undefined}
            className="flex flex-col min-h-[calc(100dvh-12rem)] pb-4"
          >
            <div className="mb-6">
              <div className="text-[11px] font-medium uppercase tracking-wider text-primary mb-2">
                {t("chat.questionLabel")}
              </div>
              <p className="text-[22px] font-medium text-ink-900 leading-snug whitespace-pre-wrap">
                {formatLastLines(turn.question, 4)}
              </p>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr">
              {turn.responses.map((r) => (
                <ResponseCard
                  key={r.modelId}
                  chunk={r}
                  followUps={byModel?.get(r.modelId) ?? []}
                  onReplyOnly={
                    onReplyToModel
                      ? (q) => onReplyToModel(r.modelId, q, turn.id)
                      : undefined
                  }
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
