# The new mermaid pictures were drawn in slightly different fur colours from the rest; record each one's own fur hue
# (most common hue in the head, leaving out the purple shell and pearls) as FIT_META.hue['<kind>-mermaid'].
import json, numpy as np; from PIL import Image
exec(open('hatmask.py').read().split('def hatmask')[0])
S9 = '../../sprdata9.js'; s9 = open(S9).read(); meta = json.loads(s9[s9.index('{'):s9.rindex('}') + 1])
def dom(A, y0, y1, skip=lambda h: np.zeros(h.shape, bool)):
    H = A.shape[0]; B = A[int(H * y0):int(H * y1)]; h, l, s = hsl(B.astype(float)); ok = (B[..., 3] > 200) & (s > 0.2) & (l > 0.25) & (l < 0.86)
    hv = h[ok]; hv = hv[~skip(hv)]
    bins = np.bincount((hv // 10).astype(int) % 36, minlength=36); t = bins.argmax(); near = hv[np.abs(hv - (t * 10 + 5)) <= 15]
    return round(float(near.mean()), 1)
meta.setdefault('hue', {}); at = {}
for k in KINDS:
    at[k] = Image.open(f'../../../fit/{k}.webp').convert('RGBA')
    def cut(key): w, h, cx, x, y = meta['img'][f'{k}-{key}']; return np.array(at[k].crop((x, y, x + w, y + h)))
    hm = dom(cut('mermaid'), 0.08, 0.5, (lambda h: (h > 240) & (h < 330)) if k != 'snake' else (lambda h: (h > 250) & (h < 262))); hb = dom(cut('bowtie'), 0, 1)
    meta['hue'][f'{k}-mermaid'] = hb if k == 'snake' else hm;   # the snake's head is mostly its cream belly stripe; its purple matches the others
    print(k, 'bowtie', hb, 'mermaid', hm)
# the green dragon and T-rex are close to the teal tail, so they get a narrower window (default is 22 degrees either way)
meta['hue']['dragon-mermaid'] = [meta['hue']['dragon-mermaid'], 11]; meta['hue']['trex-mermaid'] = [meta['hue']['trex-mermaid'], 9]
open(S9, 'w').write(s9[:s9.index('{')] + json.dumps(meta) + s9[s9.rindex('}') + 1:])
