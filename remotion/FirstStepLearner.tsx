import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const FirstStepLearner: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0A0A0A",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          color: "#7B2FF7",
          fontSize: 80,
          fontFamily: "sans-serif",
          opacity,
        }}
      >
        First Step Learner
      </h1>
    </AbsoluteFill>
  );
};
