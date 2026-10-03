from __future__ import annotations
import re
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from utils import *

INPUT = ROOT / "narration.txt"
OUTPUT = GENERATED_DIR / "story.json"
SOURCES_OUTPUT = GENERATED_DIR / "sources.json"

def main():
    ensure_dirs()
    if not INPUT.exists():
        raise FileNotFoundError("Missing narration.txt")
    text = read_text(INPUT)
    if not text:
        raise ValueError("narration.txt is missing or empty")
    sentences = split_sentences(text)
    sections = []
    for i, sentence in enumerate(sentences):
        sections.append({
            "id": f"sentence-{i:04d}",
            "index": i,
            "text": sentence,
            "wordCount": token_count(sentence),
            "tags": sorted(classify_sentence(sentence)),
        })
    locations = extract_capitalized_places(text)
    title = f"The Story of {locations[0]}" if locations else (" ".join(re.sub(r"[^\w\s]", "", sentences[0]).split()[:8]).title() if sentences else "Untitled Documentary")
    claims, source_items = [], []
    for s in sections:
        needs_source = bool(re.search(r"\b(according to|scientists|investigators|reported|records show|study|research|confirmed|official)\b", s["text"].lower()))
        cid = f"claim-{s['index']:04d}"
        claims.append({"id": cid, "text": s["text"], "sourceRequired": needs_source, "verificationStatus": "unverified_in_pipeline"})
        if needs_source:
            source_items.append({"claimId": cid, "source": "", "sourceType": "", "verified": False, "note": "Attach a lawful source before presenting this as independently verified fact."})
    write_json(OUTPUT, {
        "version": 1,
        "title": title,
        "subtitle": "Narration-driven documentary",
        "fps": 30,
        "narration": "audio/narration.mp3",
        "music": "music/investigation.mp3",
        "ambience": "audio/ambience/atmosphere.mp3",
        "entities": [],
        "locations": locations,
        "dates": find_dates(text),
        "years": find_years(text),
        "sections": sections,
        "claims": claims,
    })
    write_json(SOURCES_OUTPUT, {"version": 1, "status": "source-tracking-skeleton", "items": source_items})
    print(f"Analyzed {len(sections)} sentences.")

if __name__ == "__main__":
    main()
