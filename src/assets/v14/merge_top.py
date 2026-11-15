# keep the old picture's bottom (the old cut already dropped the name tags) and take only the new rows on top
import json, numpy as np
from PIL import Image
from pets_cut4 import page_figs
from cells import SPECIAL, EVERYDAY, PAGES
ch = json.load(open('recut_top.json')); KEEP_NEW = {('pig', 'wizard')}      # old one was also cut at the bottom
figs = {}
def newfig(kind, nm):
    p = PAGES.index(kind) * 2 + (0 if nm in SPECIAL else 1)
    if p not in figs: figs[p] = page_figs(p, header=72)
    return figs[p][(SPECIAL if nm in SPECIAL else EVERYDAY).index(nm)]
out = []
for kind, nm, _, _ in ch:
    new = newfig(kind, nm); old = Image.open(f'fit/{kind}-{nm}.png')
    if (kind, nm) in KEEP_NEW: new.save(f'fit_h72/{kind}-{nm}.png'); out.append((kind, nm, 'new')); continue
    A = np.array(new).astype(float); B = np.array(old).astype(float); best = None
    for dy in range(0, A.shape[0] - B.shape[0] + 1):
        for dx in range(-12, 13):
            x0 = max(0, dx); bx0 = max(0, -dx); w = min(A.shape[1] - x0, B.shape[1] - bx0)
            if w < B.shape[1] * 0.8: continue
            hh = min(B.shape[0], A.shape[0] - dy); a = A[dy:dy + hh, x0:x0 + w]; b = B[:hh, bx0:bx0 + w]
            m = (b[..., 3] > 100); err = np.abs(a[..., :3] - b[..., :3])[m].mean() + 100 * np.abs((a[..., 3] > 100) ^ m)[:hh // 2].mean()
            if best is None or err < best[0]: best = (err, dy, dx)
    err, dy, dx = best
    cut = new.crop((0, 0, new.width, min(new.height, dy + old.height)))
    # columns: keep the new picture's full width only where the old one had pixels below the new rows
    cut = cut.crop(cut.getbbox()); cut.save(f'fit_h72/{kind}-{nm}.png'); out.append((kind, nm, dy, dx, round(err, 1), cut.size))
for o in out: print(o)
