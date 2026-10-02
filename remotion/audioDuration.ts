import {getAudioDurationInSeconds} from "@remotion/media-utils";
import {staticFile} from "remotion";

export const getNarrationDuration = async (): Promise<number> => {
  const path = staticFile("audio/narration.mp3");

  try {
    const duration = await getAudioDurationInSeconds(path);
    return duration;
  } catch (error) {
    console.error("Could not read narration duration:", error);

    return 120;
  }
};
