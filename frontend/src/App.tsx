import { useEffect, useMemo, useState } from "react";
import { Loader2, ChevronsRight } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { SelectedModelsChips } from "./components/SelectedModelsChips";
import { ChatThread } from "./components/ChatThread";
import { QuestionInput } from "./components/QuestionInput";
import { ModelGallery } from "./components/ModelGallery";
import { AuthPage } from "./components/auth/AuthPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import {
  listConversations,
  fetchConversation,
  createConversation,
  updateConversation,
  askQuestion,
} from "./api/conversations";
import type { Conversation, ModelId, ResponseChunk, Turn } from "./types";

const TITLE_MAX = 50;
const truncateTitle = (s: string) =>
  s.length > TITLE_MAX ? s.slice(0, TITLE_MAX) + "…" : s;

function Shell() {
  const { user, logout } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [bootLoading, setBootLoading] = useState(true);
  const [busy, setBusy] = useState(false);

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

  const handleAsk = async (question: string) => {
    if (!active) return;

    const tempId = "temp-" + crypto.randomUUID();
    const optimistic: Turn = {
      id: tempId,
      question,
      createdAt: new Date().toISOString(),
      responses: active.selectedModels.map<ResponseChunk>((id) => ({
        modelId: id,
        status: "pending",
        content: "",
      })),
    };
    patchConv(active.id, { turns: [...active.turns, optimistic] });

    try {
      const realTurn = await askQuestion(active.id, question);
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
      const msg = err instanceof Error ? err.message : "erreur réseau";
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
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="px-6 py-3 border-b border-ink-200 bg-canvas/80 backdrop-blur">
          <div className="flex items-start gap-3">
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="p-1.5 -ml-1.5 text-ink-500 hover:text-ink-900 hover:bg-ink-100 rounded transition shrink-0"
                title="Afficher la barre latérale"
                aria-label="Afficher la barre latérale"
              >
                <ChevronsRight size={16} />
              </button>
            )}
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <h2
                className="font-medium truncate"
                title={active?.title ?? "Accueil"}
              >
                {truncateTitle(active?.title ?? "Accueil")}
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
              <div>
                <h1 className="text-2xl font-semibold tracking-tight mb-2">
                  Bienvenue, {user?.username}.
                </h1>
                <p className="text-ink-500 mb-6">
                  Démarre une discussion pour interroger plusieurs IA en
                  parallèle.
                </p>
                <button
                  onClick={handleNew}
                  disabled={busy}
                  className="bg-accent text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-60"
                >
                  Nouvelle discussion
                </button>
              </div>
            </div>
          )}

          {active && showGallery && (
            <ModelGallery onStart={handleStartFromGallery} />
          )}

          {active && !showGallery && <ChatThread turns={active.turns} />}
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
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
