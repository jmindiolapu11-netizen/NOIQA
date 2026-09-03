"use client";

import { useState } from "react";
import { SUBJECTS, LEVELS, getTaskOptions, COMFORT_LEVELS, type Level, type TeacherProfile } from "@/lib/constants";
import { Wordmark } from "./Wordmark";

type Step = 0 | 1 | 2 | 3 | 4;

export function RegisterModal({
  onComplete,
  dark = false,
}: {
  onComplete: (profile: TeacherProfile, email: string) => void;
  dark?: boolean;
}) {
  const [step, setStep] = useState<Step>(0);
  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState<"idle" | "loading" | "error">("idle");
  const [subject, setSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [level, setLevel] = useState<Level | "">("");
  const [task, setTask] = useState("");
  const [comfort, setComfort] = useState("");

  const actualSubject = subject === "__custom" ? customSubject.trim() : subject;

  const canProceed: Record<Step, boolean> = {
    0: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    1: actualSubject.length > 0,
    2: level !== "",
    3: task !== "",
    4: comfort !== "",
  };

  async function next() {
    if (step === 0) {
      setEmailState("loading");
      try {
        await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        });
        localStorage.setItem("noiqa-subscribed", "true");
        localStorage.setItem("noiqa-email", email.trim().toLowerCase());
        setEmailState("idle");
        setStep(1);
      } catch {
        setEmailState("error");
      }
      return;
    }

    if (step < 4) {
      if (step === 2) setTask("");
      setStep((step + 1) as Step);
    } else {
      const profile: TeacherProfile = {
        subject: actualSubject,
        level: level as Level,
        task,
        comfort,
      };
      localStorage.setItem("noiqa-profile", JSON.stringify(profile));
      onComplete(profile, email.trim().toLowerCase());
    }
  }

  function back() {
    if (step > 0) setStep((step - 1) as Step);
  }

  const selectedClass = dark
    ? "border-white bg-white/10 text-white font-medium"
    : "border-carbon bg-carbon/10 text-carbon font-medium";
  const unselectedClass = dark
    ? "border-white/10 text-white/70 hover:border-white/30 hover:bg-white/5"
    : "border-carbon/8 text-carbon/70 hover:border-carbon/30 hover:bg-carbon/5";

  const totalSteps = 5;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" />
      <div
        className={`absolute inset-0 flex flex-col animate-sheet-up ${
          dark ? "bg-dark-bg" : "bg-lino"
        }`}
      >
        <header className={`flex items-center justify-between px-4 py-3 border-b ${
          dark ? "border-white/5" : "border-carbon/5"
        }`}>
          <Wordmark size="sm" showIcon dark={dark} />
          <span className={`text-xs ${dark ? "text-white/40" : "text-carbon/40"}`}>
            {step + 1} de {totalSteps}
          </span>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-lg mx-auto px-5 py-8">
            <div className="flex gap-1.5 mb-8">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i <= step ? (dark ? "bg-white" : "bg-carbon") : dark ? "bg-white/10" : "bg-carbon/10"
                  }`}
                />
              ))}
            </div>

            <div key={step} className="animate-fade-in">
              {step === 0 && (
                <>
                  <h2 className={`text-2xl font-semibold mb-2 ${dark ? "text-white" : "text-carbon"}`}>
                    Crea tu cuenta gratuita
                  </h2>
                  <p className={`text-sm mb-8 ${dark ? "text-white/50" : "text-carbon/50"}`}>
                    Guarda tu progreso y personaliza tu experiencia
                  </p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && canProceed[0] && next()}
                    className={`w-full px-4 py-3.5 rounded-xl border text-sm focus:outline-none ${
                      dark
                        ? "border-white/10 bg-dark-card text-white placeholder:text-white/30 focus:border-white/30 focus:ring-1 focus:ring-white/10"
                        : "border-carbon/10 bg-white text-carbon placeholder:text-carbon/30 focus:border-carbon/30 focus:ring-1 focus:ring-carbon/10"
                    }`}
                  />
                  {emailState === "error" && (
                    <p className="text-xs text-red-500 mt-2">Algo salió mal. Intenta de nuevo.</p>
                  )}
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className={`text-2xl font-semibold mb-2 ${dark ? "text-white" : "text-carbon"}`}>¿Qué materia enseñas?</h2>
                  <p className={`text-sm mb-8 ${dark ? "text-white/50" : "text-carbon/50"}`}>Selecciona la principal o escribe la tuya</p>
                  <div className="grid grid-cols-2 gap-2">
                    {SUBJECTS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSubject(s)}
                        className={`px-3 py-3 rounded-xl text-sm text-left transition-all border ${
                          subject === s ? selectedClass : unselectedClass
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                    <button
                      onClick={() => setSubject("__custom")}
                      className={`px-3 py-3 rounded-xl text-sm text-left transition-all border col-span-2 ${
                        subject === "__custom" ? selectedClass : unselectedClass
                      }`}
                    >
                      Otra materia...
                    </button>
                  </div>
                  {subject === "__custom" && (
                    <input
                      type="text"
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      placeholder="Escribe tu materia"
                      autoFocus
                      className={`mt-3 w-full px-4 py-3 rounded-xl border text-sm focus:outline-none ${
                        dark
                          ? "border-white/10 bg-dark-card text-white placeholder:text-white/30 focus:border-white/30 focus:ring-1 focus:ring-white/10"
                          : "border-carbon/10 bg-white text-carbon focus:border-carbon/30 focus:ring-1 focus:ring-carbon/10"
                      }`}
                    />
                  )}
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className={`text-2xl font-semibold mb-2 ${dark ? "text-white" : "text-carbon"}`}>¿En qué nivel educativo?</h2>
                  <p className={`text-sm mb-8 ${dark ? "text-white/50" : "text-carbon/50"}`}>Esto adapta las respuestas a tu contexto</p>
                  <div className="space-y-2">
                    {LEVELS.map((l) => (
                      <button
                        key={l}
                        onClick={() => setLevel(l)}
                        className={`w-full px-4 py-4 rounded-xl text-left transition-all border ${
                          level === l ? selectedClass : unselectedClass
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 3 && level && (
                <>
                  <h2 className={`text-2xl font-semibold mb-2 ${dark ? "text-white" : "text-carbon"}`}>¿Qué tarea repites más?</h2>
                  <p className={`text-sm mb-8 ${dark ? "text-white/50" : "text-carbon/50"}`}>
                    Empezaremos por aquí — después puedes explorar todo
                  </p>
                  <div className="space-y-2">
                    {getTaskOptions(level as Level).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTask(t)}
                        className={`w-full px-4 py-4 rounded-xl text-sm text-left transition-all border ${
                          task === t ? selectedClass : unselectedClass
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <h2 className={`text-2xl font-semibold mb-2 ${dark ? "text-white" : "text-carbon"}`}>¿Qué tan cómodo te sientes con IA?</h2>
                  <p className={`text-sm mb-8 ${dark ? "text-white/50" : "text-carbon/50"}`}>No hay respuesta correcta — solo queremos adaptarnos</p>
                  <div className="space-y-2">
                    {COMFORT_LEVELS.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setComfort(c.value)}
                        className={`w-full px-4 py-4 rounded-xl text-left transition-all border ${
                          comfort === c.value ? selectedClass : unselectedClass
                        }`}
                      >
                        <span className="text-sm font-medium">{c.label}</span>
                        <span className={`block text-xs mt-0.5 ${dark ? "text-white/50" : "text-carbon/50"}`}>{c.description}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className={`border-t px-5 py-4 ${dark ? "border-white/5" : "border-carbon/5"}`}>
          <div className="max-w-lg mx-auto flex justify-between">
            <button
              onClick={back}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                step === 0 ? "invisible" : dark ? "text-white/50 hover:text-white hover:bg-white/5" : "text-carbon/50 hover:text-carbon hover:bg-carbon/5"
              }`}
            >
              Atrás
            </button>
            <button
              onClick={next}
              disabled={!canProceed[step] || emailState === "loading"}
              className={`px-8 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                dark
                  ? "bg-white text-dark-bg hover:bg-white/90"
                  : "bg-carbon text-white hover:bg-carbon/90"
              }`}
            >
              {step === 0 ? (emailState === "loading" ? "..." : "Continuar") : step === 4 ? "Empezar" : "Siguiente"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
