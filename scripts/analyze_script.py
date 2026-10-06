import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INPUT_FILE = ROOT / "narration.txt"
OUTPUT_FILE = ROOT / "generated" / "story.json"

LOCATION_PATTERNS = [
    r"\b(?:in|at|near|inside|outside|around|from|to|toward|towards)\s+([A-Z][A-Za-z0-9'’-]*(?:\s+[A-Z][A-Za-z0-9'’-]*){0,5})",
    r"\b([A-Z][A-Za-z0-9'’-]*(?:\s+[A-Z][A-Za-z0-9'’-]*){0,4})\s+(?:County|State|River|Lake|Island|Mountain|Valley|City|Town|Village)\b",
]
STOP = {"The","This","That","These","Those","A","An","And","But","When","After","Before","Later","Then","It","In","At","From","To"}

def split_sentences(text: str):
    text = re.sub(r"\s+", " ", text.strip())
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if s.strip()]

def detect_years(text: str):
    return sorted(set(int(y) for y in re.findall(r"\b(?:17|18|19|20)\d{2}\b", text)))

def clean_location(value: str):
    value = re.sub(r"\s+", " ", value).strip(" ,.;:()[]{}\"'")
    words = value.split()
    while words and words[-1] in STOP: words.pop()
    return " ".join(words)

def detect_locations(text: str):
    locations=set()
    for pattern in LOCATION_PATTERNS:
        for match in re.findall(pattern, text):
            value=clean_location(match)
            if len(value) >= 2 and value not in STOP and len(value.split()) <= 6:
                locations.add(value)
    # Explicitly capture well-known geographic constructs with punctuation.
    for match in re.findall(r"\b(?:Lake|Mount|Cape|Fort|Port|River|Island)\s+[A-Z][A-Za-z0-9'’-]*(?:\s+[A-Z][A-Za-z0-9'’-]*){0,3}", text):
        locations.add(clean_location(match))
    return sorted(locations)

def detect_keywords(text: str):
    lower=text.lower()
    categories={
        "map":["from "," to ","route","travel","traveled","travelled","moved","arrived","left ","crossed","journey","headed"],
        "document":["report","record","document","file","statement","letter","official"],
        "newspaper":["newspaper","headline","front page","article","press","media"],
        "evidence":["evidence","clue","proof","found","discovered","trace","remains"],
        "investigation":["investigation","investigators","detective","police","authorities","search","examined"],
        "quote":["said","stated","according to","told","explained","claimed"],
        "statistics":["%","percent","million","billion","thousand","statistics","population","rate"],
        "timeline":["years later","months later","days later","the next day","the following year","later that year"],
    }
    return {k:[x for x in v if x in lower] for k,v in categories.items() if any(x in lower for x in v)}

def build_story(text):
    sentences=split_sentences(text); years=detect_years(text); locations=detect_locations(text); keywords=detect_keywords(text)
    return {
        "version":2,
        "title":sentences[0][:120] if sentences else "Untitled Story",
        "narration":{"source":"narration.txt","sentence_count":len(sentences)},
        "sentences":[{"id":i,"text":s} for i,s in enumerate(sentences)],
        "entities":{"locations":locations,"years":years},
        "detected_topics":keywords,
        "editorial_status":{"confirmed_facts":[],"reported_claims":[],"uncertainties":[],"unanswered_questions":[]},
        "visual_requirements":{
            "maps":bool("map" in keywords or locations),
            "timelines":bool("timeline" in keywords or years),
            "documents":bool("document" in keywords),"newspapers":bool("newspaper" in keywords),
            "evidence":bool("evidence" in keywords),"investigation":bool("investigation" in keywords),
            "quotes":bool("quote" in keywords),"statistics":bool("statistics" in keywords),
        },
    }

def main():
    if not INPUT_FILE.exists(): raise FileNotFoundError(INPUT_FILE)
    text=INPUT_FILE.read_text(encoding="utf-8").strip()
    if not text: raise ValueError("narration.txt is empty")
    story=build_story(text); OUTPUT_FILE.parent.mkdir(parents=True,exist_ok=True)
    OUTPUT_FILE.write_text(json.dumps(story,ensure_ascii=False,indent=2),encoding="utf-8")
    print(f"Analyzed {len(story['sentences'])} sentences; locations={len(story['entities']['locations'])}; years={len(story['entities']['years'])}")
if __name__=="__main__": main()
