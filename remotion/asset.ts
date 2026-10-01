import { staticFile } from "remotion";

export const asset = (path: string): string => {
  return staticFile(path.replace(/^\/+/, ""));
};
