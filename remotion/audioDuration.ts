import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {staticFile} from 'remotion';
export const getNarrationDuration=async():Promise<number>=>{const duration=await getAudioDurationInSeconds(staticFile('audio/narration.mp3'));if(!Number.isFinite(duration)||duration<=0)throw new Error(`Invalid narration duration: ${duration}`);return duration;};
