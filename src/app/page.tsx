"use client";

import { useState, useEffect, useCallback } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { ChatView } from "@/components/ChatView";
import { SkillTree } from "@/components/SkillTree";
import { isValidProfile, type TeacherProfile } from "@/lib/constants";

type View = "loading" | "splash" | "onboarding" | "chat" | "skills";

export default function Home() {
  const [view, setView] = useState<View>("loading");
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("noiqa-theme");
    if (savedTheme === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }

    const saved = localStorage.getItem("noiqa-profile");
    if (saved) {
      const parsed = JSON.parse(saved) as TeacherProfile;
      if (isValidProfile(parsed)) {
        setProfile(parsed);
        setView("chat");
        return;
      }
      localStorage.removeItem("noiqa-profile");
    }
    setView("splash");
  }, []);

  const toggleDark = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("noiqa-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("noiqa-theme", "light");
      }
      return next;
    });
  }, []);

  function handleOnboardingComplete(p: TeacherProfile) {
    setProfile(p);
    setView("chat");
  }

  function handleLogout() {
    localStorage.removeItem("noiqa-profile");
    localStorage.removeItem("noiqa-skills");
    setProfile(null);
    setView("splash");
  }

  if (view === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lino dark:bg-dark-bg">
        <div className="text-carbon/30 dark:text-white/30 text-sm">Cargando...</div>
      </div>
    );
  }

  if (view === "splash") {
    return <SplashScreen onStart={() => setView("onboarding")} dark={dark} />;
  }

  if (view === "onboarding") {
    return <OnboardingWizard onComplete={handleOnboardingComplete} dark={dark} />;
  }

  if (view === "skills") {
    return <SkillTree onBack={() => setView("chat")} dark={dark} toggleDark={toggleDark} />;
  }

  return (
    <ChatView
      profile={profile!}
      onOpenSkills={() => setView("skills")}
      onLogout={handleLogout}
      dark={dark}
      toggleDark={toggleDark}
    />
  );
}
