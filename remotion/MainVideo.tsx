import React from "react";
import {AbsoluteFill} from "remotion";
import {AudioLayer} from "./components/AudioLayer";
import {SubtitleOverlay} from "./components/SubtitleOverlay";
import {NarrationScene} from "./scenes/NarrationScene";
import type {VisualBeat} from "./engineTypes";
export interface VideoProps{audioUrl:string;visualBeats:VisualBeat[];subtitles:Array<{start:number;end:number;text:string}>;fps:number}
export const MainVideo:React.FC<VideoProps>=({audioUrl,visualBeats,subtitles})=><AbsoluteFill style={{backgroundColor:"#070707",color:"#fff",fontFamily:"Arial,Helvetica,sans-serif",overflow:"hidden"}}><AudioLayer narration={audioUrl} music="music/investigation.mp3" ambience="audio/ambience/atmosphere.mp3"/><NarrationScene beats={visualBeats} fps={30}/><SubtitleOverlay cues={subtitles}/></AbsoluteFill>;
