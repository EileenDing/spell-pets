# Redrawn cat special houses
from PIL import Image
from cutter import cut
import shutil, numpy as np
from scipy import ndimage
im = Image.open('cats.png')
BG = np.array(im.convert('RGB').getpixel((330, 160)), int)
SC = im.size[0] / 2000
BOX = {k: tuple(round(v * SC) for v in b) for k, b in {'sunbeam': (50, 175, 690, 510), 'yarn': (720, 180, 1265, 510), 'pounce': (1295, 175, 1955, 512)}.items()}
OPEN = {'yarn': 900, 'pounce': 900}   # gaps under the awning / between the steps
def bgfn(c): return np.abs(c.astype(int) - BG).sum(-1) < 40
for k, (x0, y0, x1, y1) in BOX.items():
    print(k, cut(im, (x0, y0, x1 - x0, y1 - y0), 'house-' + k, pad=0, keep_frac=0.01, bgfn=bgfn))
    # cream walls match the paper colour: keep everything inside the outline, then reopen only the large see-through gaps
    a = np.array(Image.open(f'cut/house-{k}.png').convert('RGBA')).astype(int)
    solid = ndimage.binary_fill_holes(ndimage.binary_closing(a[..., 3] > 0, iterations=4))
    a[solid, 3] = 255
    bg = (np.abs(a[..., :3] - BG).sum(-1) < 22) & solid
    lab, n = ndimage.label(bg); sz = ndimage.sum(bg, lab, range(1, n + 1))
    a[np.isin(lab, [i + 1 for i, v in enumerate(sz) if v > OPEN.get(k, 10**9)]), 3] = 0
    Image.fromarray(a.astype(np.uint8), 'RGBA').save(f'cut/house-{k}.png')
    shutil.copy(f'cut/house-{k}.png', f'../v3/cut/house-{k}.png')
