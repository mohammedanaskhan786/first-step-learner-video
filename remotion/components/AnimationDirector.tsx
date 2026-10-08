import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import type {AnimatedScene} from "./AnimationTypes";
import {WaterGasScene} from "./WaterGasScene";
import {MountainAtmosphereScene} from "./MountainAtmosphereScene";
import {RouteAnimationScene} from "./RouteAnimationScene";
import {AnimatedTimelineScene} from "./AnimatedTimelineScene";
import {AnimatedNewspaperScene} from "./AnimatedNewspaperScene";
import {AnimatedEvidenceBoard} from "./AnimatedEvidenceBoard";
import {CinematicText} from "./CinematicText";

export const AnimationDirector: React.FC<{scenes: AnimatedScene[]; fps: number}> = ({scenes, fps}) => (
  <AbsoluteFill>
    {scenes.map((scene) => {
      const from = Math.max(0, Math.round(scene.start * fps));
      const durationInFrames = Math.max(1, Math.round((scene.end - scene.start) * fps));
      return (
        <Sequence key={scene.id} from={from} durationInFrames={durationInFrames}>
          {scene.kind === "water_gas" && <WaterGasScene title={scene.title} text={scene.text} />}
          {scene.kind === "mountain" && <MountainAtmosphereScene text={scene.text} />}
          {scene.kind === "map_route" && <RouteAnimationScene from={String(scene.data?.from ?? "ORIGIN")} to={String(scene.data?.to ?? "DESTINATION")} fromCoord={scene.data?.fromCoord as {lat:number;lon:number}|undefined} toCoord={scene.data?.toCoord as {lat:number;lon:number}|undefined} />}
          {scene.kind === "timeline" && <AnimatedTimelineScene events={(scene.data?.events as {date:string;text:string}[]) ?? []} />}
          {scene.kind === "newspaper" && <AnimatedNewspaperScene headline={String(scene.data?.headline ?? scene.title ?? "NEWS RECONSTRUCTION")} subheadline={scene.text} />}
          {scene.kind === "evidence" && <AnimatedEvidenceBoard items={(scene.data?.items as string[]) ?? [scene.text ?? "Evidence"]} />}
          {scene.kind === "cinematic" && <CinematicText eyebrow="DOCUMENTARY" title={scene.title ?? "THE STORY"} text={scene.text ?? ""} />}
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
