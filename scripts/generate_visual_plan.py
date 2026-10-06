import json, re, subprocess, sys
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent; GENERATED=ROOT/"generated"
STORY_FILE=GENERATED/"story.json"; TIMINGS_FILE=GENERATED/"word_timings.json"; OUTPUT_FILE=GENERATED/"visual_plan.json"

def load(path):
    if not path.exists(): raise FileNotFoundError(path)
    return json.loads(path.read_text(encoding="utf-8"))

def norm(text): return re.sub(r"\s+"," ",str(text or "")).strip()

def sentence_time_range(sentence, words, cursor):
    n=len(re.findall(r"\S+",sentence)); selected=words[cursor:cursor+n]
    if not selected: return None,cursor
    return {"start":float(selected[0]["start"]),"end":float(selected[-1]["end"])},cursor+n

def location_candidates(sentence):
    patterns=[r"\b(?:in|at|near|inside|outside|from|to|toward|towards)\s+([A-Z][A-Za-z0-9'’-]*(?:\s+[A-Z][A-Za-z0-9'’-]*){0,5})"]
    out=[]
    for p in patterns:
        out.extend(re.findall(p,sentence))
    return [norm(x).strip(" ,.;:") for x in out if len(norm(x))>1]

def detect_type(sentence, index, total):
    t=sentence.lower()
    # Route only when a destination/origin relation is explicit; avoids false maps like "from the surface".
    if re.search(r"\bfrom\s+[A-Z][A-Za-z0-9'’-]*(?:\s+[A-Z][A-Za-z0-9'’-]*){0,4}\s+(?:to|toward|towards)\s+[A-Z]", sentence) or any(x in t for x in ["route between","traveled from","travelled from","journey from","moved from","crossed into"]): return "map"
    if re.search(r"\b(?:18|19|20)\d{2}\b",sentence) or any(x in t for x in ["years later","months later","days later","the next day","the following year","later that year"]): return "timeline"
    if any(x in t for x in ["newspaper","headline","front page","article","press report"]): return "newspaper"
    if any(x in t for x in ["report","official record","document","file","statement","letter"]): return "document"
    if any(x in t for x in ["evidence","clue","proof","trace","remains","discovered","found"]): return "evidence"
    if any(x in t for x in ["investigation","investigators","detective","police","authorities","search"]): return "evidence"
    if any(x in t for x in ["according to","said","stated","told","explained","claimed"]): return "quote"
    if re.search(r"\b\d+(?:\.\d+)?\s*(?:%|percent|million|billion|thousand)\b",sentence,re.I): return "statistic"
    if location_candidates(sentence): return "location"
    if index==0: return "cold_open"
    if index==total-1: return "ending"
    # Controlled cinematic fallback; this is intentionally not a visual change every sentence.
    return "cinematic_text"

def extract_year(s):
    m=re.search(r"\b(?:17|18|19|20)\d{2}\b",s); return m.group(0) if m else ""

def build():
    story=load(STORY_FILE); timing=load(TIMINGS_FILE); words=timing.get("words",[])
    if not words: raise ValueError("No word timings")
    # Geocode as part of the same automatic build; cache keeps repeated stories cheap.
    geo_script=ROOT/"scripts"/"geocode_locations.py"
    subprocess.run([sys.executable,str(geo_script)],check=False)
    geocodes=load(GENERATED/"geocodes.json") if (GENERATED/"geocodes.json").exists() else {}
    beats=[]; cursor=0; sentences=story.get("sentences",[])
    for i,item in enumerate(sentences):
        sentence=norm(item.get("text","")); tr,cursor2=sentence_time_range(sentence,words,cursor)
        if not tr: continue
        cursor=cursor2; vtype=detect_type(sentence,i,len(sentences)); locs=location_candidates(sentence)
        year=extract_year(sentence)
        # Prefer sentence-local locations; otherwise use the first story location for location cards.
        loc=locs[0] if locs else (story.get("entities",{}).get("locations") or [""])[0]
        from_name=locs[0] if len(locs)>=1 else ""
        to_name=locs[1] if len(locs)>=2 else ""
        if vtype=="map" and (not from_name or not to_name):
            vtype="location" if loc else "cinematic_text"
        data={"location":loc,"date":year,"event":sentence,"quote":sentence,"sourceStatus":"narration_context","reconstruction":vtype in {"document","newspaper","evidence"}}
        if from_name: data["from"]=from_name
        if to_name: data["to"]=to_name
        if from_name and to_name: data["coordinates"]={"from":geocodes.get(from_name),"to":geocodes.get(to_name)}
        elif loc and geocodes.get(loc): data["coordinates"]={"location":geocodes.get(loc)}
        if vtype=="statistic":
            m=re.search(r"\b\d+(?:\.\d+)?\s*(?:%|percent|million|billion|thousand)?\b",sentence,re.I)
            data["value"]=m.group(0) if m else ""
            data["label"]=sentence
        beats.append({"id":f"beat-{i:04d}","sentence_id":item.get("id",i),"start":round(tr["start"],4),"end":round(tr["end"],4),"duration":round(tr["end"]-tr["start"],4),"visual_type":vtype,"description":vtype,"text":sentence,"data":data,"reconstruction":data["reconstruction"],"source_status":data["sourceStatus"]})
    duration=float(timing.get("duration",0))
    plan={"version":3,"fps":30,"duration":duration,"beats":beats,"rules":{"real_map_when_coordinates_exist":True,"maps_for_explicit_routes_only":True,"location_cards":True,"timeline_for_dates":True,"reconstruction_labels":True,"target_visual_beat_seconds":"8-18"}}
    OUTPUT_FILE.write_text(json.dumps(plan,ensure_ascii=False,indent=2),encoding="utf-8")
    print(f"Visual plan: {len(beats)} beats / {duration:.2f}s")
if __name__=="__main__": build()
