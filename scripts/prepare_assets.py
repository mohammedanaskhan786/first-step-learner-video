import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

PUBLIC_DIR = ROOT / "public"
GENERATED_DIR = ROOT / "generated"

PUBLIC_AUDIO_DIR = PUBLIC_DIR / "audio"
PUBLIC_IMAGES_DIR = PUBLIC_DIR / "images"
PUBLIC_DOCUMENTS_DIR = PUBLIC_DIR / "documents"
PUBLIC_MAPS_DIR = PUBLIC_DIR / "maps"
PUBLIC_GENERATED_DIR = PUBLIC_DIR / "generated"


def ensure_directory(path: Path):
    path.mkdir(parents=True, exist_ok=True)


def copy_generated_file(filename: str):
    source = GENERATED_DIR / filename
    destination = PUBLIC_GENERATED_DIR / filename

    if not source.exists():
        raise FileNotFoundError(
            f"Required generated file missing: {source}"
        )

    shutil.copy2(source, destination)

    print(f"Copied: generated/{filename} -> public/generated/{filename}")


def build_assets_manifest():
    return {
        "version": 2,

        "audio": {
            "narration": "audio/narration.mp3",
            "music": "music/investigation.mp3",
            "ambience": "audio/ambience/atmosphere.mp3",
        },

        "visuals": {
            "images": "images",
            "documents": "documents",
            "maps": "maps",
        },

        "generated": {
            "story": "generated/story.json",
            "visual_plan": "generated/visual_plan.json",
            "subtitles": "generated/subtitles.json",
        },

        "audio_mix": {
            "narration": 1.0,
            "music": 0.075,
            "ambience": 0.035,
        },

        "rules": {
            "manual_sfx_required": False,
            "manual_visual_assets_required": False,
            "music_loop": True,
            "ambience_loop": True,
        },
    }


def main():
    print("=" * 60)
    print("PREPARING ASSETS")
    print("=" * 60)

    # Required public directories
    for directory in [
        PUBLIC_AUDIO_DIR,
        PUBLIC_IMAGES_DIR,
        PUBLIC_DOCUMENTS_DIR,
        PUBLIC_MAPS_DIR,
        PUBLIC_GENERATED_DIR,
    ]:
        ensure_directory(directory)

    # Generated runtime files required by Remotion Root.tsx
    required_generated_files = [
        "story.json",
        "visual_plan.json",
        "subtitles.json",
    ]

    for filename in required_generated_files:
        copy_generated_file(filename)

    # Assets manifest
    manifest = build_assets_manifest()

    manifest_file = GENERATED_DIR / "assets.json"

    GENERATED_DIR.mkdir(parents=True, exist_ok=True)

    manifest_file.write_text(
        json.dumps(
            manifest,
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    print()
    print(f"Asset manifest written to: {manifest_file}")
    print(f"Generated runtime files: {len(required_generated_files)}")
    print("Assets preparation completed.")


if __name__ == "__main__":
    main()
