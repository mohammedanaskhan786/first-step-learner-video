import React from 'react';
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type GlassPanelProps = {
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  delay?: number;
  style?: React.CSSProperties;
};

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  width = 760,
  height = 260,
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: {
      damping: 16,
      stiffness: 120,
      mass: 0.7,
    },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.88, 1]);

  return (
    <div
      style={{
        width,
        height,
        opacity,
        transform: `scale(${scale})`,
        border: '1px solid rgba(123,47,247,0.42)',
        borderRadius: 28,
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.035))',
        boxShadow:
          '0 24px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
