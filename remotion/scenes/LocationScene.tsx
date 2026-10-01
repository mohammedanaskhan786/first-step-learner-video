import React from "react";
import { AbsoluteFill } from "remotion";
import { CameraZoom } from "../effects/CameraZoom";

export const LocationScene: React.FC<{ scene: any }> = ({ scene }) => {
  return (
    <CameraZoom>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(135deg,#111,#050505)",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 6,
            opacity: 0.5,
            marginBottom: 30,
          }}
        >
          LOCATION
        </div>

        <div
          style={{
            fontSize: 76,
            fontWeight: 700,
          }}
        >
          {scene.location || scene.title}
        </div>

        <div
          style={{
            marginTop: 30,
            fontSize: 30,
            opacity: 0.65,
          }}
        >
          {scene.subtitle}
        </div>
      </AbsoluteFill>
    </CameraZoom>
  );
};
