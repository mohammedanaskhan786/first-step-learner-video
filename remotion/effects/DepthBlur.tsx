import React from 'react';
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type DepthBlurProps = {
  children: React.ReactNode;
  startFrame?: number;
};

export const DepthBlur: React.FC<DepthBlurProps> = ({
  children,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: {
      damping: 22,
      stiffness: 100,
      mass: 0.7,
    },
  });

  const blur = interpolate(
    progress,
    [0, 1],
    [10, 0],
  );

  const opacity = interpolate(
    progress,
    [0, 1],
    [0.45, 1],
  );

  return (
    <div
      style={{
        filter: `blur(${blur}px)`,
        opacity,
      }}
    >
      {children}
    </div>
  );
};
