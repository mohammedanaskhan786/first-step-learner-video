import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const TimelineReveal: React.FC<{
  items: string[];
}> = ({ items }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill>
      {items.map((item, index) => {
        const start = (durationInFrames / items.length) * index;

        const opacity = interpolate(
          frame,
          [start, start + 18],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        const x = interpolate(
          frame,
          [start, start + 18],
          [-40, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: 300,
              top: 300 + index * 150,
              opacity,
              transform: `translateX(${x}px)`,
              fontSize: 34,
            }}
          >
            <span style={{ marginRight: 30 }}>●</span>
            {item}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
