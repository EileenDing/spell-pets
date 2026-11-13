# wallpapers: subtle tone-on-tone patterns become white line drawings on their own colour
import base64, io, json, re, sys, numpy as np
from PIL import Image
from scipy import ndimage
SRC = ['../../sprdata.js', '../../sprdata2.js', '../../sprdata4.js', '../../sprdata5.js', '../../sprdata6.js', '../../art.js']
def tiles():
    out = {}
    for f in SRC + ['../../sprdata3.js']:
        s = open(f).read()
        for k, b64 in re.findall(r'"(wall-[a-z0-9]+)":\s*"data:image/\w+;base64,([^"]+)"', s): out[k] = Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGB')
    return out
def outline(im, line=255, alpha=0.9, thick=1):
    a = np.array(im).astype(float); lum = a @ [0.299, 0.587, 0.114]
    base = np.median(a.reshape(-1, 3), 0); bl = base @ [0.299, 0.587, 0.114]
    d = np.sqrt(((a - base) ** 2).sum(2))
    # Otsu on the colour distance: what is pattern and what is background
    hist, edges = np.histogram(d, 64); c = (edges[:-1] + edges[1:]) / 2; best = (0, 0)
    for i in range(1, 63):
        w0, w1 = hist[:i].sum(), hist[i:].sum()
        if w0 == 0 or w1 == 0: continue
        m0, m1 = (hist[:i] * c[:i]).sum() / w0, (hist[i:] * c[i:]).sum() / w1; v = w0 * w1 * (m0 - m1) ** 2
        if v > best[0]: best = (v, c[i])
    m = d > max(8, best[1]); m = ndimage.binary_opening(m, iterations=1)
    edge = m & ~ndimage.binary_erosion(m, iterations=thick, border_value=1)
    out = np.tile(base, (a.shape[0], a.shape[1], 1)) * 0.55 + a * 0.45          # flatten the pattern to the base colour
    out[edge] = out[edge] * (1 - alpha) + line * alpha
    return Image.fromarray(out.clip(0, 255).astype(np.uint8))
OUT = ['wall-cream', 'wall-clock', 'wall-subway', 'wall-desert']
if __name__ == '__main__':
    T = tiles(); print(len(T), sorted(T)[:40])
    row = []
    for k in OUT:
        im = T[k]; o = outline(im)
        big = Image.new('RGB', (im.width * 2 + 10, im.height), 'white'); big.paste(im, (0, 0)); big.paste(o, (im.width + 10, 0)); row.append(big)
    W = max(r.width for r in row); H = sum(r.height + 10 for r in row)
    sh = Image.new('RGB', (W, H), 'white'); y = 0
    for r in row: sh.paste(r, (0, y)); y += r.height + 10
    sh.save('outline_preview.png')
