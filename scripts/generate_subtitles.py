import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent

TIMINGS_FILE = ROOT / "generated" / "word_timings.json"
OUTPUT_FILE = ROOT / "generated" / "subtitles.json"


MAX_WORDS_PER_CUE = 8
MAX_CUE_DURATION = 3.5


def load_timings():
    if not TIMINGS_FILE.exists():
        raise FileNotFoundError(
            f"Missing word timing file: {TIMINGS_FILE}"
        )

    data = json.loads(
        TIMINGS_FILE.read_text(encoding="utf-8")
    )

    words = data.get("words", [])

    if not words:
        raise ValueError(
            "word_timings.json contains no words."
        )

    return words


def build_cues(words):
    cues = []

    current_words = []
    cue_start = None
    cue_end = None

    for item in words:
        word = str(item["word"]).strip()
        start = float(item["start"])
        end = float(item["end"])

        if not word:
            continue

        if cue_start is None:
            cue_start = start

        current_words.append(word)
        cue_end = end

        duration = cue_end - cue_start

        should_close = (
            len(current_words) >= MAX_WORDS_PER_CUE
            or duration >= MAX_CUE_DURATION
        )

        if should_close:
            cues.append(
                {
                    "start": round(cue_start, 4),
                    "end": round(cue_end, 4),
                    "text": " ".join(current_words),
                }
            )

            current_words = []
            cue_start = None
            cue_end = None

    if current_words and cue_start is not None and cue_end is not None:
        cues.append(
            {
                "start": round(cue_start, 4),
                "end": round(cue_end, 4),
                "text": " ".join(current_words),
            }
        )

    return cues


def main():
    words = load_timings()
    cues = build_cues(words)

    if not cues:
        raise ValueError(
            "No subtitle cues were generated."
        )

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

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
