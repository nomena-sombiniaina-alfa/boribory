import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";

interface Props {
  onSubmit: (question: string) => void;
  disabled?: boolean;
}

export function QuestionInput({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = `${Math.min(ref.current.scrollHeight, 200)}px`;
  }, [value]);

  const submit = () => {
    const q = value.trim();
    if (!q || disabled) return;
    onSubmit(q);
    setValue("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-t border-ink-200 bg-canvas/80 backdrop-blur">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-end gap-2 bg-surface border border-ink-200 rounded-2xl px-4 py-3 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent-soft transition">
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Pose ta question au panel…"
            rows={1}
            className="flex-1 bg-transparent outline-none resize-none text-sm leading-relaxed placeholder:text-ink-500 max-h-[200px]"
            disabled={disabled}
          />
          <button
            onClick={submit}
            disabled={!value.trim() || disabled}
            className="shrink-0 w-9 h-9 rounded-xl bg-accent text-white grid place-items-center disabled:bg-ink-300 disabled:cursor-not-allowed transition"
            aria-label="Envoyer"
          >
            <ArrowUp size={18} />
          </button>
        </div>
        <div className="mt-2 text-xs text-ink-500 text-center">
          Entrée pour envoyer · Maj+Entrée pour une nouvelle ligne
        </div>
      </div>
    </div>
  );
}
