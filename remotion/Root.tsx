import React from "react";
import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { storyData } from "./storyData";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FirstStepLearner"
        component={MainVideo}
        durationInFrames={storyData.totalFrames}
        fps={storyData.fps}
        width={1920}
        height={1080}
        defaultProps={{ story: storyData }}
      />
    </>
  );
};
