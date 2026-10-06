import json, time, urllib.parse, urllib.request
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
STORY_FILE=ROOT/"generated"/"story.json"
OUTPUT_FILE=ROOT/"generated"/"geocodes.json"
CACHE_FILE=ROOT/"generated"/"geocode_cache.json"
USER_AGENT="FirstStepLearnerDocumentary/1.0 (automated documentary build)"

# Small built-in fallbacks for common geographic names; API results are preferred.
FALLBACKS={
    "Cameroon":{"lat":7.3697,"lon":12.3547,"display_name":"Cameroon"},
    "United States":{"lat":39.8283,"lon":-98.5795,"display_name":"United States"},
    "USA":{"lat":39.8283,"lon":-98.5795,"display_name":"United States"},
    "New York":{"lat":40.7128,"lon":-74.0060,"display_name":"New York, United States"},
    "Los Angeles":{"lat":34.0522,"lon":-118.2437,"display_name":"Los Angeles, United States"},
    "Chicago":{"lat":41.8781,"lon":-87.6298,"display_name":"Chicago, United States"},
    "Washington":{"lat":38.9072,"lon":-77.0369,"display_name":"Washington, United States"},
}

def load(path,default):
    if not path.exists(): return default
    try: return json.loads(path.read_text(encoding="utf-8"))
    except Exception: return default

def query_nominatim(name):
    url="https://nominatim.openstreetmap.org/search?"+urllib.parse.urlencode({"q":name,"format":"jsonv2","limit":1})
    req=urllib.request.Request(url,headers={"User-Agent":USER_AGENT,"Accept-Language":"en"})
    with urllib.request.urlopen(req,timeout=12) as r:
        data=json.loads(r.read().decode("utf-8"))
    if not data: return None
    item=data[0]
    return {"lat":float(item["lat"]),"lon":float(item["lon"]),"display_name":item.get("display_name",name)}

def geocode_all(names):
    cache=load(CACHE_FILE,{})
    results={}
    changed=False
    for raw in names:
        name=str(raw).strip()
        if not name: continue
        if name in cache:
            results[name]=cache[name]; continue
        result=FALLBACKS.get(name)
        if result is None:
            try:
                result=query_nominatim(name)
            except Exception as exc:
                print(f"Geocode warning for {name!r}: {exc}")
                result=None
            time.sleep(1.05)
        if result:
            cache[name]=result; results[name]=result; changed=True
        else:
            results[name]=None
    CACHE_FILE.parent.mkdir(parents=True,exist_ok=True)
    if changed: CACHE_FILE.write_text(json.dumps(cache,ensure_ascii=False,indent=2),encoding="utf-8")
    OUTPUT_FILE.write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding="utf-8")
    return results

def main():
    story=load(STORY_FILE,{})
    names=story.get("entities",{}).get("locations",[])
    out=geocode_all(names)
    ok=sum(v is not None for v in out.values())
    print(f"Geocoded {ok}/{len(out)} locations")
if __name__=="__main__": main()
