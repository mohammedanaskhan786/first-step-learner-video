from pathlib import Path
import json
ROOT=Path(__file__).resolve().parent.parent
G=ROOT/"generated"
plan=json.loads((G/"visual_plan.json").read_text(encoding="utf-8"))
geo=json.loads((G/"geocodes.json").read_text(encoding="utf-8")) if (G/"geocodes.json").exists() else {}
locations=[{"name":k,**v} for k,v in geo.items() if v]
routes=[]
for b in plan.get("beats",[]):
    d=b.get("data",{})
    if b.get("visual_type")=="route" and d.get("from") in geo and d.get("to") in geo and geo[d["from"]] and geo[d["to"]]:
        routes.append({"id":b["id"],"from":{"name":d["from"],**geo[d["from"]]},"to":{"name":d["to"],**geo[d["to"]]}})
(G/"map_data.json").write_text(json.dumps({"version":3,"locations":locations,"routes":routes},indent=2),encoding="utf-8")
print("Map data written:",G/"map_data.json")
