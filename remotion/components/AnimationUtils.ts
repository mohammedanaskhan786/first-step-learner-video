import { interpolate } from "remotion";

export const clamp = (n: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, n));

export const eased = (p: number) => p * p * (3 - 2 * p);

export const progress = (frame: number, fps: number, duration: number) =>
  clamp(frame / Math.max(1, fps * duration));

export const smooth = (frame: number, fps: number, duration: number) =>
  eased(progress(frame, fps, duration));

export const zoomValue = (
  frame: number,
  fps: number,
  duration: number,
  from = 1,
  to = 1.1,
) =>
  interpolate(smooth(frame, fps, duration), [0, 1], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
