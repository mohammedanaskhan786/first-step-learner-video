import React from "react";
import { Composition, staticFile } from "remotion";
import { MainVideo, VideoProps } from "./MainVideo";

const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;

interface RawBeat {
  id: string;
  sentence_id?: number;
  text: string;
  start: number;
  end: number;
  duration?: number;
  visual_type?: string;
  description?: string;
  reconstruction?: boolean;
  source_status?: string;
}

interface RawVisualPlan {
  duration: number;
  beats: RawBeat[];
}

interface RawSubtitles {
  cues: Array<{
    start: number;
    end: number;
    text: string;
  }>;
}

interface RawStory {
  title?: string;
  entities?: {
    locations?: string[];
    years?: number[];
  };
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(staticFile(path));

  if (!response.ok) {
    throw new Error(
      `Could not load ${path}: HTTP ${response.status}`
    );
  }

  return (await response.json()) as T;
}

function normalizeType(visualType?: string): string {
  if (visualType === "statistics") {
    return "statistic";
  }

  if (visualType === "cinematic") {
    return "cinematic_text";
  }

  return visualType || "cinematic_text";
}

function buildProps(
  plan: RawVisualPlan,
  subtitles: RawSubtitles,
  story: RawStory
): VideoProps {
  const visualBeats = plan.beats.map((beat) => ({
    id: beat.id,
    start: Number(beat.start),
    end: Number(beat.end),

    type: normalizeType(beat.visual_type),

    text: beat.text,

    data: {
      location: story.entities?.locations?.[0] ?? "",
      date: story.entities?.years?.[0]?.toString() ?? "",
      event: beat.text,
      quote: beat.text,
      sourceStatus:
        beat.source_status ?? "narration_context",
      reconstruction: Boolean(beat.reconstruction),
    },
  }));

  return {
    audioUrl: "audio/narration.mp3",
    visualBeats,
    subtitles: subtitles.cues,
    fps: FPS,
  };
}

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="FirstStepLearner"
      component={MainVideo}
      defaultProps={{
        audioUrl: "audio/narration.mp3",
        visualBeats: [],
        subtitles: [],
        fps: FPS,
      }}
      width={WIDTH}
      height={HEIGHT}
      fps={FPS}

      /* Temporary fallback only.
         calculateMetadata replaces this with
         the real narration duration. */
      durationInFrames={FPS}

      calculateMetadata={async () => {
        const [plan, subtitles, story] =
          await Promise.all([
            fetchJson<RawVisualPlan>(
              "generated/visual_plan.json"
            ),

            fetchJson<RawSubtitles>(
              "generated/subtitles.json"
            ),

            fetchJson<RawStory>(
              "generated/story.json"
            ),
          ]);

        const duration = Number(plan.duration);

        if (!Number.isFinite(duration) || duration <= 0) {
          throw new Error(
            `Invalid generated narration duration: ${plan.duration}`
          );
        }

        const durationInFrames = Math.ceil(
          duration * FPS
        );

        console.log(
          `Narration duration: ${duration.toFixed(2)}s`
        );

        console.log(
          `Video duration: ${durationInFrames} frames`
        );

        return {
          fps: FPS,
          width: WIDTH,
          height: HEIGHT,
          durationInFrames,
          props: buildProps(
            plan,
            subtitles,
            story
          ),
        };
      }}
    />
  );
};
