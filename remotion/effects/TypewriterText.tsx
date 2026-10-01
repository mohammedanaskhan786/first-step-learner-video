import React from 'react';
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type TypewriterTextProps = {
  text: string;
  startFrame?: number;
  framesPerCharacter?: number;
  style?: React.CSSProperties;
};

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame = 0,
  framesPerCharacter = 2,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const localFrame = Math.max(0, frame - startFrame);

  const physics = spring({
    frame: localFrame,
    fps,
    config: {
      damping: 20,
      stiffness: 100,
      mass: 0.6,
    },
  });

  const revealFrames = Math.max(1, text.length * framesPerCharacter);

  const visible = Math.floor(
    interpolate(
      Math.min(localFrame, revealFrames),
      [0, revealFrames],
      [0, text.length],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      },
    ),
  );

  const opacity = interpolate(physics, [0, 1], [0, 1]);

  return (
    <span style={{opacity, ...style}}>
      {text.slice(0, visible)}
      {visible < text.length ? (
        <span style={{opacity: frame % 10 < 5 ? 1 : 0}}>|</span>
      ) : null}
    </span>
  );
};
