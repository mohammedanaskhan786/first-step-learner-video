import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraRig } from "./CameraRig";

type C = { lat: number; lon: number };

const project = (c: C) => ({
  x: 180 + ((c.lon + 180) / 360) * 1560,
  y: 170 + ((90 - c.lat) / 180) * 740,
});

export const RouteAnimationScene: React.FC<{
  from?: string;
  to?: string;
  fromCoord?: C;
  toCoord?: C;
}> = ({ from = "ORIGIN", to = "DESTINATION", fromCoord, toCoord }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [0, 4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const a = fromCoord ? project(fromCoord) : { x: 500, y: 550 };
  const b = toCoord ? project(toCoord) : { x: 1420, y: 400 };
  const x = a.x + (b.x - a.x) * p;
  const y = a.y + (b.y - a.y) * p;

  return (
    <AbsoluteFill style={{ background: "#08090c" }}>
      <CameraRig zoomFrom={1} zoomTo={1.04} duration={8}>
        <svg width="100%" height="100%" viewBox="0 0 1920 1080">
          <rect x="80" y="90" width="1760" height="900" rx="32" fill="#0d1117" stroke="#252b34" strokeWidth="3" />
          {[...Array(11)].map((_, i) => <line key={"v"+i} x1={150+i*160} y1="140" x2={150+i*160} y2="940" stroke="#1a2028" />)}
          {[...Array(9)].map((_, i) => <line key={"h"+i} x1="110" y1={190+i*80} x2="1810" y2={190+i*80} stroke="#1a2028" />)}

          <path
            d={`M ${a.x} ${a.y} C ${(a.x+b.x)/2} ${a.y-170}, ${(a.x+b.x)/2} ${b.y+170}, ${x} ${y}`}
            fill="none" stroke="#b99dff" strokeWidth="8" strokeLinecap="round"
          />
          <circle cx={a.x} cy={a.y} r="18" fill="#fff" />
          <circle cx={x} cy={y} r="15" fill="#b99dff" />
          <circle cx={x} cy={y} r="32" fill="none" stroke="#b99dff" strokeWidth="3" opacity=".45" />
          <text x={a.x+28} y={a.y-18} fill="#fff" fontSize="28" fontFamily="Arial">{from}</text>
          <text x={b.x+28} y={b.y-18} fill="#fff" fontSize="28" fontFamily="Arial" opacity={p}>{to}</text>
        </svg>
      </CameraRig>
    </AbsoluteFill>
  );
};
