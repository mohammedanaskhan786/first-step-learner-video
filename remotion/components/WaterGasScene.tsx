import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraRig } from "./CameraRig";
import { ParticleField } from "./ParticleField";

export const WaterGasScene: React.FC<{ title?: string; text?: string }> = ({
  title = "BENEATH THE SURFACE",
  text,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [0, 12 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#071018", color: "#fff" }}>
      <CameraRig zoomFrom={1} zoomTo={1.14} duration={12}>
        <AbsoluteFill>
          <svg width="100%" height="100%" viewBox="0 0 1920 1080">
            <defs>
              <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#183e55" />
                <stop offset="55%" stopColor="#0b2231" />
                <stop offset="100%" stopColor="#030b10" />
              </linearGradient>
              <radialGradient id="waterGlow">
                <stop offset="0%" stopColor="#8ad8ff" stopOpacity=".3" />
                <stop offset="100%" stopColor="#8ad8ff" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect width="1920" height="1080" fill="url(#waterGradient)" />
            <ellipse cx="980" cy="180" rx="650" ry="230" fill="url(#waterGlow)" />

            {[0,1,2,3,4].map((i) => (
              <path
                key={i}
                d={`M0 ${560 + i * 75} C400 ${500 + i * 70}, 900 ${620 + i * 45}, 1920 ${540 + i * 70}`}
                fill="none"
                stroke="rgba(100,190,220,.18)"
                strokeWidth="3"
              />
            ))}

            {Array.from({ length: 28 }, (_, i) => {
              const x = 280 + (i * 83) % 1360;
              const y = 850 - ((frame * (0.6 + (i % 5) * .08) + i * 43) % 500);
              const r = 3 + (i % 5);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={r}
                  fill="rgba(185,235,255,.7)"
                  opacity={0.15 + p * .7}
                />
              );
            })}
          </svg>

          <ParticleField count={35} direction="up" opacity={0.16} size={4} />

          <div style={{ position: "absolute", left: 110, top: 100, maxWidth: 900, fontFamily: "Arial" }}>
            <div style={{ fontSize: 22, letterSpacing: 6, opacity: .6 }}>
              SCIENTIFIC RECONSTRUCTION
            </div>
            <div style={{ fontSize: 64, fontWeight: 700, marginTop: 12 }}>
              {title}
            </div>
            {text && (
              <div style={{ fontSize: 30, lineHeight: 1.35, marginTop: 20, opacity: .82 }}>
                {text}
              </div>
            )}
          </div>
        </AbsoluteFill>
      </CameraRig>
    </AbsoluteFill>
  );
};
