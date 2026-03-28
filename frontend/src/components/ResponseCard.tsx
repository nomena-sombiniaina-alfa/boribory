import { useEffect, useRef, useState } from "react";
import { Loader2, AlertCircle, CornerDownLeft, ArrowUp, X } from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ResponseChunk } from "../types";
import type { FollowUp } from "./ChatThread";
import { getModel } from "../data/models";
import { useLang } from "../contexts/LanguageContext";

const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="list-disc pl-5 mb-2 last:mb-0 space-y-0.5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-5 mb-2 last:mb-0 space-y-0.5">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  h1: ({ children }) => (
    <h1 className="text-base font-semibold text-ink-900 mt-3 mb-1.5 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-sm font-semibold text-ink-900 mt-3 mb-1.5 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-semibold text-ink-700 mt-2 mb-1 first:mt-0">
      {children}
    </h3>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-ink-900">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="text-accent underline underline-offset-2 hover:opacity-80"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-ink-200 pl-3 text-ink-500 italic my-2">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-3 border-ink-200" />,
  code: ({ className, children, ...props }) => {
    const isBlock = /language-/.test(className ?? "");
    if (isBlock) {
      return (
        <code className={`${className ?? ""} font-mono text-xs`} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="font-mono text-[0.85em] bg-ink-100 text-ink-900 px-1 py-0.5 rounded"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-ink-100 text-ink-900 rounded-md p-2.5 my-2 overflow-x-auto text-xs leading-relaxed">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto">
      <table className="w-full text-xs border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-ink-100 text-ink-900">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="border border-ink-200 px-2 py-1 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-ink-200 px-2 py-1 align-top">{children}</td>
  ),
};

function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {content}
    </ReactMarkdown>
  );
}

interface ResponseCardProps {
  chunk: ResponseChunk;
  followUps?: FollowUp[];
  onReplyOnly?: (question: string) => void;
}

function FollowUpBlock({ fu }: { fu: FollowUp }) {
  const { t } = useLang();
  return (
    <div className="mt-4 pt-4 border-t border-ink-100 space-y-2.5">
      <div className="text-sm text-ink-900 bg-ink-100/70 rounded-xl px-3.5 py-2.5 whitespace-pre-wrap font-medium">
        {fu.question}
      </div>
      <div className="text-sm leading-relaxed text-ink-700 break-words">
        {fu.response.status === "pending" && (
          <div className="flex items-center gap-2 text-ink-500">
            <Loader2 size={14} className="animate-spin" />
            {t("response.pending")}
          </div>
        )}
        {fu.response.status === "streaming" && (
          <>
            <MarkdownContent content={fu.response.content} />
            <span className="inline-block w-1.5 h-4 ml-0.5 bg-ink-500 align-middle animate-pulse" />
          </>
        )}
        {fu.response.status === "done" && (
          <MarkdownContent content={fu.response.content} />
        )}
        {fu.response.status === "error" && (
          <div className="flex items-start gap-2 text-danger">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{fu.response.error ?? t("response.error")}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ResponseCard({
  chunk,
  followUps = [],
  onReplyOnly,
}: ResponseCardProps) {
  const { t } = useLang();
  const model = getModel(chunk.modelId);
  const lastFollowUpStatus = followUps[followUps.length - 1]?.response.status;
  const rootDone = chunk.status === "done";
  const followUpsIdle =
    followUps.length === 0 ||
    lastFollowUpStatus === "done" ||
    lastFollowUpStatus === "error";
  const canReply = !!onReplyOnly && rootDone && followUpsIdle;

  const [replying, setReplying] = useState(false);
  const [draft, setDraft] = useState("");
  const replyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (replying) replyRef.current?.focus();
  }, [replying]);

  useEffect(() => {
    const el = replyRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [draft, replying]);

  const openReply = () => {
    if (!canReply) return;
    setReplying(true);
  };

  const cancelReply = () => {
    setReplying(false);
    setDraft("");
  };

  const sendReply = () => {
    const q = draft.trim();
    if (!q || !onReplyOnly) return;
    onReplyOnly(q);
    setReplying(false);
    setDraft("");
  };

  const onReplyKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendReply();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelReply();
    }
  };

  return (
    <article className="bg-surface rounded-2xl shadow-card overflow-hidden flex flex-col h-full min-h-[280px]">
      <header className="px-4 py-3 flex items-center gap-2.5 border-b border-ink-100">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: model.accent }}
          aria-hidden
        />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-[13px] text-ink-900 truncate leading-tight">
            {model.label}
          </div>
          <div className="text-[11px] text-ink-500 truncate leading-tight mt-0.5">
            {model.providerLabel}
          </div>
        </div>
        {chunk.latencyMs !== undefined && chunk.status === "done" && (
          <span className="text-[11px] text-ink-400 tabular-nums">
            {chunk.latencyMs}ms
          </span>
        )}
        {canReply && !replying && (
          <button
            onClick={openReply}
            className="shrink-0 inline-flex items-center gap-1 text-[11px] font-medium text-ink-500 hover:text-primary hover:bg-primary-soft rounded-full px-2 py-1 transition"
            title={t("response.replyTo", { label: model.label })}
            aria-label={t("response.replyTo", { label: model.label })}
          >
            <CornerDownLeft size={12} />
            <span className="hidden sm:inline">{t("response.reply")}</span>
          </button>
        )}
      </header>

      <div className="px-4 py-3 flex-1 text-sm leading-relaxed text-ink-700 break-words">
        {chunk.status === "pending" && (
          <div className="flex items-center gap-2 text-ink-500">
            <Loader2 size={14} className="animate-spin" />
            {t("response.pending")}
          </div>
        )}
        {chunk.status === "streaming" && (
          <>
            <MarkdownContent content={chunk.content} />
            <span className="inline-block w-1.5 h-4 ml-0.5 bg-ink-500 align-middle animate-pulse" />
          </>
        )}
        {chunk.status === "done" && <MarkdownContent content={chunk.content} />}
        {chunk.status === "error" && (
          <div className="flex items-start gap-2 text-danger">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{chunk.error ?? t("response.error")}</span>
          </div>
        )}
        {followUps.map((fu) => (
          <FollowUpBlock key={fu.id} fu={fu} />
        ))}
      </div>

      {replying && (
        <div className="border-t border-ink-100 bg-canvas/50 px-3 py-2.5">
          <div className="flex flex-col bg-surface rounded-2xl shadow-input focus-within:shadow-pop transition-shadow">
            <textarea
              ref={replyRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onReplyKeyDown}
              placeholder={t("response.continueWith", { label: model.label })}
              rows={1}
              className="w-full bg-transparent outline-none resize-none text-sm leading-relaxed placeholder:text-ink-400 px-4 pt-3 pb-1.5 min-h-[46px] max-h-[160px]"
            />
            <div className="flex justify-end gap-1 px-2 pb-2">
              <button
                onClick={cancelReply}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-500 hover:text-ink-900 hover:bg-ink-100 rounded-full px-2.5 py-1 transition"
                aria-label={t("response.cancel")}
                title={t("response.cancelEsc")}
              >
                <X size={12} />
                {t("response.cancel")}
              </button>
              <button
                onClick={sendReply}
                disabled={!draft.trim()}
                className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-fg grid place-items-center disabled:bg-ink-200 disabled:text-ink-400 disabled:cursor-not-allowed hover:bg-primary-hover transition"
                aria-label={t("response.sendTo", { label: model.label })}
                title={t("response.sendTo", { label: model.label })}
              >
                <ArrowUp size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
