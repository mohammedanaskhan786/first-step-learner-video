import React from 'react';
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type SplitWipeProps = {
  children: React.ReactNode;
  startFrame?: number;
};

export const SplitWipe: React.FC<SplitWipeProps> = ({
  children,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: {
      damping: 20,
      stiffness: 120,
      mass: 0.8,
    },
  });

  const left = interpolate(
    progress,
    [0, 1],
    [0, -100],
  );

  const right = interpolate(
    progress,
    [0, 1],
    [0, 100],
  );

  const contentOpacity = interpolate(
    progress,
    [0, 0.35, 1],
    [0, 1, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '50%',
          height: '100%',
          background: '#0A0A0A',
          transform: `translateX(${left}%)`,
          zIndex: 3,
        }}
      />

      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '50%',
          height: '100%',
          background: '#0A0A0A',
          transform: `translateX(${right}%)`,
          zIndex: 3,
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: contentOpacity,
        }}
      >
        {children}
      </div>
    </div>
  );
};
