"use client";

import React, { useEffect, useState } from "react";

export default function SplashScreen() {
  const [isRendered, setIsRendered] = useState(true);
  const [isAssembled, setIsAssembled] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // 1. Immediately trigger the scatter-to-assembly animation on mount
    const startAssemble = setTimeout(() => {
      setIsAssembled(true);
    }, 150);

    // 2. Start the overlay fade-out sequence after 4.2 seconds
    // (Allows 3s for the slow-motion assembly + 1.2s to appreciate the logo)
    const startFade = setTimeout(() => {
      setIsFading(true);
    }, 4200);

    // 3. Unmount the component from the DOM after the fade transition finishes (800ms)
    const completeDestruct = setTimeout(() => {
      setIsRendered(false);
    }, 5000);

    return () => {
      clearTimeout(startAssemble);
      clearTimeout(startFade);
      clearTimeout(completeDestruct);
    };
  }, []);

  if (!isRendered) return null;

  // Base styling for cinematic slow-motion flying transition
  const basePartStyle = {
    position: "absolute",
    inset: 0,
    transitionProperty: "all",
    transitionDuration: "3000ms", // 3.0 seconds elegant slow-motion
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)", // Premium organic ease-out
  };

  // Quadrant configurations: scattered off-screen to 4 corners vs assembled
  const partStyles = {
    tl: {
      ...basePartStyle,
      transform: isAssembled
        ? "translate(0, 0) scale(1) rotate(0deg)"
        : "translate(-60vw, -60vh) scale(0.4) rotate(-90deg)",
      opacity: isAssembled ? 1 : 0,
    },
    tr: {
      ...basePartStyle,
      transform: isAssembled
        ? "translate(0, 0) scale(1) rotate(0deg)"
        : "translate(60vw, -60vh) scale(0.4) rotate(90deg)",
      opacity: isAssembled ? 1 : 0,
    },
    bl: {
      ...basePartStyle,
      transform: isAssembled
        ? "translate(0, 0) scale(1) rotate(0deg)"
        : "translate(-60vw, 60vh) scale(0.4) rotate(90deg)",
      opacity: isAssembled ? 1 : 0,
    },
    br: {
      ...basePartStyle,
      transform: isAssembled
        ? "translate(0, 0) scale(1) rotate(0deg)"
        : "translate(60vw, 60vh) scale(0.4) rotate(-90deg)",
      opacity: isAssembled ? 1 : 0,
    },
  };

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-[#FFF7ED] transition-opacity duration-800 ease-in-out ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Container sizing the logo area */}
      <div className="relative w-80 h-40 md:w-96 md:h-48 flex items-center justify-center scale-90 sm:scale-100">
        
        {/* Top-Left Quadrant */}
        <div style={partStyles.tl}>
          <img
            src="/logo.png"
            alt="Logo TL"
            className="w-full h-full object-contain"
            style={{ clipPath: "polygon(0 0, 50% 0, 50% 50%, 0 50%)" }}
          />
        </div>

        {/* Top-Right Quadrant */}
        <div style={partStyles.tr}>
          <img
            src="/logo.png"
            alt="Logo TR"
            className="w-full h-full object-contain"
            style={{ clipPath: "polygon(50% 0, 100% 0, 100% 50%, 50% 50%)" }}
          />
        </div>

        {/* Bottom-Left Quadrant */}
        <div style={partStyles.bl}>
          <img
            src="/logo.png"
            alt="Logo BL"
            className="w-full h-full object-contain"
            style={{ clipPath: "polygon(0 50%, 50% 50%, 50% 100%, 0 100%)" }}
          />
        </div>

        {/* Bottom-Right Quadrant */}
        <div style={partStyles.br}>
          <img
            src="/logo.png"
            alt="Logo BR"
            className="w-full h-full object-contain"
            style={{ clipPath: "polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)" }}
          />
        </div>

        {/* Cinematic glow flash upon assembly */}
        <div
          className={`absolute inset-0 bg-gradient-to-tr from-primary/30 via-accent/30 to-secondary/30 blur-2xl rounded-full transition-all duration-1200 delay-[2500ms] pointer-events-none ${
            isAssembled ? "scale-125 opacity-100" : "scale-50 opacity-0"
          }`}
        />
      </div>
    </div>
  );
}
