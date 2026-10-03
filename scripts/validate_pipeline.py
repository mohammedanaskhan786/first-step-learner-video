import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

PUBLIC_DIR = ROOT / "public"
GENERATED_DIR = ROOT / "generated"

REQUIRED_FILES = [
    ROOT / "narration.txt",
    PUBLIC_DIR / "audio" / "narration.mp3",
    GENERATED_DIR / "word_timings.json",
    GENERATED_DIR / "story.json",
    GENERATED_DIR / "visual_plan.json",
    GENERATED_DIR / "subtitles.json",
    GENERATED_DIR / "assets.json",
]


def check_file(path: Path):
    if not path.exists():
        raise FileNotFoundError(
            f"Required file is missing: {path}"
        )

    if path.is_file() and path.stat().st_size == 0:
        raise ValueError(
            f"Required file is empty: {path}"
        )


def load_json(path: Path):
    try:
        return json.loads(
            path.read_text(encoding="utf-8")
        )
    except json.JSONDecodeError as exc:
        raise ValueError(
            f"Invalid JSON file: {path}"
        ) from exc


def validate_word_timings():
    path = GENERATED_DIR / "word_timings.json"
    data = load_json(path)

    words = data.get("words", [])

    if not words:
        raise ValueError(
            "word_timings.json contains no words."
        )

    previous_end = 0.0

    for index, item in enumerate(words):
        if "word" not in item:
            raise ValueError(
                f"Word timing #{index} has no word."
            )

        if "start" not in item or "end" not in item:
            raise ValueError(
                f"Word timing #{index} is missing start/end."
            )

        start = float(item["start"])
        end = float(item["end"])

        if start < 0:
            raise ValueError(
                f"Word timing #{index} has negative start."
            )

        if end < start:
            raise ValueError(
                f"Word timing #{index} ends before it starts."
            )

        if start < previous_end:
            raise ValueError(
                f"Word timing #{index} overlaps previous timing."
            )

        previous_end = end

    return len(words), previous_end


def validate_story():
    path = GENERATED_DIR / "story.json"
    data = load_json(path)

    sentences = data.get("sentences", [])

    if not sentences:
        raise ValueError(
            "story.json contains no sentences."
        )

    return len(sentences)


def validate_visual_plan():
    path = GENERATED_DIR / "visual_plan.json"
    data = load_json(path)

    beats = data.get("beats", [])

    if not beats:
        raise ValueError(
            "visual_plan.json contains no visual beats."
        )

    duration = float(
        data.get("duration", 0)
    )

    if duration <= 0:
        raise ValueError(
            "visual_plan.json has invalid duration."
        )

    previous_end = 0.0

    for index, beat in enumerate(beats):
        start = float(beat.get("start", 0))
        end = float(beat.get("end", 0))

        if end < start:
            raise ValueError(
                f"Visual beat #{index} ends before it starts."
            )

        if start < previous_end:
            raise ValueError(
                f"Visual beat #{index} overlaps previous beat."
            )

        previous_end = end

    return len(beats), duration


def validate_subtitles():
    path = GENERATED_DIR / "subtitles.json"
    data = load_json(path)

    cues = data.get("cues", [])

    if not cues:
        raise ValueError(
            "subtitles.json contains no subtitle cues."
        )

    previous_end = 0.0

    for index, cue in enumerate(cues):
        start = float(cue.get("start", 0))
        end = float(cue.get("end", 0))
        text = str(cue.get("text", "")).strip()

        if not text:
            raise ValueError(
                f"Subtitle cue #{index} has no text."
            )

        if end < start:
            raise ValueError(
                f"Subtitle cue #{index} ends before it starts."
            )

        if start < previous_end:
            raise ValueError(
                f"Subtitle cue #{index} overlaps previous cue."
            )

        previous_end = end

    return len(cues), previous_end


def validate_assets():
    path = GENERATED_DIR / "assets.json"
    data = load_json(path)

    if not isinstance(
        data.get("visual_assets", []),
        list,
    ):
        raise ValueError(
            "assets.json has invalid visual_assets."
        )

    return len(data.get("visual_assets", []))


def main():
    print("=" * 60)
    print("VALIDATING STORY PIPELINE")
    print("=" * 60)

    for path in REQUIRED_FILES:
        check_file(path)

    word_count, word_duration = validate_word_timings()
    sentence_count = validate_story()
    beat_count, visual_duration = validate_visual_plan()
    subtitle_count, subtitle_duration = validate_subtitles()
    asset_count = validate_assets()

    print()
    print("Required files: OK")
    print(f"Words: {word_count}")
    print(f"Word timing duration: {word_duration:.2f}s")
    print(f"Sentences: {sentence_count}")
    print(f"Visual beats: {beat_count}")
    print(f"Visual duration: {visual_duration:.2f}s")
    print(f"Subtitle cues: {subtitle_count}")
    print(f"Subtitle duration: {subtitle_duration:.2f}s")
    print(f"Asset categories: {asset_count}")
    print()
    print("PIPELINE VALIDATION PASSED")


if __name__ == "__main__":
    main()
