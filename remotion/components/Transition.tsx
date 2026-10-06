import React from "react";
import {AbsoluteFill,interpolate,useCurrentFrame} from "remotion";
export const Transition:React.FC<{children:React.ReactNode}>=({children})=>{const f=useCurrentFrame();const o=interpolate(f,[0,8,16],[0,1,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});return <AbsoluteFill style={{opacity:o}}>{children}</AbsoluteFill>};
