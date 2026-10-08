import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const AnimatedEvidenceBoard: React.FC<{ items: string[] }> = ({ items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "#101114", color: "#fff", padding: 90, fontFamily: "Arial" }}>
      <div style={{ fontSize: 22, letterSpacing: 5, opacity: .55 }}>EVIDENCE BOARD — RECONSTRUCTION</div>

      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {items.map((_, i) => {
          if (i === 0) return null;
          const aX = 330 + ((i-1)%3)*600;
          const aY = 330 + Math.floor((i-1)/3)*300;
          const bX = 330 + (i%3)*600;
          const bY = 330 + Math.floor(i/3)*300;
          const p = interpolate(frame, [i*.45*fps, (i*.45+.7)*fps], [0,1], {
            extrapolateLeft:"clamp", extrapolateRight:"clamp"
          });
          return <line key={i} x1={aX} y1={aY} x2={aX+(bX-aX)*p} y2={aY+(bY-aY)*p}
            stroke="#b99dff" strokeWidth="4" opacity=".65" />;
        })}
      </svg>

      {items.map((item, i) => {
        const x = 190 + (i%3)*600;
        const y = 230 + Math.floor(i/3)*300;
        const p = interpolate(frame, [i*.45*fps, (i*.45+.55)*fps], [0,1], {
          extrapolateLeft:"clamp", extrapolateRight:"clamp"
        });
        return <div key={i} style={{
          position:"absolute", left:x, top:y, width:430, minHeight:170,
          background:"#17191e", border:"1px solid #39323f", padding:28,
          transform:`scale(${.92+.08*p})`, opacity:p,
          boxShadow:"0 20px 50px rgba(0,0,0,.35)"
        }}>
          <div style={{fontSize:16, letterSpacing:3, opacity:.45}}>CLUE {String(i+1).padStart(2,"0")}</div>
          <div style={{fontSize:25, lineHeight:1.3, marginTop:18}}>{item}</div>
        </div>;
      })}
    </AbsoluteFill>
  );
};
