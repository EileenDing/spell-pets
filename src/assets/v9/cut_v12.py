# Midnight and Library Archive: cut every catalog piece, plus wall and floor tiles
import sys; sys.path.insert(0, '../v11')
from PIL import Image; from cutlib import cut, sheet
B = {
 'midnight': {'bed-midnight': (15, 130, 372, 422), 'midnightstand': (392, 242, 578, 418), 'moonorb': (620, 262, 775, 412), 'win-midnight': (800, 128, 1104, 412),
   'starpendant': (1130, 130, 1340, 412), 'starchartrug': (1362, 200, 1760, 405), 'telescope': (36, 500, 265, 790), 'midnightdresser': (282, 550, 580, 785),
   'armillary': (596, 535, 800, 785), 'bluebooks': (830, 575, 1045, 760)},
 'library': {'chaise': (16, 180, 325, 345), 'archivebookcase': (360, 105, 595, 358), 'libladder': (636, 120, 875, 358), 'cardcatalog': (926, 140, 1160, 350),
   'win-library': (1210, 110, 1455, 350), 'chandelier': (1490, 110, 1755, 340), 'displaycase': (26, 400, 325, 615), 'writingdesk': (350, 425, 645, 610),
   'bankerlamp': (695, 410, 865, 610), 'footstool': (920, 430, 1120, 610), 'archiverug': (1140, 435, 1575, 600), 'globe': (1575, 405, 1750, 610),
   'pottedivy': (150, 650, 350, 835), 'archivebooks': (430, 655, 730, 835)},
}
TILES = {'midnight': {'wall': (1142, 545, 1385, 690), 'floor': (1508, 548, 1728, 760)}, 'library': {'wall': (905, 700, 1215, 752), 'floor': (1392, 678, 1565, 822)}}
outs = []
for k, d in B.items():
    im = Image.open(k + '.png')
    for nm, box in d.items():
        o = cut(im, box, keep='all', minfrac=0.01); o.save(f'cut/it-{nm}.png'); outs.append(o); print(nm, o.size)
    for t, box in TILES[k].items(): im.convert('RGB').crop(box).save(f'cut/{t}-{k}.png')
sheet(outs, 'v12_sheet.png', scale=0.45)
# gaps between legs, rungs and arms were filled with the cream background: make them see-through
import numpy as np; from scipy import ndimage
GAPS = ['libladder', 'chandelier', 'telescope', 'armillary', 'globe', 'starpendant', 'midnightstand', 'writingdesk', 'footstool', 'bankerlamp'][:]; GAPS.remove('midnightstand')
for nm in GAPS:
    o = Image.open(f'cut/it-{nm}.png'); a = np.array(o).astype(int); al = a[..., 3] > 0
    near = al & (np.sqrt(((a[..., :3] - [253, 247, 235]) ** 2).sum(2)) < 11)
    lab, n = ndimage.label(near); sz = ndimage.sum(near, lab, range(1, n + 1)); hit = 0
    for i, s in enumerate(sz):
        if s >= 60: a[..., 3][lab == i + 1] = 0; hit += 1
    Image.fromarray(a.astype(np.uint8)).save(f'cut/it-{nm}.png'); print(nm, 'gaps', hit)
outs = [Image.open(f'cut/it-{nm}.png') for d in B.values() for nm in d]
sheet(outs[:12], 'v12_a.png', bg=(200, 40, 120), scale=0.7); sheet(outs[12:], 'v12_b.png', bg=(200, 40, 120), scale=0.6)
