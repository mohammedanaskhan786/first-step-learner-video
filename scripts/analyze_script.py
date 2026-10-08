import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent

INPUT_FILE = ROOT / "narration.txt"
OUTPUT_FILE = ROOT / "generated" / "story.json"


def split_sentences(text: str):
    """
    Split narration into readable sentences.
    """
    sentences = re.split(
        r"(?<=[.!?])\s+",
        text.strip(),
    )

    return [
        sentence.strip()
        for sentence in sentences
        if sentence.strip()
    ]


def detect_years(text: str):
    return [
        int(year)
        for year in re.findall(
            r"\b(?:18|19|20)\d{2}\b",
            text,
        )
    ]


def detect_locations(text: str):
    """
    Basic location extraction.

    This intentionally does not invent locations.
    It only detects common location phrases.
    """
    patterns = [
        r"\bin ([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*)",
        r"\bat ([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*)",
        r"\bnear ([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*)",
        r"\bfrom ([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*)",
        r"\bto ([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*)",
    ]

    locations = set()

    for pattern in patterns:
        matches = re.findall(pattern, text)

        for match in matches:
            value = match.strip()

            if len(value) > 1:
                locations.add(value)

    return sorted(locations)


def detect_keywords(text: str):
    lower = text.lower()

    categories = {
        "map": [
            "from",
            "to",
            "route",
            "traveled",
            "travelled",
            "moved",
            "arrived",
            "left",
            "crossed",
        ],
        "document": [
            "report",
            "record",
            "document",
            "file",
            "statement",
            "letter",
        ],
        "newspaper": [
            "newspaper",
            "headline",
            "reported",
            "front page",
            "article",
        ],
        "evidence": [
            "evidence",
            "clue",
            "proof",
            "found",
            "discovered",
        ],
        "investigation": [
            "investigation",
            "investigators",
            "detective",
            "police",
            "authorities",
            "search",
        ],
        "quote": [
            "said",
            "stated",
            "according to",
            "quote",
        ],
        "statistics": [
            "%",
            "percent",
            "million",
            "billion",
            "thousand",
            "statistics",
            "number",
        ],
        "timeline": [
            "in 19",
            "in 20",
            "years later",
            "months later",
            "days later",
            "the next day",
            "the following year",
        ],
    }

    detected = {}

    for category, keywords in categories.items():
        matches = [
            keyword
            for keyword in keywords
            if keyword in lower
        ]

        if matches:
            detected[category] = matches

    return detected


def build_story(text: str):
    sentences = split_sentences(text)
    years = detect_years(text)
    locations = detect_locations(text)
    keywords = detect_keywords(text)

    story = {
        "version": 1,
        "title": sentences[0][:120] if sentences else "Untitled Story",

        "narration": {
            "source": "narration.txt",
            "sentence_count": len(sentences),
        },

        "sentences": [
            {
                "id": index,
                "text": sentence,
            }
            for index, sentence in enumerate(sentences)
        ],

        "entities": {
            "locations": locations,
            "years": sorted(set(years)),
        },

        "detected_topics": keywords,

        "editorial_status": {
            "confirmed_facts": [],
            "reported_claims": [],
            "uncertainties": [],
            "unanswered_questions": [],
        },

        "visual_requirements": {
            "maps": bool(
                "map" in keywords
            ),
            "timelines": bool(
                "timeline" in keywords
                or years
            ),
            "documents": bool(
                "document" in keywords
            ),
            "newspapers": bool(
                "newspaper" in keywords
            ),
            "evidence": bool(
                "evidence" in keywords
            ),
            "investigation": bool(
                "investigation" in keywords
            ),
            "quotes": bool(
                "quote" in keywords
            ),
            "statistics": bool(
                "statistics" in keywords
            ),
        },
    }

    return story


def main():
    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            f"Missing narration file: {INPUT_FILE}"
        )

    text = INPUT_FILE.read_text(
        encoding="utf-8"
    ).strip()

    if not text:
        raise ValueError(
            "narration.txt is empty."
        )

    story = build_story(text)

    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    OUTPUT_FILE.write_text(
        json.dumps(
            story,
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    print(
        f"Analyzed {len(story['sentences'])} sentences."
    )

    print(
        f"Detected locations: "
        f"{len(story['entities']['locations'])}"
    )

    print(
        f"Detected years: "
        f"{len(story['entities']['years'])}"
    )

    print(
        f"Story analysis written to: {OUTPUT_FILE}"
    )


if __name__ == "__main__":
    main()
