import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { MODELS, MAX_SELECTED } from "../data/models";
import type { ModelId } from "../types";
import { ModelCard } from "./ModelCard";

interface Props {
  initial?: ModelId[];
  onStart: (models: ModelId[]) => void;
}

export function ModelGallery({ initial = [], onStart }: Props) {
  const [selected, setSelected] = useState<ModelId[]>(initial);

  const toggle = (id: ModelId) => {
    setSelected((curr) => {
      if (curr.includes(id)) return curr.filter((x) => x !== id);
      if (curr.length >= MAX_SELECTED) return curr;
      return [...curr, id];
    });
  };

  return (
    <div className="min-h-full bg-canvas">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <header className="mb-8 max-w-2xl">
          <div className="text-xs uppercase tracking-wider text-accent font-medium mb-2">
            Nouvelle discussion
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mb-3">
            Compose ton conseil d'IA
          </h1>
          <p className="text-ink-500 leading-relaxed">
            Sélectionne jusqu'à <strong>{MAX_SELECTED} modèles</strong>. Chacun
            répondra à ta question de son côté, sans se concerter. Compare les
            angles, croise les sources, tranche.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODELS.map((m) => (
            <ModelCard
              key={m.id}
              model={m}
              selected={selected.includes(m.id)}
              disabled={
                !selected.includes(m.id) && selected.length >= MAX_SELECTED
              }
              onToggle={() => toggle(m.id)}
            />
          ))}
        </div>

        <div className="mt-8 text-[11px] text-ink-500 leading-relaxed">
          Scores ELO : valeurs publiques approximatives du classement LMSYS
          Chatbot Arena (début 2026). Elles évoluent chaque semaine — à prendre
          comme ordre de grandeur, pas comme vérité absolue.
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-ink-200 bg-canvas/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="text-sm">
            <span className="font-medium">{selected.length}</span>
            <span className="text-ink-500"> / {MAX_SELECTED} sélectionné(s)</span>
          </div>
          <button
            onClick={() => selected.length > 0 && onStart(selected)}
            disabled={selected.length === 0}
            className="flex items-center gap-2 bg-accent text-white rounded-lg px-4 py-2 text-sm font-medium disabled:bg-ink-300 disabled:cursor-not-allowed transition"
          >
            Commencer la discussion
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
