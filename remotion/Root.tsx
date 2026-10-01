import React from 'react';
import {Composition} from 'remotion';
import {FirstStepLearner} from './FirstStepLearner';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="FirstStepLearner"
        component={FirstStepLearner}
        durationInFrames={1080}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
