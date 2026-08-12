"use client";

export function Wordmark({ size = "lg", showIcon = false }: { size?: "sm" | "lg"; showIcon?: boolean }) {
  const textClass = size === "lg" ? "text-3xl" : "text-xl";
  const iconSize = size === "lg" ? "w-8 h-8" : "w-5 h-5";
  return (
    <span className={`flex items-center gap-2 ${textClass} font-bold tracking-tight text-carbon`}>
      {showIcon && (
        <img src="/logo.png" alt="" className={iconSize} />
      )}
      NOIQA<span className="text-amber">.</span>
    </span>
  );
}
