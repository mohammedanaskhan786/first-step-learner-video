import React from 'react';
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type MagneticSnapProps = {
  children: React.ReactNode;
  startFrame?: number;
  distance?: number;
  style?: React.CSSProperties;
};

export const MagneticSnap: React.FC<MagneticSnapProps> = ({
  children,
  startFrame = 0,
  distance = 90,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: {
      damping: 9,
      stiffness: 170,
      mass: 0.55,
    },
  });

  const y = interpolate(
    progress,
    [0, 1],
    [distance, 0],
  );

  const scale = interpolate(
    progress,
    [0, 0.82, 1],
    [0.72, 1.08, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  return (
    <div
      style={{
        transform: `translateY(${y}px) scale(${scale})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
