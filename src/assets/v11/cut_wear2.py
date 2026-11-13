# final costume pieces: enclosed background holes become see-through, hood openings are cut out so the face shows
from PIL import Image; import numpy as np; from scipy import ndimage
from panels import panels; from cut_wear import comps, FIX
USE = {  # piece index -> layer
 'mermaid': {0: 'tail', 1: 'chest', 2: 'clip'}, 'unicorn': {0: 'hood', 1: 'capefront'}, 'ming': {0: 'hat', 1: 'robe'},
 'wuxia': {0: 'hat', 1: 'robe', 2: 'held'}, 'cinderella': {0: 'dress', 1: 'tiara'}, 'snowwhite': {0: 'dress', 1: 'tiara'},
 'donut': {0: 'ring', 2: 'hat'}, 'hunter': {0: 'back', 1: 'hat', 2: 'robe', 3: 'held'}, 'jungle': {0: 'dress', 1: 'tiara', 2: 'held'},
 'army': {0: 'hat', 2: 'robe', 3: 'held'}, 'gentleman': {0: 'hat', 1: 'robe', 2: 'collar', 3: 'backcape'}, 'lady': {0: 'hat', 1: 'dress'},
 'pharaoh': {0: 'hood', 1: 'collar', 2: 'skirt'}, 'peterpan': {0: 'hat', 1: 'robe'}, 'dino': {0: 'hood', 1: 'robe'}, 'octocos': {0: 'hood', 1: 'skirt'}}
HOODS = {'unicorn', 'dino', 'octocos'}
info = {}
for p in panels():
    nm = p['name']; im = Image.open(p['file'] + '.png').convert('RGB'); div = FIX.get(nm, p['div']); x0, y0, x1, y1 = p['box']
    box = (x0 + 3, y0 + 3, div - 4, y1 - 3); pcs = comps(im, box)
    a_all = np.array(im.crop(box)).astype(int); bg = np.median(np.concatenate([a_all[:3].reshape(-1, 3), a_all[-3:].reshape(-1, 3)]), 0)
    # whole set picture for the shop (all pieces, background removed)
    m_all = np.sqrt(((a_all - bg) ** 2).sum(2)) > 30; lab, n = ndimage.label(m_all); sz = ndimage.sum(m_all, lab, range(1, n + 1))
    keep = np.isin(lab, [i + 1 for i, s in enumerate(sz) if s >= 150]); keep = ndimage.binary_fill_holes(keep)
    near = np.sqrt(((a_all - bg) ** 2).sum(2)) < 18; holes = keep & near & ~ndimage.binary_erosion(keep, iterations=0 + 1) if False else None
    setim = Image.fromarray(np.dstack([a_all, keep * 255]).astype(np.uint8), 'RGBA'); setim = setim.crop(setim.getbbox()); setim.save(f'wear/final-set-{nm}.png')
    info[nm] = {}
    for j, layer in USE[nm].items():
        (px, py), piece, s = pcs[j]; a = np.array(piece).astype(int); al = a[..., 3] > 0; rgb = a[..., :3]
        # enclosed patches of background colour -> transparent (hat straps, helmet, nemes)
        if nm in ('wuxia', 'army', 'pharaoh'):
            bgl = al & (np.sqrt(((rgb - bg) ** 2).sum(2)) < 22); lab2, n2 = ndimage.label(bgl)
            for i in range(1, n2 + 1):
                reg = lab2 == i
                if reg.sum() > 60: al &= ~reg
        hole = None
        if nm in HOODS:            # the face opening: flood from the lower middle over the inner colour
            h, w = al.shape; fy, fx = {'unicorn': (0.64, 0.5), 'dino': (0.72, 0.45), 'octocos': (0.64, 0.5)}[nm]; sy, sx = int(h * fy), int(w * fx)
            lum = rgb.mean(2); free = al & (lum > 95)               # the dark outline is the wall of the opening
            bx = {'unicorn': (0.17, 0.40, 0.85, 0.86), 'dino': (0, 0, 1, 1), 'octocos': (0.16, 0.30, 0.88, 0.80)}[nm]
            win = np.zeros_like(free); win[int(h * bx[1]):int(h * bx[3]), int(w * bx[0]):int(w * bx[2])] = True
            if nm == 'octocos':          # an arch: ellipse top, flat bottom
                yy, xx = np.mgrid[0:h, 0:w]; win = ((((xx / w - 0.515) / 0.35) ** 2 + ((yy / h - 0.62) / 0.29) ** 2) < 1) & (yy / h < 0.775)
            free &= win
            lab3, _ = ndimage.label(free); reg = lab3 == lab3[sy, sx]
            reg = ndimage.binary_fill_holes(ndimage.binary_dilation(reg, iterations=1) & al & (lum > 60) & win)
            al &= ~reg; hole = reg
        if nm == 'pharaoh':        # the nemes opening was background: it is already see-through
            pass
        out = Image.fromarray(np.dstack([rgb, al * 255]).astype(np.uint8), 'RGBA')
        # opening box (where the face goes) for hoods, measured from the see-through area inside the piece
        filled = ndimage.binary_fill_holes(al); op = filled & ~al
        lab4, n4 = ndimage.label(op); ob = None
        if n4:
            sz4 = ndimage.sum(op, lab4, range(1, n4 + 1)); big = int(np.argmax(sz4)) + 1; ys, xs = np.where(lab4 == big)
            ob = [round(float(xs.min()) / out.width, 3), round(float(ys.min()) / out.height, 3), round(float(xs.max()) / out.width, 3), round(float(ys.max()) / out.height, 3)]
        out.save(f'wear/final-{nm}-{j}.png'); info[nm][j] = {'layer': layer, 'open': ob if layer in ('hood', 'hat') else None, 'w': out.width, 'h': out.height}
import json; json.dump(info, open('wear_info.json', 'w'), indent=0)
for k, v in info.items(): print(k, {j: (d['layer'], d['open']) for j, d in v.items()})
