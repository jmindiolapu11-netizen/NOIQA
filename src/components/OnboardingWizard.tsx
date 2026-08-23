"use client";

import { useState } from "react";
import { SUBJECTS, LEVELS, getTaskOptions, COMFORT_LEVELS, type Level, type TeacherProfile } from "@/lib/constants";
import { Wordmark } from "./Wordmark";

type Step = 1 | 2 | 3 | 4;

export function OnboardingWizard({ onComplete, dark = false }: { onComplete: (profile: TeacherProfile) => void; dark?: boolean }) {
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

  const selectedClass = dark
    ? "border-wine-light bg-wine-light/15 text-white font-medium"
    : "border-wine-light bg-wine-light/10 text-carbon font-medium";
  const unselectedClass = dark
    ? "border-white/10 text-white/70 hover:border-wine-light/40 hover:bg-wine-light/5"
    : "border-carbon/8 text-carbon/70 hover:border-wine-light/40 hover:bg-wine-light/5";

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${dark ? "bg-dark-bg" : "bg-lino"}`}>
      <div className="w-full max-w-lg">
        <div className="text-center mb-10 animate-fade-in">
          <Wordmark size="lg" dark={dark} />
          <p className={`mt-2 text-sm ${dark ? "text-white/60" : "text-carbon/60"}`}>Tu copiloto de IA para enseñar</p>
        </div>

        <div className="flex gap-2 mb-8 px-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? "bg-wine-light" : dark ? "bg-white/10" : "bg-carbon/10"
              }`}
            />
          ))}
        </div>

        <div className={`rounded-2xl shadow-sm border p-6 animate-slide-up ${
          dark ? "bg-dark-card border-white/5" : "bg-white border-carbon/5"
        }`} key={step}>
          {step === 1 && (
            <StepSubject
              subject={subject}
              customSubject={customSubject}
              onSubject={setSubject}
              onCustomSubject={setCustomSubject}
              dark={dark}
              selectedClass={selectedClass}
              unselectedClass={unselectedClass}
            />
          )}
          {step === 2 && <StepLevel level={level} onLevel={setLevel} dark={dark} selectedClass={selectedClass} unselectedClass={unselectedClass} />}
          {step === 3 && level && <StepTask level={level as Level} task={task} onTask={setTask} dark={dark} selectedClass={selectedClass} unselectedClass={unselectedClass} />}
          {step === 4 && <StepComfort comfort={comfort} onComfort={setComfort} dark={dark} selectedClass={selectedClass} unselectedClass={unselectedClass} />}

          <div className="flex justify-between mt-8">
            <button
              onClick={back}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                step === 1 ? "invisible" : dark ? "text-white/50 hover:text-white hover:bg-white/5" : "text-carbon/50 hover:text-carbon hover:bg-carbon/5"
              }`}
            >
              Atrás
            </button>
            <button
              onClick={next}
              disabled={!canProceed[step]}
              className="px-6 py-2.5 rounded-lg text-sm font-medium bg-wine-light text-white transition-all hover:bg-wine disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {step === 4 ? "Empezar" : "Siguiente"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type StepProps = {
  dark: boolean;
  selectedClass: string;
  unselectedClass: string;
};

function StepSubject({
  subject,
  customSubject,
  onSubject,
  onCustomSubject,
  dark,
  selectedClass,
  unselectedClass,
}: {
  subject: string;
  customSubject: string;
  onSubject: (v: string) => void;
  onCustomSubject: (v: string) => void;
} & StepProps) {
  return (
    <>
      <h2 className={`text-lg font-semibold mb-1 ${dark ? "text-white" : "text-carbon"}`}>¿Qué materia enseñas?</h2>
      <p className={`text-sm mb-5 ${dark ? "text-white/50" : "text-carbon/50"}`}>Selecciona la principal o escribe la tuya</p>
      <div className="grid grid-cols-2 gap-2">
        {SUBJECTS.map((s) => (
          <button
            key={s}
            onClick={() => onSubject(s)}
            className={`px-3 py-2.5 rounded-lg text-sm text-left transition-all border ${
              subject === s ? selectedClass : unselectedClass
            }`}
          >
            {s}
          </button>
        ))}
        <button
          onClick={() => onSubject("__custom")}
          className={`px-3 py-2.5 rounded-lg text-sm text-left transition-all border col-span-2 ${
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
          onChange={(e) => onCustomSubject(e.target.value)}
          placeholder="Escribe tu materia"
          autoFocus
          className={`mt-3 w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-wine-light focus:ring-1 focus:ring-wine-light/30 ${
            dark ? "border-white/10 bg-dark-bg text-white placeholder:text-white/30" : "border-carbon/15 bg-lino/50 text-carbon"
          }`}
        />
      )}
    </>
  );
}

function StepLevel({ level, onLevel, dark, selectedClass, unselectedClass }: { level: string; onLevel: (v: Level) => void } & StepProps) {
  return (
    <>
      <h2 className={`text-lg font-semibold mb-1 ${dark ? "text-white" : "text-carbon"}`}>¿En qué nivel educativo?</h2>
      <p className={`text-sm mb-5 ${dark ? "text-white/50" : "text-carbon/50"}`}>Esto adapta las respuestas a tu contexto</p>
      <div className="space-y-2">
        {LEVELS.map((l) => (
          <button
            key={l}
            onClick={() => onLevel(l)}
            className={`w-full px-4 py-3.5 rounded-lg text-left transition-all border ${
              level === l ? selectedClass : unselectedClass
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </>
  );
}

function StepTask({ level, task, onTask, dark, selectedClass, unselectedClass }: { level: Level; task: string; onTask: (v: string) => void } & StepProps) {
  const tasks = getTaskOptions(level);
  return (
    <>
      <h2 className={`text-lg font-semibold mb-1 ${dark ? "text-white" : "text-carbon"}`}>¿Qué tarea repites más?</h2>
      <p className={`text-sm mb-5 ${dark ? "text-white/50" : "text-carbon/50"}`}>
        Empezaremos por aquí — después puedes explorar todo
      </p>
      <div className="space-y-2">
        {tasks.map((t) => (
          <button
            key={t}
            onClick={() => onTask(t)}
            className={`w-full px-4 py-3.5 rounded-lg text-sm text-left transition-all border ${
              task === t ? selectedClass : unselectedClass
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </>
  );
}

function StepComfort({ comfort, onComfort, dark, selectedClass, unselectedClass }: { comfort: string; onComfort: (v: string) => void } & StepProps) {
  return (
    <>
      <h2 className={`text-lg font-semibold mb-1 ${dark ? "text-white" : "text-carbon"}`}>¿Qué tan cómodo te sientes con IA?</h2>
      <p className={`text-sm mb-5 ${dark ? "text-white/50" : "text-carbon/50"}`}>No hay respuesta correcta — solo queremos adaptarnos</p>
      <div className="space-y-2">
        {COMFORT_LEVELS.map((c) => (
          <button
            key={c.value}
            onClick={() => onComfort(c.value)}
            className={`w-full px-4 py-3.5 rounded-lg text-left transition-all border ${
              comfort === c.value ? selectedClass : unselectedClass
            }`}
          >
            <span className="text-sm font-medium">{c.label}</span>
            <span className={`block text-xs mt-0.5 ${dark ? "text-white/50" : "text-carbon/50"}`}>{c.description}</span>
          </button>
        ))}
      </div>
    </>
  );
}
