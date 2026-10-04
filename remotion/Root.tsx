import React from "react";
import { Composition, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { MainVideo } from "./MainVideo";

const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="FirstStepLearner"
      component={MainVideo}
      width={WIDTH}
      height={HEIGHT}
      fps={FPS}
      durationInFrames={FPS * 60}
      defaultProps={{}}
      calculateMetadata={async () => {
        const narrationDuration = await getAudioDurationInSeconds(
          staticFile("audio/narration.mp3"),
        );

        if (!Number.isFinite(narrationDuration) || narrationDuration <= 0) {
          throw new Error(
            `Invalid narration duration: ${narrationDuration}`,
          );
        }

        return {
          fps: FPS,
          width: WIDTH,
          height: HEIGHT,
          durationInFrames: Math.ceil(narrationDuration * FPS),
        };
      }}
    />
  );
};
