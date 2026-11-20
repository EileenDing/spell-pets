# Straw hat: mark the hat's own pixels so a colour skin never recolours them (straw is close to brown/tan fur).
# Writes FIT_META.keep['<kind>-strawhat'] = rows "y:x0+len,x0+len;..." at the packed picture's size, plus a check sheet.
import json, re, io, base64, colorsys, numpy as np
from PIL import Image; from scipy import ndimage
KINDS = ['dragon','dinosaur','dog','cat','turtle','rabbit','pig','rat','monkey','trex','snake','parrot','owl','capybara','frog','octopus']
S9 = '../../sprdata9.js'; s9 = open(S9).read(); meta = json.loads(s9[s9.index('{'):s9.rindex('}') + 1])
def hsl(A):
    r, g, b = A[..., 0] / 255, A[..., 1] / 255, A[..., 2] / 255
    mx, mn = np.maximum(np.maximum(r, g), b), np.minimum(np.minimum(r, g), b); l = (mx + mn) / 2; d = mx - mn
    s = np.where(d == 0, 0, d / (1 - np.abs(2 * l - 1) + 1e-9))
    h = np.where(d == 0, 0, np.where(mx == r, ((g - b) / (d + 1e-9)) % 6, np.where(mx == g, (b - r) / (d + 1e-9) + 2, (r - g) / (d + 1e-9) + 4))) * 60
    return h, l, s
def hatmask(im):
    A = np.array(im.convert('RGBA')).astype(float); H, W = A.shape[:2]; h, l, s = hsl(A); op = A[..., 3] > 120
    light = op & (l > 0.33)
    lab, n = ndimage.label(light)                            # pieces between the dark outlines
    idx = np.arange(1, n + 1)
    med_h = ndimage.median(h, lab, idx); med_l = ndimage.median(l, lab, idx); med_s = ndimage.median(s, lab, idx)
    top = ndimage.minimum(np.indices((H, W))[0], lab, idx)
    bot = ndimage.maximum(np.indices((H, W))[0], lab, idx); tall = (bot - top) > H * 0.5   # the face and body are tall; hat pieces are flat bands
    red = ((med_h < 14) | (med_h > 340)) & (med_s > 0.45) & (med_l < 0.72) & (top < H * 0.45)
    straw = (((med_h > 36) & (med_h < 58) & (med_l > 0.55)) | ((med_h > 30) & (med_h < 58) & (med_l > 0.5) & ~tall)) & (med_l < 0.88) & (med_s > 0.35) & (top < H * 0.55)
    def has_eyes(i):                                         # a face: its piece wraps round dark, roundish blobs (eyes, nose)
        sl = ndimage.find_objects((lab == i).astype(np.int32))[0]; pc = lab[sl] == i; holes = ndimage.binary_fill_holes(pc) & ~pc
        hl, hn = ndimage.label(holes)
        for j in range(1, hn + 1):
            b = hl == j; a = b.sum(); ys, xs = np.where(b)
            if a >= 12 and a / ((np.ptp(ys) + 1) * (np.ptp(xs) + 1)) > 0.45 and np.median(l[sl][b]) < 0.3 and np.ptp(ys) < 3 * (np.ptp(xs) + 1): return True
        return False
    hat = set((idx[red]).tolist())
    if not hat: return np.zeros((H, W), bool)
    while True:                                              # grow from the ribbon through straw pieces that touch it (across an outline)
        m = np.isin(lab, list(hat)); near = ndimage.binary_dilation(m, iterations=4)
        add = set(np.unique(lab[near]).tolist()) - {0} - hat
        add = {i for i in add if (straw[i - 1] or red[i - 1]) and not has_eyes(i)}
        if not add: break
        hat |= add
    m = np.isin(lab, list(hat))
    m = ndimage.binary_closing(m, iterations=1) & op & (l < 0.9) & (s > 0.25)
    return m
def rle(m):
    rows = []
    for y in range(m.shape[0]):
        xs = np.flatnonzero(np.diff(np.concatenate([[0], m[y].astype(int), [0]])))
        if len(xs): rows.append(f'{y}:' + ','.join(f'{a}+{b - a}' for a, b in zip(xs[::2], xs[1::2])))
    return ';'.join(rows)
at = {}; sheet = []
meta.setdefault('keep', {})
for k in KINDS:
    w, hh, cx, x, y = meta['img'][f'{k}-strawhat']
    if k not in at: at[k] = Image.open(f'../../../fit/{k}.webp').convert('RGBA')
    im = at[k].crop((x, y, x + w, y + hh)); m = hatmask(im)
    meta['keep'][f'{k}-strawhat'] = rle(m)
    v = np.array(im).copy(); v[m] = (v[m] * 0.4 + np.array([255, 0, 255, 255]) * 0.6).astype(np.uint8); sheet.append(Image.fromarray(v))
    print(k, int(m.sum()), 'px')
open(S9, 'w').write(s9[:s9.index('{')] + json.dumps(meta) + s9[s9.rindex('}') + 1:])
W = Image.new('RGBA', (sum(i.width for i in sheet) // 2 + 200, 2 * max(i.height for i in sheet)), (120, 160, 200, 255)); xx = 0; yy = 0
for i, im in enumerate(sheet):
    if i == 8: xx = 0; yy = max(s.height for s in sheet)
    W.alpha_composite(im, (xx, yy)); xx += im.width
W.save('/tmp/claude-0/-home-claude/73b1055a-597b-553d-8d3b-a747a428061d/scratchpad/hatmask.png')
