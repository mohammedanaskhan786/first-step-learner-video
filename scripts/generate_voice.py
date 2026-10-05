import asyncio
import json
import re
from pathlib import Path

import edge_tts
from mutagen.mp3 import MP3


ROOT = Path(__file__).resolve().parent.parent

INPUT_FILE = ROOT / "narration.txt"
AUDIO_FILE = ROOT / "public" / "audio" / "narration.mp3"
TIMINGS_FILE = ROOT / "generated" / "word_timings.json"


# ---------------------------------------------------------
# VOICE SETTINGS
# ---------------------------------------------------------

VOICE = "en-US-ChristopherNeural"

# Slightly slower than normal speech for documentary narration.
RATE = "-8%"

VOLUME = "+0%"


# ---------------------------------------------------------
# TEXT CLEANING
# ---------------------------------------------------------

def clean_narration(text: str) -> str:
    """
    Prepare narration for more natural TTS delivery.

    We preserve punctuation because punctuation controls
    natural pauses in the generated voice.
    """

    text = text.replace("\r\n", "\n")
    text = text.replace("\r", "\n")

    # Normalize excessive spaces.
    text = re.sub(r"[ \t]+", " ", text)

    # Avoid huge empty gaps.
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Give sentence-ending punctuation a clean space.
    text = re.sub(r"([.!?])([A-Za-z])", r"\1 \2", text)

    # Clean spaces before punctuation.
    text = re.sub(r"\s+([,.!?;:])", r"\1", text)

    return text.strip()


def split_words(text: str):
    return re.findall(r"\S+", text)


# ---------------------------------------------------------
# TTS GENERATION
# ---------------------------------------------------------

async def generate_audio(text: str):
    """
    Generate the narration MP3.

    Punctuation and paragraph structure are intentionally
    preserved so Edge TTS can introduce natural pauses.
    """

    AUDIO_FILE.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    communicate = edge_tts.Communicate(
        text=text,
        voice=VOICE,
        rate=RATE,
        volume=VOLUME,
    )

    audio_data = bytearray()

    async for event in communicate.stream():
        if event.get("type") == "audio":
            audio_data.extend(event["data"])

    if not audio_data:
        raise RuntimeError(
            "Edge TTS returned no audio data."
        )

    AUDIO_FILE.write_bytes(audio_data)

    print(
        f"Voiceover generated: {AUDIO_FILE}"
    )


# ---------------------------------------------------------
# AUDIO DURATION
# ---------------------------------------------------------

def get_audio_duration() -> float:
    audio = MP3(str(AUDIO_FILE))

    duration = float(audio.info.length)

    if duration <= 0:
        raise RuntimeError(
            "Generated audio has invalid duration."
        )

    return duration


# ---------------------------------------------------------
# NATURAL TIMING ESTIMATION
# ---------------------------------------------------------

def word_weight(word: str) -> float:
    """
    Longer words receive slightly more timing weight.

    This is only a fallback timing model. The actual audio
    duration remains the source of truth for the video.
    """

    clean = re.sub(
        r"[^\w']",
        "",
        word,
    )

    if not clean:
        return 1.0

    length = len(clean)

    # Prevent extremely long words from receiving
    # disproportionately large timing.
    return min(
        2.2,
        max(
            1.0,
            length / 5.0,
        ),
    )


def punctuation_pause(word: str) -> float:
    """
    Small timing weight for punctuation.

    These values do NOT change the audio.
    They help subtitles and visual beats feel more natural.
    """

    if word.endswith((".", "!", "?")):
        return 0.35

    if word.endswith((",", ";", ":")):
        return 0.16

    return 0.0


def create_fallback_timings(
    text: str,
    duration: float,
):
    words = split_words(text)

    if not words:
        raise ValueError(
            "No words found in narration."
        )

    weights = []

    for word in words:
        weight = word_weight(word)

        weight += punctuation_pause(word)

        weights.append(weight)

    total_weight = sum(weights)

    if total_weight <= 0:
        raise RuntimeError(
            "Could not calculate word timing weights."
        )

    timings = []

    current = 0.0

    for index, (
        word,
        weight,
    ) in enumerate(
        zip(words, weights)
    ):
        portion = (
            weight / total_weight
        )

        if index == len(words) - 1:
            end = duration
        else:
            end = (
                current
                + duration * portion
            )

        timings.append(
            {
                "word": word,
                "start": round(
                    current,
                    4,
                ),
                "end": round(
                    end,
                    4,
                ),
            }
        )

        current = end

    # Force the final word to end exactly
    # at the real audio duration.
    timings[-1]["end"] = round(
        duration,
        4,
    )

    return timings


# ---------------------------------------------------------
# MAIN
# ---------------------------------------------------------

async def main():
    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            f"Missing narration file: {INPUT_FILE}"
        )

    raw_text = INPUT_FILE.read_text(
        encoding="utf-8"
    ).strip()

    if not raw_text:
        raise ValueError(
            "narration.txt is empty."
        )

    text = clean_narration(
        raw_text
    )

    if not text:
        raise ValueError(
            "Narration became empty after cleaning."
        )

    TIMINGS_FILE.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    # Generate actual narration.
    await generate_audio(text)

    # Read actual MP3 duration.
    duration = get_audio_duration()

    # Generate reusable timing data.
    timings = create_fallback_timings(
        text=text,
        duration=duration,
    )

    output = {
        "method": (
            "audio-duration-proportional"
        ),
        "voice": VOICE,
        "rate": RATE,
        "duration": round(
            duration,
            4,
        ),
        "word_count": len(timings),
        "words": timings,
    }

    TIMINGS_FILE.write_text(
        json.dumps(
            output,
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    print()
    print("=" * 60)
    print("VOICE GENERATION COMPLETED")
    print("=" * 60)
    print(
        f"Voice: {VOICE}"
    )
    print(
        f"Rate: {RATE}"
    )
    print(
        f"Audio duration: {duration:.2f}s"
    )
    print(
        f"Word timings: {len(timings)}"
    )
    print(
        f"Timing file: {TIMINGS_FILE}"
    )
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
