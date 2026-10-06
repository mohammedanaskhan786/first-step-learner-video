import json, subprocess, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent; GENERATED=ROOT/"generated"; PUBLIC=ROOT/"public"
PLAN=GENERATED/"visual_plan.json"; OUT=GENERATED/"assets.json"
def load(p): return json.loads(p.read_text(encoding="utf-8"))
def main():
    plan=load(PLAN); (PUBLIC/"audio").mkdir(parents=True,exist_ok=True); (PUBLIC/"images/story").mkdir(parents=True,exist_ok=True); (PUBLIC/"documents/reports").mkdir(parents=True,exist_ok=True); (PUBLIC/"maps").mkdir(parents=True,exist_ok=True)
    subprocess.run([sys.executable,str(ROOT/"scripts"/"build_map_data.py")],check=False)
    types=sorted(set(b.get("visual_type","cinematic_text") for b in plan.get("beats",[])))
    assets={"version":2,"narration":{"path":"audio/narration.mp3","required":True},"music":{"path":"music/investigation.mp3","volume":0.075,"loop":True},"ambience":{"path":"audio/ambience/atmosphere.mp3","volume":0.035,"loop":True},"visual_assets":[{"type":t,"source":"generated","required":False} for t in types],"rules":{"missing_assets_use_generated_visuals":True,"no_manual_sfx_required":True,"reconstruction_visuals_are_labeled":True,"world_map":"maps/world.svg"}}
    OUT.write_text(json.dumps(assets,ensure_ascii=False,indent=2),encoding="utf-8")
    print(f"Assets prepared: {len(types)} visual types")
if __name__=="__main__": main()
