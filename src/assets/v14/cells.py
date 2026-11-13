import numpy as np
from PIL import Image
from scipy import ndimage
SPECIAL = ['crown', 'sunglasses', 'wizard', 'party', 'wuxialight', 'moneybag', 'mermaid', 'unicorn', 'ming', 'wuxia', 'cinderella', 'snowwhite', 'donut', 'hunter', 'jungle', 'army', 'gentleman', 'lady', 'pharaoh', 'peterpan', 'dino', 'octocos']
EVERYDAY = ['wingcape', 'fernkerchief', 'rescuevest', 'yarnberet', 'shellmantle', 'bunnyhood', 'mudponcho', 'seedapron', 'vinesash', 'spikecape', 'scalecollar', 'feathercape', 'moonreadercap', 'citrusrobe', 'strawhat', 'bluecap', 'bowtie', 'roundglasses', 'redscarf', 'backpack', 'overalls', 'raincoat', 'orangehead', 'lotushat', 'checkscarf', 'swimring', 'crossbag']
PAGES = ['dragon', 'dinosaur', 'dog', 'cat', 'turtle', 'rabbit', 'pig', 'rat', 'monkey', 'trex', 'snake', 'parrot', 'owl', 'capybara', 'frog', 'octopus']
def runs(idx, gap=4):
    out = []
    for i in idx:
        if out and i - out[-1][1] <= gap: out[-1][1] = i
        else: out.append([i, i])
    return out
def longruns(m, axis, minlen):
    """per line: how many pixels sit in runs at least minlen long (axis=1: rows)"""
    m = ndimage.binary_closing(m, structure=np.ones((1, 5)) if axis == 1 else np.ones((5, 1)))
    if axis == 0: m = m.T
    out = np.zeros(m.shape[0], int)
    for i, row in enumerate(m):
        d = np.diff(np.concatenate([[0], row.astype(int), [0]])); st = np.where(d == 1)[0]; en = np.where(d == -1)[0]
        L = en - st; out[i] = L[L >= minlen].sum()
    return out
def find_cells(im):
    a = np.array(im.convert('RGB')).astype(int); H, W = a.shape[:2]
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    br = ((r + g + b) < 660) & (r - b > 30) & (r > 120)
    hr = longruns(br, 1, 150)
    ls = runs(np.where(hr > W * 0.45)[0], 12)
    cells = []
    for i in range(len(ls) - 1):
        y0, y1 = ls[i][1], ls[i + 1][0]
        if y1 - y0 < 120: continue
        band = br[y0 + 3:y1 - 3]; vc = longruns(band, 0, int((y1 - y0) * 0.6))
        xs = [(s + e) // 2 for s, e in runs(np.where(vc > 0)[0], 6)]
        for j in range(len(xs) - 1):
            x0, x1 = xs[j], xs[j + 1]
            if x1 - x0 < 120: continue
            cells.append((x0, y0, x1, y1))
    return cells
def cut_cell(im, box):
    x0, y0, x1, y1 = box; a = np.array(im.convert('RGB').crop((x0 + 6, y0 + 6, x1 - 6, y1 - 6))).astype(int)
    h, w = a.shape[:2]; bg = np.median(np.concatenate([a[:3].reshape(-1, 3), a[:, :3].reshape(-1, 3), a[:, -3:].reshape(-1, 3)]), 0)
    d = np.sqrt(((a - bg) ** 2).sum(2)); m = d > 36
    lab, n = ndimage.label(ndimage.binary_dilation(m, iterations=2))
    objs = ndimage.find_objects(lab)
    for i, o in enumerate(objs):                       # the name tag: a short, wide pill in the lower part
        hh = o[0].stop - o[0].start; ww = o[1].stop - o[1].start
        if hh < h * 0.24 and ww > hh * 2.2 and o[0].start > h * 0.55: m[o[0].start:o[0].stop + 1, o[1].start:o[1].stop + 1] = False
    m = ndimage.binary_closing(np.pad(m, 3), iterations=1)[3:-3, 3:-3]
    lab, n = ndimage.label(m)
    if not n: return None
    sz = ndimage.sum(m, lab, range(1, n + 1)); objs = ndimage.find_objects(lab); keep = []
    for i, s in enumerate(sz):
        o = objs[i]; edge = o[0].start <= 1 or o[1].start <= 1 or o[1].stop >= w - 1 or o[0].stop >= h - 1
        if s >= sz.max() * 0.012 and not (edge and s < sz.max() * 0.2): keep.append(i + 1)
    mm = ndimage.binary_fill_holes(np.isin(lab, keep))
    mm = mm | (ndimage.binary_dilation(mm, iterations=1) & (d > 16))
    ys, xs = np.where(mm)
    out = Image.fromarray(np.dstack([a, mm * 255]).astype(np.uint8), 'RGBA').crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    return out
