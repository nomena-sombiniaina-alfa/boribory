import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";

interface Props {
  onSubmit: (question: string) => void;
  disabled?: boolean;
}

export function QuestionInput({ onSubmit, disabled }: Props) {
  const { t } = useLang();
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = `${Math.min(ref.current.scrollHeight, 240)}px`;
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
    <div className="px-4 pb-4 pt-2 bg-canvas">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col bg-surface rounded-3xl shadow-input focus-within:shadow-pop transition-shadow">
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t("input.placeholder")}
            rows={1}
            className="w-full bg-transparent outline-none resize-none text-[15px] leading-relaxed placeholder:text-ink-400 px-5 pt-4 pb-2 min-h-[64px] max-h-[240px]"
            disabled={disabled}
          />
          <div className="flex justify-end px-3 pb-3">
            <button
              onClick={submit}
              disabled={!value.trim() || disabled}
              className="shrink-0 w-9 h-9 rounded-full bg-primary text-primary-fg grid place-items-center disabled:bg-ink-200 disabled:text-ink-400 disabled:cursor-not-allowed hover:bg-primary-hover transition"
              aria-label={t("input.send")}
            >
              <ArrowUp size={17} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
