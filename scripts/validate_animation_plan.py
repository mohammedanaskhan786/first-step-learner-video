import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLAN = ROOT / "generated" / "animation_plan.json"

def main():
    if not PLAN.exists():
        raise FileNotFoundError(PLAN)

    data = json.loads(PLAN.read_text(encoding="utf-8"))
    scenes = data.get("scenes", [])
    if not scenes:
        raise ValueError("Animation plan contains no scenes.")

    previous_end = 0.0
    for scene in scenes:
        start = float(scene["start"])
        end = float(scene["end"])
        if end <= start:
            raise ValueError(f"Invalid scene duration: {scene['id']}")
        if start < previous_end - 0.05:
            raise ValueError(f"Overlapping scene timing near {scene['id']}")
        actions = {a.get("type") for a in scene.get("actions", [])}
        for required in ("camera_zoom", "fade"):
            if required not in actions:
                raise ValueError(f"{scene['id']} missing action: {required}")
        previous_end = end

    print(f"Animation plan valid: {len(scenes)} scenes")

if __name__ == "__main__":
    main()
