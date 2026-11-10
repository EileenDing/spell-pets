# Redrawn dog, rabbit and hamster special houses (the cat row of this sheet is not used yet)
from PIL import Image
from cutter import cut
import shutil
im = Image.open('dog_rabbit_hamster.png')
BOX = {'fetchball': (240, 86, 600, 280), 'snifftrail': (640, 86, 1020, 280), 'wagon': (1075, 80, 1460, 280),
       'clover': (215, 568, 615, 750), 'carrot': (640, 568, 1005, 750), 'bunnyhop': (1045, 564, 1465, 750),
       'seedsilo': (255, 800, 610, 980), 'wheelshop': (620, 794, 1005, 980), 'tunnel': (1035, 798, 1495, 980)}
for k, (x0, y0, x1, y1) in BOX.items():
    print(k, cut(im, (x0, y0, x1 - x0, y1 - y0), 'house-' + k, pad=0, keep_frac=0.01))
    if k in ('bunnyhop', 'tunnel'):        # background showing through between the ears / under the tubes
        import numpy as np
        from scipy import ndimage
        a = np.array(Image.open(f'cut/house-{k}.png').convert('RGBA')).astype(int)
        bg = (np.abs(a[..., :3] - np.array([252, 247, 239])).sum(-1) < 16) & (a[..., 3] > 0)
        lab, n = ndimage.label(bg); sz = ndimage.sum(bg, lab, range(1, n + 1))
        a[np.isin(lab, [i + 1 for i, v in enumerate(sz) if v > 300]), 3] = 0
        Image.fromarray(a.astype(np.uint8), 'RGBA').save(f'cut/house-{k}.png')
    shutil.copy(f'cut/house-{k}.png', f'../v3/cut/house-{k}.png')
