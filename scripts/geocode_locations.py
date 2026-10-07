from pathlib import Path
import json, time, urllib.parse, urllib.request
ROOT=Path(__file__).resolve().parent.parent
G=ROOT/"generated"
story=json.loads((G/"story.json").read_text(encoding="utf-8"))
out={}
for name in story.get("entities",{}).get("locations",[]):
    try:
        q=urllib.parse.urlencode({"q":name,"format":"json","limit":1})
        req=urllib.request.Request("https://nominatim.openstreetmap.org/search?"+q,
            headers={"User-Agent":"first-step-learner-documentary/1.0"})
        with urllib.request.urlopen(req,timeout=15) as r: data=json.loads(r.read().decode())
        out[name]=({"lat":float(data[0]["lat"]),"lon":float(data[0]["lon"])} if data else None)
        time.sleep(1)
    except Exception as e:
        print("Geocode failed:",name,e); out[name]=None
(G/"geocodes.json").write_text(json.dumps(out,indent=2),encoding="utf-8")
print(f"Geocoded {sum(v is not None for v in out.values())}/{len(out)} locations")
