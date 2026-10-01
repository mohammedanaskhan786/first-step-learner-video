import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { DocumentSlide } from "../effects/DocumentSlide";

export const DocumentScene: React.FC<{ scene: any }> = ({ scene }) => {
  return (
    <AbsoluteFill
      style={{
        background: "#101010",
      }}
    >
      <DocumentSlide
        src={staticFile(
          (scene.document || "").replace(/^\//, "")
        )}
      />

      <div
        style={{
          position: "absolute",
          top: 70,
          left: 100,
          fontSize: 50,
          fontWeight: 700,
        }}
      >
        {scene.title}
      </div>
    </AbsoluteFill>
  );
};
