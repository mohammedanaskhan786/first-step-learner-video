import React from 'react';
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type ProgressLineProps = {
  width?: number;
  startFrame?: number;
  durationInFrames?: number;
};

export const ProgressLine: React.FC<ProgressLineProps> = ({
  width = 760,
  startFrame = 0,
  durationInFrames = 24,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const physics = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: {
      damping: 18,
      stiffness: 120,
      mass: 0.7,
    },
  });

  const progress = interpolate(
    physics,
    [0, 1],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  const timeProgress = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  const finalProgress = Math.max(progress, timeProgress);

  return (
    <div
      style={{
        width,
        height: 4,
        borderRadius: 999,
        background: 'rgba(255,255,255,0.08)',
        overflow: 'hidden',
        boxShadow: '0 0 18px rgba(123,47,247,0.25)',
      }}
    >
      <div
        style={{
          width: `${finalProgress * 100}%`,
          height: '100%',
          background: '#7B2FF7',
          boxShadow: '0 0 20px #7B2FF7',
        }}
      />
    </div>
  );
};
