"use client";

import { useState } from "react";
import { SUBJECTS, LEVELS, getTaskOptions, COMFORT_LEVELS, type Level, type TeacherProfile } from "@/lib/constants";
import { Wordmark } from "./Wordmark";

type Step = 1 | 2 | 3 | 4;

export function OnboardingWizard({ onComplete }: { onComplete: (profile: TeacherProfile) => void }) {
  const [step, setStep] = useState<Step>(1);
  const [subject, setSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [level, setLevel] = useState<Level | "">("");
  const [task, setTask] = useState("");
  const [comfort, setComfort] = useState("");

  const actualSubject = subject === "__custom" ? customSubject.trim() : subject;
  const canProceed: Record<Step, boolean> = {
    1: actualSubject.length > 0,
    2: level !== "",
    3: task !== "",
    4: comfort !== "",
  };

  function next() {
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
      onComplete(profile);
    }
  }

  function back() {
    if (step > 1) setStep((step - 1) as Step);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-lino px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10 animate-fade-in">
          <Wordmark size="lg" />
          <p className="mt-2 text-carbon/60 text-sm">Tu copiloto de IA para enseñar</p>
        </div>

        <div className="flex gap-2 mb-8 px-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? "bg-amber" : "bg-carbon/10"
              }`}
            />
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-carbon/5 p-6 animate-slide-up" key={step}>
          {step === 1 && (
            <StepSubject
              subject={subject}
              customSubject={customSubject}
              onSubject={setSubject}
              onCustomSubject={setCustomSubject}
            />
          )}
          {step === 2 && <StepLevel level={level} onLevel={setLevel} />}
          {step === 3 && level && <StepTask level={level as Level} task={task} onTask={setTask} />}
          {step === 4 && <StepComfort comfort={comfort} onComfort={setComfort} />}

          <div className="flex justify-between mt-8">
            <button
              onClick={back}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                step === 1 ? "invisible" : "text-carbon/50 hover:text-carbon hover:bg-carbon/5"
              }`}
            >
              Atrás
            </button>
            <button
              onClick={next}
              disabled={!canProceed[step]}
              className="px-6 py-2.5 rounded-lg text-sm font-medium bg-wine text-white transition-all hover:bg-wine/90 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {step === 4 ? "Empezar" : "Siguiente"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepSubject({
  subject,
  customSubject,
  onSubject,
  onCustomSubject,
}: {
  subject: string;
  customSubject: string;
  onSubject: (v: string) => void;
  onCustomSubject: (v: string) => void;
}) {
  return (
    <>
      <h2 className="text-lg font-semibold text-carbon mb-1">¿Qué materia enseñas?</h2>
      <p className="text-sm text-carbon/50 mb-5">Selecciona la principal o escribe la tuya</p>
      <div className="grid grid-cols-2 gap-2">
        {SUBJECTS.map((s) => (
          <button
            key={s}
            onClick={() => onSubject(s)}
            className={`px-3 py-2.5 rounded-lg text-sm text-left transition-all border ${
              subject === s
                ? "border-amber bg-amber/10 text-carbon font-medium"
                : "border-carbon/8 text-carbon/70 hover:border-amber/40 hover:bg-amber/5"
            }`}
          >
            {s}
          </button>
        ))}
        <button
          onClick={() => onSubject("__custom")}
          className={`px-3 py-2.5 rounded-lg text-sm text-left transition-all border col-span-2 ${
            subject === "__custom"
              ? "border-amber bg-amber/10 text-carbon font-medium"
              : "border-carbon/8 text-carbon/70 hover:border-amber/40 hover:bg-amber/5"
          }`}
        >
          Otra materia...
        </button>
      </div>
      {subject === "__custom" && (
        <input
          type="text"
          value={customSubject}
          onChange={(e) => onCustomSubject(e.target.value)}
          placeholder="Escribe tu materia"
          autoFocus
          className="mt-3 w-full px-4 py-2.5 rounded-lg border border-carbon/15 text-sm focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber/30 bg-lino/50"
        />
      )}
    </>
  );
}

function StepLevel({ level, onLevel }: { level: string; onLevel: (v: Level) => void }) {
  return (
    <>
      <h2 className="text-lg font-semibold text-carbon mb-1">¿En qué nivel educativo?</h2>
      <p className="text-sm text-carbon/50 mb-5">Esto adapta las respuestas a tu contexto</p>
      <div className="space-y-2">
        {LEVELS.map((l) => (
          <button
            key={l}
            onClick={() => onLevel(l)}
            className={`w-full px-4 py-3.5 rounded-lg text-left transition-all border ${
              level === l
                ? "border-amber bg-amber/10 text-carbon font-medium"
                : "border-carbon/8 text-carbon/70 hover:border-amber/40 hover:bg-amber/5"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </>
  );
}

function StepTask({ level, task, onTask }: { level: Level; task: string; onTask: (v: string) => void }) {
  const tasks = getTaskOptions(level);
  return (
    <>
      <h2 className="text-lg font-semibold text-carbon mb-1">¿Qué tarea repites más?</h2>
      <p className="text-sm text-carbon/50 mb-5">
        Empezaremos por aquí — después puedes explorar todo
      </p>
      <div className="space-y-2">
        {tasks.map((t) => (
          <button
            key={t}
            onClick={() => onTask(t)}
            className={`w-full px-4 py-3.5 rounded-lg text-sm text-left transition-all border ${
              task === t
                ? "border-amber bg-amber/10 text-carbon font-medium"
                : "border-carbon/8 text-carbon/70 hover:border-amber/40 hover:bg-amber/5"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </>
  );
}

function StepComfort({ comfort, onComfort }: { comfort: string; onComfort: (v: string) => void }) {
  return (
    <>
      <h2 className="text-lg font-semibold text-carbon mb-1">¿Qué tan cómodo te sientes con IA?</h2>
      <p className="text-sm text-carbon/50 mb-5">No hay respuesta correcta — solo queremos adaptarnos</p>
      <div className="space-y-2">
        {COMFORT_LEVELS.map((c) => (
          <button
            key={c.value}
            onClick={() => onComfort(c.value)}
            className={`w-full px-4 py-3.5 rounded-lg text-left transition-all border ${
              comfort === c.value
                ? "border-amber bg-amber/10 text-carbon font-medium"
                : "border-carbon/8 text-carbon/70 hover:border-amber/40 hover:bg-amber/5"
            }`}
          >
            <span className="text-sm font-medium">{c.label}</span>
            <span className="block text-xs text-carbon/50 mt-0.5">{c.description}</span>
          </button>
        ))}
      </div>
    </>
  );
}
