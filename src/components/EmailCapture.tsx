"use client";

import { useState } from "react";

export function EmailCapture({ onDismiss, dark = false }: { onDismiss: () => void; dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        setState("error");
        return;
      }

      localStorage.setItem("noiqa-subscribed", "true");
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className={`mx-4 mb-4 p-4 rounded-xl animate-fade-in ${
        dark ? "bg-wine-light/10 border border-wine-light/20" : "bg-wine-light/5 border border-wine-light/20"
      }`}>
        <div className="flex items-start justify-between">
          <div>
            <p className={`text-sm font-semibold ${dark ? "text-white" : "text-carbon"}`}>Te avisaremos</p>
            <p className={`text-xs mt-0.5 ${dark ? "text-white/50" : "text-carbon/50"}`}>
              Recibirás novedades sobre NOIQA en tu correo.
            </p>
          </div>
          <button onClick={onDismiss} className={`ml-2 ${dark ? "text-white/30 hover:text-white/50" : "text-carbon/30 hover:text-carbon/50"}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`mx-4 mb-4 p-4 rounded-xl shadow-sm animate-slide-up ${
      dark ? "bg-dark-card border border-white/5" : "bg-white border border-carbon/8"
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className={`text-sm font-semibold ${dark ? "text-white" : "text-carbon"}`}>
            Curso de IA para profesores
          </p>
          <p className={`text-xs mt-0.5 ${dark ? "text-white/50" : "text-carbon/50"}`}>
            Estamos preparando algo especial. Deja tu correo y te avisamos cuando esté listo.
          </p>
        </div>
        <button onClick={onDismiss} className={`ml-2 flex-shrink-0 ${dark ? "text-white/30 hover:text-white/50" : "text-carbon/30 hover:text-carbon/50"}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          className={`flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-wine-light focus:ring-1 focus:ring-wine-light/30 ${
            dark ? "border-white/10 bg-dark-bg text-white placeholder:text-white/30" : "border-carbon/10 bg-lino/50 text-carbon"
          }`}
        />
        <button
          type="submit"
          disabled={!email.trim() || state === "loading"}
          className="px-4 py-2 rounded-lg bg-wine-light text-white text-xs font-medium transition-all hover:bg-wine disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {state === "loading" ? "..." : "Avísame"}
        </button>
      </form>
      {state === "error" && (
        <p className="text-xs text-red-500 mt-2">Algo salió mal. Intenta de nuevo.</p>
      )}
    </div>
  );
}
