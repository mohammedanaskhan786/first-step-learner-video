from pathlib import Path
import shutil,json
ROOT=Path(__file__).resolve().parent.parent
G=ROOT/"generated"; P=ROOT/"public"; PG=P/"generated"; PG.mkdir(parents=True,exist_ok=True)
for n in ["story.json","visual_plan.json","subtitles.json","assets.json","map_data.json"]:
    s=G/n
    if s.exists(): shutil.copy2(s,PG/n); print("✓",n)
for p in [P/"audio"/"narration.mp3",P/"music"/"investigation.mp3",P/"audio"/"ambience"/"atmosphere.mp3"]:
    if not p.exists(): raise FileNotFoundError(f"Required file missing: {p}")
plan=json.loads((G/"visual_plan.json").read_text())
manifest={"version":3,"audio":{"narration_volume":1,"music_volume":.075,"ambience_volume":.035,"music_loop":True,"ambience_loop":True},"visuals":{"continuous_animation":True,"sentence_slides_disabled":True},"maps":{"automatic":True,"geocoding":True,"route_animation":True},"manual_sfx_required":False}
(G/"assets.json").write_text(json.dumps(manifest,indent=2),encoding="utf-8"); shutil.copy2(G/"assets.json",PG/"assets.json")
print("Assets prepared")
