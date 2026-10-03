from __future__ import annotations
import re
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from utils import *
STORY = GENERATED_DIR / "story.json"
WORDS = GENERATED_DIR / "word_timings.json"
OUT = GENERATED_DIR / "visual_plan.json"

def align(sentence, words, cursor):
    target = [normalize_token(x) for x in tokens(sentence)]
    idx, start, end, matched = cursor, None, None, 0
    while idx < len(words) and matched < len(target):
        if normalize_token(words[idx].get("text", "")) == target[matched]:
            if start is None: start = float(words[idx]["start"])
            end = float(words[idx]["end"])
            matched += 1
        idx += 1
        if idx - cursor > max(20, len(target) * 4): break
    if start is None:
        start = float(words[cursor]["start"]) if cursor < len(words) else 0.0
        end = float(words[min(len(words)-1, cursor + max(1, len(target)-1))]["end"]) if words else start + 1.0
        idx = min(len(words), cursor + max(1, len(target)))
    return start, end or start, idx

def route_pair(text):
    patterns = [
        r"\btravel(?:led|ed)?\s+from\s+(.+?)\s+to\s+(.+?)(?:[,.]|$)",
        r"\bfrom\s+(.+?)\s+to\s+(.+?)(?:[,.]|$)",
    ]
    for p in patterns:
        m = re.search(p, text, re.I)
        if m: return m.group(1).strip(" ,"), m.group(2).strip(" ,")
    return None

def kind(tags, index, total):
    if index == 0: return "cold_open"
    if index >= total - 2: return "ending"
    if "route" in tags: return "map"
    if "newspaper" in tags: return "newspaper"
    if "document" in tags: return "document"
    if "quote" in tags: return "quote"
    if "statistic" in tags: return "statistic"
    if "timeline" in tags: return "timeline"
    if "evidence" in tags: return "evidence"
    if "unknown" in tags: return "unknown"
    if "location" in tags: return "location"
    if "photo" in tags: return "photo"
    return "cinematic_text"

def main():
    story = read_json(STORY)
    words = read_json(WORDS).get("wordTimings", [])
    sections = story.get("sections", [])
    if not words: raise ValueError("No word timings.")
    beats, cursor = [], 0
    for i, section in enumerate(sections):
        text = section["text"]
        start, end, cursor = align(text, words, cursor)
        tags = set(section.get("tags", []))
        k = kind(tags, i, len(sections))
        data = {"text": text}
        pair = route_pair(text)
        if k == "map": data.update({"from": pair[0] if pair else "", "to": pair[1] if pair else ""})
        if k == "timeline": data.update({"date": (re.findall(r"\b(?:18|19|20)\d{2}\b", text) or [""])[0], "event": text})
        if k in {"newspaper", "document"}: data["headline"] = text[:100]
        if k == "quote": data["quote"] = text
        if k == "statistic": data.update({"value": (re.findall(r"\b\d[\d,]*(?:\.\d+)?%?", text) or [""])[0], "label": text})
        if k in {"evidence", "unknown"}: data["items"] = [text]
        if k == "location": data["location"] = next((x for x in story.get("locations", []) if x.lower() in text.lower()), "")
        beats.append({"id": f"beat-{i:04d}", "start": round(start, 3), "end": round(max(end, start + .5), 3), "type": k, "text": text, "data": data, "sourceClaimId": f"claim-{i:04d}"})
    for i in range(1, len(beats)):
        if beats[i]["start"] < beats[i-1]["end"]: beats[i-1]["end"] = beats[i]["start"]
        if beats[i]["end"] <= beats[i]["start"]: beats[i]["end"] = beats[i]["start"] + .5
    write_json(OUT, {"version": 1, "fps": 30, "beats": beats})
    print(f"Generated {len(beats)} visual beats")

if __name__ == "__main__": main()
