import React from "react";
import { AbsoluteFill } from "remotion";
import { CameraZoom } from "../effects/CameraZoom";

export const NewspaperScene: React.FC<{ scene: any }> = ({ scene }) => {
  return (
    <CameraZoom>
      <AbsoluteFill
        style={{
          background: "#171717",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 1100,
            minHeight: 650,
            padding: 70,
            background: "#e9e5d9",
            color: "#111",
            transform: "rotate(-1deg)",
            boxShadow: "0 30px 100px rgba(0,0,0,.7)",
          }}
        >
          <div
            style={{
              borderBottom: "3px solid #111",
              fontSize: 24,
              letterSpacing: 5,
              paddingBottom: 15,
            }}
          >
            ARCHIVE / REPORT
          </div>

          <div
            style={{
              fontSize: 58,
              fontWeight: 800,
              marginTop: 40,
              lineHeight: 1.05,
            }}
          >
            {scene.title}
          </div>

          <div
            style={{
              fontSize: 28,
              lineHeight: 1.5,
              marginTop: 45,
            }}
          >
            {scene.text}
          </div>
        </div>
      </AbsoluteFill>
    </CameraZoom>
  );
};
