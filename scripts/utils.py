import re

def normalize_spaces(text: str) -> str:
    return re.sub(r"\s+", " ", str(text or "")).strip()

def clamp(value, low, high):
    return max(low, min(high, value))

def safe_float(value, default=None):
    try: return float(value)
    except (TypeError, ValueError): return default

def slugify(text: str) -> str:
    value=re.sub(r"[^a-z0-9]+","-",str(text).lower()).strip("-")
    return value or "item"
