export type SceneType =
  | "coldOpen"
  | "location"
  | "timeline"
  | "map"
  | "photo"
  | "document"
  | "newspaper"
  | "evidence"
  | "investigation"
  | "known"
  | "unknown"
  | "resolution"
  | "ending";

export interface StoryScene {
  id: string;
  type: SceneType;
  start: number;
  duration: number;

  title?: string;
  subtitle?: string;
  text?: string;

  image?: string;
  document?: string;
  map?: string;

  location?: string;
  date?: string;

  items?: string[];
  facts?: string[];
  unknowns?: string[];

  from?: string;
  to?: string;
}

export interface SFXItem {
  src: string;
  at: number;
  volume?: number;
}

export interface SubtitleCue {
  start: number;
  end: number;
  text: string;
}

export interface StoryData {
  title: string;
  subtitle: string;

  fps: number;
  totalFrames: number;

  narration: string;

  music?: string;
  ambience?: string;

  sfx: SFXItem[];

  subtitles: SubtitleCue[];

  scenes: StoryScene[];
}

export const storyData: StoryData = {
  title: "YOUR DOCUMENTARY TITLE",

  subtitle:
    "A documented real-world story",

  fps: 30,

  totalFrames: 30 * 60,

  narration: "audio/narration.mp3",

  music:
    "music/investigation.mp3",

  ambience:
    "audio/ambience/atmosphere.mp3",

  sfx: [
    {
      src: "audio/sfx/whoosh.mp3",
      at: 8,
      volume: 0.2,
    },
    {
      src: "audio/sfx/impact.mp3",
      at: 25,
      volume: 0.25,
    },
    {
      src: "audio/sfx/paper.mp3",
      at: 43,
      volume: 0.2,
    },
    {
      src: "audio/sfx/map-route.mp3",
      at: 68,
      volume: 0.2,
    },
  ],

  subtitles: [
    {
      start: 0,
      end: 4,
      text: "This is a real story.",
    },

    {
      start: 4,
      end: 8,
      text: "And every detail matters.",
    },
  ],

  scenes: [
    {
      id: "cold-open",
      type: "coldOpen",
      start: 0,
      duration: 8,
      title: "THIS STORY REALLY HAPPENED",
      subtitle:
        "The beginning of a documented story.",
    },

    {
      id: "location",
      type: "location",
      start: 8,
      duration: 7,
      title: "THE LOCATION",
      location: "LOCATION • USA",
      subtitle:
        "This is where the story begins.",
    },

    {
      id: "timeline",
      type: "timeline",
      start: 15,
      duration: 10,
      title: "THE TIMELINE",
      items: [
        "The first documented event",
        "A major turning point",
        "The moment everything changed",
      ],
    },

    {
      id: "map",
      type: "map",
      start: 25,
      duration: 10,
      title: "WHERE IT HAPPENED",
      from: "Location A",
      to: "Location B",
      map: "maps/usa.svg",
    },

    {
      id: "photo",
      type: "photo",
      start: 35,
      duration: 8,
      title: "THE STORY IN ONE IMAGE",
      image: "images/story/example.jpg",
    },

    {
      id: "document",
      type: "document",
      start: 43,
      duration: 8,
      title: "THE DOCUMENT",
      document:
        "documents/reports/example.jpg",
    },

    {
      id: "newspaper",
      type: "newspaper",
      start: 51,
      duration: 8,
      title: "WHAT THE REPORTS SAID",
      text:
        "A documented report connected to the event.",
    },

    {
      id: "evidence",
      type: "evidence",
      start: 59,
      duration: 9,
      title: "THE EVIDENCE",
      items: [
        "Confirmed detail",
        "Documented record",
        "Important connection",
      ],
    },

    {
      id: "investigation",
      type: "investigation",
      start: 68,
      duration: 10,
      title: "PUTTING THE PIECES TOGETHER",
      items: [
        "What happened first?",
        "What happened next?",
        "What does the evidence show?",
      ],
    },

    {
      id: "known",
      type: "known",
      start: 78,
      duration: 8,
      title: "WHAT WE KNOW",
      facts: [
        "The event is documented.",
        "The location is established.",
        "The timeline contains confirmed events.",
      ],
    },

    {
      id: "unknown",
      type: "unknown",
      start: 86,
      duration: 8,
      title: "WHAT REMAINS UNKNOWN",
      unknowns: [
        "Some details remain unclear.",
        "Accounts may differ.",
        "Not every question has an answer.",
      ],
    },

    {
      id: "resolution",
      type: "resolution",
      start: 94,
      duration: 10,
      title: "THE RESOLUTION",
      text:
        "Here is what the available record shows.",
    },

    {
      id: "ending",
      type: "ending",
      start: 104,
      duration: 16,
      title:
        "REAL STORIES. REAL QUESTIONS.",
      subtitle:
        "Some stories end with answers. Others leave questions behind.",
    },
  ],
};
