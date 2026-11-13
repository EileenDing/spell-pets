import numpy as np
from PIL import Image
from scipy import ndimage
def strip_tag(im):
    """cut a name tag stuck under the feet: a band of pill-beige rows at the bottom of the picture"""
    a = np.array(im).astype(int); al = a[..., 3] > 0; r, g, b = a[..., 0], a[..., 1], a[..., 2]; H, W = al.shape
    tan = al & (r - b > 38) & ((r + g + b) < 650) & (r > 120)
    tc = ndimage.binary_closing(tan, structure=np.ones((1, 7)))
    def runs(y, minlen=40):
        row = tc[y]; d = np.diff(np.concatenate([[0], row.astype(int), [0]])); st = np.where(d == 1)[0]; en = np.where(d == -1)[0]
        return [(s, e) for s, e in zip(st, en) if e - s >= minlen]
    bot = None
    for y in range(H - 1, max(-1, H - 16), -1):
        if runs(y): bot = y; break
    if bot is not None:
        top = None
        for y in range(bot - 16, max(-1, bot - 62), -1):
            if runs(y): top = y; break
        if top is not None:
            R = runs(bot) + runs(top); xs0 = min(s for s, e in R); xs1 = max(e for s, e in R)
            al[max(0, top - 3):, max(0, xs0 - 30):min(W, xs1 + 30)] = False
    # a frame line along the very top
    for y in range(min(6, H)):
        if al[y].sum() > W * 0.45: al[:y + 1] = False
    # thin straight leftovers (cell border bits) and specks
    lab, n = ndimage.label(al); ob = ndimage.find_objects(lab); sz = ndimage.sum(al, lab, range(1, n + 1))
    if n:
        big = sz.max()
        for i, o in enumerate(ob):
            hh = o[0].stop - o[0].start; ww = o[1].stop - o[1].start
            if sz[i] < big * 0.02 or min(hh, ww) <= 6: al[lab == i + 1] = False
    a[..., 3] = np.where(al, a[..., 3], 0)
    out = Image.fromarray(a.astype(np.uint8), 'RGBA'); return out.crop(out.getbbox())
