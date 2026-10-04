import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

NARRATION_FILE = ROOT / "narration.txt"
PUBLIC_AUDIO = ROOT / "public" / "audio" / "narration.mp3"

GENERATED_DIR = ROOT / "generated"
PUBLIC_GENERATED_DIR = ROOT / "public" / "generated"

REQUIRED_GENERATED = [
    "word_timings.json",
    "story.json",
    "visual_plan.json",
    "subtitles.json",
    "assets.json",
]

REQUIRED_PUBLIC_GENERATED = [
    "story.json",
    "visual_plan.json",
    "subtitles.json",
]


def load_json(path: Path):
    if not path.exists():
        raise FileNotFoundError(f"Missing file: {path}")

    try:
        return json.loads(
            path.read_text(encoding="utf-8")
        )
    except json.JSONDecodeError as exc:
        raise ValueError(
            f"Invalid JSON: {path}"
        ) from exc


def validate_file(path: Path):
    if not path.exists():
        raise FileNotFoundError(
            f"Required file missing: {path}"
        )

    if path.is_file() and path.stat().st_size == 0:
        raise ValueError(
            f"File is empty: {path}"
        )


def validate_word_timings():
    data = load_json(
        GENERATED_DIR / "word_timings.json"
    )

    words = data.get("words", [])

    if not words:
        raise ValueError(
            "word_timings.json contains no words."
        )

    previous_end = 0.0

    for index, item in enumerate(words):
        start = float(item["start"])
        end = float(item["end"])

        if end <= start:
            raise ValueError(
                f"Invalid timing at word {index}: "
                f"{start} -> {end}"
            )

        if start < previous_end - 0.001:
            raise ValueError(
                f"Word timing overlap at word {index}."
            )

        previous_end = end

    duration = float(data.get("duration", 0))

    if duration <= 0:
        raise ValueError(
            "Invalid narration duration."
        )

    if abs(previous_end - duration) > 0.1:
        raise ValueError(
            "Word timings do not end at narration duration."
        )

    print(
        f"✓ Word timings valid: "
        f"{len(words)} words / {duration:.2f}s"
    )

    return duration


def validate_visual_plan(narration_duration):
    data = load_json(
        GENERATED_DIR / "visual_plan.json"
    )

    beats = data.get("beats", [])

    if not beats:
        raise ValueError(
            "visual_plan.json contains no beats."
        )

    plan_duration = float(
        data.get("duration", 0)
    )

    if plan_duration <= 0:
        raise ValueError(
            "Visual plan has invalid duration."
        )

    difference = abs(
        plan_duration - narration_duration
    )

    if difference > 1.0:
        raise ValueError(
            f"Visual plan duration {plan_duration:.2f}s "
            f"does not match narration "
            f"{narration_duration:.2f}s."
        )

    previous_end = 0.0

    for index, beat in enumerate(beats):
        start = float(beat["start"])
        end = float(beat["end"])

        if end <= start:
            raise ValueError(
                f"Invalid visual beat {index}."
            )

        if start < previous_end - 0.01:
            raise ValueError(
                f"Visual beat overlap at beat {index}."
            )

        previous_end = end

    print(
        f"✓ Visual plan valid: "
        f"{len(beats)} beats / {plan_duration:.2f}s"
    )


def validate_subtitles(narration_duration):
    data = load_json(
        GENERATED_DIR / "subtitles.json"
    )

    cues = data.get("cues", [])

    if not cues:
        raise ValueError(
            "subtitles.json contains no cues."
        )

    for index, cue in enumerate(cues):
        start = float(cue["start"])
        end = float(cue["end"])

        if end <= start:
            raise ValueError(
                f"Invalid subtitle cue {index}."
            )

        if start < 0:
            raise ValueError(
                f"Subtitle cue {index} starts before zero."
            )

        if end > narration_duration + 0.1:
            raise ValueError(
                f"Subtitle cue {index} exceeds narration duration."
            )

    print(
        f"✓ Subtitles valid: {len(cues)} cues"
    )


def validate_public_runtime_files():
    for filename in REQUIRED_PUBLIC_GENERATED:
        path = PUBLIC_GENERATED_DIR / filename
        validate_file(path)

    print(
        f"✓ Public runtime files ready: "
        f"{len(REQUIRED_PUBLIC_GENERATED)}"
    )


def main():
    print("=" * 60)
    print("VALIDATING STORY PIPELINE")
    print("=" * 60)

    validate_file(NARRATION_FILE)
    validate_file(PUBLIC_AUDIO)

    for filename in REQUIRED_GENERATED:
        validate_file(
            GENERATED_DIR / filename
        )

    print("✓ Required source/generated files exist.")

    narration_duration = validate_word_timings()

    load_json(
        GENERATED_DIR / "story.json"
    )

    validate_visual_plan(
        narration_duration
    )

    validate_subtitles(
        narration_duration
    )

    validate_public_runtime_files()

    print()
    print("=" * 60)
    print("PIPELINE VALIDATION PASSED")
    print(
        f"Narration duration: "
        f"{narration_duration:.2f}s"
    )
    print(
        f"Expected video duration: "
        f"{narration_duration:.2f}s"
    )
    print("=" * 60)


if __name__ == "__main__":
    main()
