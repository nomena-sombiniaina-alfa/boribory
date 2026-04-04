import { getModel } from "../data/models";
import type { ModelId } from "../types";

interface Props {
  selected: ModelId[];
  align?: "left" | "right";
}

export function SelectedModelsChips({ selected, align = "right" }: Props) {
  if (selected.length === 0) return null;
  return (
    <div
      className={`flex flex-wrap gap-1.5 ${
        align === "right" ? "justify-end" : "justify-start"
      }`}
    >
      {selected.map((id) => {
        const m = getModel(id);
        return (
          <span
            key={id}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium text-ink-700 bg-ink-100"
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: m.accent }}
            />
            {m.label}
          </span>
        );
      })}
    </div>
  );
}
