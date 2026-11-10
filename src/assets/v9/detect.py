# Finds every item on a catalog sheet. Text and label plaques are removed first, then nearby parts are grouped.
import numpy as np, sys, json
from PIL import Image, ImageDraw
from scipy import ndimage
def boxes(path, top=0, gap=14, textmax=34):
    im = Image.open(path).convert('RGB'); A = np.array(im).astype(int)
    bg = np.median(np.concatenate([A[2, :], A[-3, :], A[:, 2], A[:, -3]]), axis=0)
    fg = np.abs(A - bg).sum(-1) > 45
    fg[:top] = False
    lab, n = ndimage.label(fg)
    keep = np.zeros_like(fg)
    for i, sl in enumerate(ndimage.find_objects(lab)):
        h, w = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
        if h <= textmax and w <= 60: continue                       # letters, sparkles
        if h < 80 and w / max(h, 1) > 2.4 and w > 110: continue     # label plaques, rules, text bars
        if w > A.shape[1] * 0.6: continue
        keep |= lab == i + 1
    lab2, n2 = ndimage.label(ndimage.binary_dilation(keep, iterations=gap // 2))
    out = [[sl[1].start, sl[0].start, sl[1].stop, sl[0].stop] for sl in ndimage.find_objects(lab2)]
    out = [[b[0] + gap // 2, b[1] + gap // 2, b[2] - gap // 2, b[3] - gap // 2] for b in out]
    out = [b for b in out if (b[3] - b[1]) * (b[2] - b[0]) > 2500 and (b[3] - b[1]) > 30]
    out.sort(key=lambda b: (b[1] + b[3]) / 2)
    rows = []
    for b in out:
        cy = (b[1] + b[3]) / 2
        if rows and abs(cy - rows[-1][0]) < 80: rows[-1][1].append(b)
        else: rows.append([cy, [b]])
    return im, [b for _, r in rows for b in sorted(r, key=lambda b: b[0])]
if __name__ == '__main__':
    path = sys.argv[1]; top = int(sys.argv[2]); im, res = boxes(path, top, int(sys.argv[4]) if len(sys.argv) > 4 else 14)
    d = ImageDraw.Draw(im)
    for i, b in enumerate(res): d.rectangle(b, outline=(255, 0, 0), width=3); d.text((b[0] + 4, b[1] + 2), str(i), fill=(255, 0, 0))
    im.save(sys.argv[3]); print(len(res)); print(json.dumps(res))
