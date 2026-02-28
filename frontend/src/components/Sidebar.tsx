import {
  MessageSquarePlus,
  MessagesSquare,
  UserCircle2,
  LogOut,
  ChevronsLeft,
} from "lucide-react";
import type { Conversation, User } from "../types";

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  user: User | null;
  onLogout: () => void;
  onCollapse: () => void;
  collapsed: boolean;
}

export function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  user,
  onLogout,
  onCollapse,
  collapsed,
}: Props) {
  return (
    <aside
      className={`shrink-0 overflow-hidden border-r border-ink-200 bg-ink-100/60 transition-[width] duration-200 ease-out ${
        collapsed ? "w-0 border-r-0 pointer-events-none" : "w-64"
      }`}
      aria-hidden={collapsed}
    >
      <div className="w-64 h-full flex flex-col">
      <div className="px-4 py-4 border-b border-ink-200">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-md bg-accent text-white grid place-items-center text-sm font-bold shrink-0">
              B
            </div>
            <span className="font-semibold tracking-tight truncate">
              Boribory
            </span>
          </div>
          <button
            onClick={onCollapse}
            className="p-1.5 text-ink-500 hover:text-ink-900 hover:bg-ink-200/60 rounded transition"
            title="Réduire la barre latérale"
            aria-label="Réduire la barre latérale"
          >
            <ChevronsLeft size={16} />
          </button>
        </div>
        <button
          onClick={onNew}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-ink-200 hover:border-ink-300 text-sm font-medium transition"
        >
          <MessagesSquare size={16} />
          Nouvelle discussion
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3">
        <div className="text-xs uppercase tracking-wider text-ink-500 px-2 mb-2">
          Discussions
        </div>
        <ul className="space-y-0.5">
          {conversations.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => onSelect(c.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate transition ${
                  activeId === c.id
                    ? "bg-surface text-ink-900 shadow-sm"
                    : "text-ink-700 hover:bg-surface/60"
                }`}
                title={c.title}
              >
                {c.title}
              </button>
            </li>
          ))}
          {conversations.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-ink-500">
              <MessageSquarePlus className="mx-auto mb-2" size={20} />
              Aucune discussion
            </li>
          )}
        </ul>
      </div>

      <div className="px-3 py-3 border-t border-ink-200 space-y-1.5">
        <button
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-ink-200 hover:border-ink-300 text-sm font-medium transition"
          title="Compte utilisateur"
        >
          <UserCircle2 size={16} className="text-ink-500 shrink-0" />
          <span className="truncate">{user?.username ?? "Invité"}</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-ink-200 hover:border-ink-300 text-sm font-medium text-ink-700 hover:text-ink-900 transition"
        >
          <LogOut size={16} className="text-ink-500 shrink-0" />
          Se déconnecter
        </button>
      </div>
      </div>
    </aside>
  );
}
