import asyncio
import json
import os
from pathlib import Path

import edge_tts


ROOT = Path(__file__).resolve().parent.parent

INPUT_FILE = ROOT / "narration.txt"
AUDIO_FILE = ROOT / "public" / "audio" / "narration.mp3"
TIMINGS_FILE = ROOT / "generated" / "word_timings.json"

VOICE = "en-US-ChristopherNeural"
RATE = "-5%"
VOLUME = "+0%"


async def generate_voice():
    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            f"Missing narration file: {INPUT_FILE}"
        )

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

    word_timings = []
    audio_chunks = []

    async for event in communicate.stream():
        event_type = event.get("type")

        if event_type == "audio":
            audio_chunks.append(event["data"])

        elif event_type == "WordBoundary":
            offset = event.get("offset", 0)
            duration = event.get("duration", 0)
            word = event.get("text", "").strip()

            if not word:
                continue

            # edge-tts uses 100-nanosecond units.
            start = offset / 10_000_000
            duration_seconds = duration / 10_000_000
            end = start + duration_seconds

            word_timings.append(
                {
                    "word": word,
                    "start": round(start, 4),
                    "end": round(end, 4),
                }
            )

    if not audio_chunks:
        raise RuntimeError(
            "Voice generation produced no audio data."
        )

    AUDIO_FILE.write_bytes(b"".join(audio_chunks))

    if not word_timings:
        raise RuntimeError(
            "Voiceover was generated, but edge-tts returned "
            "zero WordBoundary timings. Cannot continue safely."
        )

    TIMINGS_FILE.write_text(
        json.dumps(
            {
                "voice": VOICE,
                "rate": RATE,
                "word_count": len(word_timings),
                "words": word_timings,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    print(f"Voiceover generated: {AUDIO_FILE}")
    print(f"Word timings generated: {len(word_timings)}")


if __name__ == "__main__":
    asyncio.run(generate_voice())
