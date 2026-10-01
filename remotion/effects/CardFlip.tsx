import React from 'react';
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type CardFlipProps = {
  front: React.ReactNode;
  back: React.ReactNode;
  startFrame?: number;
};

export const CardFlip: React.FC<CardFlipProps> = ({
  front,
  back,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: {
      damping: 20,
      stiffness: 110,
      mass: 0.8,
    },
  });

  const rotation = interpolate(
    progress,
    [0, 1],
    [0, 180],
  );

  return (
    <div
      style={{
        position: 'relative',
        width: 900,
        height: 460,
        perspective: 1400,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          transform: `rotateY(${rotation}deg)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: 30,
            border: '1px solid rgba(123,47,247,0.45)',
            background: 'rgba(18,12,28,0.92)',
            boxShadow:
              '0 30px 100px rgba(0,0,0,0.5)',
          }}
        >
          {front}
        </div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: 30,
            border: '1px solid rgba(123,47,247,0.65)',
            background: 'rgba(31,17,48,0.95)',
            boxShadow:
              '0 30px 100px rgba(0,0,0,0.5)',
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
};
