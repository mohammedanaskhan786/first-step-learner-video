import React from 'react';
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type GridPulseProps = {
  opacity?: number;
  spacing?: number;
};

export const GridPulse: React.FC<GridPulseProps> = ({
  opacity = 0.12,
  spacing = 80,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 24,
      stiffness: 70,
      mass: 0.8,
    },
  });

  const pulse = interpolate(
    frame % 90,
    [0, 45, 90],
    [0.55, 1, 0.55],
  );

  const finalOpacity =
    opacity * pulse * entrance;

  const lines: React.ReactNode[] = [];

  for (let x = 0; x <= 1920; x += spacing) {
    lines.push(
      <div
        key={`vertical-${x}`}
        style={{
          position: 'absolute',
          left: x,
          top: 0,
          width: 1,
          height: '100%',
          background: `rgba(123,47,247,${finalOpacity})`,
        }}
      />,
    );
  }

  for (let y = 0; y <= 1080; y += spacing) {
    lines.push(
      <div
        key={`horizontal-${y}`}
        style={{
          position: 'absolute',
          left: 0,
          top: y,
          width: '100%',
          height: 1,
          background: `rgba(123,47,247,${finalOpacity})`,
        }}
      />,
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
      }}
    >
      {lines}
    </div>
  );
};
