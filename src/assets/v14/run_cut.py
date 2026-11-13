import os, json
from PIL import Image, ImageDraw
from pets_cut4 import page_figs as page_figures
from cells import SPECIAL, EVERYDAY, PAGES
os.makedirs('fit', exist_ok=True); report = {}
for p in range(32):
    kind = PAGES[p // 2]; names = SPECIAL if p % 2 == 0 else EVERYDAY
    figs = page_figures(p); report[p] = len(figs)
    if len(figs) != len(names): print('page', p, kind, len(figs), 'want', len(names)); continue
    for nm, f in zip(names, figs): f.save(f'fit/{kind}-{nm}.png')
    # contact sheet with names
    H = 130; W = sum(int(f.width * H / f.height) + 8 for f in figs[:14]); rows = [figs[:14], figs[14:]]
    sh = Image.new('RGB', (max(1, W) + 200, (H + 16) * 2), (90, 160, 210)); dr = ImageDraw.Draw(sh)
    for r, row in enumerate(rows):
        x = 0
        for i, f in enumerate(row):
            t = f.resize((int(f.width * H / f.height), H)); sh.paste(t, (x, r * (H + 16)), t); dr.text((x, r * (H + 16) + H + 2), names[r * 14 + i][:10], fill=(255, 255, 0)); x += t.width + 8
    sh.save(f'fit/_sheet-{p:02d}.png')
json.dump(report, open('cut_report.json', 'w'))
