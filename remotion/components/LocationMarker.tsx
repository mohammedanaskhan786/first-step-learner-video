import React from "react";
import {spring,useCurrentFrame,useVideoConfig} from "remotion";
export const LocationMarker:React.FC<{point:{x:number;y:number};label?:string}>=({point,label="LOCATION"})=>{const{fps}=useVideoConfig();const p=spring({frame:useCurrentFrame(),fps,config:{damping:13,stiffness:150}});return <g><circle cx={point.x} cy={point.y} r={22+p*9} fill="none" stroke="#b99dff" strokeWidth="3" opacity={1-p*.6}/><circle cx={point.x} cy={point.y} r="11" fill="#fff"/><text x={point.x+22} y={point.y-18} fill="#fff" fontSize="26" fontFamily="Arial" fontWeight="700">{label}</text></g>};
