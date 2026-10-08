import json
from pathlib import Path
from typing import Any


def project_root() -> Path:
    return Path(__file__).resolve().parent.parent


def load_json(path: Path) -> Any:
    if not path.exists():
        raise FileNotFoundError(f"Missing JSON file: {path}")

    try:
        return json.loads(
            path.read_text(encoding="utf-8")
        )
    except json.JSONDecodeError as exc:
        raise ValueError(
            f"Invalid JSON file: {path}"
        ) from exc


def save_json(path: Path, data: Any):
    path.parent.mkdir(parents=True, exist_ok=True)

    path.write_text(
        json.dumps(
            data,
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )


def load_word_timings(root: Path | None = None):
    root = root or project_root()

    path = root / "generated" / "word_timings.json"

    data = load_json(path)

    words = data.get("words", [])

    if not isinstance(words, list) or not words:
        raise ValueError(
            "No word timings found in generated/word_timings.json"
        )

    return words


def narration_duration_from_timings(words) -> float:
    if not words:
        raise ValueError("Cannot calculate duration from empty timings.")

    return max(
        float(word["end"])
        for word in words
    )


def validate_word_timings(words):
    previous_end = 0.0

    for index, item in enumerate(words):
        if "word" not in item:
            raise ValueError(
                f"Timing #{index} is missing 'word'."
            )

        if "start" not in item or "end" not in item:
            raise ValueError(
                f"Timing #{index} is missing start/end."
            )

        start = float(item["start"])
        end = float(item["end"])

        if start < 0:
            raise ValueError(
                f"Timing #{index} has negative start time."
            )

        if end < start:
            raise ValueError(
                f"Timing #{index} ends before it starts."
            )

        if start < previous_end:
            raise ValueError(
                f"Timing #{index} overlaps the previous word."
            )

        previous_end = end

    return True
