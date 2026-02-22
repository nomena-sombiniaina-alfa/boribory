import { Check, Building2, Globe, Calendar, Gauge, Boxes } from "lucide-react";
import type { ModelInfo } from "../types";

interface Props {
  model: ModelInfo;
  selected: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export function ModelCard({ model, selected, disabled, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`text-left rounded-2xl border border-ink-200 p-5 transition flex flex-col ${
        selected
          ? "bg-emerald-100 hover:bg-emerald-100"
          : "bg-surface hover:border-ink-300"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="font-semibold tracking-tight truncate">
            {model.label}
          </div>
          <div className="text-xs text-ink-500 mt-0.5">
            {model.providerLabel} · {model.dailyQuota}
          </div>
        </div>
        <div
          className={`shrink-0 w-5 h-5 rounded border grid place-items-center ${
            selected
              ? "bg-emerald-600 border-emerald-600 text-white"
              : "border-ink-300 bg-surface"
          }`}
        >
          {selected && <Check size={13} strokeWidth={3} />}
        </div>
      </div>

      <dl className="space-y-1.5 text-xs text-ink-700 mb-3">
        <Row icon={<Building2 size={13} />} label="Entreprise">
          {model.company}
        </Row>
        <Row icon={<Globe size={13} />} label="Pays">
          {model.companyCountry}
        </Row>
        <Row icon={<Calendar size={13} />} label="Sortie">
          {model.released}
        </Row>
        <Row icon={<Boxes size={13} />} label="Taille">
          {model.paramsLabel}
        </Row>
        <Row icon={<Gauge size={13} />} label="Contexte">
          {model.contextWindow}
        </Row>
      </dl>

      {model.arenaElo !== null && (
        <div
          className={`rounded-lg px-3 py-2 mb-3 ${
            selected ? "bg-emerald-50" : "bg-ink-100/70"
          }`}
        >
          <div className="text-[11px] uppercase tracking-wider text-ink-500">
            LMSYS Chatbot Arena
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold tabular-nums">
              {model.arenaElo}
            </span>
            <span className="text-[11px] text-ink-500">
              ELO · {model.arenaNote ?? "public"}
            </span>
          </div>
        </div>
      )}

      <ul className="mt-auto space-y-1 text-xs text-ink-700">
        {model.highlights.map((h, i) => (
          <li key={i} className="flex gap-1.5">
            <span
              className="mt-1.5 w-1 h-1 rounded-full shrink-0"
              style={{ background: model.accent }}
            />
            {h}
          </li>
        ))}
      </ul>
    </button>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-ink-500 mt-0.5">{icon}</span>
      <span className="text-ink-500 w-16 shrink-0">{label}</span>
      <span className="text-ink-900 flex-1">{children}</span>
    </div>
  );
}
