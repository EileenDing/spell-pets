# Legendary skins, 4 per pet (Nov 17 2026) + the four ninja brothers for the turtle
import json, re, base64, io, sys
from PIL import Image; import numpy as np; from scipy import ndimage
KINDS = ['dragon','dinosaur','dog','cat','turtle','rabbit','pig','rat','monkey','trex','snake','parrot','owl','capybara','frog','octopus']
def fgmask(A):
    H, W = A.shape[:2]
    bg = np.median(np.concatenate([A[0], A[-1], A[:, 0], A[:, -1]]), axis=0)
    near = (np.abs(A - bg).sum(2) < 48) | (A.min(2) > 238)          # cream page and the white tiles behind some pictures
    lab, n = ndimage.label(near); border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    return ~np.isin(lab, list(border))
def cells(path, rows, cols):
    A = np.array(Image.open(path).convert('RGB')).astype(int); H, W = A.shape[:2]
    fg = fgmask(A)
    lab, n = ndimage.label(fg, structure=np.ones((3, 3)))
    idx = range(1, n + 1); sz = ndimage.sum(fg, lab, idx); cm = ndimage.center_of_mass(fg, lab, idx)
    big = [(i, cm[i]) for i in range(n) if sz[i] > 1500]
    # row centres: cluster big pieces' y
    ys = sorted(c[0] for _, c in big); groups = [[ys[0]]]
    for y in ys[1:]:
        (groups[-1].append(y) if y - groups[-1][-1] < H / rows * 0.45 else groups.append([y]))
    rc = [np.mean(g) for g in groups]
    if len(rc) != rows: print('rows found', len(rc), 'want', rows); 
    masks = {}
    for i in range(n):
        if sz[i] < 30: continue
        cy, cx = cm[i]; r = int(np.argmin([abs(cy - c) for c in rc])); c = min(cols - 1, int(cx / W * cols))
        masks.setdefault((r, c), np.zeros((H, W), bool)); masks[(r, c)] |= lab == i + 1
    out = {}
    for (r, c), m in masks.items():
        m = ndimage.binary_fill_holes(m) | m
        ys_, xs_ = np.where(m); y0, y1, x0, x1 = ys_.min(), ys_.max() + 1, xs_.min(), xs_.max() + 1
        rgba = np.dstack([A[y0:y1, x0:x1].astype(np.uint8), (m[y0:y1, x0:x1] * 255).astype(np.uint8)])
        out[(r, c)] = Image.fromarray(rgba, 'RGBA')
    return out
spr = ''.join(open('../../' + f).read() for f in ['sprdata.js', 'sprdata7.js', 'sprdata8.js', 'sprdata10.js'])
def base_size(k):
    m = re.search('"pet-' + k + '": "data:image/[a-z]+;base64,([^"]+)"', spr)
    return Image.open(io.BytesIO(base64.b64decode(m.group(1)))).size if m else (170, 185)
def fit(img, k):
    bw, bh = base_size(k); maxw = 250 if k == 'dragon' else 196
    h = round(bh * 1.06); w = round(img.width * h / img.height)
    if w > maxw: w = maxw; h = round(img.height * w / img.width)
    return img.resize((w, h), Image.LANCZOS)
res = {}
grid = cells('legends4_sheet.png', 16, 4)
for (r, c), img in sorted(grid.items()):
    k = KINDS[r]; key = f'{k}-{c + 1}'
    if key == 'turtle-1': continue                    # the ninja brothers come from their own sheet
    res['lg-' + key] = fit(img, k)
nin = cells('ninja_sheet.png', 1, 4)
for (r, c), img in nin.items(): res['lg-turtle-1' + 'abcd'[c]] = fit(img, 'turtle')
print(len(res), sorted(res)[:6])
missing = [f'lg-{k}-{c}' for k in KINDS for c in range(1, 5) if f'lg-{k}-{c}' not in res and not (k == 'turtle' and c == 1)]
print('missing', missing)
out = {}
for key, img in res.items():
    img.save(f'cut_{key}.png'); b = io.BytesIO(); img.save(b, 'WEBP', quality=92, method=6)
    out[key] = 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()
open('../../sprdata13.js', 'w').write('// Legendary skins: 4 choices per pet, plus the turtle\'s four ninja brothers (assets/v19)\nObject.assign(SPR_SRC, ' + json.dumps(out) + ');\n')
print(sum(len(v) for v in out.values()) // 1024, 'KB')
