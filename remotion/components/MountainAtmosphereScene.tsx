import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CameraRig } from "./CameraRig";
import { ParticleField } from "./ParticleField";

export const MountainAtmosphereScene: React.FC<{ text?: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 55) * 18;

  return (
    <AbsoluteFill style={{ background: "#090b0e" }}>
      <CameraRig zoomFrom={1} zoomTo={1.08} panX={-30} duration={14}>
        <svg width="100%" height="100%" viewBox="0 0 1920 1080">
          <defs>
            <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#101d2a" />
              <stop offset="100%" stopColor="#050608" />
            </linearGradient>
          </defs>
          <rect width="1920" height="1080" fill="url(#skyGradient)" />
          <circle cx={1500 + drift} cy="210" r="150" fill="rgba(220,235,255,.08)" />
          <path d="M0 850 L360 430 L650 770 L980 300 L1300 720 L1600 420 L1920 830 L1920 1080 L0 1080 Z" fill="#111820" />
          <path d="M0 910 L360 560 L680 830 L1000 480 L1300 790 L1610 560 L1920 900 L1920 1080 L0 1080 Z" fill="#0a1015" />
        </svg>

        <div style={{ position: "absolute", inset: 0, opacity: .35, transform: `translateX(${drift}px)` }}>
          <div style={{ width: 900, height: 260, marginTop: 360, marginLeft: 500, borderRadius: "50%", background: "rgba(190,210,220,.06)", filter: "blur(45px)" }} />
        </div>

        <ParticleField count={25} direction="left" opacity={0.12} size={3} />

        {text && (
          <div style={{ position: "absolute", left: 110, bottom: 100, maxWidth: 900, color: "#fff", fontFamily: "Arial", fontSize: 34, lineHeight: 1.35 }}>
            {text}
          </div>
        )}
      </CameraRig>
    </AbsoluteFill>
  );
};
