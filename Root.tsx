import React from 'react';
import { Composition } from 'remotion';
import { FirstStepLearner } from './FirstStepLearner';
export const Root: React.FC = () => <Composition id="FirstStepLearner" component={FirstStepLearner} durationInFrames={9*60*30} fps={30} width={1920} height={1080} defaultProps={{}} />;
