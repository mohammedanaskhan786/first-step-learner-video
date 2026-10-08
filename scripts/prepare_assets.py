import json
import shutil
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
GENERATED_DIR=ROOT/'generated'
PUBLIC_DIR=ROOT/'public'
PLAN_FILE=GENERATED_DIR/'visual_plan.json'


def load_json(path):
    if not path.exists(): raise FileNotFoundError(f'Missing required file: {path}')
    return json.loads(path.read_text(encoding='utf-8'))


def ensure_directories():
    for d in [PUBLIC_DIR/'audio',PUBLIC_DIR/'images',PUBLIC_DIR/'documents',PUBLIC_DIR/'maps',PUBLIC_DIR/'generated']:
        d.mkdir(parents=True,exist_ok=True)


def main():
    print('='*60); print('PREPARING RUNTIME ASSETS'); print('='*60)
    plan=load_json(PLAN_FILE)
    ensure_directories()
    for name in ['story.json','visual_plan.json','subtitles.json','assets.json','sources.json','word_timings.json','animation_plan.json']:
        src=GENERATED_DIR/name
        if src.exists(): shutil.copy2(src,PUBLIC_DIR/'generated'/name)
    assets={
      'version':2,'generated':True,
      'narration':{'path':'audio/narration.mp3','required':True},
      'music':{'path':'music/investigation.mp3','required':True},
      'ambience':{'path':'audio/ambience/atmosphere.mp3','required':True},
      'visual_assets':sorted({b.get('visual_type','cinematic') for b in plan.get('beats',[])}),
      'rules':{'missing_assets_use_generated_visuals':True,'no_manual_sfx_required':True,'generated_visuals_are_reconstructions':True}
    }
    (GENERATED_DIR/'assets.json').write_text(json.dumps(assets,ensure_ascii=False,indent=2),encoding='utf-8')
    shutil.copy2(GENERATED_DIR/'assets.json',PUBLIC_DIR/'generated'/'assets.json')
    print(f"Runtime JSON copied to: {PUBLIC_DIR/'generated'}")

if __name__=='__main__': main()
