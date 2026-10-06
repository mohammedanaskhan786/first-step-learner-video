import React from "react";
import {AbsoluteFill,Sequence} from "remotion";
import type {VisualBeat} from "../engineTypes";
import {VisualBeat as Renderer} from "../components/VisualBeat";
export const NarrationScene:React.FC<{beats:VisualBeat[];fps:number}>=({beats,fps})=><AbsoluteFill>{beats.map(beat=>{const start=Math.max(0,Math.round(beat.start*fps));const duration=Math.max(1,Math.round((beat.end-beat.start)*fps));return <Sequence key={beat.id} from={start} durationInFrames={duration}><Renderer beat={beat}/></Sequence>})}</AbsoluteFill>;
