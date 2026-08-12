"use client";

import { useState, useRef, useEffect } from "react";
import type { TeacherProfile } from "@/lib/constants";
import { getSuggestedChips } from "@/lib/chat-helpers";
import { Wordmark } from "./Wordmark";
import { EmailCapture } from "./EmailCapture";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function ChatView({
  profile,
  onOpenSkills,
  onLogout,
}: {
  profile: TeacherProfile;
  onOpenSkills: () => void;
  onLogout: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [skillBadge, setSkillBadge] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const chips = getSuggestedChips(profile);

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
    <div className="flex flex-col h-screen bg-lino">
      <header className="flex items-center justify-between px-4 py-3 border-b border-carbon/5 bg-white/80 backdrop-blur-sm">
        <Wordmark size="sm" showIcon />
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSkills}
            className="relative px-3 py-1.5 text-xs font-medium rounded-lg transition-colors text-carbon/60 hover:text-carbon hover:bg-carbon/5"
          >
            Habilidades
            {skillBadge && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber rounded-full border-2 border-white" />
            )}
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 text-xs font-medium rounded-lg text-carbon/40 hover:text-carbon/70 hover:bg-carbon/5 transition-colors"
          >
            Reiniciar
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {messages.length === 0 ? (
            <EmptyState chips={chips} onChip={sendMessage} profile={profile} />
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-4 animate-fade-in ${msg.role === "user" ? "flex justify-end" : ""}`}
              >
                {msg.role === "user" ? (
                  <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-br-sm bg-carbon text-white text-sm leading-relaxed">
                    {msg.content}
                  </div>
                ) : (
                  <div className="max-w-[90%]">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-amber/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-amber text-xs font-bold">N</span>
                      </div>
                      <div className="chat-message text-sm leading-relaxed text-carbon/85 flex-1 min-w-0">
                        <FormattedMessage content={msg.content} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="mb-4 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-amber/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber text-xs font-bold">N</span>
                </div>
                <div className="flex gap-1 py-3">
                  <span className="typing-dot w-2 h-2 rounded-full bg-amber/60" />
                  <span className="typing-dot w-2 h-2 rounded-full bg-amber/60" />
                  <span className="typing-dot w-2 h-2 rounded-full bg-amber/60" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {showEmailCapture && (
        <EmailCapture
          onDismiss={() => {
            setShowEmailCapture(false);
            localStorage.setItem("noiqa-email-dismissed", "true");
          }}
        />
      )}

      <div className="border-t border-carbon/5 bg-white/80 backdrop-blur-sm p-4">
        <div className="max-w-2xl mx-auto flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe lo que necesitas..."
            rows={1}
            className="flex-1 px-4 py-3 rounded-xl border border-carbon/10 text-sm resize-none focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber/30 bg-lino/50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="px-4 py-3 rounded-xl bg-wine text-white text-sm font-medium transition-all hover:bg-wine/90 disabled:opacity-30 disabled:cursor-not-allowed"
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
  chips,
  onChip,
  profile,
}: {
  chips: string[];
  onChip: (text: string) => void;
  profile: TeacherProfile;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className="w-12 h-12 rounded-full bg-amber/15 flex items-center justify-center mb-4">
        <span className="text-amber text-lg font-bold">N</span>
      </div>
      <h2 className="text-xl font-semibold text-carbon mb-1">¿Qué necesitas hoy?</h2>
      <p className="text-sm text-carbon/50 mb-8 max-w-sm">
        Soy tu copiloto para {profile.subject} en {profile.level.toLowerCase()}. Pregúntame lo que necesites o prueba con alguno de estos:
      </p>
      <div className="flex flex-wrap gap-2 justify-center max-w-md">
        {chips.map((chip) => (
          <button
            key={chip}
            onClick={() => onChip(chip)}
            className="px-4 py-2 rounded-full text-sm border border-amber/30 text-carbon/70 hover:bg-amber/10 hover:border-amber/50 hover:text-carbon transition-all"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}

function FormattedMessage({ content }: { content: string }) {
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
                  ? "bg-amber/5 border-l-2 border-amber/40 pl-3 py-2 rounded-r-lg"
                  : isComoSeLogro
                    ? "bg-carbon/[0.02] border-l-2 border-carbon/10 pl-3 py-2 rounded-r-lg"
                    : ""
              }`}
            >
              <h3 className="font-semibold text-sm text-carbon mb-1">
                {isParaSalon && <span className="text-amber mr-1">*</span>}
                {title}
              </h3>
              <SimpleMarkdown text={body} />
            </div>
          );
        }
        return <SimpleMarkdown key={i} text={section} />;
      })}
    </div>
  );
}

function SimpleMarkdown({ text }: { text: string }) {
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
              <InlineFormat text={item} />
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
            <InlineFormat text={trimmed} />
          </p>
        );
      }
    }
  }
  flushList();

  return <>{elements}</>;
}

function InlineFormat({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-carbon">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
