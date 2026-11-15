# drop name-tag letters and frame bits left under a figure: small separate pieces in the bottom quarter
import json, glob, numpy as np
from PIL import Image
from scipy import ndimage
def detag(im):
    a = np.array(im); al = a[..., 3] > 100; H = al.shape[0]
    lab, n = ndimage.label(al, structure=np.ones((3, 3)))
    if n < 2: return im
    sz = ndimage.sum(al, lab, range(1, n + 1)); ob = ndimage.find_objects(lab); big = sz.max()
    for i, o in enumerate(ob):
        if sz[i] < big * 0.04 and o[0].start > H * 0.72: a[lab == i + 1, 3] = 0
    out = Image.fromarray(a, 'RGBA'); return out.crop(out.getbbox())
if __name__ == '__main__':
    for p in sorted(glob.glob('fit_h72/*.png')): detag(Image.open(p)).save(p)
