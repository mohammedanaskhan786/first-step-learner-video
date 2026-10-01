import React from 'react';
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type ParticleTrailProps = {
  startFrame?: number;
  direction?: 'horizontal' | 'vertical';
};

export const ParticleTrail: React.FC<ParticleTrailProps> = ({
  startFrame = 0,
  direction = 'horizontal',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: {
      damping: 18,
      stiffness: 80,
      mass: 0.8,
    },
  });

  return (
    <>
      {Array.from({length: 18}).map((_, index) => {
        const lag = index / 18;
        const particleProgress = Math.max(
          0,
          progress - lag * 0.16,
        );

        const position = interpolate(
          particleProgress,
          [0, 1],
          [420, 1500],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          },
        );

        const size = 5 + (18 - index) * 0.35;
        const opacity = Math.max(
          0,
          0.75 - index * 0.035,
        );

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left:
                direction === 'horizontal'
                  ? position
                  : 960,
              top:
                direction === 'horizontal'
                  ? 540
                  : position,
              width: size,
              height: size,
              borderRadius: '50%',
              background: '#7B2FF7',
              opacity,
              boxShadow: '0 0 14px #7B2FF7',
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </>
  );
};
