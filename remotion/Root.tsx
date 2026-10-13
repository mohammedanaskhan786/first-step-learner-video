import React from "react";
import { Composition, staticFile } from "remotion";
import { MainVideo } from "./MainVideo";
import type { StoryData } from "./engineTypes";

const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;

async function loadRuntimeStory(): Promise<StoryData & { durationSeconds?: number }> {
  const response = await fetch(staticFile("generated/story.json"));
  if (!response.ok) throw new Error(`Could not load generated story: ${response.status}`);
  const story = await response.json();
  if (!Array.isArray(story.visualBeats) || !Array.isArray(story.subtitles)) {
    throw new Error("generated/story.json is missing visualBeats or subtitles. Run python scripts/build_story.py first.");
  }
  return story;
}

export const RemotionRoot: React.FC = () => (
  <Composition
    id="FirstStepLearner"
    component={MainVideo}
    width={WIDTH}
    height={HEIGHT}
    fps={FPS}
    durationInFrames={FPS * 60}
    defaultProps={{ story: { version: 1, title: "Documentary", subtitle: "", fps: FPS, narration: "audio/narration.mp3", visualBeats: [], subtitles: [], assets: [], sources: [], locations: [], dates: [], years: [] } as StoryData }}
    calculateMetadata={async () => {
      const story = await loadRuntimeStory();
      const seconds = Math.max(1, Number(story.durationSeconds || 0));
      return { durationInFrames: Math.ceil(seconds * FPS), props: { story } };
    }}
  />
);
