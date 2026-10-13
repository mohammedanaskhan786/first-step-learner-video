import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GEN = ROOT / "generated"
PUBLIC = ROOT / "public"

def read(name):
    path = GEN / name
    if not path.exists():
        raise FileNotFoundError(f"Missing generated file: {path}. Run the pipeline first.")
    return json.loads(path.read_text(encoding="utf-8"))

def main():
    (PUBLIC / "audio").mkdir(parents=True, exist_ok=True)
    (PUBLIC / "generated").mkdir(parents=True, exist_ok=True)
    audio = PUBLIC / "audio" / "narration.mp3"
    if not audio.exists() or audio.stat().st_size == 0:
        raise FileNotFoundError("public/audio/narration.mp3 was not generated")

    story = read("story.json")
    plan = read("visual_plan.json")
    subtitle_data = read("subtitles.json")
    assets = read("assets.json")
    timings = read("word_timings.json")

    type_map = {"statistics": "statistic", "cinematic": "cinematic_text"}
    visual_beats = []
    for beat in plan.get("beats", []):
        visual_type = beat.get("visual_type", "cinematic")
        mapped = type_map.get(visual_type, visual_type)
        data = {"location": beat.get("location", ""), "date": beat.get("date", ""), "event": beat.get("text", ""), "quote": beat.get("text", ""), "label": beat.get("text", ""), "items": [beat.get("text", "")]}
        visual_beats.append({"id": str(beat.get("id", len(visual_beats))), "start": float(beat.get("start", 0)), "end": max(float(beat.get("end", 0)), float(beat.get("start", 0)) + 0.1), "type": mapped, "text": str(beat.get("text", "")), "data": data, "sourceClaimId": str(beat.get("sentence_id", ""))})

    duration = max(float(plan.get("duration", 0)), float(timings.get("duration", 0)), 1.0)
    runtime = {
        "version": 2, "title": story.get("title", "Documentary"), "subtitle": "2D animated documentary",
        "fps": 30, "narration": "audio/narration.mp3", "visualBeats": visual_beats,
        "subtitles": subtitle_data.get("cues", []), "assets": assets.get("visual_assets", []),
        "sources": [], "locations": story.get("entities", {}).get("locations", []),
        "dates": [], "years": story.get("entities", {}).get("years", []), "durationSeconds": duration
    }
    (PUBLIC / "generated" / "story.json").write_text(json.dumps(runtime, ensure_ascii=False, indent=2), encoding="utf-8")
    for name in ("visual_plan.json", "subtitles.json", "assets.json", "word_timings.json", "sources.json"):
        src = GEN / name
        if src.exists(): shutil.copy2(src, PUBLIC / "generated" / name)
    print(f"Runtime story prepared: {len(visual_beats)} 2D visual beats; {duration:.2f}s")

if __name__ == "__main__": main()
