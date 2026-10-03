from __future__ import annotations
import asyncio
import json
import os
from pathlib import Path
import edge_tts

ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "narration.txt"
OUTPUT = ROOT / "public/audio/narration.mp3"
WORDS = ROOT / "generated/word_timings.json"

async def main():
    text = INPUT.read_text(encoding="utf-8").strip() if INPUT.exists() else ""
    if not text:
        raise ValueError("narration.txt is missing or empty")
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    WORDS.parent.mkdir(parents=True, exist_ok=True)
    if OUTPUT.exists():
        OUTPUT.unlink()
    voice = os.getenv("TTS_VOICE", "en-US-ChristopherNeural")
    rate = os.getenv("TTS_RATE", "-5%")
    volume = os.getenv("TTS_VOLUME", "+0%")
    pitch = os.getenv("TTS_PITCH", "+0Hz")
    communicator = edge_tts.Communicate(text=text, voice=voice, rate=rate, volume=volume, pitch=pitch)
    timings = []
    with OUTPUT.open("wb") as audio:
        async for message in communicator.stream():
            if message["type"] == "audio":
                audio.write(message["data"])
            elif message["type"] == "WordBoundary":
                data = message.get("data", {})
                start = float(data.get("offset", 0)) / 10_000_000
                duration = float(data.get("duration", 0)) / 10_000_000
                spoken = str(data.get("text", "")).strip()
                if spoken:
                    timings.append({"text": spoken, "start": round(start, 4), "end": round(start + duration, 4)})
    if not OUTPUT.exists() or OUTPUT.stat().st_size < 1024:
        raise RuntimeError("Voice generation produced no usable audio")
    WORDS.write_text(json.dumps({"version": 1, "voice": voice, "rate": rate, "wordTimings": timings}, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Voiceover generated: {len(timings)} word timings")

if __name__ == "__main__":
    asyncio.run(main())
