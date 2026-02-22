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
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-surface border border-ink-200"
          >
            {m.label}
          </span>
        );
      })}
    </div>
  );
}
