
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GENERATED_DIR = ROOT / "generated"

STORY_FILE = GENERATED_DIR / "story.json"
TIMINGS_FILE = GENERATED_DIR / "word_timings.json"
OUTPUT_FILE = GENERATED_DIR / "visual_plan.json"


def load_json(path: Path):
    if not path.exists():
        raise FileNotFoundError(f"Missing required file: {path}")

    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON file: {path}") from exc


def load_word_timings():
    data = load_json(TIMINGS_FILE)

    words = data.get("words", [])

    if not isinstance(words, list) or not words:
        raise ValueError("No word timings found.")

    return words


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip())


def sentence_time_range(sentence_text: str, words, search_from: int):
    """
    Finds the approximate timing of a sentence inside the generated
    proportional word timings.
    """

    target_words = re.findall(r"\S+", sentence_text)

    if not target_words:
        return None, search_from

    target_count = len(target_words)

    if search_from >= len(words):
        return None, search_from

    end_index = min(
        search_from + target_count,
        len(words),
    )

    selected = words[search_from:end_index]

    if not selected:
        return None, search_from

    start = float(selected[0]["start"])
    end = float(selected[-1]["end"])

    return {
        "start": round(start, 4),
        "end": round(end, 4),
    }, end_index


def detect_visual_type(sentence: str, detected_topics: dict):
    text = sentence.lower()

    # Route / movement
    route_words = [
        "from ",
        " to ",
        "toward ",
        "towards ",
        "route",
        "travel",
        "traveled",
        "travelled",
        "moved",
        "arrived",
        "left ",
        "crossed",
        "journey",
    ]

    if any(word in text for word in route_words):
        return "map"

    # Location
    location_words = [
        "in ",
        "at ",
        "near ",
        "inside ",
        "outside ",
        "located",
        "location",
        "city",
        "town",
        "country",
        "state",
        "street",
        "road",
        "building",
    ]

    if any(word in text for word in location_words):
        return "location"

    # Dates / timeline
    if re.search(r"\b(?:18|19|20)\d{2}\b", sentence):
        return "timeline"

    timeline_words = [
        "years later",
        "months later",
        "days later",
        "the next day",
        "the following year",
        "later that year",
        "afterward",
        "afterwards",
    ]

    if any(word in text for word in timeline_words):
        return "timeline"

    # Newspaper
    newspaper_words = [
        "newspaper",
        "headline",
        "front page",
        "article",
        "reported",
        "press",
        "media",
    ]

    if any(word in text for word in newspaper_words):
        return "newspaper"

    # Documents / reports
    document_words = [
        "report",
        "record",
        "document",
        "file",
        "statement",
        "letter",
        "official record",
    ]

    if any(word in text for word in document_words):
        return "document"

    # Investigation / evidence
    evidence_words = [
        "evidence",
        "clue",
        "proof",
        "discovered",
        "found",
        "investigation",
        "investigators",
        "detective",
        "police",
        "authorities",
        "search",
    ]

    if any(word in text for word in evidence_words):
        return "evidence"

    # Quotes / statements
    quote_words = [
        "said",
        "stated",
        "according to",
        "told",
        "explained",
        "claimed",
    ]

    if any(word in text for word in quote_words):
        return "quote"

    # Statistics
    statistics_words = [
        "%",
        "percent",
        "million",
        "billion",
        "thousand",
        "statistics",
        "population",
        "number",
        "rate",
    ]

    if any(word in text for word in statistics_words):
        return "statistics"

    # Default cinematic narration
    return "cinematic"


def visual_description(visual_type: str, sentence: str):
    descriptions = {
        "map": "Cinematic map visualization with location markers and animated route.",
        "location": "Cinematic location card with geographic context.",
        "timeline": "Cinematic timeline highlighting the referenced date or event.",
        "newspaper": "Newspaper-style reconstruction clearly presented as a visual reconstruction.",
        "document": "Document/report reconstruction with source-status treatment.",
        "evidence": "Evidence-board visualization connecting relevant clues and facts.",
        "quote": "Clean cinematic quotation card highlighting the spoken statement.",
        "statistics": "Cinematic statistics visualization using counters or charts.",
        "cinematic": "Cinematic documentary visual using typography, shapes, atmosphere and controlled motion.",
    }

    return descriptions.get(
        visual_type,
        descriptions["cinematic"],
    )


def build_visual_plan(story, word_timings):
    sentences = story.get("sentences", [])
    detected_topics = story.get("detected_topics", {})

    if not sentences:
        raise ValueError("story.json contains no sentences.")

    beats = []
    word_index = 0

    for sentence_item in sentences:
        sentence_id = sentence_item.get("id")
        sentence = normalize_text(sentence_item.get("text", ""))

        if not sentence:
            continue

        timing, new_word_index = sentence_time_range(
            sentence,
            word_timings,
            word_index,
        )

        if timing is None:
            continue

        word_index = new_word_index

        visual_type = detect_visual_type(
            sentence,
            detected_topics,
        )

        beat = {
            "id": f"beat-{sentence_id}",
            "sentence_id": sentence_id,
            "text": sentence,
            "start": timing["start"],
            "end": timing["end"],
            "duration": round(
                timing["end"] - timing["start"],
                4,
            ),
            "visual_type": visual_type,
            "description": visual_description(
                visual_type,
                sentence,
            ),
            "reconstruction": visual_type
            in {
                "newspaper",
                "document",
                "evidence",
            },
            "source_status": (
                "reconstruction"
                if visual_type
                in {
                    "newspaper",
                    "document",
                    "evidence",
                }
                else "narration_context"
            ),
        }

        beats.append(beat)

    if not beats:
        raise RuntimeError(
            "Visual plan generation produced zero beats."
        )

    duration = max(
        float(beat["end"])
        for beat in beats
    )

    plan = {
        "version": 1,
        "duration": round(duration, 4),
        "beat_count": len(beats),
        "beats": beats,
        "rules": {
            "maps_for_routes": True,
            "location_cards": True,
            "timelines_for_dates": True,
            "newspaper_reconstructions": True,
            "document_reconstructions": True,
            "evidence_visuals": True,
            "quote_cards": True,
            "statistics_visuals": True,
            "cinematic_default": True,
            "generated_visuals_are_not_archival_evidence": True,
        },
    }

    return plan


def main():
    print("=" * 60)
    print("GENERATING VISUAL PLAN")
    print("=" * 60)

    story = load_json(STORY_FILE)
    word_timings = load_word_timings()

    plan = build_visual_plan(
        story=story,
        word_timings=word_timings,
    )

    GENERATED_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    OUTPUT_FILE.write_text(
        json.dumps(
            plan,
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    print(f"Visual beats generated: {plan['beat_count']}")
    print(f"Story duration: {plan['duration']:.2f}s")
    print(f"Visual plan written to: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()

Ab kya hoga

Is fix ke baad pipeline:

"narration.txt"
→ "generate_voice.py" ✅
→ "word_timings.json" ✅
→ "analyze_script.py" ✅
→ "generate_visual_plan.py" ✅
→ "generate_subtitles.py"
→ "prepare_assets.py"
→ "validate_pipeline.py"
→ Remotion render

Aur important: 341.71 seconds narration duration automatically visual plan mein carry hogi. Manual duration set karne ki zarurat nahi hogi.

Ab sirf ye file replace karke Action dobara run karo. Agar next error aata hai, uska पूरा log bhej dena—ab hum pipeline ko systematically end tak fix kar rahe hain, ek-ek missing dependency ko random तरीके से नहीं जोड़ेंगे.
