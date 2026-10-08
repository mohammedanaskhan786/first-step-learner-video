export type VisualBeat = {id:string; start:number; end:number; type:string; text:string; data?:Record<string,unknown>; asset?:string; sourceClaimId?:string};
export type SubtitleCue = {start:number; end:number; text:string};
export type AnimatedScene = {id:string; start:number; end:number; kind:string; title?:string; text?:string; image?:string; data?:Record<string,unknown>; actions?:string[]};
export type StoryData = {fps:number; narration:string; music:string; ambience:string; visualBeats:VisualBeat[]; subtitles:SubtitleCue[]; animationScenes:AnimatedScene[]};
