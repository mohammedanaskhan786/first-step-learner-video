import React from "react";
import { AbsoluteFill } from "remotion";
import { EvidenceHighlight } from "../effects/EvidenceHighlight";

export const EvidenceScene: React.FC<{ scene: any }> = ({ scene }) => {
  return (
    <AbsoluteFill
      style={{
        background: "#090909",
        padding: 100,
      }}
    >
      <div
        style={{
          fontSize: 58,
          fontWeight: 700,
          marginBottom: 60,
        }}
      >
        {scene.title}
      </div>

      {(scene.items || []).map(
        (item: string, index: number) => (
          <div
            key={index}
            style={{
              marginBottom: 22,
            }}
          >
            <EvidenceHighlight text={item} />
          </div>
        )
      )}
    </AbsoluteFill>
  );
};
