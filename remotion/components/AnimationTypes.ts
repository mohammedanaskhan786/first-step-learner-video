export type Point = { x: number; y: number };

export type AnimationAction =
  | { type: "camera_zoom"; from?: number; to?: number; duration?: number }
  | { type: "camera_pan"; from?: Point; to?: Point; duration?: number }
  | { type: "fade"; from?: number; to?: number; duration?: number }
  | { type: "parallax"; strength?: number; duration?: number }
  | { type: "particles"; count?: number; speed?: number; direction?: "up"|"down"|"left"|"right"|"random"; size?: number }
  | { type: "gas_rise"; count?: number; speed?: number; spread?: number }
  | { type: "water_ripple"; strength?: number; speed?: number }
  | { type: "fog"; amount?: number; speed?: number }
  | { type: "route_draw"; duration?: number }
  | { type: "marker_pulse"; duration?: number }
  | { type: "timeline_reveal"; duration?: number }
  | { type: "document_reveal"; duration?: number }
  | { type: "newspaper_reveal"; duration?: number }
  | { type: "evidence_connect"; duration?: number }
  | { type: "text_reveal"; duration?: number };

export type AnimatedScene = {
  id: string;
  start: number;
  end: number;
  kind:
    | "cinematic"
    | "water_gas"
    | "mountain"
    | "map_route"
    | "timeline"
    | "newspaper"
    | "document"
    | "evidence"
    | "particles"
    | "abstract";
  title?: string;
  text?: string;
  image?: string;
  data?: Record<string, unknown>;
  actions?: AnimationAction[];
};
