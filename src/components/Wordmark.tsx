"use client";

export function Wordmark({ size = "lg", showIcon = false, dark = false }: { size?: "sm" | "lg"; showIcon?: boolean; dark?: boolean }) {
  const textClass = size === "lg" ? "text-3xl" : "text-xl";
  const iconSize = size === "lg" ? "w-8 h-8" : "w-5 h-5";
  return (
    <span className={`flex items-center gap-2 ${textClass} font-bold tracking-tight ${dark ? "text-white" : "text-carbon"}`}>
      {showIcon && (
        <img src={dark ? "/logo-white.png" : "/logo.png"} alt="" className={iconSize} />
      )}
      NOIQA<span className="text-wine-light">.</span>
    </span>
  );
}
