import React from "react";
import { AbsoluteFill } from "remotion";
import type { StoryData } from "./engineTypes";
import { AudioLayer } from "./components/AudioLayer";
import { SubtitleOverlay } from "./components/SubtitleOverlay";
import { NarrationScene } from "./scenes/NarrationScene";

export const MainVideo: React.FC<{ story: StoryData }> = ({ story }) => (
  <AbsoluteFill style={{ backgroundColor: "#F4F0E8", color: "#18212B", fontFamily: "Arial, Helvetica, sans-serif", overflow: "hidden" }}>
    <AudioLayer narration={story.narration || "audio/narration.mp3"} fps={story.fps || 30} />
    <NarrationScene beats={story.visualBeats || []} fps={story.fps || 30} />
    <SubtitleOverlay cues={story.subtitles || []} />
  </AbsoluteFill>
);
