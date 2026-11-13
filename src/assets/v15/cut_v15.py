# 12 new houses: capybara, frog, octopus (name tags excluded by the boxes)
import numpy as np, shutil, sys
from PIL import Image
sys.path.insert(0, '../v10'); from cutter import cut
from scipy import ndimage
BOX = {  # x, y, w, h  (above each name tag)
 'capy.png': {'capybara': (180, 84, 425, 371), 'hotspring': (840, 84, 560, 371), 'orangecottage': (50, 545, 665, 355), 'lotuslodge': (770, 565, 720, 345)},
 'frogocto.png': {'frog': (12, 125, 390, 270), 'stonehop': (400, 135, 425, 260), 'raindrop': (835, 155, 445, 240), 'pondchorus': (1290, 120, 450, 275),
                  'octopus': (15, 555, 360, 260), 'inkbottle': (395, 525, 400, 290), 'coralcurl': (825, 530, 440, 285), 'tideglass': (1290, 525, 450, 290)}}
for f, d in BOX.items():
    im = Image.open(f); BG = np.array(im.convert('RGB').getpixel((8, 120)), int)
    for k, b in d.items():
        print(k, cut(im, b, 'house-' + k, pad=0, keep_frac=0.01, bgfn=lambda c: np.abs(c.astype(int) - BG).sum(-1) < 34))
        a = np.array(Image.open(f'cut/house-{k}.png')); m = a[..., 3] > 0; lab, n = ndimage.label(m); sz = ndimage.sum(m, lab, range(1, n + 1))
        a[np.isin(lab, [i + 1 for i, v in enumerate(sz) if v < 60]), 3] = 0; out = Image.fromarray(a); out.crop(out.getbbox()).save(f'cut/house-{k}.png')
        shutil.copy(f'cut/house-{k}.png', f'../v3/cut/house-{k}.png')
ims = [Image.open(f'cut/house-{k}.png') for d in BOX.values() for k in d]
H = 180; th = [i.resize((int(i.width * H / i.height), H)) for i in ims]; W = sum(t.width + 10 for t in th)
c = Image.new('RGBA', (W, H), (200, 40, 120, 255)); x = 0
for t in th: c.alpha_composite(t, (x, 0)); x += t.width + 10
c.save('houses_sheet.png')
