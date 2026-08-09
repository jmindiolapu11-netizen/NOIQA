"use client";

import { useState, useEffect } from "react";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { ChatView } from "@/components/ChatView";
import { SkillTree } from "@/components/SkillTree";
import { isValidProfile, type TeacherProfile } from "@/lib/constants";

type View = "loading" | "onboarding" | "chat" | "skills";

export default function Home() {
  const [view, setView] = useState<View>("loading");
  const [profile, setProfile] = useState<TeacherProfile | null>(null);

  useEffect(() => {
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
    setView("onboarding");
  }, []);

  function handleOnboardingComplete(p: TeacherProfile) {
    setProfile(p);
    setView("chat");
  }

  function handleLogout() {
    localStorage.removeItem("noiqa-profile");
    localStorage.removeItem("noiqa-skills");
    setProfile(null);
    setView("onboarding");
  }

  if (view === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lino">
        <div className="text-carbon/30 text-sm">Cargando...</div>
      </div>
    );
  }

  if (view === "onboarding") {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  if (view === "skills") {
    return <SkillTree onBack={() => setView("chat")} />;
  }

  return (
    <ChatView
      profile={profile!}
      onOpenSkills={() => setView("skills")}
      onLogout={handleLogout}
    />
  );
}
