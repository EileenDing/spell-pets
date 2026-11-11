# Redrawn Ember Spire (lava dragon house), smoke included
from PIL import Image
import numpy as np, shutil
from scipy import ndimage
from cutter import cut
im = Image.open('ember.png'); W, H = im.size
BG = np.array(im.convert('RGB').getpixel((5, 5)), int)
print(cut(im, (2, 2, W - 4, H - 4), 'house-ember', pad=0, keep_frac=0.01, bgfn=lambda c: np.abs(c.astype(int) - BG).sum(-1) < 30))
# a faint 3-pixel line in the drawing above the tower: drop thin horizontal strips with nothing above or below
a = np.array(Image.open('cut/house-ember.png'))
al = a[..., 3] > 0; H2 = al.shape[0]
for y in range(1, H2 - 4):
    for t in (1, 2, 3):
        strip = al[y:y + t].all(0) & ~al[y - 1] & ~al[y + t]
        lab, n = ndimage.label(strip)
        for i in range(1, n + 1):
            xs = np.where(lab == i)[0]
            if len(xs) >= 12: a[y:y + t, xs, 3] = 0
rgb = a[..., :3].astype(int); light = (rgb.mean(-1) > 150) & (rgb.max(-1) - rgb.min(-1) < 60)
a[:22, 90:190][light[:22, 90:190]] = 0                     # leftover dots of that line (light grey, above the dark tower)
m = a[..., 3] > 0; lab, n = ndimage.label(m); sz = ndimage.sum(m, lab, range(1, n + 1))
a[np.isin(lab, [i + 1 for i, v in enumerate(sz) if v < 40]), 3] = 0     # stray specks
Image.fromarray(a).save('cut/house-ember.png')
shutil.copy('cut/house-ember.png', '../v3/cut/house-ember.png')
