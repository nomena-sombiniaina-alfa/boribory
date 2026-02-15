import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { ApiError } from "../../api/client";

type Mode = "login" | "register";

export function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
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
        await auth.register(username.trim(), email.trim(), password);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur inattendue");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-6 bg-canvas">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-lg bg-accent text-white grid place-items-center text-lg font-bold mx-auto mb-3">
            B
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Boribory</h1>
          <p className="text-sm text-ink-500 mt-1">
            Ton conseil de modèles d'IA
          </p>
        </div>

        <div className="flex p-1 bg-ink-100 rounded-lg mb-6">
          {(["login", "register"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError(null);
              }}
              className={`flex-1 py-1.5 text-sm rounded-md transition ${
                mode === m
                  ? "bg-surface text-ink-900 shadow-sm"
                  : "text-ink-500"
              }`}
            >
              {m === "login" ? "Se connecter" : "S'inscrire"}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-ink-500 mb-1">
              Nom d'utilisateur
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full bg-surface border border-ink-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-xs text-ink-500 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full bg-surface border border-ink-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-ink-500 mb-1">
              Mot de passe
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
              className="w-full bg-surface border border-ink-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
            {mode === "register" && (
              <div className="text-xs text-ink-500 mt-1">
                8 caractères minimum
              </div>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 bg-accent text-white rounded-lg py-2.5 text-sm font-medium disabled:bg-ink-300 transition"
          >
            {busy && <Loader2 size={14} className="animate-spin" />}
            {mode === "login" ? "Se connecter" : "Créer le compte"}
          </button>
        </form>
      </div>
    </div>
  );
}
