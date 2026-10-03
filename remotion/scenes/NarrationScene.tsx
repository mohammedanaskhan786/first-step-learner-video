import React from 'react';
import {AbsoluteFill,Sequence} from 'remotion';
import type {VisualBeat} from '../engineTypes';
import {VisualBeat as Renderer} from '../components/VisualBeat';
export const NarrationScene:React.FC<{beats:VisualBeat[];fps:number}>=({beats,fps})=><AbsoluteFill>{beats.map(b=><Sequence key={b.id} from={Math.max(0,Math.round(b.start*fps))} durationInFrames={Math.max(1,Math.round((b.end-b.start)*fps))}><Renderer beat={b}/></Sequence>)}</AbsoluteFill>;
