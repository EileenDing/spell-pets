# Grass patches that cover a lot's fence, gate and sign once its pet has a house (lot-<kind>.png + lotrects.json).
import numpy as np, json, re, os
from PIL import Image, ImageFilter
here = os.path.dirname(os.path.abspath(__file__))
src = np.array(Image.open(os.path.join(here, '..', 'town_clean.png')).convert('RGB'))
town_js = open(os.path.join(here, '..', '..', 'town.js')).read()
LOTS = {m[0]: dict(lx=int(m[1]), ly=int(m[2]), x0=int(m[3]), x1=int(m[4])) for m in re.findall(r"(\w+): \{ lx: (\d+), ly: (\d+), x0: (\d+), x1: (\d+)", town_js)}
rects = {}; os.makedirs(os.path.join(here, 'lots'), exist_ok=True)
for k, L in LOTS.items():
    x0, x1, ly = L['x0'], L['x1'], L['ly']; top = ly - 168
    R = [x0 - 10, top, x1 + 10, ly + 28]; w, h = R[2] - R[0], R[3] - R[1]
    S = src[ly - 118:ly - 66, x0 + 22:x1 - 22]                       # clean grass inside the fence
    tile = np.concatenate([S, S[::-1], S, S[::-1]], 0)[:h]
    patch = np.array(Image.fromarray(tile).resize((w, h), Image.LANCZOS))
    a = Image.new('L', (w, h), 0); a.paste(255, (7, 7, w - 7, h - 7)); a = a.filter(ImageFilter.GaussianBlur(4))
    Image.fromarray(np.dstack([patch, np.array(a)])).save(os.path.join(here, 'lots', f'lot-{k}.png'))
    rects[k] = R
json.dump(rects, open(os.path.join(here, 'lotrects.json'), 'w')); print(rects)
# preview
prev = Image.fromarray(src).convert('RGBA')
for k, R in rects.items():
    p = Image.open(os.path.join(here, 'lots', f'lot-{k}.png')); prev.alpha_composite(p, (R[0], R[1]))
prev.convert('RGB').save(os.path.join(here, 'nofence_preview.png'))
