# Cuts the 39 special houses out of the four collection sheets (s1-s4.png) into cut/house-<id>.png
from PIL import Image
from cutter import cut
import os
os.makedirs('cut', exist_ok=True)
BOX = {  # id: (sheet, x0, y0, x1, y1) -- each box stops just above the name plaque
 'ember': ('s1', 280, 60, 600, 281), 'crystal': ('s1', 640, 70, 1000, 281), 'cloudkeep': ('s1', 1090, 75, 1450, 281),
 'fern': ('s1', 290, 322, 625, 521), 'orchard': ('s1', 655, 322, 1035, 519), 'canopy': ('s1', 1090, 322, 1450, 521),
 'eggshell': ('s1', 250, 560, 625, 743), 'diner': ('s1', 660, 578, 1020, 743), 'footprint': ('s1', 1060, 572, 1465, 741),
 'spiral': ('s1', 290, 785, 610, 979), 'desertden': ('s1', 630, 785, 1025, 979), 'silk': ('s1', 1065, 785, 1450, 979),
 'beacon': ('s2', 110, 85, 562, 331), 'mosaic': ('s2', 600, 108, 962, 329), 'teahouse': ('s2', 1030, 108, 1478, 329),
 'mudpark': ('s2', 112, 405, 562, 643), 'truffle': ('s2', 592, 382, 972, 643), 'windmill': ('s2', 1018, 375, 1472, 643),
 'banana': ('s2', 100, 752, 522, 965), 'vinegym': ('s2', 562, 718, 978, 965), 'drum': ('s2', 1018, 718, 1452, 965),
 'fetchball': ('s3', 235, 82, 597, 281), 'snifftrail': ('s3', 640, 82, 1017, 281), 'wagon': ('s3', 1075, 76, 1467, 281),
 'sunbeam': ('s3', 208, 328, 612, 519), 'yarn': ('s3', 668, 328, 1002, 519), 'pounce': ('s3', 1048, 322, 1462, 519),
 'clover': ('s3', 218, 572, 607, 744), 'carrot': ('s3', 628, 562, 1012, 744), 'bunnyhop': ('s3', 1048, 558, 1462, 744),
 'seedsilo': ('s3', 228, 788, 612, 975), 'wheelshop': ('s3', 618, 788, 1002, 975), 'tunnel': ('s3', 1033, 788, 1492, 975),
 'feather': ('s4', 40, 108, 502, 465), 'beakbay': ('s4', 518, 160, 972, 465), 'echo': ('s4', 998, 112, 1502, 465),
 'moonlib': ('s4', 40, 575, 502, 950), 'hollowoak': ('s4', 518, 570, 972, 950), 'observatory': ('s4', 978, 580, 1507, 950),
}
for k, (sh, x0, y0, x1, y1) in BOX.items():
    print(k, cut(Image.open(sh + '.png'), (x0, y0, x1 - x0, y1 - y0), 'house-' + k, pad=0, keep_frac=0.06))
# drop the thin divider line some boxes caught along their top edge
import numpy as np, glob
from scipy import ndimage
for f in glob.glob('cut/house-*.png'):
    a = np.array(Image.open(f).convert('RGBA')); h, w = a.shape[:2]; changed = False
    for y in range(min(14, h)):
        if (a[y, :, 3] > 0).mean() > 0.6: a[max(0, y - 1):y + 2, :, 3] = 0; changed = True
    if changed:
        m = a[..., 3] > 0; lab, n = ndimage.label(m)
        if n:
            sizes = ndimage.sum(m, lab, range(1, n + 1)); keep = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > sizes.max() * 0.06]); a[~keep, 3] = 0
        im = Image.fromarray(a, 'RGBA'); im.crop(im.getbbox()).save(f); print('trimmed', f)
# a divider line further down: a peach row that runs to both edges of the picture
def peach(p): return p[3] > 0 and p[0] > 235 and 150 < p[1] < 235 and 120 < p[2] < 215
for f in glob.glob('cut/house-*.png'):
    a = np.array(Image.open(f).convert('RGBA')).astype(int); h, w = a.shape[:2]; hit = []
    for y in range(h):
        if peach(a[y, 1]) and peach(a[y, w - 2]): hit.append(y)
    if not hit: continue
    for y in hit:
        for yy in range(max(0, y - 1), min(h, y + 2)):
            row = a[yy]; m = (row[:, 0] > 235) & (row[:, 1] > 150) & (row[:, 1] < 245) & (row[:, 2] > 120) & (row[:, 2] < 235)
            a[yy, m, 3] = 0
    m = a[..., 3] > 0; lab, n = ndimage.label(m); sizes = ndimage.sum(m, lab, range(1, n + 1))
    a[~np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > sizes.max() * 0.06]), 3] = 0
    im = Image.fromarray(a.astype(np.uint8), 'RGBA'); im.crop(im.getbbox()).save(f); print('line removed', f, hit)
# windmill: the divider line runs from the weather vane to the right edge
a = np.array(Image.open('cut/house-windmill.png').convert('RGBA')).astype(int); h, w = a.shape[:2]
for y in range(40):
    if peach(a[y, w - 2]) or peach(a[y, 1]):
        row = a[y]; m = (row[:, 0] > 235) & (row[:, 1] > 150) & (row[:, 1] < 245) & (row[:, 2] > 120) & (row[:, 2] < 235); a[y, m, 3] = 0
m = a[..., 3] > 0; lab, n = ndimage.label(m); sizes = ndimage.sum(m, lab, range(1, n + 1))
a[~np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > 150]), 3] = 0
im = Image.fromarray(a.astype(np.uint8), 'RGBA'); im.crop(im.getbbox()).save('cut/house-windmill.png'); print('windmill fixed')
