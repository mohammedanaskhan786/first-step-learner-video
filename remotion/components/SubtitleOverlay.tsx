import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface SubtitleCue {
  start: number;
  end: number;
  text: string;
}

interface SubtitleOverlayProps {
  cues: SubtitleCue[];
}

export const SubtitleOverlay: React.FC<
  SubtitleOverlayProps
> = ({ cues }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const time = frame / fps;

  const active = cues.find(
    (cue) => time >= cue.start && time <= cue.end
  );

  if (!active) {
    return null;
  }

  const localTime = time - active.start;

  const opacity = interpolate(
    localTime,
    [0, 0.12, active.end - active.start - 0.12, active.end - active.start],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 95,
      }}
    >
      <div
        style={{
          opacity,
          maxWidth: 1450,
          padding: "12px 26px",
          background: "rgba(0,0,0,.72)",
          borderRadius: 8,
          fontSize: 31,
          lineHeight: 1.3,
          textAlign: "center",
          color: "#ffffff",
          textShadow: "0 2px 8px rgba(0,0,0,.8)",
        }}
      >
        {active.text}
      </div>
    </AbsoluteFill>
  );
};
