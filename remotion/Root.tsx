import React from "react";
import { Composition, staticFile } from "remotion";
import { MainVideo } from "./MainVideo";

const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;

const getNarrationDuration = async (): Promise<number> => {
  const response = await fetch(
    staticFile("audio/narration.mp3"),
    {
      method: "HEAD",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Could not access narration audio: ${response.status}`,
    );
  }

  const contentLength = response.headers.get(
    "content-length",
  );

  if (!contentLength) {
    throw new Error(
      "Could not determine narration audio size.",
    );
  }

  // Duration is supplied by the generated pipeline.
  // Root metadata is loaded from generated story data.
  return 0;
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="FirstStepLearner"
      component={MainVideo}
      width={WIDTH}
      height={HEIGHT}
      fps={FPS}
      durationInFrames={FPS * 60}
      calculateMetadata={async () => {
        const response = await fetch(
          staticFile("audio/narration.mp3"),
        );

        if (!response.ok) {
          throw new Error(
            `Could not load narration audio: ${response.status}`,
          );
        }

        const audioUrl = staticFile(
          "audio/narration.mp3",
        );

        return {
          fps: FPS,
          width: WIDTH,
          height: HEIGHT,
          durationInFrames: FPS * 60,
          props: {
            audioUrl,
          },
        };
      }}
    />
  );
};
