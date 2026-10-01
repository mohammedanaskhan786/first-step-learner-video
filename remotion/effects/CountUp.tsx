import React from 'react';
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type CountUpProps = {
  target: number;
  startFrame?: number;
  decimals?: number;
  suffix?: string;
  style?: React.CSSProperties;
};

export const CountUp: React.FC<CountUpProps> = ({
  target,
  startFrame = 0,
  decimals = 0,
  suffix = '',
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const physics = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: {
      damping: 18,
      stiffness: 90,
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

  const value = target * progress;

  return (
    <span style={style}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
};
