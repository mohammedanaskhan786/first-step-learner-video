import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

type Particle = { x: number; y: number; size: number; speed: number; phase: number };

export const ParticleField: React.FC<{
  count?: number;
  direction?: "up" | "down" | "left" | "right";
  opacity?: number;
  size?: number;
}> = ({ count = 50, direction = "up", opacity = 0.35, size = 5 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (i * 137.5) % width,
        y: (i * 83.7) % height,
        size: size * (0.5 + ((i * 17) % 100) / 100),
        speed: 0.35 + ((i * 13) % 100) / 180,
        phase: (i * 29) % 100,
      })),
    [count, width, height, size],
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {particles.map((p, i) => {
        const t = frame * p.speed + p.phase * 10;
        let x = p.x;
        let y = p.y;
        if (direction === "up") y = (p.y - t) % (height + 80);
        if (direction === "down") y = (p.y + t) % (height + 80);
        if (direction === "left") x = (p.x - t) % (width + 80);
        if (direction === "right") x = (p.x + t) % (width + 80);
        if (x < -40) x += width + 80;
        if (y < -40) y += height + 80;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: "rgba(210,220,255,.65)",
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
