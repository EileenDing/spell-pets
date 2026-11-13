import numpy as np
from PIL import Image
from scipy import ndimage
def cut(im, box, T=38, minfrac=0.02, fill=True, keep="big", dilate=1, bg=None, close=1):
    """cut the drawing inside box from a flat cream background -> RGBA cropped"""
    x0, y0, x1, y1 = box
    a = np.array(im.convert('RGB').crop(box)).astype(int)
    if bg is None:
        e = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]]); bg = np.median(e, 0)
    d = np.sqrt(((a - bg) ** 2).sum(2)); m = d > T
    if close: m = ndimage.binary_closing(np.pad(m, 3), iterations=close)[3:-3, 3:-3]
    lab, n = ndimage.label(m)
    if n == 0: return None
    sizes = ndimage.sum(m, lab, range(1, n + 1))
    if keep == 'big': ks = [int(np.argmax(sizes)) + 1]
    else:
        objs = ndimage.find_objects(lab); ks = []
        for i, s in enumerate(sizes):
            h = objs[i][0].stop - objs[i][0].start; w = objs[i][1].stop - objs[i][1].start
            edge = objs[i][0].start <= 4 or objs[i][1].start <= 4 or objs[i][1].stop >= m.shape[1] - 4 or objs[i][0].stop >= m.shape[0] - 4
            if s >= sizes.max() * minfrac and h >= 10 and w / h < 8 and not (edge and s < sizes.max() * 0.3): ks.append(i + 1)
    mm = np.isin(lab, ks)
    if fill: mm = ndimage.binary_fill_holes(mm)
    if dilate: mm = ndimage.binary_dilation(mm, iterations=dilate) & (d > T * 0.45) | mm
    ys, xs = np.where(mm)
    rgba = np.dstack([a, (mm * 255)]).astype(np.uint8)
    out = Image.fromarray(rgba, 'RGBA').crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    return out
def sheet(ims, path, bg=(90, 160, 210), scale=1):
    W = sum(i.width for i in ims) + 10 * len(ims); H = max(i.height for i in ims)
    c = Image.new('RGBA', (W, H), bg + (255,)); x = 0
    for i in ims: c.alpha_composite(i, (x, H - i.height)); x += i.width + 10
    if scale != 1: c = c.resize((int(W * scale), int(H * scale)))
    c.save(path)
