import { Check, Building2, Globe, Calendar, Gauge, Boxes } from "lucide-react";
import type { ModelInfo } from "../types";
import { useLang } from "../contexts/LanguageContext";

interface Props {
  model: ModelInfo;
  selected: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export function ModelCard({ model, selected, disabled, onToggle }: Props) {
  const { t } = useLang();
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`text-left rounded-2xl p-5 transition flex flex-col shadow-card ${
        selected
          ? "bg-surface ring-2 ring-primary"
          : "bg-surface hover:shadow-pop"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0 flex items-center gap-2.5">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ background: model.accent }}
            aria-hidden
          />
          <div className="min-w-0">
            <div className="font-semibold tracking-tight truncate text-ink-900">
              {model.label}
            </div>
            <div className="text-[11px] text-ink-500 mt-0.5 truncate">
              {model.providerLabel} · {model.dailyQuota}
            </div>
          </div>
        </div>
        <div
          className={`shrink-0 w-5 h-5 rounded-full grid place-items-center transition ${
            selected
              ? "bg-primary text-primary-fg"
              : "bg-ink-100 text-transparent"
          }`}
        >
          <Check size={12} strokeWidth={3} />
        </div>
      </div>

      <dl className="space-y-1.5 text-xs text-ink-700 mb-4">
        <Row icon={<Building2 size={13} />} label={t("model.company")}>
          {model.company}
        </Row>
        <Row icon={<Globe size={13} />} label={t("model.country")}>
          {model.companyCountry}
        </Row>
        <Row icon={<Calendar size={13} />} label={t("model.released")}>
          {model.released}
        </Row>
        <Row icon={<Boxes size={13} />} label={t("model.size")}>
          {model.paramsLabel}
        </Row>
        <Row icon={<Gauge size={13} />} label={t("model.context")}>
          {model.contextWindow}
        </Row>
      </dl>

      {model.arenaElo !== null && (
        <div className="rounded-xl px-3.5 py-2.5 mb-3 bg-ink-100/70">
          <div className="text-[10px] uppercase tracking-wider text-ink-500 font-medium">
            {t("model.arenaTitle")}
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-semibold tabular-nums text-ink-900">
              {model.arenaElo}
            </span>
            <span className="text-[11px] text-ink-500">
              ELO · {model.arenaNote ?? t("model.arenaPublic")}
            </span>
          </div>
        </div>
      )}

      <ul className="mt-auto space-y-1.5 text-xs text-ink-700">
        {model.highlights.map((h, i) => (
          <li key={i} className="flex gap-2 leading-relaxed">
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
