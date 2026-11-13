# scale the new pets to the game's pet size and find their eyes (anchors for clothes and blinking)
import json, numpy as np
from PIL import Image
from scipy import ndimage
KINDS = {'frog': ['mint', 'gold', 'pond', 'plum'], 'octopus': ['peach', 'lagoon', 'berry', 'ink'], 'capybara': ['honey', 'cocoa', 'cream', 'mist']}
anch = {}
for kind, sks in KINDS.items():
    base = Image.open(f'cut/pet-{kind}.png'); sc = min(185 / base.height, 188 / base.width)
    for nm in [kind] + [f'{kind}-{s}' for s in sks]:
        im = Image.open(f'cut/pet-{nm}.png'); im = im.resize((round(im.width * sc), round(im.height * sc)), Image.LANCZOS); im.save(f'cut/g-pet-{nm}.png')
    im = Image.open(f'cut/g-pet-{kind}.png'); a = np.array(im).astype(int); al = a[..., 3] > 128; lum = a[..., :3].mean(2)
    dark = al & (lum < 70); lab, k = ndimage.label(dark); objs = ndimage.find_objects(lab); sizes = ndimage.sum(dark, lab, range(1, k + 1))
    big = int(np.argmax(sizes)); cands = []
    for i, (s, o) in enumerate(zip(sizes, objs)):
        if i == big or s < 12: continue
        h = o[0].stop - o[0].start; w = o[1].stop - o[1].start
        if 0.5 < h / w < 2.2 and s > 0.5 * h * w: cands.append(((o[1].start + o[1].stop) / 2, (o[0].start + o[0].stop) / 2, s, w, h))
    best = None
    for i in range(len(cands)):
        for j in range(i + 1, len(cands)):
            A, B = cands[i], cands[j]; dy = abs(A[1] - B[1]); ds = abs(A[2] - B[2]) / max(A[2], B[2]); dx = abs(A[0] - B[0])
            if dy < 6 and ds < 0.45 and 15 < dx < 110:
                sc2 = dy + ds * 20 - min(A[2], B[2]) / 20
                if best is None or sc2 < best[0]: best = (sc2, A, B)
    r = {'w': im.width, 'h': im.height}
    if best:
        A, B = sorted([best[1], best[2]]); r.update(ex=round((A[0] + B[0]) / 2, 1), ey=round((A[1] + B[1]) / 2, 1), es=round(B[0] - A[0], 1), er=round((A[3] + B[3]) / 4, 1))
    anch[kind] = r; print(kind, r, len(cands))
json.dump(anch, open('anchors_new.json', 'w'))
