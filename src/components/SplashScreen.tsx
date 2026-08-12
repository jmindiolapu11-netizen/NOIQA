"use client";

import { useState } from "react";
import { Wordmark } from "./Wordmark";

export function SplashScreen({ onStart }: { onStart: () => void }) {
  const [play] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-lino px-5">
      <div className="flex flex-col items-center justify-center">
        <div className={`splash-logo-wrap ${play ? "play" : ""}`}>
          <img
            src="/logo.png"
            alt="NOIQA"
            className="splash-logo-img"
            width={130}
            height={130}
          />
        </div>

        <div className={`splash-wordmark ${play ? "play" : ""}`}>
          <Wordmark size="lg" />
        </div>

        <button
          onClick={onStart}
          className={`splash-cta ${play ? "play" : ""}`}
        >
          Comenzar
        </button>
      </div>
    </div>
  );
}
