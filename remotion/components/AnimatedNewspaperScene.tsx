import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const AnimatedNewspaperScene: React.FC<{
  headline: string;
  subheadline?: string;
}> = ({ headline, subheadline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [0, 1.2 * fps], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#15130f", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        width: 1250, minHeight: 760, background: "#e7e0cf", color: "#181612",
        padding: 70, boxShadow: "0 35px 90px rgba(0,0,0,.6)",
        transform: `rotate(${-1.5 + p*1.5}deg) translateY(${(1-p)*80}px) scale(${.94+p*.06})`,
        opacity: p, fontFamily: "Georgia, serif"
      }}>
        <div style={{ fontSize: 22, letterSpacing: 5, borderBottom: "3px solid #181612", paddingBottom: 16 }}>
          DAILY RECORD — RECONSTRUCTION
        </div>
        <div style={{ fontSize: 70, fontWeight: 800, lineHeight: 1.02, marginTop: 45 }}>{headline}</div>
        {subheadline && <div style={{ fontSize: 28, marginTop: 28, lineHeight: 1.35, maxWidth: 1000 }}>{subheadline}</div>}
        <div style={{ marginTop: 60, height: 210, background: "#c8c0ad", opacity: .75 }} />
        <div style={{ marginTop: 28, height: 16, width: "80%", background: "#9d9687" }} />
        <div style={{ marginTop: 15, height: 16, width: "92%", background: "#aaa394" }} />
        <div style={{ marginTop: 15, height: 16, width: "68%", background: "#aaa394" }} />
      </div>
    </AbsoluteFill>
  );
};
