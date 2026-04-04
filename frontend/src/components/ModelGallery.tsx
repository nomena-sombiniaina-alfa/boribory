import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { MODELS, MAX_SELECTED } from "../data/models";
import type { ModelId } from "../types";
import { ModelCard } from "./ModelCard";
import { useLang } from "../contexts/LanguageContext";

interface Props {
  initial?: ModelId[];
  onStart: (models: ModelId[]) => void;
}

export function ModelGallery({ initial = [], onStart }: Props) {
  const { t } = useLang();
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
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-10 max-w-2xl">
          <div className="text-[11px] uppercase tracking-wider text-primary font-medium mb-3">
            {t("gallery.badge")}
          </div>
          <h1 className="text-4xl font-semibold tracking-tight mb-4 text-ink-900">
            {t("gallery.title")}
          </h1>
          <p className="text-ink-500 leading-relaxed text-[15px]">
            {t("gallery.descriptionPrefix")}
            <strong className="text-ink-700">
              {t("gallery.descriptionModels", { max: MAX_SELECTED })}
            </strong>
            {t("gallery.descriptionSuffix")}
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

        <div className="mt-10 text-[11px] text-ink-500 leading-relaxed max-w-2xl">
          {t("gallery.eloDisclaimer")}
        </div>
      </div>

      <div className="sticky bottom-0 bg-canvas/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="text-sm">
            <span className="font-semibold text-ink-900">{selected.length}</span>
            <span className="text-ink-500">
              {" "}
              {t("gallery.selected", { max: MAX_SELECTED })}
            </span>
          </div>
          <button
            onClick={() => selected.length > 0 && onStart(selected)}
            disabled={selected.length === 0}
            className="flex items-center gap-2 bg-primary text-primary-fg rounded-full px-5 py-2.5 text-sm font-medium disabled:bg-ink-200 disabled:text-ink-400 disabled:cursor-not-allowed hover:bg-primary-hover transition shadow-card"
          >
            {t("gallery.start")}
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
