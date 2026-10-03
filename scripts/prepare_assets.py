from __future__ import annotations
import json
import os
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from asset_registry import make_record
from utils import *
PLAN = GENERATED_DIR / "visual_plan.json"
STORY = GENERATED_DIR / "story.json"
OUT = GENERATED_DIR / "assets.json"

def esc(x):
    return str(x).replace('&','&amp;').replace('<','&lt;').replace('>','&gt;').replace('"','&quot;')

def svg(path, title, body, watermark):
    path.parent.mkdir(parents=True, exist_ok=True)
    wm = f'<text x="960" y="1000" text-anchor="middle" font-family="Arial" font-size="20" fill="#6f6878">{esc(watermark)}</text>' if watermark else ''
    path.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><rect width="1920" height="1080" fill="#070707"/><rect x="70" y="70" width="1780" height="940" rx="30" fill="#101014" stroke="#34303d"/><text x="120" y="160" font-family="Arial" font-size="30" fill="#8d8797" letter-spacing="5">{esc(title.upper())}</text>{body}{wm}</svg>', encoding='utf-8')

def geocode(name):
    if not name or os.getenv('ENABLE_GEOCODING','true').lower() != 'true': return None
    try:
        q = urllib.parse.urlencode({'q': name, 'format': 'jsonv2', 'limit': 1})
        req = urllib.request.Request('https://nominatim.openstreetmap.org/search?' + q, headers={'User-Agent':'first-step-learner-video/2.0'})
        data = json.loads(urllib.request.urlopen(req, timeout=8).read().decode())
        if data: return {'lat': float(data[0]['lat']), 'lon': float(data[0]['lon'])}
    except Exception as exc:
        print('[geocode]', name, exc)
    return None

def main():
    plan = read_json(PLAN); story = read_json(STORY); assets = []
    coord_map = {}
    for loc in story.get('locations', [])[:8]:
        c = geocode(loc)
        if c: coord_map[loc.lower()] = c
        time.sleep(1.05)
    map_path = PUBLIC_DIR / 'generated/maps/story-map.svg'
    grid = ''.join(f'<line x1="{160+i*160}" y1="180" x2="{160+i*160}" y2="900" stroke="#1d1a22"/>' for i in range(11))
    grid += ''.join(f'<line x1="120" y1="{210+i*85}" x2="1800" y2="{210+i*85}" stroke="#1d1a22"/>' for i in range(9))
    for loc,c in coord_map.items():
        x = 120 + ((c['lon'] + 180) / 360) * 1680; y = 180 + ((90-c['lat']) / 180) * 720
        grid += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="11" fill="#d8c7ff"/><text x="{x+20:.1f}" y="{y-16:.1f}" font-family="Arial" font-size="24" fill="#f2eef8">{esc(loc.title())}</text>'
    grid += '<text x="120" y="950" font-family="Arial" font-size="18" fill="#6f6878">SCHEMATIC GEOGRAPHIC VIEW — MARKERS SHOWN ONLY WHEN GEOCODED</text>'
    svg(map_path, 'Story Map', grid, '')
    assets.append(make_record('story-map', 'generated/maps/story-map.svg', 'map', label='Story map'))
    for beat in plan.get('beats', []):
        k = beat['type']; idx = beat['id'].split('-')[-1]; text = beat.get('text','')
        if k == 'newspaper':
            p = PUBLIC_DIR / f'generated/newspapers/newspaper_{idx}.svg'
            body = f'<rect x="140" y="210" width="1640" height="720" fill="#e5e0d8"/><text x="960" y="315" text-anchor="middle" font-family="Georgia" font-size="58" font-weight="700" fill="#1b1a18">{esc(text[:90])}</text><line x1="220" y1="350" x2="1700" y2="350" stroke="#1b1a18" stroke-width="3"/><text x="220" y="420" font-family="Georgia" font-size="28" fill="#34312e">{esc(text[:190])}</text>'
            svg(p, 'Newspaper Reconstruction', body, 'RECONSTRUCTED • NOT AN ORIGINAL NEWSPAPER')
            beat['asset'] = f'generated/newspapers/newspaper_{idx}.svg'
            assets.append(make_record(f'newspaper-{idx}', beat['asset'], 'newspaper', reconstructed=True, label='Reconstructed newspaper'))
        elif k == 'document':
            p = PUBLIC_DIR / f'generated/documents/document_{idx}.svg'
            body = f'<rect x="360" y="205" width="1200" height="735" fill="#efede8"/><text x="960" y="300" text-anchor="middle" font-family="Georgia" font-size="46" font-weight="700" fill="#252525">DOCUMENTARY RECORD</text><text x="500" y="410" font-family="Arial" font-size="28" fill="#222">{esc(text[:120])}</text><text x="500" y="500" font-family="Arial" font-size="26" fill="#222">{esc(text[120:260])}</text><rect x="1180" y="730" width="260" height="110" fill="none" stroke="#a95656" stroke-width="4"/><text x="1310" y="795" text-anchor="middle" font-family="Arial" font-size="22" fill="#a95656">RECONSTRUCTED</text>'
            svg(p, 'Document Reconstruction', body, 'RECONSTRUCTED • NOT AN ORIGINAL OFFICIAL DOCUMENT')
            beat['asset'] = f'generated/documents/document_{idx}.svg'
            assets.append(make_record(f'document-{idx}', beat['asset'], 'document', reconstructed=True, label='Reconstructed document'))
        elif k in {'photo','location'}:
            p = PUBLIC_DIR / f'generated/photos/photo_{idx}.svg'
            loc = beat.get('data',{}).get('location') or 'STORY LOCATION'
            body = f'<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#191723"/><stop offset="1" stop-color="#26212c"/></linearGradient></defs><rect x="160" y="220" width="1600" height="700" rx="20" fill="url(#g)"/><circle cx="1490" cy="390" r="210" fill="#7b5fa8" opacity=".16"/><path d="M180 770 L520 500 L800 700 L1090 420 L1710 820 L1710 900 L180 900 Z" fill="#15131a"/><text x="220" y="330" font-family="Arial" font-size="28" fill="#a9a0b7" letter-spacing="4">CINEMATIC RECONSTRUCTION</text><text x="220" y="425" font-family="Arial" font-size="72" font-weight="800" fill="#f3eff8">{esc(str(loc).upper()[:28])}</text>'
            svg(p, 'Visual Reconstruction', body, 'GENERATED VISUAL • NOT AN ARCHIVAL PHOTOGRAPH')
            beat['asset'] = f'generated/photos/photo_{idx}.svg'
            assets.append(make_record(f'photo-{idx}', beat['asset'], 'photo', reconstructed=True, label='Generated visual'))
        elif k == 'map':
            d = beat.setdefault('data',{}); a = d.get('from',''); b = d.get('to','')
            d['coordinates'] = {'from': geocode(a) if a else None, 'to': geocode(b) if b else None}
            time.sleep(1.05)
    write_json(OUT, {'version':1,'assets':assets}); write_json(PLAN, plan)
    print(f'Prepared {len(assets)} assets')

if __name__ == '__main__': main()
