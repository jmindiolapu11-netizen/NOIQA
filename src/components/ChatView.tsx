"use client";

import { useState, useRef, useEffect } from "react";
import type { TeacherProfile } from "@/lib/constants";
import { Wordmark } from "./Wordmark";
import { EmailCapture } from "./EmailCapture";

type Message = {
  role: "user" | "assistant";
  content: string;
};

function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`px-2 py-1.5 rounded-lg transition-colors ${
        dark ? "text-white/60 hover:text-white hover:bg-white/10" : "text-carbon/60 hover:text-carbon hover:bg-carbon/5"
      }`}
      title={dark ? "Modo claro" : "Modo oscuro"}
    >
      {dark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

function NoiqaLoader() {
  return (
    <div className="flex flex-col items-center gap-2 py-3">
      <svg className="w-10 h-10 overflow-visible" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="loader-wine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B2E3A" />
            <stop offset="100%" stopColor="#9E2F3F" />
          </linearGradient>
          <linearGradient id="loader-burgundy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5C1D24" />
            <stop offset="100%" stopColor="#4A101D" />
          </linearGradient>
        </defs>
        <g className="noiqa-loader-group">
          <path
            d="M100 20 C125 20 140 40 140 70 L140 130 C140 160 125 180 100 180 C75 180 60 160 60 130 L60 70 C60 40 75 20 100 20 Z"
            fill="none"
            stroke="#1E252B"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path
            d="M20 100 C20 75 40 60 70 60 L130 60 C160 60 180 75 180 100 C180 125 160 140 130 140 L70 140 C40 140 20 125 20 100 Z"
            fill="none"
            stroke="url(#loader-wine)"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path
            className="noiqa-loader-core"
            d="M82 82 C90 74 110 74 118 82 C126 90 126 110 118 118 C110 126 90 126 82 118 C74 110 74 90 82 82 Z"
            fill="url(#loader-burgundy)"
          />
        </g>
      </svg>
      <span className="text-xs text-carbon/40 dark:text-white/40">Pensando</span>
    </div>
  );
}

export function ChatView({
  profile,
  onOpenSkills,
  onLogout,
  dark,
  toggleDark,
}: {
  profile: TeacherProfile;
  onOpenSkills: () => void;
  onLogout: () => void;
  dark: boolean;
  toggleDark: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [skillBadge, setSkillBadge] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 2 && !skillBadge) {
      setSkillBadge(true);
    }
    const alreadySubscribed = localStorage.getItem("noiqa-subscribed");
    const dismissed = localStorage.getItem("noiqa-email-dismissed");
    const assistantCount = messages.filter((m) => m.role === "assistant").length;
    if (assistantCount >= 3 && !alreadySubscribed && !dismissed && !showEmailCapture) {
      setShowEmailCapture(true);
    }
  }, [messages.length, skillBadge, showEmailCapture]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, profile }),
      });

      if (!res.ok) throw new Error("Error del servidor");

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.content }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Lo siento, hubo un error al procesar tu mensaje. Intenta de nuevo.",
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className={`flex flex-col h-screen ${dark ? "bg-dark-bg" : "bg-lino"}`}>
      <header className={`flex items-center justify-between px-4 py-3 border-b ${
        dark ? "border-white/5 bg-dark-bg" : "border-carbon/5 bg-white/80 backdrop-blur-sm"
      }`}>
        <Wordmark size="sm" showIcon dark={dark} />
        <div className="flex items-center gap-1">
          <ThemeToggle dark={dark} onToggle={toggleDark} />
          <button
            onClick={onOpenSkills}
            className={`relative px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              dark ? "text-white/60 hover:text-white hover:bg-white/10" : "text-carbon/60 hover:text-carbon hover:bg-carbon/5"
            }`}
          >
            Habilidades
            {skillBadge && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-wine-light rounded-full border-2 border-white dark:border-dark-bg" />
            )}
          </button>
          <button
            onClick={onLogout}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              dark ? "text-white/40 hover:text-white/70 hover:bg-white/10" : "text-carbon/40 hover:text-carbon/70 hover:bg-carbon/5"
            }`}
          >
            Reiniciar
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {messages.length === 0 ? (
            <EmptyState profile={profile} dark={dark} />
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-4 animate-fade-in ${msg.role === "user" ? "flex justify-end" : ""}`}
              >
                {msg.role === "user" ? (
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed ${
                    dark ? "bg-white/10 text-white" : "bg-carbon text-white"
                  }`}>
                    {msg.content}
                  </div>
                ) : (
                  <div className="max-w-[90%]">
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        dark ? "bg-white/10" : "bg-wine-light/10"
                      }`}>
                        <img src={dark ? "/logo-white.png" : "/logo.png"} alt="" className="w-4 h-4" />
                      </div>
                      <div className={`chat-message text-sm leading-relaxed flex-1 min-w-0 ${
                        dark ? "text-white/85" : "text-carbon/85"
                      }`}>
                        <FormattedMessage content={msg.content} dark={dark} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="mb-4 animate-fade-in">
              <NoiqaLoader />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {showEmailCapture && (
        <EmailCapture
          dark={dark}
          onDismiss={() => {
            setShowEmailCapture(false);
            localStorage.setItem("noiqa-email-dismissed", "true");
          }}
        />
      )}

      <div className={`border-t p-4 ${
        dark ? "border-white/5 bg-dark-bg" : "border-carbon/5 bg-white/80 backdrop-blur-sm"
      }`}>
        <div className="max-w-2xl mx-auto flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe lo que necesitas..."
            rows={1}
            className={`flex-1 px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none focus:border-wine-light focus:ring-1 focus:ring-wine-light/30 ${
              dark
                ? "border-white/10 bg-dark-card text-white placeholder:text-white/30"
                : "border-carbon/10 bg-lino/50 text-carbon"
            }`}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="px-4 py-3 rounded-xl bg-wine-light text-white text-sm font-medium transition-all hover:bg-wine disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  profile,
  dark,
}: {
  profile: TeacherProfile;
  dark: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
        dark ? "bg-white/10" : "bg-wine-light/10"
      }`}>
        <img src={dark ? "/logo-white.png" : "/logo.png"} alt="" className="w-7 h-7" />
      </div>
      <h2 className={`text-xl font-semibold mb-1 ${dark ? "text-white" : "text-carbon"}`}>
        ¿Qué necesitas hoy?
      </h2>
      <p className={`text-sm mb-8 max-w-sm ${dark ? "text-white/50" : "text-carbon/50"}`}>
        Soy tu copiloto para {profile.subject} en {profile.level.toLowerCase()}. Pregúntame lo que necesites.
      </p>
    </div>
  );
}

function FormattedMessage({ content, dark }: { content: string; dark: boolean }) {
  const sections = content.split(/(?=###\s)/);

  return (
    <div>
      {sections.map((section, i) => {
        const headerMatch = section.match(/^###\s+(.+)\n/);
        if (headerMatch) {
          const title = headerMatch[1];
          const body = section.replace(/^###\s+.+\n/, "");
          const isParaSalon = title.toLowerCase().includes("para tu salón");
          const isComoSeLogro = title.toLowerCase().includes("cómo se logró");

          return (
            <div
              key={i}
              className={`mb-4 ${
                isParaSalon
                  ? dark
                    ? "bg-wine-light/10 border-l-2 border-wine-light/40 pl-3 py-2 rounded-r-lg"
                    : "bg-wine-light/5 border-l-2 border-wine-light/30 pl-3 py-2 rounded-r-lg"
                  : isComoSeLogro
                    ? dark
                      ? "bg-white/[0.03] border-l-2 border-white/10 pl-3 py-2 rounded-r-lg"
                      : "bg-carbon/[0.02] border-l-2 border-carbon/10 pl-3 py-2 rounded-r-lg"
                    : ""
              }`}
            >
              <h3 className={`font-semibold text-sm mb-1 ${dark ? "text-white" : "text-carbon"}`}>
                {isParaSalon && <span className="text-wine-light mr-1">*</span>}
                {title}
              </h3>
              <SimpleMarkdown text={body} dark={dark} />
            </div>
          );
        }
        return <SimpleMarkdown key={i} text={section} dark={dark} />;
      })}
    </div>
  );
}

function SimpleMarkdown({ text, dark }: { text: string; dark: boolean }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let listType: "ul" | "ol" | null = null;

  function flushList() {
    if (listItems.length > 0 && listType) {
      const Tag = listType;
      elements.push(
        <Tag key={elements.length} className={`${listType === "ol" ? "list-decimal" : "list-disc"} ml-5 mb-3 space-y-1`}>
          {listItems.map((item, j) => (
            <li key={j} className="text-sm">
              <InlineFormat text={item} dark={dark} />
            </li>
          ))}
        </Tag>
      );
      listItems = [];
      listType = null;
    }
  }

  for (const line of lines) {
    const ulMatch = line.match(/^[-*]\s+(.+)/);
    const olMatch = line.match(/^\d+\.\s+(.+)/);

    if (ulMatch) {
      if (listType === "ol") flushList();
      listType = "ul";
      listItems.push(ulMatch[1]);
    } else if (olMatch) {
      if (listType === "ul") flushList();
      listType = "ol";
      listItems.push(olMatch[1]);
    } else {
      flushList();
      const trimmed = line.trim();
      if (trimmed) {
        elements.push(
          <p key={elements.length} className="mb-2 text-sm">
            <InlineFormat text={trimmed} dark={dark} />
          </p>
        );
      }
    }
  }
  flushList();

  return <>{elements}</>;
}

function InlineFormat({ text, dark }: { text: string; dark: boolean }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className={`font-semibold ${dark ? "text-white" : "text-carbon"}`}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
