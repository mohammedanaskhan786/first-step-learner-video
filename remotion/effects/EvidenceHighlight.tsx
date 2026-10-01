import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const EvidenceHighlight: React.FC<{
  text: string;
}> = ({ text }) => {
  const frame = useCurrentFrame();

  const width = interpolate(
    frame,
    [0, 20],
    [0, 100],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: 42,
          padding: "30px 50px",
          border: "1px solid rgba(255,255,255,.25)",
          background: "rgba(255,255,255,.04)",
          position: "relative",
        }}
      >
        {text}

        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            height: 4,
            width: `${width}%`,
            background: "#ffffff",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
