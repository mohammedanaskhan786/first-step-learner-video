import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const AnimatedTimelineScene: React.FC<{
  events: { date: string; text: string }[];
}> = ({ events }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "#09090b", color: "#fff", padding: "120px 150px", fontFamily: "Arial" }}>
      <div style={{ fontSize: 22, letterSpacing: 5, opacity: .55 }}>TIMELINE</div>
      <div style={{ position: "absolute", left: 180, right: 180, top: 540, height: 4, background: "#33303a" }} />
      {events.map((event, i) => {
        const start = i * 0.8 * fps;
        const p = interpolate(frame, [start, start + 0.7 * fps], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        const x = 180 + (i / Math.max(1, events.length - 1)) * 1560;
        return (
          <div key={i} style={{ position: "absolute", left: x - 100, top: 465, width: 200, opacity: p, transform: `translateY(${(1-p)*25}px)` }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#c9b6ff", margin: "0 auto 20px" }} />
            <div style={{ textAlign: "center", fontSize: 26, fontWeight: 700 }}>{event.date}</div>
            <div style={{ textAlign: "center", fontSize: 20, opacity: .7, marginTop: 10 }}>{event.text}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
