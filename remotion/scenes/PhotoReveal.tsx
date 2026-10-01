import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { KenBurns } from "../effects/KenBurns";

export const PhotoReveal: React.FC<{ scene: any }> = ({ scene }) => {
  return (
    <AbsoluteFill>
      {scene.image ? (
        <KenBurns src={staticFile(scene.image.replace(/^\//, ""))} />
      ) : (
        <AbsoluteFill
          style={{
            background: "#151515",
          }}
        />
      )}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(transparent 45%,rgba(0,0,0,.85))",
          justifyContent: "flex-end",
          padding: 100,
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
          }}
        >
          {scene.title}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
