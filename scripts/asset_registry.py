from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
PUBLIC=ROOT/"public"

def asset_path(kind: str, name: str) -> str:
    clean=str(name).lstrip("/")
    return f"{kind.strip('/')}/{clean}"

def existing_asset(kind: str, name: str):
    rel=asset_path(kind,name); path=PUBLIC/rel
    return rel if path.exists() else None

def manifest_entry(kind: str, source: str, generated=False):
    return {"kind":kind,"source":source,"generated":generated}
