import React from "react";
import { AbsoluteFill, Audio } from "remotion";
import { asset } from "../asset";

interface AudioLayerProps {
  narration?: string;
  music?: string;
  ambience?: string;
}

export const AudioLayer: React.FC<AudioLayerProps> = ({
  narration = "audio/narration.mp3",
  music = "music/investigation.mp3",
  ambience = "audio/ambience/atmosphere.mp3",
}) => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Audio
        src={asset(narration)}
        volume={1}
      />

      <Audio
        src={asset(music)}
        volume={0.075}
        loop
      />

      <Audio
        src={asset(ambience)}
        volume={0.035}
        loop
      />
    </AbsoluteFill>
  );
};
