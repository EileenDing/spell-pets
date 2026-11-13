import numpy as np, glob
from PIL import Image
from scipy import ndimage
def deletter(im):
    a = np.array(im).astype(int); al = a[..., 3] > 0; H, W = al.shape
    dark = al & (a[..., :3].sum(2) < 300)
    lab, n = ndimage.label(dark); ob = ndimage.find_objects(lab); sz = ndimage.sum(dark, lab, range(1, n + 1))
    cand = []
    for i, o in enumerate(ob):
        hh = o[0].stop - o[0].start; ww = o[1].stop - o[1].start
        if o[0].start > H * 0.6 and 5 <= hh <= 20 and ww <= 120 and sz[i] >= 8: cand.append(((o[0].start + o[0].stop) / 2, o))
    if len(cand) < 2: return im, False
    cand.sort(key=lambda c: c[0]); best = None
    for i in range(len(cand)):
        grp = [c for c in cand if abs(c[0] - cand[i][0]) <= 5]
        if len(grp) >= 2 and sum(c[1][1].stop - c[1][1].start for c in grp) >= 22:
            if best is None or len(grp) > len(best): best = grp
    if not best: return im, False
    y0 = min(c[1][0].start for c in best); y1 = max(c[1][0].stop for c in best); x0 = min(c[1][1].start for c in best); x1 = max(c[1][1].stop for c in best)
    cut = np.zeros_like(al); cut[max(0, y0 - 14):min(H, y1 + 16), max(0, x0 - 34):min(W, x1 + 34)] = True
    # only erase if the band is the bottom of the picture (a tag), not a pattern on clothes
    if y1 < H - 26: return im, False
    al2 = al & ~cut
    lb, k = ndimage.label(al2); s = ndimage.sum(al2, lb, range(1, k + 1))
    if not k: return im, False
    obs = ndimage.find_objects(lb); mi = int(np.argmax(s)); M = obs[mi]
    keep = [i + 1 for i, o in enumerate(obs) if s[i] >= s.max() * 0.02 and o[0].start < M[0].stop - 8]
    al2 = np.isin(lb, keep); a[..., 3] = np.where(al2, a[..., 3], 0)
    out = Image.fromarray(a.astype(np.uint8), 'RGBA'); return out.crop(out.getbbox()), True
if __name__ == '__main__':
    n = 0
    for f in sorted(glob.glob('fit/*.png')):
        if '/_' in f: continue
        im, ch = deletter(Image.open(f))
        if ch: im.save(f); n += 1
    print('cleaned', n)
