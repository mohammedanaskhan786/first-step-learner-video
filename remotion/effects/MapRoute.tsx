import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const MapRoute: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(
    frame,
    [0, durationInFrames * 0.8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const width = 760 * progress;

  return (
    <AbsoluteFill>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
      >
        <path
          d="M520 600 C760 380 1050 720 1400 470"
          fill="none"
          stroke="#ffffff"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="760"
          strokeDashoffset={760 - width}
        />

        <circle
          cx="520"
          cy="600"
          r="15"
          fill="#ffffff"
        />

        <circle
          cx="1400"
          cy="470"
          r="15"
          fill="#ffffff"
        />
      </svg>
    </AbsoluteFill>
  );
};
