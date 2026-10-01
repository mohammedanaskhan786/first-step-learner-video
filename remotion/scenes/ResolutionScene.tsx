import React from "react";
import { AbsoluteFill } from "remotion";
import { CinematicFade } from "../effects/CinematicFade";

export const ResolutionScene: React.FC<{
  scene: any;
}> = ({ scene }) => {
  return (
    <CinematicFade>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(135deg,#171717,#050505)",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 150,
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 7,
            opacity: 0.55,
            marginBottom: 35,
          }}
        >
          THE RESOLUTION
        </div>

        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
          }}
        >
          {scene.title}
        </div>

        <div
          style={{
            marginTop: 35,
            maxWidth: 1100,
            fontSize: 32,
            lineHeight: 1.5,
            opacity: 0.72,
          }}
        >
          {scene.text}
        </div>
      </AbsoluteFill>
    </CinematicFade>
  );
};
