import asyncio
import json
import re
from pathlib import Path

import edge_tts


ROOT = Path(__file__).resolve().parent.parent

INPUT_FILE = ROOT / "narration.txt"
AUDIO_FILE = ROOT / "public" / "audio" / "narration.mp3"
TIMINGS_FILE = ROOT / "generated" / "word_timings.json"

VOICE = "en-US-ChristopherNeural"
RATE = "-5%"
VOLUME = "+0%"


def split_words(text: str):
    return re.findall(r"\S+", text)


async def generate_audio():
    if not INPUT_FILE.exists():
        raise FileNotFoundError("Missing narration.txt")

    text = INPUT_FILE.read_text(encoding="utf-8").strip()

    if not text:
        raise ValueError("narration.txt is empty.")

    AUDIO_FILE.parent.mkdir(parents=True, exist_ok=True)
    TIMINGS_FILE.parent.mkdir(parents=True, exist_ok=True)

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
        raise RuntimeError("Edge TTS returned no audio.")

    AUDIO_FILE.write_bytes(audio_data)

    print(f"Voiceover generated: {AUDIO_FILE}")


def get_audio_duration():
    """
    Read MP3 duration without requiring ffmpeg.
    Uses mutagen, installed by the workflow.
    """
    from mutagen.mp3 import MP3

    audio = MP3(str(AUDIO_FILE))
    return float(audio.info.length)


def create_fallback_timings(text: str, duration: float):
    """
    Creates stable proportional word timings.

    This is intentionally used only when Edge TTS does not
    expose WordBoundary events.
    """

    words = split_words(text)

    if not words:
        raise ValueError("No words found in narration.")

    # Give slightly more time to longer words.
    weights = [
        max(1.0, len(re.sub(r"\W", "", word)))
        for word in words
    ]

    total_weight = sum(weights)

    timings = []
    current = 0.0

    for index, (word, weight) in enumerate(zip(words, weights)):
        portion = weight / total_weight

        if index == len(words) - 1:
            end = duration
        else:
            end = current + duration * portion

        timings.append(
            {
                "word": word,
                "start": round(current, 4),
                "end": round(end, 4),
            }
        )

        current = end

    return timings


async def generate_voice():
    text = INPUT_FILE.read_text(encoding="utf-8").strip()

    await generate_audio()

    duration = get_audio_duration()

    if duration <= 0:
        raise RuntimeError("Generated audio has invalid duration.")

    timings = create_fallback_timings(
        text=text,
        duration=duration,
    )

    TIMINGS_FILE.write_text(
        json.dumps(
            {
                "method": "audio-duration-proportional",
                "duration": round(duration, 4),
                "word_count": len(timings),
                "words": timings,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    print(f"Audio duration: {duration:.2f}s")
    print(f"Word timings generated: {len(timings)}")


if __name__ == "__main__":
    asyncio.run(generate_voice())
