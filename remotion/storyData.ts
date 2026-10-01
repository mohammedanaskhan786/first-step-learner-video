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
  location?: string;
  date?: string;
  items?: string[];
  facts?: string[];
  unknowns?: string[];
  from?: string;
  to?: string;
}

export interface StoryData {
  title: string;
  subtitle: string;
  fps: number;
  totalFrames: number;
  narration: string;
  scenes: StoryScene[];
}

const fps = 30;

export const storyData: StoryData = {
  title: "YOUR DOCUMENTARY TITLE",
  subtitle: "A REAL STORY",
  fps,

  // Temporary demo duration.
  // Replace with the actual narration duration after adding the voice file.
  totalFrames: 30 * 60,

  narration: "/audio/narration.mp3",

  scenes: [
    {
      id: "cold-open",
      type: "coldOpen",
      start: 0,
      duration: 8,
      title: "THIS STORY REALLY HAPPENED",
      subtitle: "What happened next changed everything.",
    },

    {
      id: "location",
      type: "location",
      start: 8,
      duration: 7,
      title: "THE LOCATION",
      location: "LOCATION • USA",
      subtitle: "The story begins here.",
    },

    {
      id: "timeline",
      type: "timeline",
      start: 15,
      duration: 10,
      title: "THE TIMELINE",
      items: [
        "The first important event",
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
    },

    {
      id: "photo",
      type: "photo",
      start: 35,
      duration: 8,
      title: "THE STORY IN ONE IMAGE",
      image: "/images/example.jpg",
    },

    {
      id: "document",
      type: "document",
      start: 43,
      duration: 8,
      title: "THE DOCUMENT",
      document: "/documents/example.jpg",
    },

    {
      id: "newspaper",
      type: "newspaper",
      start: 51,
      duration: 8,
      title: "WHAT THE REPORTS SAID",
      text: "A documented report connected to the event.",
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
      text: "Here is what ultimately happened.",
    },

    {
      id: "ending",
      type: "ending",
      start: 104,
      duration: 16,
      title: "REAL STORIES. REAL QUESTIONS.",
      subtitle: "Some stories end with answers. Others leave questions behind.",
    },
  ],
};

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
  location?: string;
  date?: string;
  items?: string[];
  facts?: string[];
  unknowns?: string[];
  from?: string;
  to?: string;
}

export interface StoryData {
  title: string;
  subtitle: string;
  fps: number;
  totalFrames: number;
  narration: string;
  scenes: StoryScene[];
}

const fps = 30;

export const storyData: StoryData = {
  title: "YOUR DOCUMENTARY TITLE",
  subtitle: "A REAL STORY",
  fps,

  // Temporary demo duration.
  // Replace with the actual narration duration after adding the voice file.
  totalFrames: 30 * 60,

  narration: "/audio/narration.mp3",

  scenes: [
    {
      id: "cold-open",
      type: "coldOpen",
      start: 0,
      duration: 8,
      title: "THIS STORY REALLY HAPPENED",
      subtitle: "What happened next changed everything.",
    },

    {
      id: "location",
      type: "location",
      start: 8,
      duration: 7,
      title: "THE LOCATION",
      location: "LOCATION • USA",
      subtitle: "The story begins here.",
    },

    {
      id: "timeline",
      type: "timeline",
      start: 15,
      duration: 10,
      title: "THE TIMELINE",
      items: [
        "The first important event",
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
    },

    {
      id: "photo",
      type: "photo",
      start: 35,
      duration: 8,
      title: "THE STORY IN ONE IMAGE",
      image: "/images/example.jpg",
    },

    {
      id: "document",
      type: "document",
      start: 43,
      duration: 8,
      title: "THE DOCUMENT",
      document: "/documents/example.jpg",
    },

    {
      id: "newspaper",
      type: "newspaper",
      start: 51,
      duration: 8,
      title: "WHAT THE REPORTS SAID",
      text: "A documented report connected to the event.",
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
      text: "Here is what ultimately happened.",
    },

    {
      id: "ending",
      type: "ending",
      start: 104,
      duration: 16,
      title: "REAL STORIES. REAL QUESTIONS.",
      subtitle: "Some stories end with answers. Others leave questions behind.",
    },
  ],
};
