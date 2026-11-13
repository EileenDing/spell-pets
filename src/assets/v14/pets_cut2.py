import numpy as np
from PIL import Image
from scipy import ndimage
from pets_cut import reading, merge
BG = np.array([253, 247, 235])
def hruns(mask, minlen):
    out = []
    for y in range(mask.shape[0]):
        row = mask[y]; d = np.diff(np.concatenate([[0], row.astype(int), [0]])); st = np.where(d == 1)[0]; en = np.where(d == -1)[0]
        for s, e in zip(st, en):
            if e - s >= minlen: out.append((y, s, e))
    return out
def prep(p, header=95):
    im = Image.open(f'pages/p-{p:03d}.jpg'); a = np.array(im.convert('RGB')).astype(int); H, W = a.shape[:2]
    r, g, b = a[..., 0], a[..., 1], a[..., 2]; d = np.sqrt(((a - BG) ** 2).sum(2)); m0 = d > 40
    tan = (r - b > 22) & ((r + g + b) > 380) & ((r + g + b) < 715)
    tanc = ndimage.binary_closing(tan, structure=np.ones((1, 4)))
    th = ndimage.binary_opening(tanc, structure=np.ones((1, 60))) & ~ndimage.binary_opening(tanc, structure=np.ones((7, 1)))
    tv = ndimage.binary_opening(ndimage.binary_closing(tan, structure=np.ones((4, 1))), structure=np.ones((60, 1))) & ~ndimage.binary_opening(tanc, structure=np.ones((1, 7)))
    m = m0 & ~ndimage.binary_dilation(th | tv, iterations=2)
    # name tags: the pill's beige fill (warmer than the cell background), text and paws closed over
    beige = (r > 235) & (g > 205) & (g < 248) & (b > 160) & (b < 228) & (r - b > 24) & (r - b < 75)
    bc = ndimage.binary_closing(beige, structure=np.ones((9, 25)))
    lb, n = ndimage.label(bc); pills = []
    for o in ndimage.find_objects(lb):
        hh = o[0].stop - o[0].start; ww = o[1].stop - o[1].start
        if 14 <= hh <= 60 and ww >= 70 and ww > hh * 2.6: pills.append((o[1].start - 8, o[0].start - 6, o[1].stop + 8, o[0].stop + 6))
    for x0, y0, x1, y1 in pills: m[max(0, y0):y1, max(0, x0):x1] = False
    m[:header] = False
    return a, d, m, pills
def figures2(p):
    a, d, m, pills = prep(p)
    lab, n = ndimage.label(ndimage.binary_dilation(m, iterations=3)); objs = ndimage.find_objects(lab); sz = ndimage.sum(m, lab, range(1, n + 1))
    big = []
    for i, o in enumerate(objs):
        hh = o[0].stop - o[0].start; ww = o[1].stop - o[1].start
        if sz[i] > 2500 and hh > 70: big.append((o[1].start, o[0].start, o[1].stop, o[0].stop))
    out = []
    for bx in reading(merge(big)):
        x0, y0, x1, y1 = bx; x0 = max(0, x0 - 4); y0 = max(0, y0 - 4); x1 = min(a.shape[1], x1 + 4); y1 = min(a.shape[0], y1 + 4)
        mm = m[y0:y1, x0:x1]; sub = a[y0:y1, x0:x1]; dd = d[y0:y1, x0:x1]
        lb, k = ndimage.label(ndimage.binary_dilation(mm, iterations=1)); s = ndimage.sum(mm, lb, range(1, k + 1)); ob = ndimage.find_objects(lb)
        mi = int(np.argmax(s)); M = ob[mi]; my1 = M[0].stop; mx0, mx1 = M[1].start - 25, M[1].stop + 25
        ids = []
        for i, v in enumerate(s):                         # keep the figure; drop what sits under its feet or beside it (name tag text)
            o = ob[i]
            if i == mi or (v >= 30 and o[0].start < my1 - 6 and o[1].stop > mx0 and o[1].start < mx1 and not (o[0].stop - o[0].start < 40 and o[0].start > M[0].start + (my1 - M[0].start) * 0.8)): ids.append(i + 1)
        keep = np.isin(lb, ids) & mm
        keep = ndimage.binary_fill_holes(ndimage.binary_closing(np.pad(keep, 4), iterations=2)[4:-4, 4:-4])
        keep |= ndimage.binary_dilation(keep, iterations=1) & (dd > 14)
        ys, xs = np.where(keep)
        out.append(Image.fromarray(np.dstack([sub, keep * 255]).astype(np.uint8), 'RGBA').crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)))
    return out, pills
if __name__ == '__main__':
    import sys
    for p in map(int, sys.argv[1:]):
        f, pills = figures2(p); print(p, len(f), 'pills', len(pills))
