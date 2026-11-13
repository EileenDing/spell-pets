import numpy as np
from PIL import Image
from scipy import ndimage
BG = np.array([253, 247, 235])
def untag(m, a, y0, y1, x0, x1):
    """a name tag stuck under the feet: its top edge is a thin straight tan line, 70+ px long, in the lower part"""
    sub = a[y0:y1, x0:x1]; mm = m[y0:y1, x0:x1]; h, w = mm.shape; r, g, b = sub[..., 0], sub[..., 1], sub[..., 2]
    tan = mm & (r - b > 30) & ((r + g + b) < 690) & (r > 120)
    thick = ndimage.binary_opening(tan, structure=np.ones((5, 1)))
    thin = ndimage.binary_opening(ndimage.binary_closing(tan, structure=np.ones((1, 5))), structure=np.ones((1, 70))) & ~thick
    for y in range(int(h * 0.55), h):
        xs = np.where(thin[y])[0]
        if len(xs) >= 70:
            out = m.copy(); out[y0 + y - 3:y1, x0 + max(0, xs.min() - 28):x0 + min(w, xs.max() + 29)] = False
            lb, k = ndimage.label(out); sz = ndimage.sum(out, lb, range(1, k + 1))
            return np.isin(lb, [i + 1 for i, v in enumerate(sz) if v >= sz.max() * 0.02]) if k else m
    return m
def tidy(m):
    """fill small holes; drop loose bits lying below the pet's feet (tag letters)"""
    holes = ndimage.binary_fill_holes(m) & ~m; lb, k = ndimage.label(holes)
    if k:
        sz = ndimage.sum(holes, lb, range(1, k + 1)); m = m | np.isin(lb, [i + 1 for i, v in enumerate(sz) if v < 4000])
    lb, k = ndimage.label(m)
    if k > 1:
        sz = ndimage.sum(m, lb, range(1, k + 1)); ob = ndimage.find_objects(lb); M = ob[int(np.argmax(sz))]
        keep = [i + 1 for i, o in enumerate(ob) if o[0].start < M[0].stop - 10 or sz[i] > sz.max() * 0.25]
        m = np.isin(lb, keep)
    return m
def unhook(m):
    """a tag hanging under the feet by a thin bridge: open the mask to break bridges, drop what sits below the body"""
    mo = ndimage.binary_opening(m, iterations=3); lb, k = ndimage.label(mo)
    if k < 2: return m
    sz = ndimage.sum(mo, lb, range(1, k + 1)); ob = ndimage.find_objects(lb); mi = int(np.argmax(sz)); M = ob[mi]
    drop = np.zeros_like(m)
    for i, o in enumerate(ob):
        if i == mi: continue
        hh = o[0].stop - o[0].start; ww = o[1].stop - o[1].start
        if o[0].start >= M[0].stop - 18 and hh < 50: drop |= lb == i + 1
    if not drop.any(): return m
    m = m & ~ndimage.binary_dilation(drop, iterations=4)
    lb, k = ndimage.label(m); sz = ndimage.sum(m, lb, range(1, k + 1))
    return np.isin(lb, [i + 1 for i, v in enumerate(sz) if v >= sz.max() * 0.02])
def page_figs(p, header=92):
    im = Image.open(f'pages/p-{p:03d}.jpg'); a = np.array(im.convert('RGB')).astype(int); H, W = a.shape[:2]
    r, g, b = a[..., 0], a[..., 1], a[..., 2]; d = np.sqrt(((a - BG) ** 2).sum(2))
    bgm = d < 26
    tan = (r - b > 22) & ((r + g + b) < 700) & (r > 120) & ~bgm
    oh = ndimage.binary_opening(tan, structure=np.ones((1, 45))); ov = ndimage.binary_opening(tan, structure=np.ones((45, 1)))
    thick = ndimage.binary_opening(tan, structure=np.ones((9, 9)))
    frame = ndimage.binary_dilation((oh | ov) & ~ndimage.binary_dilation(thick, iterations=2), iterations=2)
    bgm = bgm | frame; bgm[:header] = True
    lab, n = ndimage.label(bgm); sz = ndimage.sum(bgm, lab, range(1, n + 1))
    back = np.isin(lab, [i + 1 for i, s in enumerate(sz) if s > 15000])
    fg = ~back
    fg = ndimage.binary_opening(fg, iterations=1)
    # thin light-brown lines (tag outlines) are cut out before grouping, so a tag never joins the pet it touches
    tl = fg & (r - b > 30) & ((r + g + b) < 700) & ((r + g + b) > 330) & (r > 120)
    thin_tl = tl & ~ndimage.binary_opening(tl, structure=np.ones((5, 5)))
    fg_full = fg; fg = fg & ~ndimage.binary_dilation(thin_tl, iterations=1)
    lab, n = ndimage.label(fg); ob = ndimage.find_objects(lab); sz = ndimage.sum(fg, lab, range(1, n + 1))
    comps = []
    for i, o in enumerate(ob):
        hh = o[0].stop - o[0].start; ww = o[1].stop - o[1].start
        if sz[i] < 60: continue
        box = (o[1].start, o[0].start, o[1].stop, o[0].stop)
        pill = 16 <= hh <= 60 and ww > hh * 2.3 and sz[i] > 0.55 * hh * ww
        comps.append(dict(i=i + 1, box=box, s=sz[i], pill=pill))
    for c in comps:                                        # flat strips (a leftover frame or a long tag) are not figures
        x0, y0, x1, y1 = c['box']
        if (y1 - y0) < 45 and (x1 - x0) > 2 * (y1 - y0): c['pill'] = True
    bigs = [c for c in comps if not c['pill'] and c['s'] > 3500]
    smalls = [c for c in comps if not c['pill'] and c['s'] <= 3500]
    for c in bigs: c['ids'] = [c['i']]
    for c in smalls:                                       # stars, swords, balloons: give them to the nearest figure
        x0, y0, x1, y1 = c['box']; best = None
        for B in bigs:
            X0, Y0, X1, Y1 = B['box']; dx = max(0, X0 - x1, x0 - X1); dy = max(0, Y0 - y1, y0 - Y1); dist = max(dx, dy)
            if dist < 30 and y0 < Y1 - 8 and y1 > Y0 + 10 and (best is None or dist < best[0]): best = (dist, B)   # nothing above the head or below the feet (tag text)
        if best: best[1]['ids'].append(c['i'])
    # rows in reading order
    bigs.sort(key=lambda c: c['box'][3]); rows = []
    for c in bigs:
        if rows and abs(c['box'][3] - np.median([x['box'][3] for x in rows[-1]])) < 70: rows[-1].append(c)
        else: rows.append([c])
    order = [c for r_ in rows for c in sorted(r_, key=lambda c: c['box'][0])]
    out = []
    for c in order:
        m = np.isin(lab, c['ids'])
        m = m | (ndimage.binary_dilation(m, iterations=2) & fg_full & ~np.isin(lab, [x['i'] for x in comps if x['i'] not in c['ids']]))   # put back the pet's own thin brown lines
        mys = np.where((lab == c['i']).any(1))[0]; m[mys.max() + 3:] = False     # nothing below the feet
        m = tidy(unhook(m))
        ys, xs = np.where(m); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        m = untag(m, a, y0, y1, x0, x1); ys, xs = np.where(m); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        mm = m[y0:y1, x0:x1]; mm = mm | (ndimage.binary_dilation(mm, iterations=1) & (d[y0:y1, x0:x1] > 12))
        out.append(Image.fromarray(np.dstack([a[y0:y1, x0:x1], mm * 255]).astype(np.uint8), 'RGBA'))
    return out
