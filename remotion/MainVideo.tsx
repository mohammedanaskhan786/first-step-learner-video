import React from "react";
import { AbsoluteFill, Sequence } from "remotion";

import { StoryData, StoryScene } from "./storyData";

import { AudioLayer } from "./components/AudioLayer";
import { SubtitleOverlay } from "./components/SubtitleOverlay";

import { ColdOpen } from "./scenes/ColdOpen";
import { LocationScene } from "./scenes/LocationScene";
import { TimelineScene } from "./scenes/TimelineScene";
import { MapScene } from "./scenes/MapScene";
import { PhotoReveal } from "./scenes/PhotoReveal";
import { DocumentScene } from "./scenes/DocumentScene";
import { NewspaperScene } from "./scenes/NewspaperScene";
import { EvidenceScene } from "./scenes/EvidenceScene";
import { InvestigationScene } from "./scenes/InvestigationScene";
import { WhatWeKnow } from "./scenes/WhatWeKnow";
import { WhatRemainsUnknown } from "./scenes/WhatRemainsUnknown";
import { ResolutionScene } from "./scenes/ResolutionScene";
import { EndingScene } from "./scenes/EndingScene";

const SceneRenderer: React.FC<{
  scene: StoryScene;
}> = ({ scene }) => {
  switch (scene.type) {
    case "coldOpen":
      return <ColdOpen scene={scene} />;

    case "location":
      return <LocationScene scene={scene} />;

    case "timeline":
      return <TimelineScene scene={scene} />;

    case "map":
      return <MapScene scene={scene} />;

    case "photo":
      return <PhotoReveal scene={scene} />;

    case "document":
      return <DocumentScene scene={scene} />;

    case "newspaper":
      return <NewspaperScene scene={scene} />;

    case "evidence":
      return <EvidenceScene scene={scene} />;

    case "investigation":
      return (
        <InvestigationScene scene={scene} />
      );

    case "known":
      return <WhatWeKnow scene={scene} />;

    case "unknown":
      return (
        <WhatRemainsUnknown scene={scene} />
      );

    case "resolution":
      return <ResolutionScene scene={scene} />;

    case "ending":
      return <EndingScene scene={scene} />;

    default:
      return null;
  }
};

export const MainVideo: React.FC<{
  story: StoryData;
}> = ({ story }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#070707",
        color: "#ffffff",
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      <AudioLayer
        narration={story.narration}
        music={story.music}
        ambience={story.ambience}
        sfx={story.sfx}
        fps={story.fps}
      />

      {story.scenes.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.start * story.fps}
          durationInFrames={
            scene.duration * story.fps
          }
        >
          <SceneRenderer scene={scene} />
        </Sequence>
      ))}

      <SubtitleOverlay
        cues={story.subtitles}
      />
    </AbsoluteFill>
  );
};
