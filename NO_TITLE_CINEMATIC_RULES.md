# Visual rules update — no title cards

This patch removes decorative title/eyebrow overlays from the animation scenes. Narration is delivered through the voice track and synchronized subtitles. The scene visuals should carry the storytelling.

## Updated files
- `remotion/components/AnimationDirector.tsx` — routes generic cinematic beats to a visual-only atmosphere scene; no documentary title card.
- `remotion/components/CinematicText.tsx` — converted to a visual-only cinematic background fallback.
- `remotion/components/WaterGasScene.tsx` — keeps animated water, bubbles, particles and camera move; removes heading/narration text overlay.
- `remotion/components/MountainAtmosphereScene.tsx` — keeps moving atmosphere and camera drift; removes narration overlay.
- `remotion/components/AnimatedTimelineScene.tsx` — removes decorative TIMELINE heading; actual dates/events remain part of the timeline graphic.
- `remotion/components/AnimatedEvidenceBoard.tsx` — removes decorative heading; evidence objects remain part of the visual.
- `remotion/components/VisualBeat.tsx` — removes narration/title text from fallback/visual panels where practical.

Important: labels that are intrinsic to a story artifact (such as a date on a timeline or a newspaper reconstruction label) may remain when they are needed to understand the evidence and avoid presenting a reconstruction as genuine archival material.

This is a code patch, not a claim that a full GitHub Actions render has been verified. Run the workflow and inspect the resulting MP4 for visual motion, scene relevance, and subtitle synchronization.
