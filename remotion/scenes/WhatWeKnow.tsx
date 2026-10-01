import React from "react";
import { AbsoluteFill } from "remotion";

export const WhatWeKnow: React.FC<{ scene: any }> = ({
  scene,
}) => {
  return (
    <AbsoluteFill
      style={{
        background: "#0a0a0a",
        padding: 120,
      }}
    >
      <div
        style={{
          fontSize: 58,
          fontWeight: 700,
          marginBottom: 55,
        }}
      >
        {scene.title}
      </div>

      {(scene.facts || []).map(
        (fact: string, index: number) => (
          <div
            key={index}
            style={{
              fontSize: 32,
              marginBottom: 25,
              padding: "20px 30px",
              borderLeft: "4px solid #ffffff",
              background: "rgba(255,255,255,.04)",
            }}
          >
            ✓ {fact}
          </div>
        )
      )}
    </AbsoluteFill>
  );
};
