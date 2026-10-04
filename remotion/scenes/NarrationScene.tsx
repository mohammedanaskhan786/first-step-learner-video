import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import type { VisualBeat } from "../engineTypes";
import { VisualBeat as Renderer } from "../components/VisualBeat";

type NarrationSceneProps = {
  beats: VisualBeat[];
  fps: number;
};

export const NarrationScene: React.FC<NarrationSceneProps> = ({
  beats,
  fps,
}) => {
  if (!beats.length) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#070707",
        }}
      />
    );
  }

  return (
    <AbsoluteFill>
      {beats.map((beat) => {
        const startFrame = Math.max(
          0,
          Math.round(beat.start * fps)
        );

        const durationInFrames = Math.max(
          1,
          Math.round(
            (beat.end - beat.start) * fps
          )
        );

        return (
          <Sequence
            key={beat.id}
            from={startFrame}
            durationInFrames={durationInFrames}
          >
            <Renderer beat={beat} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
