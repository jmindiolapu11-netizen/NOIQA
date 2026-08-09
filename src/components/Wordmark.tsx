"use client";

export function Wordmark({ size = "lg" }: { size?: "sm" | "lg" }) {
  const textClass = size === "lg" ? "text-3xl" : "text-xl";
  return (
    <span className={`${textClass} font-bold tracking-tight text-carbon`}>
      NOIQA<span className="text-amber">.</span>
    </span>
  );
}
