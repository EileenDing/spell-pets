# Legendary skins (one finished picture per pet), Nov 2026
import json, re, base64, io
from PIL import Image; import numpy as np; from scipy import ndimage
GRID = ['dragon','dinosaur','dog','cat', 'turtle','rabbit','pig','rat', 'monkey','trex','snake','parrot', 'owl','capybara','frog','octopus']
im = Image.open('legend_sheet.png').convert('RGB'); A = np.array(im).astype(int); H, W = A.shape[:2]
bg = np.median(np.concatenate([A[0], A[-1], A[:, 0], A[:, -1]]), axis=0)
near = np.abs(A - bg).sum(2) < 40
lab, n = ndimage.label(near); border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
fg = ~np.isin(lab, list(border))
flab, fn = ndimage.label(fg, structure=np.ones((3, 3)))
objs = ndimage.find_objects(flab); sizes = ndimage.sum(fg, flab, range(1, fn + 1)); cms = ndimage.center_of_mass(fg, flab, range(1, fn + 1))
spr = open('../../sprdata.js').read()
def base_h(k):
    m = re.search('"pet-' + k + '": "data:image/[a-z]+;base64,([^"]+)"', spr)
    return Image.open(io.BytesIO(base64.b64decode(m.group(1)))).size if m else None
out = {}; best = {}
masks = {k: np.zeros((H, W), bool) for k in GRID}
for i, s in enumerate(sizes):
    if s < 40: continue
    cy, cx = cms[i]; k = GRID[min(3, int(cy / H * 4)) * 4 + min(3, int(cx / W * 4))]
    masks[k] |= flab == i + 1
for k, m in masks.items():
    if not m.any(): continue
    m = ndimage.binary_fill_holes(m) | m
    rgba = np.dstack([A.astype(np.uint8), (m * 255).astype(np.uint8)])
    best[k] = (m.sum(), Image.fromarray(rgba, 'RGBA'))
for k, (s, img) in best.items():
    img = img.crop(img.getchannel('A').getbbox())
    bw, bh = base_h(k) or (170, 185)
    h = round(bh * 1.06); w = round(img.width * h / img.height)
    if w > 196: w = 196; h = round(img.height * w / img.width)
    img = img.resize((w, h), Image.LANCZOS); img.save(f'legend_{k}.png')
    b = io.BytesIO(); img.save(b, 'WEBP', lossless=True, method=6)
    out['pet-' + k + '-legend'] = 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()
    print(k, (bw, bh), img.size)
print(set(GRID) - set(best))
open('../../sprdata12.js', 'w').write('// Legendary skins: one finished picture per pet (assets/v18)\nObject.assign(SPR_SRC, ' + json.dumps(out) + ');\n')
