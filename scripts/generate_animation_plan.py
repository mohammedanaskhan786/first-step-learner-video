import json
import re
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
PLAN=ROOT/'generated'/'visual_plan.json'
OUT=ROOT/'generated'/'animation_plan.json'


def scene_kind(text: str, visual_type: str, index: int) -> str:
    low=text.lower()
    # The opening should feel like a documentary hook, not a generic info card.
    if index == 0:
        return 'cinematic'
    # Scientific/physical processes get actual animated environment scenes.
    if re.search(r'carbon dioxide|\bco2\b|gas|dissolved|under pressure|deep beneath|beneath the surface|underground|deep water', low):
        return 'water_gas'
    if re.search(r'volcanic crater|mountain lake|mountain|volcanic|crater|valley|mist|fog|cloud', low):
        return 'mountain'
    # Only treat genuine journeys as routes. Avoid false positives such as "from the surface".
    if re.search(r'from\s+[^.?!,]+\s+to\s+[^.?!,]+|toward(?:s)?\s+\w+|\btravel(?:ed|led)?\b|\bmoved\b|\barrived\b|\bleft\s+(?:the|for|from)\b|\bcrossed\b|\bjourney\b', low):
        return 'map_route'
    if visual_type == 'newspaper':
        return 'newspaper'
    if visual_type in ('evidence','document'):
        return 'evidence'
    if visual_type == 'timeline' or re.search(r'\b(?:18|19|20)\d{2}\b|years later|following morning|next day|following year|evening of', low):
        return 'timeline'
    return 'cinematic'


def main():
    plan=json.loads(PLAN.read_text(encoding='utf-8'))
    scenes=[]
    for i,b in enumerate(plan.get('beats',[])):
        text=str(b.get('text',''))
        kind=scene_kind(text,str(b.get('visual_type','')),i)
        data=b.get('data',{}) if isinstance(b.get('data'),dict) else {}
        scenes.append({'id':b['id'],'start':float(b['start']),'end':float(b['end']),'kind':kind,'title':kind.replace('_',' ').upper(),'text':text,'data':data,'actions':['camera_zoom','parallax','text_reveal']})
    OUT.write_text(json.dumps({'version':1,'duration':plan.get('duration',0),'scenes':scenes},ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'Animation plan generated: {len(scenes)} scenes')

if __name__=='__main__': main()
