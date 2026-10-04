import React from "react";
import type { VisualBeat as Beat } from "../engineTypes";
import { CinematicText } from "./CinematicText";
import { LocationCard } from "./LocationCard";
import { TimelineAnimation } from "./TimelineAnimation";
import { MapAnimation } from "./MapAnimation";
import { PhotoPanel } from "./PhotoPanel";
import { DocumentPanel } from "./DocumentPanel";
import { NewspaperPanel } from "./NewspaperPanel";
import { EvidencePanel } from "./EvidencePanel";
import { QuoteCard } from "./QuoteCard";
import { StatisticsPanel } from "./StatisticsPanel";

export const VisualBeat: React.FC<{ beat: Beat }> = ({ beat }) => {
  const d = beat.data ?? {};
  const text = beat.text;

  switch (beat.type) {
    case "map":
      return (
        <MapAnimation
          from={String(d.from ?? "")}
          to={String(d.to ?? "")}
        />
      );

    case "timeline":
      return (
        <TimelineAnimation
          date={String(d.date ?? "TIMELINE")}
          event={String(d.event ?? text)}
        />
      );

    case "location":
      return (
        <LocationCard
          location={String(d.location ?? "LOCATION")}
          text={text}
        />
      );

    case "photo":
      return (
        <PhotoPanel
          src={beat.asset}
          title={String(d.location ?? "VISUAL")}
          text={text}
          reconstructed
        />
      );

    case "document":
      return <DocumentPanel src={beat.asset} text={text} />;

    case "newspaper":
      return <NewspaperPanel src={beat.asset} text={text} />;

    case "evidence":
      return <EvidencePanel items={[text]} />;

    case "quote":
      return <QuoteCard quote={String(d.quote ?? text)} />;

    case "statistic":
      return (
        <StatisticsPanel
          value={String(d.value ?? "")}
          label={String(d.label ?? text)}
        />
      );

    case "unknown":
      return (
        <EvidencePanel
          title="WHAT REMAINS UNKNOWN"
          items={[text]}
        />
      );

    case "ending":
      return (
        <CinematicText
          eyebrow="DOCUMENTARY"
          title="REAL STORY. REAL QUESTIONS."
          text={text}
        />
      );

    case "cold_open":
      return (
        <CinematicText
          eyebrow="THE STORY"
          title="THIS REALLY HAPPENED"
          text={text}
        />
      );

    default:
      return (
        <CinematicText
          eyebrow="NARRATION"
          title={text}
        />
      );
  }
};
