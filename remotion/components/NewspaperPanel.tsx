import React from 'react';
import {AbsoluteFill,Img,staticFile} from 'remotion';
import {SourceBadge} from './SourceBadge';
export const NewspaperPanel:React.FC<{src?:string;title?:string;text?:string}>=({src,title='NEWSPAPER',text=''})=><AbsoluteFill style={{alignItems:'center',justifyContent:'center'}}>{src?<Img src={staticFile(src)} style={{width:1560,height:830,objectFit:'contain'}}/>:<div style={{width:1480,minHeight:760,padding:65,background:'#e5e0d8',color:'#1d1b19'}}><div style={{fontSize:42,fontWeight:800}}>{title}</div><div style={{marginTop:35,fontSize:30,lineHeight:1.4}}>{text}</div></div>}<SourceBadge reconstructed/></AbsoluteFill>;
