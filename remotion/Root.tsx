import { Composition } from "remotion";
import { FirstStepLearner } from "./FirstStepLearner";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FirstStepLearner"
        component={FirstStepLearner}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
