export type Coordinate={lat:number;lon:number};
export type VisualBeatType='cold_open'|'cinematic_text'|'location'|'map'|'timeline'|'photo'|'document'|'newspaper'|'evidence'|'quote'|'statistic'|'unknown'|'ending';
export type VisualBeat={id:string;start:number;end:number;type:VisualBeatType;text:string;data?:Record<string,unknown>;asset?:string;sourceClaimId?:string};
export type SubtitleCue={start:number;end:number;text:string};
export type StoryData={version:number;title:string;subtitle:string;fps:number;narration:string;music?:string;ambience?:string;visualBeats:VisualBeat[];subtitles:SubtitleCue[];assets:Array<Record<string,unknown>>;sources:Array<Record<string,unknown>>;locations:string[];dates:string[];years:string[]};
