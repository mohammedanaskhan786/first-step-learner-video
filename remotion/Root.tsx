import React from "react";
import {Composition} from "remotion";
import {MainVideo} from "./MainVideo";
import {storyData} from "./storyData";
import {getNarrationDuration} from "./audioDuration";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="FirstStepLearner"
      component={MainVideo}
      width={1920}
      height={1080}
      fps={storyData.fps}
      durationInFrames={storyData.totalFrames}
      calculateMetadata={async () => {
        const duration = await getNarrationDuration();

        return {
          durationInFrames: Math.ceil(duration * storyData.fps),
        };
      }}
    />
  );
};
