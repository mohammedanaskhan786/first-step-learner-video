import React from "react";
import { AbsoluteFill } from "remotion";
import { TimelineReveal } from "../effects/TimelineReveal";

export const InvestigationScene: React.FC<{
  scene: any;
}> = ({ scene }) => {
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at center,#171717,#050505)",
        padding: 100,
      }}
    >
      <div
        style={{
          fontSize: 58,
          fontWeight: 700,
        }}
      >
        {scene.title}
      </div>

      <TimelineReveal items={scene.items || []} />
    </AbsoluteFill>
  );
};
