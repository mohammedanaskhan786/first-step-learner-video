import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { zoomValue, smooth } from "./AnimationUtils";

export const CameraRig: React.FC<{
  children: React.ReactNode;
  zoomFrom?: number;
  zoomTo?: number;
  panX?: number;
  panY?: number;
  duration?: number;
}> = ({
  children,
  zoomFrom = 1,
  zoomTo = 1.08,
  panX = 0,
  panY = 0,
  duration = 10,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = zoomValue(frame, fps, duration, zoomFrom, zoomTo);
  const p = smooth(frame, fps, duration);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${panX * p}px, ${panY * p}px) scale(${zoom})`,
          transformOrigin: "50% 50%",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
