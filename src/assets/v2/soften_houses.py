# Paints out the animal signs on the houses so any pet can live in any house.
import numpy as np, cv2
from PIL import Image
def hsv(a): return cv2.cvtColor(a[..., :3].astype(np.uint8), cv2.COLOR_RGB2HSV).astype(int)
lum = lambda a: (0.299*a[...,0] + 0.587*a[...,1] + 0.114*a[...,2])
light = lambda t: (lambda a: lum(a) > t)
yellow = lambda a: (lambda h: (h[...,0] >= 15) & (h[...,0] <= 35) & (h[...,1] > 90) & (h[...,2] > 120))(hsv(a))
allpx = lambda a: np.ones(a.shape[:2], bool)
def fade(im, x0, y0, x1, y1, strength=0.8, thr=38):
    # blend the sign toward the wall colour around it, so it reads as a faint carving
    box = im[y0:y1, x0:x1, :3].astype(float)
    ring = np.concatenate([box[0], box[-1], box[:, 0], box[:, -1]])
    rep = np.median(ring, axis=0)
    d = np.sqrt(((box - rep) ** 2).sum(-1))
    m = (d > thr) & (im[y0:y1, x0:x1, 3] > 100)
    m = cv2.dilate(m.astype(np.uint8), np.ones((3, 3), np.uint8), iterations=1).astype(bool)
    soft = cv2.GaussianBlur(m.astype(float), (5, 5), 0) * strength
    tex = box - cv2.GaussianBlur(box, (0, 0), 3)          # keep a little of the wood/plank texture
    out = box * (1 - soft[..., None]) + (rep + tex * 0.5) * soft[..., None]
    im[y0:y1, x0:x1, :3] = np.clip(out, 0, 255).astype(np.uint8)
FADE = {
  'dog':      [(104, 76, 172, 124, 0.82)],
  'dinosaur': [(114, 76, 184, 140, 0.8)],
  'pig':      [(136, 91, 194, 129, 0.85)],
  'rabbit':   [(172, 106, 198, 142, 0.8)],
  'snake':    [(124, 90, 174, 122, 0.75)],
}
JOBS = {  # house: [(x0, y0, x1, y1, which pixels, grow)]
  'dragon':   [(112, 122, 158, 168, yellow, 1)],
  'owl':      [(153, 138, 182, 172, yellow, 1)],
  'trex':     [(52, 122, 98, 168, light(160), 1), (288, 122, 334, 168, light(160), 1)],
}
for k, jobs in JOBS.items():
    im = np.array(Image.open(f'cut_orig/house-{k}.png').convert('RGBA'))
    rgb = im[..., :3].copy(); mask = np.zeros(im.shape[:2], np.uint8)
    for x0, y0, x1, y1, pick, grow in jobs:
        sub = pick(im[y0:y1, x0:x1].astype(int)) & (im[y0:y1, x0:x1, 3] > 100)
        m = np.zeros(im.shape[:2], np.uint8); m[y0:y1, x0:x1][sub] = 255
        if grow: m = cv2.dilate(m, np.ones((3, 3), np.uint8), iterations=grow)
        m[:y0, :] = 0; m[y1:, :] = 0; m[:, :x0] = 0; m[:, x1:] = 0
        mask |= m
    out = cv2.inpaint(rgb, mask, 5, cv2.INPAINT_TELEA)
    im[..., :3] = out
    Image.fromarray(im, 'RGBA').save(f'cut/house-{k}.png')
    print(k, int((mask > 0).sum()), 'px repainted')

for k, jobs in FADE.items():
    im = np.array(Image.open(f'cut_orig/house-{k}.png').convert('RGBA'))
    for x0, y0, x1, y1, st in jobs: fade(im, x0, y0, x1, y1, st)
    Image.fromarray(im, 'RGBA').save(f'cut/house-{k}.png'); print(k, 'faded')
