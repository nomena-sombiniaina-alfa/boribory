import { useEffect, useMemo, useState } from "react";
import { X, Check, Trash2, Loader2, AlertTriangle } from "lucide-react";
import type { Conversation, User } from "../types";
import { useLang } from "../contexts/LanguageContext";
import { ApiError } from "../api/client";

type Section = "profile" | "language" | "conversations";

interface Props {
  open: boolean;
  onClose: () => void;
  user: User | null;
  conversations: Conversation[];
  onUpdateUsername: (username: string) => Promise<void>;
  onDeleteSelected: (ids: string[]) => Promise<void>;
  onDeleteAll: () => Promise<void>;
}

export function SettingsModal({
  open,
  onClose,
  user,
  conversations,
  onUpdateUsername,
  onDeleteSelected,
  onDeleteAll,
}: Props) {
  const { t, lang, setLang } = useLang();
  const [section, setSection] = useState<Section>("profile");
  const [username, setUsername] = useState(user?.username ?? "");
  const [usernameBusy, setUsernameBusy] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameSaved, setUsernameSaved] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteBusy, setDeleteBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setUsername(user?.username ?? "");
    setUsernameError(null);
    setUsernameSaved(false);
    setSelected(new Set());
    setSection("profile");
  }, [open, user]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const canSaveUsername = useMemo(
    () =>
      username.trim().length > 0 &&
      username.trim() !== user?.username &&
      !usernameBusy,
    [username, user, usernameBusy],
  );

  if (!open) return null;

  const saveUsername = async () => {
    const u = username.trim();
    if (!u || u === user?.username) return;
    setUsernameBusy(true);
    setUsernameError(null);
    setUsernameSaved(false);
    try {
      await onUpdateUsername(u);
      setUsernameSaved(true);
    } catch (err) {
      setUsernameError(
        err instanceof ApiError ? err.message : t("auth.unexpectedError"),
      );
    } finally {
      setUsernameBusy(false);
    }
  };

  const toggleAll = () => {
    if (selected.size === conversations.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(conversations.map((c) => c.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const deleteSelected = async () => {
    if (selected.size === 0) return;
    if (
      !window.confirm(
        t("settings.confirmDeleteSelected", { count: selected.size }),
      )
    )
      return;
    setDeleteBusy(true);
    try {
      await onDeleteSelected(Array.from(selected));
      setSelected(new Set());
    } finally {
      setDeleteBusy(false);
    }
  };

  const deleteAll = async () => {
    if (!window.confirm(t("settings.confirmDeleteAll"))) return;
    setDeleteBusy(true);
    try {
      await onDeleteAll();
      setSelected(new Set());
    } finally {
      setDeleteBusy(false);
    }
  };

  const sections: { id: Section; label: string }[] = [
    { id: "profile", label: t("settings.profile") },
    { id: "language", label: t("settings.language") },
    { id: "conversations", label: t("settings.conversations") },
  ];

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] bg-surface rounded-2xl shadow-pop overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <header className="flex items-center justify-between px-5 py-3">
          <h2 className="text-base font-semibold text-ink-900">
            {t("settings.title")}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-ink-500 hover:text-ink-900 hover:bg-ink-100 rounded-md transition"
            aria-label={t("settings.close")}
          >
            <X size={16} />
          </button>
        </header>

        <div className="flex flex-1 min-h-0">
          <nav className="w-44 shrink-0 bg-canvas py-3 px-2 space-y-0.5">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition ${
                  section === s.id
                    ? "bg-ink-200/80 text-ink-900 font-medium"
                    : "text-ink-700 hover:bg-ink-200/50"
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>

          <div className="flex-1 overflow-y-auto p-5">
            {section === "profile" && (
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-[11px] font-medium text-ink-500 mb-1.5 uppercase tracking-wider">
                    {t("settings.usernameLabel")}
                  </label>
                  <input
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setUsernameSaved(false);
                      setUsernameError(null);
                    }}
                    className="w-full bg-canvas rounded-xl px-3.5 py-2.5 text-sm outline-none shadow-card focus:shadow-pop transition-shadow"
                  />
                  {usernameError && (
                    <div className="inline-flex items-center bg-danger text-white font-bold rounded-lg px-3 py-1.5 text-xs mt-2">
                      {usernameError}
                    </div>
                  )}
                  {usernameSaved && (
                    <div className="text-xs text-primary mt-1.5 flex items-center gap-1">
                      <Check size={12} />
                      {t("settings.saved")}
                    </div>
                  )}
                </div>
                <button
                  onClick={saveUsername}
                  disabled={!canSaveUsername}
                  className="bg-primary text-primary-fg hover:bg-primary-hover rounded-full px-4 py-2 text-sm font-medium disabled:bg-ink-200 disabled:text-ink-400 disabled:cursor-not-allowed transition shadow-card inline-flex items-center gap-2"
                >
                  {usernameBusy && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  {t("settings.save")}
                </button>
              </div>
            )}

            {section === "language" && (
              <div className="max-w-md space-y-2">
                {(["fr", "en"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition ${
                      lang === l
                        ? "bg-primary text-primary-fg font-semibold"
                        : "bg-canvas text-ink-700 hover:bg-ink-100"
                    }`}
                  >
                    <span>{l === "fr" ? "Français" : "English"}</span>
                    {lang === l && <Check size={16} />}
                  </button>
                ))}
              </div>
            )}

            {section === "conversations" && (
              <div className="space-y-4">
                {conversations.length === 0 ? (
                  <div className="text-sm text-ink-500 text-center py-8 bg-canvas rounded-xl">
                    {t("settings.noConversations")}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <button
                        onClick={toggleAll}
                        className="text-xs font-medium text-primary hover:text-primary-hover transition"
                      >
                        {selected.size === conversations.length
                          ? t("settings.selectNone")
                          : t("settings.selectAll")}
                      </button>
                      <button
                        onClick={deleteSelected}
                        disabled={selected.size === 0 || deleteBusy}
                        className="inline-flex items-center gap-1.5 bg-danger text-white font-bold rounded-full px-3 py-1.5 text-xs disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <Trash2 size={13} />
                        {t("settings.deleteSelected", {
                          count: selected.size,
                        })}
                      </button>
                    </div>

                    <ul className="bg-canvas rounded-xl p-1 space-y-0.5 max-h-[40vh] overflow-y-auto">
                      {conversations.map((c) => {
                        const checked = selected.has(c.id);
                        return (
                          <li key={c.id}>
                            <button
                              onClick={() => toggleOne(c.id)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm rounded-lg transition ${
                                checked
                                  ? "bg-primary-soft"
                                  : "hover:bg-ink-100"
                              }`}
                            >
                              <span
                                className={`w-4 h-4 rounded grid place-items-center shrink-0 transition ${
                                  checked
                                    ? "bg-primary text-primary-fg"
                                    : "bg-ink-200"
                                }`}
                              >
                                {checked && (
                                  <Check size={11} strokeWidth={3} />
                                )}
                              </span>
                              <span className="truncate flex-1 text-ink-900">
                                {c.title}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}

                <div className="bg-danger/15 rounded-xl p-4 space-y-3">
                  <div className="inline-flex items-center gap-1.5 bg-danger text-white font-bold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded">
                    <AlertTriangle size={12} />
                    {t("settings.dangerZone")}
                  </div>
                  <div>
                    <button
                      onClick={deleteAll}
                      disabled={conversations.length === 0 || deleteBusy}
                      className="inline-flex items-center gap-2 bg-danger text-white font-bold hover:opacity-90 rounded-full px-4 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <Trash2 size={14} />
                      {t("settings.deleteAll")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
