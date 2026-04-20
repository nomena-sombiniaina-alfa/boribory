import { useEffect, useMemo, useState } from "react";
import { Loader2, PanelLeftOpen } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { SelectedModelsChips } from "./components/SelectedModelsChips";
import { ChatThread } from "./components/ChatThread";
import { QuestionInput } from "./components/QuestionInput";
import { ModelGallery } from "./components/ModelGallery";
import { AuthPage } from "./components/auth/AuthPage";
import { SettingsModal } from "./components/SettingsModal";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider, useLang } from "./contexts/LanguageContext";
import {
  listConversations,
  fetchConversation,
  createConversation,
  updateConversation,
  askQuestion,
  bulkDeleteConversations,
  deleteAllConversations,
} from "./api/conversations";
import type { Conversation, ModelId, ResponseChunk, Turn } from "./types";

const TITLE_MAX = 50;
const truncateTitle = (s: string) =>
  s.length > TITLE_MAX ? s.slice(0, TITLE_MAX) + "…" : s;

function Shell() {
  const { user, logout, updateUsername } = useAuth();
  const { t } = useLang();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [bootLoading, setBootLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    listConversations()
      .then((items) =>
        setConversations(items.map((i) => ({ ...i, turns: [] }))),
      )
      .catch(() => setConversations([]))
      .finally(() => setBootLoading(false));
  }, []);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId],
  );

  const showGallery =
    !!active && active.turns.length === 0 && active.selectedModels.length === 0;

  const patchConv = (id: string, patch: Partial<Conversation>) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );
  };

  const handleSelect = async (id: string) => {
    setActiveId(id);
    try {
      const full = await fetchConversation(id);
      patchConv(id, full);
    } catch {
      /* on garde ce qu'on a */
    }
  };

  const handleDeleteSelected = async (ids: string[]) => {
    if (ids.length === 0) return;
    await bulkDeleteConversations(ids);
    const idSet = new Set(ids);
    setConversations((prev) => prev.filter((c) => !idSet.has(c.id)));
    if (activeId && idSet.has(activeId)) setActiveId(null);
  };

  const handleDeleteAll = async () => {
    await deleteAllConversations();
    setConversations([]);
    setActiveId(null);
  };

  const handleNew = async () => {
    try {
      setBusy(true);
      const c = await createConversation([]);
      setConversations((prev) => [{ ...c, turns: [] }, ...prev]);
      setActiveId(c.id);
    } finally {
      setBusy(false);
    }
  };

  const handleStartFromGallery = async (models: ModelId[]) => {
    if (!active) return;
    try {
      setBusy(true);
      const updated = await updateConversation(active.id, {
        selectedModels: models,
      });
      patchConv(active.id, { selectedModels: updated.selectedModels });
    } finally {
      setBusy(false);
    }
  };

  const handleAsk = async (
    question: string,
    targetModels?: ModelId[],
    parentTurnId?: string,
  ) => {
    if (!active) return;

    const modelsForTurn: ModelId[] =
      targetModels && targetModels.length > 0
        ? targetModels
        : active.selectedModels;

    const tempId = "temp-" + crypto.randomUUID();
    const optimistic: Turn = {
      id: tempId,
      question,
      createdAt: new Date().toISOString(),
      parentTurnId: parentTurnId ?? null,
      responses: modelsForTurn.map<ResponseChunk>((id) => ({
        modelId: id,
        status: "pending",
        content: "",
      })),
    };
    patchConv(active.id, { turns: [...active.turns, optimistic] });

    try {
      const realTurn = await askQuestion(
        active.id,
        question,
        targetModels,
        parentTurnId,
      );
      setConversations((prev) =>
        prev.map((c) =>
          c.id !== active.id
            ? c
            : {
                ...c,
                turns: c.turns.map((t) => (t.id === tempId ? realTurn : t)),
                title:
                  c.turns.length === 1
                    ? question.slice(0, 60) +
                      (question.length > 60 ? "…" : "")
                    : c.title,
              },
        ),
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("error.network");
      setConversations((prev) =>
        prev.map((c) =>
          c.id !== active.id
            ? c
            : {
                ...c,
                turns: c.turns.map((t) =>
                  t.id !== tempId
                    ? t
                    : {
                        ...t,
                        responses: t.responses.map((r) => ({
                          ...r,
                          status: "error",
                          error: msg,
                        })),
                      },
                ),
              },
        ),
      );
    }
  };

  if (bootLoading) {
    return (
      <div className="h-screen grid place-items-center text-ink-500">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-canvas">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelect}
        onNew={handleNew}
        user={user}
        onLogout={logout}
        onCollapse={() => setSidebarCollapsed(true)}
        collapsed={sidebarCollapsed}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        conversations={conversations}
        onUpdateUsername={updateUsername}
        onDeleteSelected={handleDeleteSelected}
        onDeleteAll={handleDeleteAll}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="px-6 pt-4 pb-3 bg-canvas/80 backdrop-blur sticky top-0 z-10">
          <div className="flex items-start gap-3">
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="p-1.5 -ml-1.5 text-ink-500 hover:text-ink-900 hover:bg-ink-200/60 rounded-md transition shrink-0"
                title={t("sidebar.expand")}
                aria-label={t("sidebar.expand")}
              >
                <PanelLeftOpen size={16} />
              </button>
            )}
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <h2
                className="text-[15px] font-medium text-ink-900 truncate"
                title={active?.title ?? t("header.home")}
              >
                {truncateTitle(active?.title ?? t("header.home"))}
              </h2>
              {active && active.selectedModels.length > 0 && (
                <SelectedModelsChips
                  selected={active.selectedModels}
                  align="left"
                />
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {!active && (
            <div className="h-full grid place-items-center text-center px-6">
              <div className="max-w-md">
                <h1 className="text-3xl font-semibold tracking-tight mb-3 text-ink-900">
                  {t("welcome.title", { name: user?.username ?? "" })}
                </h1>
                <p className="text-ink-500 mb-8 leading-relaxed">
                  {t("welcome.subtitle")}
                </p>
                <button
                  onClick={handleNew}
                  disabled={busy}
                  className="bg-primary text-primary-fg hover:bg-primary-hover rounded-full px-5 py-2.5 text-sm font-medium disabled:opacity-60 transition shadow-card"
                >
                  {t("welcome.cta")}
                </button>
              </div>
            </div>
          )}

          {active && showGallery && (
            <ModelGallery onStart={handleStartFromGallery} />
          )}

          {active && !showGallery && (
            <ChatThread
              turns={active.turns}
              onReplyToModel={(id, q, parentTurnId) =>
                handleAsk(q, [id], parentTurnId)
              }
            />
          )}
        </div>

        {active && !showGallery && (
          <QuestionInput
            onSubmit={handleAsk}
            disabled={active.selectedModels.length === 0}
          />
        )}
      </main>
    </div>
  );
}

function Gate() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="h-screen grid place-items-center text-ink-500">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  return user ? <Shell /> : <AuthPage />;
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <Gate />
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
