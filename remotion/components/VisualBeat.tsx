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

export const VisualBeat: React.FC<{ beat: Beat }> = ({
  beat,
}) => {
  const data = beat.data ?? {};
  const text = beat.text;

  const value = String(
    data.value ?? ""
  );

  const label = String(
    data.label ?? text
  );

  switch (beat.type) {
    case "map":
      return (
        <MapAnimation
          from={String(data.from ?? "")}
          to={String(data.to ?? "")}
        />
      );

    case "location":
      return (
        <LocationCard
          location={String(
            data.location ?? "LOCATION"
          )}
          text={text}
        />
      );

    case "timeline":
      return (
        <TimelineAnimation
          date={String(
            data.date ?? "TIMELINE"
          )}
          event={String(
            data.event ?? text
          )}
        />
      );

    case "photo":
      return (
        <PhotoPanel
          src={beat.asset}
          title={String(
            data.location ?? "VISUAL"
          )}
          text={text}
          reconstructed
        />
      );

    case "document":
      return (
        <DocumentPanel
          src={beat.asset}
          text={text}
        />
      );

    case "newspaper":
      return (
        <NewspaperPanel
          src={beat.asset}
          text={text}
        />
      );

    case "evidence":
      return (
        <EvidencePanel
          items={[text]}
        />
      );

    case "quote":
      return (
        <QuoteCard
          quote={String(
            data.quote ?? text
          )}
        />
      );

    case "statistic":
      return (
        <StatisticsPanel
          value={value}
          label={label}
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

    case "cinematic_text":
    default:
      return (
        <CinematicText
          eyebrow="NARRATION"
          title={text}
        />
      );
  }
};
