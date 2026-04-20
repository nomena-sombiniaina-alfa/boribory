import {
  MessageSquarePlus,
  LogOut,
  PanelLeftClose,
  Plus,
  Sun,
  Moon,
  Languages,
  Settings as SettingsIcon,
} from "lucide-react";
import type { Conversation, User } from "../types";
import { useTheme } from "../contexts/ThemeContext";
import { useLang } from "../contexts/LanguageContext";

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  user: User | null;
  onLogout: () => void;
  onCollapse: () => void;
  collapsed: boolean;
  onOpenSettings: () => void;
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
  onOpenSettings,
}: Props) {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();

  return (
    <aside
      className={`shrink-0 overflow-hidden bg-sidebar border-r border-ink-200 transition-[width] duration-200 ease-out ${
        collapsed ? "w-0 border-r-0 pointer-events-none" : "w-64"
      }`}
      aria-hidden={collapsed}
    >
      <div className="w-64 h-full flex flex-col">
        <div className="px-3 pt-4 pb-3">
          <div className="flex items-center justify-between gap-2 mb-5 px-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-primary text-primary-fg grid place-items-center text-sm font-semibold shrink-0">
                B
              </div>
              <span className="font-semibold tracking-tight truncate text-[15px]">
                Boribory
              </span>
            </div>
            <button
              onClick={onCollapse}
              className="p-1.5 text-ink-500 hover:text-ink-900 hover:bg-ink-200/70 rounded-md transition"
              title={t("sidebar.collapse")}
              aria-label={t("sidebar.collapse")}
            >
              <PanelLeftClose size={16} />
            </button>
          </div>
          <button
            onClick={onNew}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-ink-900 hover:bg-ink-200/60 transition"
          >
            <Plus size={16} className="text-primary" />
            {t("sidebar.newConversation")}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3">
          <div className="text-[11px] font-medium uppercase tracking-wider text-ink-500 px-3 pt-3 pb-1.5">
            {t("sidebar.conversations")}
          </div>
          <ul className="space-y-0.5">
            {conversations.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => onSelect(c.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm truncate transition ${
                    activeId === c.id
                      ? "bg-ink-200/80 text-ink-900 font-medium"
                      : "text-ink-700 hover:bg-ink-200/50"
                  }`}
                  title={c.title}
                >
                  {c.title}
                </button>
              </li>
            ))}
            {conversations.length === 0 && (
              <li className="px-3 py-8 text-center text-sm text-ink-500">
                <MessageSquarePlus className="mx-auto mb-2" size={18} />
                {t("sidebar.noConversations")}
              </li>
            )}
          </ul>
        </div>

        <div className="px-3 py-3 border-t border-ink-200 space-y-0.5">
          <button
            onClick={toggleLang}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-ink-700 hover:bg-ink-200/60 transition"
            title={
              lang === "fr"
                ? t("sidebar.switchToEnglish")
                : t("sidebar.switchToFrench")
            }
          >
            <Languages size={16} className="text-ink-500 shrink-0" />
            <span className="truncate">
              {lang === "fr" ? t("sidebar.english") : t("sidebar.french")}
            </span>
          </button>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-ink-700 hover:bg-ink-200/60 transition"
            title={
              theme === "light"
                ? t("sidebar.switchToDark")
                : t("sidebar.switchToLight")
            }
          >
            {theme === "light" ? (
              <Moon size={16} className="text-ink-500 shrink-0" />
            ) : (
              <Sun size={16} className="text-ink-500 shrink-0" />
            )}
            <span className="truncate">
              {theme === "light"
                ? t("sidebar.darkMode")
                : t("sidebar.lightMode")}
            </span>
          </button>
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-ink-700 hover:bg-ink-200/60 transition"
            title={t("sidebar.settings")}
          >
            <SettingsIcon size={16} className="text-ink-500 shrink-0" />
            <span className="truncate">
              {user?.username ?? t("sidebar.settings")}
            </span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-ink-700 hover:bg-ink-200/60 transition"
          >
            <LogOut size={16} className="text-ink-500 shrink-0" />
            {t("sidebar.logout")}
          </button>
        </div>
      </div>
    </aside>
  );
}
