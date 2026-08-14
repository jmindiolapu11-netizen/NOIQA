"use client";

import { useEffect, useState } from "react";
import { Wordmark } from "./Wordmark";

export function SplashScreen({ onStart }: { onStart: () => void }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onStart, 400);
    }, 1900);
    return () => clearTimeout(timer);
  }, [onStart]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-lino px-5 transition-all duration-400 ease-out ${
        fading ? "opacity-0 scale-[0.97]" : ""
      }`}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="splash-logo-wrap play">
          <img
            src="/logo.png"
            alt="NOIQA"
            className="splash-logo-img"
            width={130}
            height={130}
          />
        </div>

        <div className="splash-wordmark play">
          <Wordmark size="lg" />
        </div>
      </div>
    </div>
  );
}
