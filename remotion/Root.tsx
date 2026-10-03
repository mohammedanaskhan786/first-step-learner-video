import React from 'react';
import {Composition} from 'remotion';
import {MainVideo} from './MainVideo';
import {storyData} from './storyData';
import {getNarrationDuration} from './audioDuration';
export const RemotionRoot:React.FC=()=> <Composition id='FirstStepLearner' component={MainVideo} defaultProps={{story:storyData}} width={1920} height={1080} fps={storyData.fps} durationInFrames={1800} calculateMetadata={async({props})=>{const duration=await getNarrationDuration();const story=props.story as typeof storyData;return {durationInFrames:Math.max(1,Math.ceil(duration*(story.fps||30)))}}}/>;
