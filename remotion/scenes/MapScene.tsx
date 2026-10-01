import React from "react";
import { AbsoluteFill } from "remotion";
import { MapRoute } from "../effects/MapRoute";

export const MapScene: React.FC<{ scene: any }> = ({ scene }) => {
  return (
    <AbsoluteFill
      style={{
        background: "#0b0b0b",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 100,
          zIndex: 5,
          fontSize: 54,
          fontWeight: 700,
        }}
      >
        {scene.title}
      </div>

      <MapRoute />

      <div
        style={{
          position: "absolute",
          left: 480,
          top: 650,
          fontSize: 28,
        }}
      >
        {scene.from}
      </div>

      <div
        style={{
          position: "absolute",
          right: 450,
          top: 500,
          fontSize: 28,
        }}
      >
        {scene.to}
      </div>
    </AbsoluteFill>
  );
};
