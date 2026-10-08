import React from "react";
import { AbsoluteFill, Audio, Sequence } from "remotion";
import { asset } from "../asset";

interface SFXItem {
  src: string;
  at: number;
  volume?: number;
}

interface AudioLayerProps {
  narration?: string;
  music?: string;
  ambience?: string;
  sfx?: SFXItem[];
  fps: number;
}

export const AudioLayer: React.FC<AudioLayerProps> = ({
  narration,
  music,
  ambience,
  sfx = [],
  fps,
}) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
      }}
    >
      {narration && (
        <Audio
          src={asset(narration)}
          volume={1}
        />
      )}

      {music && (
        <Audio
          src={asset(music)}
          volume={0.075}
          loop
        />
      )}

      {ambience && (
        <Audio
          src={asset(ambience)}
          volume={0.035}
          loop
        />
      )}

      {sfx.map((item, index) => (
        <Sequence
          key={`${item.src}-${index}`}
          from={Math.max(0, Math.floor(item.at * fps))}
        >
          <Audio
            src={asset(item.src)}
            volume={item.volume ?? 0.3}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
