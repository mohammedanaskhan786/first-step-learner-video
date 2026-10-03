import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {StoryData} from './engineTypes';
import {AudioLayer} from './components/AudioLayer';
import {SubtitleOverlay} from './components/SubtitleOverlay';
import {NarrationScene} from './scenes/NarrationScene';
export const MainVideo:React.FC<{story:StoryData}>=({story})=><AbsoluteFill style={{backgroundColor:'#070707',color:'#fff',fontFamily:'Arial,Helvetica,sans-serif',overflow:'hidden'}}><AudioLayer narration={story.narration} music={story.music} ambience={story.ambience} sfx={[]} fps={story.fps}/><NarrationScene beats={story.visualBeats} fps={story.fps}/><SubtitleOverlay cues={story.subtitles}/></AbsoluteFill>;
