from dataclasses import dataclass, asdict

@dataclass
class AssetRecord:
    id: str
    path: str
    kind: str
    status: str = "ready"
    origin: str = "pipeline"
    label: str | None = None
    source: str | None = None
    reconstructed: bool = False

def make_record(asset_id, path, kind, status="ready", origin="pipeline", label=None, source=None, reconstructed=False):
    return asdict(AssetRecord(asset_id, path, kind, status, origin, label, source, reconstructed))
