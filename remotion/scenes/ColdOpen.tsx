import React from "react";
import { AbsoluteFill } from "remotion";
import { CinematicFade } from "../effects/CinematicFade";

export const ColdOpen: React.FC<{ scene: any }> = ({ scene }) => {
  return (
    <CinematicFade>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at center, #202020 0%, #080808 65%)",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 100,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 24,
              letterSpacing: 8,
              opacity: 0.65,
              marginBottom: 35,
            }}
          >
            DOCUMENTARY
          </div>

          <h1
            style={{
              fontSize: 82,
              margin: 0,
              fontWeight: 700,
            }}
          >
            {scene.title}
          </h1>

          {scene.subtitle && (
            <div
              style={{
                fontSize: 32,
                marginTop: 30,
                opacity: 0.7,
              }}
            >
              {scene.subtitle}
            </div>
          )}
        </div>
      </AbsoluteFill>
    </CinematicFade>
  );
};
