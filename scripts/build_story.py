import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = ROOT / "scripts"


def run(script_name: str):
    path = SCRIPTS / script_name

    if not path.exists():
        raise FileNotFoundError(
            f"Required script missing: {path}"
        )

    print()
    print("=" * 60)
    print(f"RUNNING: {script_name}")
    print("=" * 60)

    subprocess.run(
        [sys.executable, str(path)],
        cwd=str(ROOT),
        check=True,
    )


def main():
    print("=" * 60)
    print("FIRST STEP LEARNER - STORY BUILD PIPELINE")
    print("=" * 60)

    # Voice + actual audio duration + timing map
    run("generate_voice.py")

    # Understand the narration
    run("analyze_script.py")

    # Generate visual beats
    run("generate_visual_plan.py")
    run("generate_animation_plan.py")

    # Generate subtitles from the timing map
    run("generate_subtitles.py")

    # Prepare/check visual assets
    run("prepare_assets.py")

    # Final validation
    run("validate_pipeline.py")

    print()
    print("=" * 60)
    print("STORY PIPELINE COMPLETED")
    print("=" * 60)


if __name__ == "__main__":
    main()
