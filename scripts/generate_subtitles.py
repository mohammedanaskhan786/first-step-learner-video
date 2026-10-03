from __future__ import annotations
import re
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from utils import *
WORDS = GENERATED_DIR / "word_timings.json"
OUT = GENERATED_DIR / "subtitles.json"

def main():
    words = read_json(WORDS).get("wordTimings", [])
    if not words:
        raise ValueError("No word timings; generate voice first.")
    cues, current, chars = [], [], 0
    def flush():
        nonlocal current, chars
        if current:
            cues.append({"start": round(max(0, current[0]["start"] - .02), 3), "end": round(current[-1]["end"] + .05, 3), "text": " ".join(x["text"] for x in current)})
            current, chars = [], 0
    for word in words:
        text = word["text"]
        projected = chars + len(text) + (1 if current else 0)
        if current and (len(current) >= 8 or projected > 52):
            flush()
        current.append(word)
        chars += len(text) + (1 if len(current) > 1 else 0)
        if re.search(r"[.!?,:;]$", text) and len(current) >= 4:
            flush()
    flush()
    write_json(OUT, {"version": 1, "cues": cues})
    print(f"Generated {len(cues)} subtitle cues")

if __name__ == "__main__":
    main()
