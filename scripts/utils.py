from __future__ import annotations
import hashlib
import json
import re
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
GENERATED_DIR = ROOT / "generated"
PUBLIC_DIR = ROOT / "public"
WORD_RE = re.compile(r"[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*")

def ensure_dirs() -> None:
    GENERATED_DIR.mkdir(parents=True, exist_ok=True)
    (PUBLIC_DIR / "generated").mkdir(parents=True, exist_ok=True)

def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8").strip()

def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")

def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))

def normalize_token(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", str(value).lower())

def tokens(text: str) -> list[str]:
    return WORD_RE.findall(text)

def token_count(text: str) -> int:
    return len(tokens(text))

def split_sentences(text: str) -> list[str]:
    out: list[str] = []
    for paragraph in [p.strip() for p in re.split(r"\n\s*\n+", text) if p.strip()]:
        parts = re.split(r"(?<=[.!?])\s+(?=[A-Z0-9“\"'])", paragraph)
        out.extend(x.strip() for x in parts if x.strip())
    return out

def find_years(text: str) -> list[str]:
    return sorted(set(re.findall(r"\b(?:18|19|20)\d{2}\b", text)))

def find_dates(text: str) -> list[str]:
    patterns = [
        r"\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+(?:18|19|20)\d{2}\b",
        r"\b\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+(?:18|19|20)\d{2}\b",
    ]
    found: list[str] = []
    for pattern in patterns:
        found.extend(re.findall(pattern, text, flags=re.IGNORECASE))
    return sorted(set(found))

def extract_capitalized_places(text: str) -> list[str]:
    patterns = [
        r"\bLake\s+[A-Z][A-Za-z0-9-]+(?:\s+[A-Z][A-Za-z0-9-]+){0,2}\b",
        r"\b(?:Chicago|Los Angeles|New York|Houston|Dallas|Miami|Seattle|Boston|Denver|Phoenix|Atlanta|Detroit|Cameroon|Nigeria|Canada|United States|United Kingdom|Texas|California|Florida|Colorado|Arizona|Georgia|Michigan|Illinois|Massachusetts|Washington)\b",
        r"\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}\b",
    ]
    found: set[str] = set()
    for pattern in patterns:
        for match in re.findall(pattern, text):
            match = match.strip(" ,.;:()[]")
            if 2 <= len(match.split()) <= 4:
                found.add(match)
    blacklist = {"This Is", "There Was", "The Story", "The Answer", "What We", "The Event", "The Danger", "And No", "One Possibility", "Allah Knows Best"}
    return sorted(found - blacklist)

def classify_sentence(text: str) -> set[str]:
    t = text.lower()
    tags: set[str] = set()
    if re.search(r"\b(from|to|travel|travell?ed|journey|flew|drove|moved|arrived|left)\b", t): tags.add("route")
    if re.search(r"\b(january|february|march|april|may|june|july|august|september|october|november|december|(?:18|19|20)\d{2}|on the night|following morning|days later)\b", t): tags.add("timeline")
    if re.search(r"\b(newspaper|newspapers|headline|press|reported|reports|reporters|media)\b", t): tags.add("newspaper")
    if re.search(r"\b(document|report|record|records|file|case|court|police report|official statement)\b", t): tags.add("document")
    if re.search(r"\b(photo|photograph|image|picture|scene|looks like|surface)\b", t): tags.add("photo")
    if re.search(r"\b(evidence|investigator|investigators|scientists|discovered|found|study|studied|research|confirmed)\b", t): tags.add("evidence")
    if re.search(r"[“\"].+[”\"]", text): tags.add("quote")
    if re.search(r"\b\d[\d,]*(?:\.\d+)?\b|percent|%|more than|at least|thousands|millions|billion", t): tags.add("statistic")
    if re.search(r"\b(unknown|mystery|mysterious|unclear|uncertain|possible|possibility|proposed|question)\b", t): tags.add("unknown")
    if re.search(r"\b(lake|city|town|village|state|country|located|sits|nearby|valley|mountain)\b", t): tags.add("location")
    return tags
