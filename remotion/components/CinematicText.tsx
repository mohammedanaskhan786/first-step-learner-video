import React from "react";
import { AbsoluteFill } from "remotion";

// Visual-only fallback. Narration is carried by the audio track and subtitles;
// this component intentionally does not print title cards or repeat narration.
export const CinematicText: React.FC<{ title?: string; text?: string; eyebrow?: string }> = () => (
  <AbsoluteFill style={{
    background: "radial-gradient(ellipse at 50% 42%, #17212b 0%, #090b10 48%, #030405 100%)",
    overflow: "hidden",
  }}>
    <div style={{
      position: "absolute", inset: "-15%",
      background: "linear-gradient(115deg, transparent 25%, rgba(158,190,220,.07) 48%, transparent 65%)",
      transform: "rotate(-8deg)",
    }} />
    <div style={{
      position: "absolute", width: 900, height: 900, left: "28%", top: "-28%",
      borderRadius: "50%", background: "rgba(90,130,165,.06)", filter: "blur(80px)",
    }} />
  </AbsoluteFill>
);
