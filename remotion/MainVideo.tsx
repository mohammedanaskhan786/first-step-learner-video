import React from "react";
import { AbsoluteFill } from "remotion";
import { AudioLayer } from "./components/AudioLayer";
import { SubtitleOverlay } from "./components/SubtitleOverlay";
import { NarrationScene } from "./scenes/NarrationScene";
import type { StoryData } from "./engineTypes";

export const MainVideo: React.FC<{ story?: StoryData }> = ({ story }) => {
  const fps = story?.fps ?? 30;
  const beats = story?.visualBeats ?? [];
  const subtitles = story?.subtitles ?? [];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#070707",
        color: "#fff",
        fontFamily: "Arial, Helvetica, sans-serif",
        overflow: "hidden",
      }}
    >
      <AudioLayer
        narration="audio/narration.mp3"
        music="music/investigation.mp3"
        ambience="audio/ambience/atmosphere.mp3"
      />

      <NarrationScene
        beats={beats}
        fps={fps}
      />

      <SubtitleOverlay cues={subtitles} />
    </AbsoluteFill>
  );
};
