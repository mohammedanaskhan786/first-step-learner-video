import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SCRIPTS = ROOT / "scripts"


def run(script_name: str):
    script_path = SCRIPTS / script_name

    if not script_path.exists():
        raise FileNotFoundError(
            f"Required pipeline script is missing: {script_path}"
        )

    print(f"\n========== RUNNING {script_name} ==========")

    subprocess.run(
        [sys.executable, str(script_path)],
        cwd=ROOT,
        check=True,
    )


def main():
    print("========================================")
    print(" FIRST STEP LEARNER STORY PIPELINE")
    print("========================================")

    # 1. Generate narration audio + real word timings.
    run("generate_voice.py")

    # 2. Analyze narration and create story structure.
    run("analyze_script.py")

    # 3. Create visual beats using the real word timings.
    run("generate_visual_plan.py")

    # 4. Generate subtitle cues from the same timings.
    run("generate_subtitles.py")

    # 5. Prepare/validate referenced assets.
    run("prepare_assets.py")

    # 6. Final pipeline validation.
    run("validate_pipeline.py")

    print("\n========================================")
    print(" STORY PIPELINE COMPLETED SUCCESSFULLY")
    print("========================================")


if __name__ == "__main__":
    main()
