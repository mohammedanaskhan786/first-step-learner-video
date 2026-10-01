import React from "react";
import { AbsoluteFill } from "remotion";
import { TimelineReveal } from "../effects/TimelineReveal";

export const TimelineScene: React.FC<{ scene: any }> = ({ scene }) => {
  return (
    <AbsoluteFill
      style={{
        background: "#090909",
        padding: "100px 180px",
      }}
    >
      <h1
        style={{
          fontSize: 60,
          margin: 0,
        }}
      >
        {scene.title}
      </h1>

      <TimelineReveal items={scene.items || []} />
    </AbsoluteFill>
  );
};
