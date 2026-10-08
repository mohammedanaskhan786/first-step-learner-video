import React from "react";
import {Composition, staticFile} from "remotion";
import {MainVideo} from "./MainVideo";
import type {AnimatedScene, VisualBeat, SubtitleCue} from "./engineTypes";

const FPS=30, WIDTH=1920, HEIGHT=1080;
const fetchJson=async <T,>(path:string):Promise<T>=>{const r=await fetch(staticFile(path));if(!r.ok)throw new Error(`Could not load ${path}: HTTP ${r.status}`);return r.json() as Promise<T>};

export const RemotionRoot:React.FC=()=> <Composition
  id="FirstStepLearner"
  component={MainVideo}
  width={WIDTH}
  height={HEIGHT}
  fps={FPS}
  defaultProps={{story:{fps:FPS,narration:"audio/narration.mp3",music:"music/investigation.mp3",ambience:"audio/ambience/atmosphere.mp3",visualBeats:[],subtitles:[],animationScenes:[]}}}
  durationInFrames={FPS}
  calculateMetadata={async()=>{
    const [plan,subs,anim]=await Promise.all([
      fetchJson<{duration:number;beats:VisualBeat[]}>("generated/visual_plan.json"),
      fetchJson<{cues:SubtitleCue[]}>("generated/subtitles.json"),
      fetchJson<{scenes:AnimatedScene[]}>("generated/animation_plan.json"),
    ]);
    const duration=Number(plan.duration);
    if(!Number.isFinite(duration)||duration<=0) throw new Error(`Invalid narration duration: ${duration}`);
    return {fps:FPS,width:WIDTH,height:HEIGHT,durationInFrames:Math.ceil(duration*FPS),props:{story:{fps:FPS,narration:"audio/narration.mp3",music:"music/investigation.mp3",ambience:"audio/ambience/atmosphere.mp3",visualBeats:plan.beats,subtitles:subs.cues,animationScenes:anim.scenes}}};
  }}
/>;
