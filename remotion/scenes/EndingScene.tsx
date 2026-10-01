import React from "react";
import { AbsoluteFill } from "remotion";
import { CinematicFade } from "../effects/CinematicFade";

export const EndingScene: React.FC<{ scene: any }> = ({
  scene,
}) => {
  return (
    <CinematicFade>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at center,#202020 0%,#050505 70%)",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          {scene.title}
        </div>

        <div
          style={{
            marginTop: 35,
            fontSize: 30,
            opacity: 0.6,
          }}
        >
          {scene.subtitle}
        </div>

        <div
          style={{
            marginTop: 70,
            fontSize: 22,
            letterSpacing: 6,
            opacity: 0.4,
          }}
        >
          FIRST STEP LEARNER
        </div>
      </AbsoluteFill>
    </CinematicFade>
  );
};
