import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INPUT = ROOT / "generated" / "visual_plan.json"
OUTPUT = ROOT / "generated" / "animation_plan.json"

def make_actions(kind: str, text: str):
    low = text.lower()
    actions = [
        {"type": "camera_zoom", "from": 1.0, "to": 1.08, "duration": 10},
        {"type": "fade", "from": 0, "to": 1, "duration": 0.8},
    ]

    if kind in {"location", "cinematic", "photo"}:
        actions.append({"type": "parallax", "strength": 18, "duration": 10})
    if kind == "map":
        actions += [
            {"type": "route_draw", "duration": 4},
            {"type": "marker_pulse", "duration": 8},
        ]
    if kind == "timeline":
        actions.append({"type": "timeline_reveal", "duration": 5})
    if kind == "newspaper":
        actions.append({"type": "newspaper_reveal", "duration": 1.2})
    if kind == "document":
        actions.append({"type": "document_reveal", "duration": 1.5})
    if kind == "evidence":
        actions.append({"type": "evidence_connect", "duration": 5})
    if any(w in low for w in ["gas", "smoke", "fog", "cloud", "mist"]):
        actions.append({"type": "gas_rise", "count": 50, "speed": 0.8, "spread": 180})
    if any(w in low for w in ["water", "lake", "ocean", "river", "sea"]):
        actions.append({"type": "water_ripple", "strength": 0.6, "speed": 0.8})
    if any(w in low for w in ["rain", "snow", "ash", "dust", "particles"]):
        actions.append({"type": "particles", "count": 45, "speed": 0.7, "direction": "down", "size": 4})

    return actions

def main():
    if not INPUT.exists():
        raise FileNotFoundError(INPUT)

    plan = json.loads(INPUT.read_text(encoding="utf-8"))
    scenes = []

    mapping = {
        "map": "map_route",
        "location": "mountain",
        "timeline": "timeline",
        "newspaper": "newspaper",
        "document": "document",
        "evidence": "evidence",
        "photo": "cinematic",
        "quote": "cinematic",
        "cinematic": "cinematic",
        "cinematic_text": "cinematic",
    }

    for i, beat in enumerate(plan.get("beats", [])):
        raw_kind = beat.get("visual_type", "cinematic")
        kind = mapping.get(raw_kind, "cinematic")
        text = beat.get("text", "")
        scenes.append({
            "id": beat.get("id", f"scene_{i+1:03d}"),
            "start": float(beat.get("start", 0)),
            "end": float(beat.get("end", 1)),
            "kind": kind,
            "title": beat.get("description", "")[:80],
            "text": text,
            "data": beat.get("data", {}),
            "actions": make_actions(raw_kind, text),
        })

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(
        json.dumps({"version": 1, "scenes": scenes}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Animation plan generated: {OUTPUT}")
    print(f"Animated scenes: {len(scenes)}")

if __name__ == "__main__":
    main()
