# Redrawn parrot and owl special houses -> ../v3/cut/house-*.png (replacing the earlier versions)
from PIL import Image
from cutter import cut
import shutil, os
im = Image.open('parrot_owl.png')
BOX = {'feather': (45, 112, 498, 468), 'beakbay': (515, 120, 980, 468), 'echo': (985, 112, 1520, 468),
       'moonlib': (35, 558, 498, 940), 'hollowoak': (498, 560, 1025, 945), 'observatory': (978, 580, 1510, 935)}
os.makedirs('cut', exist_ok=True)
for k, (x0, y0, x1, y1) in BOX.items():
    print(k, cut(im, (x0, y0, x1 - x0, y1 - y0), 'house-' + k, pad=0, keep_frac=0.01))
    if k == 'hollowoak':   # its box catches the edge of the observatory: keep only pieces left of x=1000 or above the observatory
        import numpy as np
        a = np.array(Image.open('cut/house-hollowoak.png')); a[170:, 476:, 3] = 0; im2 = Image.fromarray(a); im2.crop(im2.getbbox()).save('cut/house-hollowoak.png')
    shutil.copy(f'cut/house-{k}.png', f'../v3/cut/house-{k}.png')
