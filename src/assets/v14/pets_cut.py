import numpy as np
from PIL import Image
from scipy import ndimage
from cells import SPECIAL, EVERYDAY, PAGES
def strip_lines(m, L=45):
    """remove straight horizontal/vertical runs (cell borders) from a mask"""
    h = ndimage.binary_opening(m, structure=np.ones((1, L))); v = ndimage.binary_opening(m, structure=np.ones((L, 1)))
    return m & ~ndimage.binary_dilation(h | v, iterations=2)
def figures(im, header=95):
    a = np.array(im.convert('RGB')).astype(int); H, W = a.shape[:2]
    bg = np.array([253, 247, 235]); d = np.sqrt(((a - bg) ** 2).sum(2))
    m = d > 40
    oh = ndimage.binary_opening(m, structure=np.ones((1, 50))); ov = ndimage.binary_opening(m, structure=np.ones((50, 1)))
    th = oh & ~ndimage.binary_opening(m, structure=np.ones((8, 1))); tv = ov & ~ndimage.binary_opening(m, structure=np.ones((1, 8)))
    m &= ~ndimage.binary_dilation(th | tv, iterations=2)
    m[:header] = False
    lab, n = ndimage.label(ndimage.binary_dilation(m, iterations=3))
    objs = ndimage.find_objects(lab); sz = ndimage.sum(m, lab, range(1, n + 1))
    big, small = [], []
    for i, o in enumerate(objs):
        hh = o[0].stop - o[0].start; ww = o[1].stop - o[1].start
        box = (o[1].start, o[0].start, o[1].stop, o[0].stop)
        if hh < 46 and ww > hh * 2.0: continue                                # name tags
        if sz[i] > 2500 and hh > 70: big.append(box)
        elif sz[i] > 40: small.append(box)
    return big, small, m, a
def reading(boxes):
    boxes = sorted(boxes, key=lambda b: (b[3])); rows = []
    for bx in boxes:
        if rows and abs(bx[3] - np.median([x[3] for x in rows[-1]])) < 60: rows[-1].append(bx)
        else: rows.append([bx])
    return [b for r in rows for b in sorted(r, key=lambda b: b[0])]
if __name__ == '__main__':
    bad = 0
    for p in range(32):
        big, small, m, a = figures(Image.open(f'pages/p-{p:03d}.jpg'))
        want = 22 if p % 2 == 0 else 27
        if len(big) != want: print(p, len(big), 'want', want); bad += 1
    print('bad pages', bad)

def merge(boxes):
    boxes = [list(b) for b in boxes]; changed = True; Hm = np.percentile([b[3] - b[1] for b in boxes], 80)
    while changed:
        changed = False
        for i in range(len(boxes)):
            for j in range(i + 1, len(boxes)):
                A, B = boxes[i], boxes[j]
                ox = min(A[2], B[2]) - max(A[0], B[0]); gap = max(A[1], B[1]) - min(A[3], B[3])
                if ox > 0.4 * min(A[2] - A[0], B[2] - B[0]) and gap < 25 and max(A[3], B[3]) - min(A[1], B[1]) < Hm * 1.12:
                    boxes[i] = [min(A[0], B[0]), min(A[1], B[1]), max(A[2], B[2]), max(A[3], B[3])]; boxes.pop(j); changed = True; break
            if changed: break
    return [tuple(b) for b in boxes]
def cut_figure(a, m, th, box):
    """one pet: the figure inside box, without its name tag, background made transparent"""
    x0, y0, x1, y1 = box; x0 = max(0, x0 - 4); y0 = max(0, y0 - 4); x1 = min(a.shape[1], x1 + 4); y1 = min(a.shape[0], y1 + 4)
    sub = a[y0:y1, x0:x1]; mm = m[y0:y1, x0:x1].copy(); t = th[y0:y1, x0:x1]; h, w = mm.shape
    # name tag: its top edge is a thin horizontal run in the lower part of the box; blank the tag area
    rows = np.where(t[int(h * 0.55):].sum(1) > 30)[0]
    if len(rows):
        ty = int(h * 0.55) + rows.min(); xs = np.where(t[ty:ty + 3].any(0))[0]
        mm[ty - 1:, max(0, xs.min() - 6):xs.max() + 7] = False
    lab, n = ndimage.label(mm)
    if not n: return None
    sz = ndimage.sum(mm, lab, range(1, n + 1)); keep = [i + 1 for i, s in enumerate(sz) if s >= max(30, sz.max() * 0.006)]
    k = ndimage.binary_fill_holes(np.isin(lab, keep))
    d = np.sqrt(((sub - np.array([253, 247, 235])) ** 2).sum(2)); k = k | (ndimage.binary_dilation(k, iterations=1) & (d > 14))
    ys, xs = np.where(k)
    return Image.fromarray(np.dstack([sub, k * 255]).astype(np.uint8), 'RGBA').crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
def page_figures(p):
    im = Image.open(f'pages/p-{p:03d}.jpg'); a = np.array(im.convert('RGB')).astype(int)
    d = np.sqrt(((a - np.array([253, 247, 235])) ** 2).sum(2)); m0 = d > 40
    oh = ndimage.binary_opening(m0, structure=np.ones((1, 50))); th = oh & ~ndimage.binary_opening(m0, structure=np.ones((8, 1)))
    big, small, m, _ = figures(im)
    return [cut_figure(a, m, th, b) for b in reading(merge(big))]
