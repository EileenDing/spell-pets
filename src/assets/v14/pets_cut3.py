import numpy as np
from PIL import Image
from scipy import ndimage
from pets_cut import figures, reading, merge
BG = np.array([253, 247, 235])
def figures3(p):
    im = Image.open(f'pages/p-{p:03d}.jpg'); big, small, _, a = figures(im); H, W = a.shape[:2]
    r, g, b = a[..., 0], a[..., 1], a[..., 2]; d = np.sqrt(((a - BG) ** 2).sum(2)); m0 = d > 40
    tan = (r - b > 40) & ((r + g + b) < 640) & (r > 140)
    tanc = ndimage.binary_closing(tan, structure=np.ones((1, 5)))
    thin_h = ndimage.binary_opening(tanc, structure=np.ones((1, 70))) & ~ndimage.binary_opening(tan, structure=np.ones((5, 1)))
    thin_v = ndimage.binary_opening(ndimage.binary_closing(tan, structure=np.ones((5, 1))), structure=np.ones((70, 1))) & ~ndimage.binary_opening(tan, structure=np.ones((1, 5)))
    out = []
    for bx in reading(merge(big)):
        x0, y0, x1, y1 = bx; x0 = max(0, x0 - 6); y0 = max(0, y0 - 6); x1 = min(W, x1 + 6); y1 = min(H, y1 + 6)
        mm = m0[y0:y1, x0:x1] & ~ndimage.binary_dilation(thin_v[y0:y1, x0:x1], iterations=2); sub = a[y0:y1, x0:x1]; dd = d[y0:y1, x0:x1]
        th = thin_h[y0:y1, x0:x1]; h, w = mm.shape
        # name tag: a pair of thin tan lines (its top and bottom edge) 24-38 px apart, running under the middle of the figure
        cx = w // 2; runs = []
        for y in range(int(h * 0.4), h):
            row = th[y]
            if not row[max(0, cx - 15):cx + 15].any(): continue
            dd_ = np.diff(np.concatenate([[0], row.astype(int), [0]])); st = np.where(dd_ == 1)[0]; en = np.where(dd_ == -1)[0]
            for s_, e_ in zip(st, en):
                if e_ - s_ >= 80 and s_ <= cx + 15 and e_ >= cx - 15: runs.append((y, s_, e_))
        pill = None
        for i, (y1_, s1, e1) in enumerate(runs):
            for (y2_, s2, e2) in runs:
                if 22 <= y2_ - y1_ <= 40 and abs(s1 - s2) < 30 and abs(e1 - e2) < 30: pill = (y1_, y2_, min(s1, s2), max(e1, e2)); break
            if pill: break
        if pill: mm[max(0, pill[0] - 2):pill[1] + 4, max(0, pill[2] - 24):pill[3] + 24] = False
        else:
            # the tag may sit lower than the box: look just below it
            pass
        mm &= ~ndimage.binary_dilation(th & ~ndimage.binary_dilation(mm & ~th, iterations=0), iterations=0) if False else mm
        mm &= ~ndimage.binary_dilation(thin_h[y0:y1, x0:x1] & (np.arange(h)[:, None] > h * 0.4) & ((ndimage.binary_dilation(thin_h[y0:y1, x0:x1], structure=np.ones((1, 160)))) ), iterations=1) if False else mm
        lb, k = ndimage.label(mm)
        if not k: out.append(None); continue
        s = ndimage.sum(mm, lb, range(1, k + 1)); ob = ndimage.find_objects(lb); mi = int(np.argmax(s)); M = ob[mi]
        ids = [i + 1 for i, v in enumerate(s) if i == mi or (v >= 25 and ob[i][0].start < M[0].stop - 4 and ob[i][1].stop > M[1].start - 30 and ob[i][1].start < M[1].stop + 30)]
        keep = np.isin(lb, ids)
        keep = ndimage.binary_fill_holes(ndimage.binary_closing(np.pad(keep, 4), iterations=2)[4:-4, 4:-4])
        keep |= ndimage.binary_dilation(keep, iterations=1) & (dd > 14)
        ys, xs = np.where(keep)
        out.append(Image.fromarray(np.dstack([sub, keep * 255]).astype(np.uint8), 'RGBA').crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)))
    return out
