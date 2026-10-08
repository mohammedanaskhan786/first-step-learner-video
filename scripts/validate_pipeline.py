import json
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
PUBLIC=ROOT/'public'; GENERATED=ROOT/'generated'
REQUIRED=[ROOT/'narration.txt',PUBLIC/'audio'/'narration.mp3',GENERATED/'word_timings.json',GENERATED/'story.json',GENERATED/'visual_plan.json',GENERATED/'subtitles.json',GENERATED/'assets.json',GENERATED/'animation_plan.json']

def check(p):
    if not p.exists(): raise FileNotFoundError(f'Required file is missing: {p}')
    if p.is_file() and p.stat().st_size==0: raise ValueError(f'Required file is empty: {p}')

def load(p): return json.loads(p.read_text(encoding='utf-8'))
def main():
    for p in REQUIRED: check(p)
    wt=load(GENERATED/'word_timings.json'); words=wt.get('words') or wt.get('wordTimings') or []
    if not words: raise ValueError('word_timings.json contains no words.')
    story=load(GENERATED/'story.json'); sentences=story.get('sentences',[])
    if not sentences: raise ValueError('story.json contains no sentences.')
    plan=load(GENERATED/'visual_plan.json'); beats=plan.get('beats',[]); duration=float(plan.get('duration',0))
    if not beats or duration<=0: raise ValueError('visual_plan.json is invalid.')
    subs=load(GENERATED/'subtitles.json').get('cues',[])
    if not subs: raise ValueError('subtitles.json contains no cues.')
    anim=load(GENERATED/'animation_plan.json').get('scenes',[])
    if not anim: raise ValueError('animation_plan.json contains no scenes.')
    runtime=PUBLIC/'generated'
    for n in ['story.json','visual_plan.json','subtitles.json','assets.json','animation_plan.json']:
        check(runtime/n)
    print('='*60); print('PIPELINE VALIDATION OK'); print(f'Words: {len(words)}'); print(f'Sentences: {len(sentences)}'); print(f'Visual beats: {len(beats)}'); print(f'Animation scenes: {len(anim)}'); print(f'Duration: {duration:.2f}s'); print(f'Subtitle cues: {len(subs)}'); print('='*60)
if __name__=='__main__': main()
