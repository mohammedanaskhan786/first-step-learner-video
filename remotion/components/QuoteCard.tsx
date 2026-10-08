import React from 'react';
import {AbsoluteFill} from 'remotion';
export const QuoteCard:React.FC<{quote?:string;attribution?:string}>=({quote='',attribution=''})=><AbsoluteFill style={{alignItems:'center',justifyContent:'center',padding:180,textAlign:'center'}}><div style={{maxWidth:1350}}><div style={{fontSize:110,color:'#9c80cf',fontFamily:'Georgia'}}>“</div><div style={{fontSize:53,lineHeight:1.28,fontWeight:700}}>{quote}</div>{attribution?<div style={{marginTop:30,color:'#aaa3b3',fontSize:24}}>— {attribution}</div>:null}</div></AbsoluteFill>;
