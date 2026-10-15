"""Generate a single mixed MP3 with speaker-specific Edge TTS voices.

Script format (optional labels):
  NARRATOR: The lake looked peaceful.
  SCIENTIST: The deep water contained dissolved carbon dioxide.
  LOCAL RESIDENT: We heard a strange rumbling sound.

Unlabelled text is spoken by the narrator. A speaker label applies to the
text on that line only; following unlabelled lines return to NARRATOR.
"""
from __future__ import annotations

import asyncio
import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import Any

import edge_tts
from mutagen.mp3 import MP3

ROOT = Path(__file__).resolve().parent.parent
INPUT_FILE = ROOT / "narration.txt"
AUDIO_FILE = ROOT / "public" / "audio" / "narration.mp3"
TIMINGS_FILE = ROOT / "generated" / "word_timings.json"

# These are creative voice choices, not claims about real people's voices.
VOICE_MAP = {
    "NARRATOR": "en-US-ChristopherNeural",
    "HOUDINI": "en-US-GuyNeural",
    "BESS": "en-US-AriaNeural",
    "DOCTOR": "en-US-RogerNeural",
    "WHITEHEAD": "en-US-EricNeural",
    "SCIENTIST": "en-US-JennyNeural",
    "LOCAL RESIDENT": "en-US-AnaNeural",
    "WITNESS": "en-US-JennyNeural",
}
DEFAULT_RATE = "-5%"
DEFAULT_VOLUME = "+0%"
TICKS_PER_SECOND = 10_000_000


def parse_script(text: str) -> list[dict[str, str]]:
    """Parse optional SPEAKER: labels while keeping plain narration compatible."""
    segments: list[dict[str, str]] = []
    label_pattern = re.compile(r"^\s*(?:\[([A-Z][A-Z _-]*)\]|([A-Z][A-Z _-]{1,24}):)\s*(.*)$")
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        match = label_pattern.match(line)
        speaker = "NARRATOR"
        spoken = line
        if match:
            candidate = (match.group(1) or match.group(2) or "").strip().upper()
            if candidate in VOICE_MAP:
                speaker = candidate
                spoken = match.group(3).strip()
        if not spoken:
            continue
        # Merge adjacent lines with the same voice into one TTS request. This keeps
        # natural paragraph flow and avoids dozens of tiny MP3 segments for plain narration.
        if segments and segments[-1]["speaker"] == speaker:
            segments[-1]["text"] += " " + spoken
        else:
            segments.append({"speaker": speaker, "text": spoken})
    if not segments:
        raise ValueError("narration.txt is empty or contains no spoken text.")
    return segments


def audio_duration(path: Path) -> float:
    duration = float(MP3(str(path)).info.length)
    if duration <= 0:
        raise RuntimeError(f"Invalid MP3 duration: {path}")
    return duration


def fallback_word_timings(text: str, duration: float, speaker: str, offset: float) -> list[dict[str, Any]]:
    words = re.findall(r"\S+", text)
    weights = [max(1, len(re.sub(r"\W", "", w))) for w in words]
    total = sum(weights) or 1
    cursor = offset
    result = []
    for i, (word, weight) in enumerate(zip(words, weights)):
        end = offset + duration if i == len(words) - 1 else cursor + duration * weight / total
        result.append({"word": word, "start": round(cursor, 4), "end": round(end, 4), "speaker": speaker})
        cursor = end
    return result


