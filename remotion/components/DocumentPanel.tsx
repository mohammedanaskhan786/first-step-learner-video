import React from 'react';
import {AbsoluteFill,Img,staticFile} from 'remotion';
import {SourceBadge} from './SourceBadge';
export const DocumentPanel:React.FC<{src?:string;title?:string;text?:string}>=({src,title='DOCUMENT',text=''})=><AbsoluteFill style={{alignItems:'center',justifyContent:'center'}}>{src?<Img src={staticFile(src)} style={{width:1480,height:820,objectFit:'contain'}}/>:<div style={{width:1180,minHeight:720,padding:70,background:'#efede8',color:'#26231f'}}><div style={{fontSize:44,fontWeight:800}}>{title}</div><div style={{marginTop:40,fontSize:28,lineHeight:1.4}}>{text}</div></div>}<SourceBadge reconstructed/></AbsoluteFill>;
