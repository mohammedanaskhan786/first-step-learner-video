import React from 'react';
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type MorphShapeProps = {
  startFrame?: number;
};

export const MorphShape: React.FC<MorphShapeProps> = ({
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: {
      damping: 18,
      stiffness: 95,
      mass: 0.75,
    },
  });

  const radius = interpolate(
    progress,
    [0, 1],
    [42, 18],
  );

  const width = interpolate(
    progress,
    [0, 1],
    [260, 330],
  );

  const height = interpolate(
    progress,
    [0, 1],
    [180, 300],
  );

  const brainOpacity = interpolate(
    progress,
    [0.55, 1],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  const bubbleOpacity = interpolate(
    progress,
    [0.25, 0.7],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: radius,
        border: '3px solid #7B2FF7',
        background: 'rgba(123,47,247,0.12)',
        boxShadow:
          '0 0 60px rgba(123,47,247,0.35)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 36,
          bottom: -22,
          width: 58,
          height: 58,
          background: 'rgba(123,47,247,0.12)',
          borderLeft: '3px solid #7B2FF7',
          borderBottom: '3px solid #7B2FF7',
          transform: 'rotate(-20deg)',
          opacity: bubbleOpacity,
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: bubbleOpacity,
          fontSize: 62,
          fontWeight: 800,
          color: '#7B2FF7',
        }}
      >
        …
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: brainOpacity,
        }}
      >
        <div
          style={{
            width: 170,
            height: 210,
            border: '5px solid #7B2FF7',
            borderRadius: '48% 52% 45% 55%',
            position: 'relative',
            boxShadow:
              'inset 0 0 30px rgba(123,47,247,0.18)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 30,
              top: 48,
              width: 110,
              height: 5,
              background: '#7B2FF7',
              transform: 'rotate(28deg)',
            }}
          />

          <div
            style={{
              position: 'absolute',
              left: 30,
              top: 92,
              width: 110,
              height: 5,
              background: '#7B2FF7',
              transform: 'rotate(-22deg)',
            }}
          />

          <div
            style={{
              position: 'absolute',
              left: 38,
              top: 135,
              width: 92,
              height: 5,
              background: '#7B2FF7',
              transform: 'rotate(24deg)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
