from __future__ import annotations
import json
import subprocess
import sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; S=ROOT/'scripts'; G=ROOT/'generated'
def run(name): subprocess.run([sys.executable, str(S/name)], cwd=ROOT, check=True)
def main():
    G.mkdir(exist_ok=True)
    run('generate_voice.py')
    run('analyze_script.py')
    run('generate_visual_plan.py')
    run('generate_subtitles.py')
    run('prepare_assets.py')
    run('validate_pipeline.py')
    story=json.loads((G/'story.json').read_text()); plan=json.loads((G/'visual_plan.json').read_text()); subs=json.loads((G/'subtitles.json').read_text()); assets=json.loads((G/'assets.json').read_text()); sources=json.loads((G/'sources.json').read_text())
    final={'version':2,'title':story['title'],'subtitle':story['subtitle'],'fps':story['fps'],'narration':story['narration'],'music':story['music'],'ambience':story['ambience'],'visualBeats':plan['beats'],'subtitles':subs['cues'],'assets':assets['assets'],'sources':sources['items'],'locations':story.get('locations',[]),'dates':story.get('dates',[]),'years':story.get('years',[])}
    (G/'story.json').write_text(json.dumps(final,indent=2,ensure_ascii=False),encoding='utf-8')
    print('FINAL STORY DATA READY')
if __name__=='__main__': main()
