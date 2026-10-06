import json
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
GENERATED=ROOT/"generated"
OUT=GENERATED/"map_data.json"

def main():
    geo=GENERATED/"geocodes.json"
    data=json.loads(geo.read_text(encoding="utf-8")) if geo.exists() else {}
    out={"version":1,"projection":"equirectangular","locations":data,"map_asset":"maps/world.svg"}
    OUT.write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding="utf-8")
    print(f"Map data written: {OUT}")
if __name__=="__main__": main()
