import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GENERATED_DIR = ROOT / "generated"
PUBLIC_DIR = ROOT / "public"

PLAN_FILE = GENERATED_DIR / "visual_plan.json"
ASSETS_FILE = GENERATED_DIR / "assets.json"


def load_json(path: Path):
    if not path.exists():
        raise FileNotFoundError(f"Missing required file: {path}")

    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON file: {path}") from exc


def ensure_directories():
    directories = [
        PUBLIC_DIR / "audio",
        PUBLIC_DIR / "images",
        PUBLIC_DIR / "documents",
        PUBLIC_DIR / "maps",
    ]

    for directory in directories:
        directory.mkdir(
            parents=True,
            exist_ok=True,
        )


def build_assets(plan):
    assets = {
        "version": 1,
        "generated": True,
        "narration": {
            "path": "audio/narration.mp3",
            "required": True,
        },
        "visual_assets": [],
        "available_asset_directories": {
            "images": "images/",
            "documents": "documents/",
            "maps": "maps/",
        },
        "rules": {
            "missing_assets_use_generated_visuals": True,
            "no_manual_sfx_required": True,
            "no_manual_ambience_required": True,
            "no_manual_music_required": True,
            "generated_visuals_are_reconstructions": True,
        },
    }

    visual_types = sorted(
        {
            beat.get("visual_type", "cinematic")
            for beat in plan.get("beats", [])
        }
    )

    for visual_type in visual_types:
        assets["visual_assets"].append(
            {
                "type": visual_type,
                "source": "generated",
                "required": False,
            }
        )

    return assets


def main():
    print("=" * 60)
    print("PREPARING ASSETS")
    print("=" * 60)

    plan = load_json(PLAN_FILE)

    ensure_directories()

    assets = build_assets(plan)

    GENERATED_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    ASSETS_FILE.write_text(
        json.dumps(
            assets,
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    print(
        f"Asset categories prepared: "
        f"{len(assets['visual_assets'])}"
    )

    print(
        f"Asset manifest written to: {ASSETS_FILE}"
    )


if __name__ == "__main__":
    main()
