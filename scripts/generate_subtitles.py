import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent

TIMINGS_FILE = ROOT / "generated" / "word_timings.json"
OUTPUT_FILE = ROOT / "generated" / "subtitles.json"

MAX_WORDS = 8
MAX_DURATION = 3.5


def main():
    if not TIMINGS_FILE.exists():
        raise FileNotFoundError(
            "generated/word_timings.json is missing."
        )

    data = json.loads(
        TIMINGS_FILE.read_text(encoding="utf-8")
    )

    words = data.get("words", [])

    if not words:
        raise ValueError(
            "No word timings available."
        )

    cues = []

    current = []
    start = None
    end = None

    for item in words:
        word = item["word"].strip()

        if not word:
            continue

        word_start = float(item["start"])
        word_end = float(item["end"])

        if start is None:
            start = word_start

        current.append(word)
        end = word_end

        duration = end - start

        if (
            len(current) >= MAX_WORDS
            or duration >= MAX_DURATION
        ):
            cues.append(
                {
                    "start": round(start, 4),
                    "end": round(end, 4),
                    "text": " ".join(current),
                }
            )

            current = []
            start = None
            end = None

    if current:
        cues.append(
            {
                "start": round(start, 4),
                "end": round(end, 4),
                "text": " ".join(current),
            }
        )

    if not cues:
        raise RuntimeError(
            "Subtitle generation produced zero cues."
        )

    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    OUTPUT_FILE.write_text(
        json.dumps(
            {
                "cue_count": len(cues),
                "cues": cues,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    print(f"Subtitles generated: {len(cues)} cues")


if __name__ == "__main__":
    main()
