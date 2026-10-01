import React from "react";
import { AbsoluteFill } from "remotion";

export const WhatRemainsUnknown: React.FC<{
  scene: any;
}> = ({ scene }) => {
  return (
    <AbsoluteFill
      style={{
        background: "#090909",
        padding: 120,
      }}
    >
      <div
        style={{
          fontSize: 58,
          fontWeight: 700,
          marginBottom: 55,
        }}
      >
        {scene.title}
      </div>

      {(scene.unknowns || []).map(
        (item: string, index: number) => (
          <div
            key={index}
            style={{
              fontSize: 32,
              marginBottom: 25,
              padding: "20px 30px",
              borderLeft: "4px solid #777",
              background: "rgba(255,255,255,.035)",
            }}
          >
            ? {item}
          </div>
        )
      )}
    </AbsoluteFill>
  );
};
