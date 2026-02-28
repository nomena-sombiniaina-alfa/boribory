import { useEffect, useRef } from "react";
import type { Turn } from "../types";
import { ResponseCard } from "./ResponseCard";

interface Props {
  turns: Turn[];
}

function formatLastLines(text: string, n: number): string {
  const lines = text.split("\n");
  if (lines.length <= n) return text;
  return "…\n" + lines.slice(-n).join("\n");
}

export function ChatThread({ turns }: Props) {
  const lastSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    lastSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [turns.length]);

  if (turns.length === 0) {
    return (
      <div className="h-full grid place-items-center text-center px-6">
        <div className="max-w-md">
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            Pose une question, reçois plusieurs avis.
          </h1>
          <p className="text-ink-500">
            Tape ta question en bas. Chaque IA de ton conseil répondra dans sa
            propre carte.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-6 space-y-8">
      {turns.map((turn, idx) => {
        const isLast = idx === turns.length - 1;
        return (
          <section
            key={turn.id}
            ref={isLast ? lastSectionRef : undefined}
            className="flex flex-col min-h-[calc(100dvh-12rem)] pb-6"
          >
            <p className="text-lg text-ink-900 leading-relaxed whitespace-pre-wrap mb-4">
              {formatLastLines(turn.question, 4)}
            </p>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr">
              {turn.responses.map((r) => (
                <ResponseCard key={r.modelId} chunk={r} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
