import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const DocumentSlide: React.FC<{
  src: string;
}> = ({ src }) => {
  const frame = useCurrentFrame();

  const x = interpolate(
    frame,
    [0, 20],
    [500, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Img
        src={src}
        style={{
          width: 900,
          maxHeight: 700,
          objectFit: "contain",
          transform: `translateX(${x}px)`,
          boxShadow: "0 30px 100px rgba(0,0,0,.6)",
        }}
      />
    </AbsoluteFill>
  );
};
