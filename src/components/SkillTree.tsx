"use client";

import { useState, useEffect } from "react";
import { SKILLS } from "@/lib/constants";
import { Wordmark } from "./Wordmark";

type SkillProgress = Record<string, boolean>;

export function SkillTree({ onBack, dark, toggleDark }: { onBack: () => void; dark: boolean; toggleDark: () => void }) {
  const [progress, setProgress] = useState<SkillProgress>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("noiqa-skills");
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  function toggleComplete(id: string) {
    const updated = { ...progress, [id]: !progress[id] };
    setProgress(updated);
    localStorage.setItem("noiqa-skills", JSON.stringify(updated));
  }

  const completedCount = Object.values(progress).filter(Boolean).length;

  return (
    <div className={`min-h-screen ${dark ? "bg-dark-bg" : "bg-lino"}`}>
      <header className={`flex items-center justify-between px-4 py-3 border-b ${
        dark ? "border-white/5 bg-dark-bg" : "border-carbon/5 bg-white/80 backdrop-blur-sm"
      }`}>
        <Wordmark size="sm" showIcon dark={dark} />
        <button
          onClick={onBack}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            dark ? "text-white/60 hover:text-white hover:bg-white/10" : "text-carbon/60 hover:text-carbon hover:bg-carbon/5"
          }`}
        >
          Volver al chat
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className={`text-xl font-semibold mb-1 ${dark ? "text-white" : "text-carbon"}`}>Árbol de habilidades</h1>
          <p className={`text-sm mb-4 ${dark ? "text-white/50" : "text-carbon/50"}`}>
            8 habilidades para usar IA como profesor. Aprende a tu ritmo.
          </p>
          <div className="flex items-center gap-3">
            <div className={`flex-1 h-2 rounded-full overflow-hidden ${dark ? "bg-white/5" : "bg-carbon/5"}`}>
              <div
                className={`h-full rounded-full transition-all duration-500 ${dark ? "bg-white" : "bg-carbon"}`}
                style={{ width: `${(completedCount / SKILLS.length) * 100}%` }}
              />
            </div>
            <span className={`text-xs font-medium ${dark ? "text-white/50" : "text-carbon/50"}`}>
              {completedCount}/{SKILLS.length}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {SKILLS.map((skill, index) => {
            const isExpanded = expandedId === skill.id;
            const isCompleted = !!progress[skill.id];

            return (
              <div
                key={skill.id}
                className={`rounded-xl border transition-all animate-slide-up ${
                  dark
                    ? isCompleted ? "bg-dark-card border-white/20" : "bg-dark-card border-white/5"
                    : isCompleted ? "bg-white border-carbon/20" : "bg-white border-carbon/5"
                }`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : skill.id)}
                  className="w-full px-5 py-4 flex items-center gap-4 text-left"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-colors ${
                      isCompleted
                        ? dark ? "bg-white text-dark-bg" : "bg-carbon text-white"
                        : dark ? "bg-white/5 text-white/40" : "bg-carbon/5 text-carbon/40"
                    }`}
                  >
                    {isCompleted ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-semibold ${dark ? "text-white" : "text-carbon"}`}>{skill.title}</h3>
                    <p className={`text-xs ${dark ? "text-white/45" : "text-carbon/45"}`}>{skill.subtitle}</p>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""} ${dark ? "text-white/30" : "text-carbon/30"}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 animate-fade-in">
                    <div className="ml-12">
                      <p className={`text-sm mb-4 leading-relaxed ${dark ? "text-white/70" : "text-carbon/70"}`}>{skill.description}</p>

                      <div className="space-y-3 mb-5">
                        <div className={`rounded-lg p-3 border ${dark ? "bg-red-900/20 border-red-800/30" : "bg-red-50/50 border-red-100/50"}`}>
                          <p className="text-xs font-medium text-red-400/80 mb-1">En vez de esto:</p>
                          <p className={`text-sm italic ${dark ? "text-white/60" : "text-carbon/60"}`}>&ldquo;{skill.example.bad}&rdquo;</p>
                        </div>
                        <div className={`rounded-lg p-3 border ${dark ? "bg-green-900/20 border-green-800/30" : "bg-green-50/50 border-green-100/50"}`}>
                          <p className={`text-xs font-medium mb-1 ${dark ? "text-green-400/80" : "text-green-600/80"}`}>Prueba esto:</p>
                          <p className={`text-sm ${dark ? "text-white/70" : "text-carbon/70"}`}>&ldquo;{skill.example.good}&rdquo;</p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleComplete(skill.id)}
                        className={`text-xs font-medium px-4 py-2 rounded-lg transition-all ${
                          isCompleted
                            ? dark ? "bg-white/10 text-white hover:bg-white/15" : "bg-carbon/10 text-carbon hover:bg-carbon/15"
                            : dark ? "bg-white/5 text-white/50 hover:bg-white/10" : "bg-carbon/5 text-carbon/50 hover:bg-carbon/10"
                        }`}
                      >
                        {isCompleted ? "Completada" : "Marcar como completada"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
