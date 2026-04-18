import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { ApiError } from "../../api/client";
import { useLang } from "../../contexts/LanguageContext";

type Mode = "login" | "register";

export function AuthPage() {
  const { t } = useLang();
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const auth = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "login") {
        await auth.login(username.trim(), password);
      } else {
        await auth.register(username.trim(), password);
      }
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : t("auth.unexpectedError"),
      );
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "w-full bg-surface rounded-xl px-3.5 py-2.5 text-sm outline-none shadow-card focus:shadow-pop transition-shadow placeholder:text-ink-400";

  return (
    <div className="min-h-screen grid place-items-center px-6 bg-canvas">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-11 h-11 rounded-xl bg-primary text-primary-fg grid place-items-center text-lg font-semibold mx-auto mb-4 shadow-card">
            B
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">
            Boribory
          </h1>
          <p className="text-sm text-ink-500 mt-1.5">{t("auth.subtitle")}</p>
        </div>

        <div className="flex p-1 bg-ink-100 rounded-full mb-7">
          {(["login", "register"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError(null);
              }}
              className={`flex-1 py-1.5 text-sm rounded-full transition ${
                mode === m
                  ? "bg-surface text-ink-900 shadow-card font-medium"
                  : "text-ink-500 hover:text-ink-700"
              }`}
            >
              {m === "login" ? t("auth.login") : t("auth.register")}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-medium text-ink-500 mb-1.5 uppercase tracking-wider">
              {t("auth.username")}
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-ink-500 mb-1.5 uppercase tracking-wider">
              {t("auth.password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={mode === "register" ? 8 : undefined}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              className={inputCls}
            />
            {mode === "register" && (
              <div className="text-xs text-ink-500 mt-1.5">
                {t("auth.minChars")}
              </div>
            )}
          </div>

          {error && (
            <div className="text-sm text-danger bg-danger/10 rounded-xl px-3.5 py-2.5">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-fg hover:bg-primary-hover rounded-full py-2.5 text-sm font-medium disabled:bg-ink-300 disabled:text-ink-500 transition shadow-card mt-2"
          >
            {busy && <Loader2 size={14} className="animate-spin" />}
            {mode === "login" ? t("auth.submitLogin") : t("auth.submitRegister")}
          </button>
        </form>
      </div>
    </div>
  );
}
