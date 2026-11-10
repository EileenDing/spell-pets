# Cuts the 35 catalog pieces (cat1.png: tables/beds/sofas/chairs, cat2.png: pendants/table lamps/windows)
from PIL import Image
from cutter import cut
C1 = [196, 452, 716, 984, 1256, 1528]; R1 = [(72, 256), (306, 507), (556, 724), (776, 973)]
C2 = [160, 432, 690, 960, 1245, 1528]; R2 = [(62, 336), (400, 650), (722, 958)]
N1 = [['gateleg', 'nesting', 'pebbletable', 'puzzletable', 'tuliptable'], ['booknook', 'zippocket', 'foldaway', 'bunkbed', 'canoebed'],
      ['scurve', 'blocksofa', 'convopit', 'boothsofa', 'ribbonsofa'], ['director', 'eggchair', 'saddlestool', 'kneeling', 'cantilever']]
N2 = [['belltrio', 'prism', 'ribbonpendant', 'balancebeam', 'discpendant'], ['acornlamp', 'flipbook', 'snaillamp', 'periscope', 'pebblelamp'],
      ['cornerwin', 'clerestory', 'fanlightwin', 'shutterwin', 'honeycombwin']]
for sheet, C, R, N in (('cat1', C1, R1, N1), ('cat2', C2, R2, N2)):
    im = Image.open(sheet + '.png')
    for r, (y0, y1) in enumerate(R):
        for c in range(5):
            print(N[r][c], cut(im, (C[c] + 6, y0, C[c + 1] - C[c] - 12, y1 - y0), 'it-' + N[r][c], pad=0, keep_frac=0.02))
# open shapes: the background showing through them must stay see-through
for sheet, C, R, N in (('cat1', C1, R1, N1), ('cat2', C2, R2, N2)):
    im = Image.open(sheet + '.png')
    for r, (y0, y1) in enumerate(R):
        for c in range(5):
            if N[r][c] in ('belltrio', 'prism', 'cantilever', 'eggchair', 'balancebeam', 'director', 'kneeling', 'saddlestool', 'gateleg', 'nesting'):
                cut(im, (C[c] + 6, y0, C[c + 1] - C[c] - 12, y1 - y0), 'it-' + N[r][c], pad=0, keep_frac=0.02, holes=False)
# pockets of background enclosed by the shape (between cords, bars, frame): make them see-through too
import numpy as np
from scipy import ndimage
for n in ('belltrio', 'cantilever', 'eggchair'):
    a = np.array(Image.open(f'cut/it-{n}.png').convert('RGBA')).astype(int); rgb = a[..., :3]
    bg = (np.abs(rgb - np.array([252, 247, 239])).sum(-1) < 14) & (a[..., 3] > 0)
    lab, k = ndimage.label(bg); sizes = ndimage.sum(bg, lab, range(1, k + 1))
    kill = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > 40])
    a[kill, 3] = 0; Image.fromarray(a.astype(np.uint8), 'RGBA').save(f'cut/it-{n}.png'); print(n, int(kill.sum()))
