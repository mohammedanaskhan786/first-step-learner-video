import React from "react";
import { AbsoluteFill } from "remotion";
import { AudioLayer } from "./components/AudioLayer";
import { SubtitleOverlay } from "./components/SubtitleOverlay";
import { NarrationScene } from "./scenes/NarrationScene";
import type {
  VisualBeat,
  SubtitleCue,
} from "./engineTypes";

export type VideoProps = {
  audioUrl: string;
  visualBeats: VisualBeat[];
  subtitles: SubtitleCue[];
  fps: number;
};

export const MainVideo: React.FC<VideoProps> = ({
  visualBeats,
  subtitles,
  fps,
}) => {
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
        beats={visualBeats}
        fps={fps}
      />

      <SubtitleOverlay
        cues={subtitles}
      />
    </AbsoluteFill>
  );
};