async def synthesize_segment(segment: dict[str, str], output: Path) -> tuple[float, list[dict[str, Any]], str]:
    speaker = segment["speaker"]
    text = segment["text"]
    voice = VOICE_MAP.get(speaker, VOICE_MAP["NARRATOR"])
    communicate = edge_tts.Communicate(text=text, voice=voice, rate=DEFAULT_RATE, volume=DEFAULT_VOLUME)
    audio = bytearray()
    boundaries: list[dict[str, Any]] = []
    async for event in communicate.stream():
        event_type = str(event.get("type", "")).lower()
        if event_type == "audio":
            audio.extend(event.get("data", b""))
        elif event_type in {"wordboundary", "word_boundary"}:
            token = str(event.get("text", "")).strip()
            if token:
                start = float(event.get("offset", 0)) / TICKS_PER_SECOND
                duration = float(event.get("duration", 0)) / TICKS_PER_SECOND
                boundaries.append({"word": token, "start": max(0.0, start), "end": max(start, start + duration), "speaker": speaker})
    if not audio:
        raise RuntimeError(f"Edge TTS returned no audio for speaker {speaker}.")
    output.write_bytes(audio)
    duration = audio_duration(output)
    if boundaries:
        # Clamp metadata to the measured segment duration and keep valid intervals.
        words = []
        for item in boundaries:
            start = min(duration, item["start"])
            end = min(duration, max(start + 0.02, item["end"]))
            words.append({"word": item["word"], "start": round(start, 4), "end": round(end, 4), "speaker": speaker})
        return duration, words, "edge-tts-word-boundary"
    return duration, fallback_word_timings(text, duration, speaker, 0.0), "audio-duration-proportional-fallback"


async def main() -> None:
    if not INPUT_FILE.exists():
        raise FileNotFoundError("Missing narration.txt")
    text = INPUT_FILE.read_text(encoding="utf-8").strip()
    segments = parse_script(text)
    AUDIO_FILE.parent.mkdir(parents=True, exist_ok=True)
    TIMINGS_FILE.parent.mkdir(parents=True, exist_ok=True)
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise RuntimeError("ffmpeg is required to combine speaker clips. Install ffmpeg and rerun.")

    all_words: list[dict[str, Any]] = []
    speaker_counts: dict[str, int] = {}
    timing_methods: set[str] = set()
    with tempfile.TemporaryDirectory(prefix="fsl_voice_") as temp_dir:
        temp = Path(temp_dir)
        concat_list = temp / "concat.txt"
        durations: list[float] = []
        segment_paths: list[Path] = []
        for index, segment in enumerate(segments):
            segment_path = temp / f"segment_{index:04d}.mp3"
            duration, local_words, method = await synthesize_segment(segment, segment_path)
            offset = sum(durations)
            durations.append(duration)
            segment_paths.append(segment_path)
            timing_methods.add(method)
            speaker_counts[segment["speaker"]] = speaker_counts.get(segment["speaker"], 0) + 1
            for word in local_words:
                start = min(duration, float(word["start"])) + offset
                end = min(duration, float(word["end"])) + offset
                if end <= start:
                    end = start + 0.02
                all_words.append({"word": word["word"], "start": round(start, 4), "end": round(end, 4), "speaker": segment["speaker"]})
        concat_list.write_text("".join(f"file '{p.as_posix()}'\n" for p in segment_paths), encoding="utf-8")
        cmd = [ffmpeg, "-y", "-hide_banner", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(concat_list), "-vn", "-c:a", "libmp3lame", "-q:a", "3", str(AUDIO_FILE)]
        subprocess.run(cmd, check=True)

    # Sort boundaries and enforce monotonic, non-overlapping intervals.
    all_words.sort(key=lambda item: (item["start"], item["end"]))
    previous_end = 0.0
    for item in all_words:
        item["start"] = max(previous_end, float(item["start"]))
        item["end"] = max(item["start"] + 0.02, float(item["end"]))
        previous_end = item["end"]
    duration = audio_duration(AUDIO_FILE)
    TIMINGS_FILE.write_text(json.dumps({
        "method": "+".join(sorted(timing_methods)),
        "duration": round(duration, 4),
        "word_count": len(all_words),
        "speakers": speaker_counts,
        "words": all_words,
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Final mixed voice track: {AUDIO_FILE}")
    print(f"Measured duration: {duration:.2f}s")
    print(f"Word timings: {len(all_words)}; timing method(s): {', '.join(sorted(timing_methods))}")
    print("Speaker segments: " + ", ".join(f"{k}={v}" for k, v in speaker_counts.items()))


if __name__ == "__main__":
    asyncio.run(main())
