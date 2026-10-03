from __future__ import annotations
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from utils import *

def req(path):
    if not Path(path).exists(): raise RuntimeError(f'Missing required file: {path}')

def main():
    required = [ROOT/'narration.txt', PUBLIC_DIR/'audio/narration.mp3', GENERATED_DIR/'story.json', GENERATED_DIR/'visual_plan.json', GENERATED_DIR/'subtitles.json', GENERATED_DIR/'assets.json', GENERATED_DIR/'sources.json']
    for p in required: req(p)
    story=read_json(GENERATED_DIR/'story.json'); plan=read_json(GENERATED_DIR/'visual_plan.json'); subs=read_json(GENERATED_DIR/'subtitles.json'); assets=read_json(GENERATED_DIR/'assets.json')
    if story.get('fps') != 30: raise RuntimeError('FPS must be 30')
    if story.get('narration') != 'audio/narration.mp3': raise RuntimeError('Narration path mismatch')
    beats=plan.get('beats',[])
    if not beats: raise RuntimeError('No visual beats generated')
    prev=-1
    for b in beats:
        s,e=float(b['start']),float(b['end'])
        if s<0 or e<=s: raise RuntimeError(f'Invalid beat timing {b["id"]}')
        if s<prev-.05: raise RuntimeError(f'Overlapping beats near {b["id"]}')
        prev=e
    for c in subs.get('cues',[]):
        if float(c['end'])<=float(c['start']): raise RuntimeError('Invalid subtitle timing')
    for a in assets.get('assets',[]):
        if a.get('status') == 'ready': req(PUBLIC_DIR/a['path'])
    print('PIPELINE VALIDATION PASSED')

if __name__=='__main__': main()
