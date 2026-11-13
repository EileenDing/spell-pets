# re-pack the fitted pictures of one pet into ../../../fit/<kind>.webp and update FIT_META in ../../sprdata9.js
import sys, json, os, re, io, base64, numpy as np
from PIL import Image
from cells import SPECIAL, EVERYDAY
ROOT = '../../..'; kind = sys.argv[1]
src = ''.join(open(f'../../{f}').read() for f in ['sprdata.js', 'sprdata7.js'])
m = re.search(r'"pet-%s":\s*"data:image/\w+;base64,([^"]+)"' % kind, src); b = Image.open(io.BytesIO(base64.b64decode(m.group(1)))).convert('RGBA')
def cx_of(im):
    a = np.array(im)[..., 3] > 100; H = a.shape[0]; cs = []
    for y in range(int(H * 0.55), int(H * 0.95)):
        xs = np.where(a[y])[0]
        if len(xs): cs.append((xs.min() + xs.max()) / 2)
    return float(np.median(cs)) if cs else im.width / 2
s9 = open('../../sprdata9.js').read(); meta = json.loads(s9[s9.index('{'):s9.rindex('}') + 1])
ref = Image.open(f'fit/{kind}-bowtie.png'); s = float(np.median([b.height / ref.height, b.width / ref.width]))
meta['base'][kind] = round(cx_of(b), 1); ims = []
for n in SPECIAL + EVERYDAY:
    im = Image.open(f'fit/{kind}-{n}.png'); im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS); ims.append((n, im))
cols = 7; cw = max(i.width for _, i in ims) + 2; ch = max(i.height for _, i in ims) + 2; rows = (len(ims) + cols - 1) // cols
at = Image.new('RGBA', (cw * cols, ch * rows), (0, 0, 0, 0))
for j, (n, im) in enumerate(ims):
    x, y = (j % cols) * cw + 1, (j // cols) * ch + 1; at.paste(im, (x, y)); meta['img'][f'{kind}-{n}'] = [im.width, im.height, round(cx_of(im), 1), x, y]
at.save(f'{ROOT}/fit/{kind}.webp', 'WEBP', quality=88, method=6, alpha_quality=100)
open('../../sprdata9.js', 'w').write(s9[:s9.index('{')] + json.dumps(meta) + s9[s9.rindex('}') + 1:])
print(kind, 'scale', round(s, 3), os.path.getsize(f'{ROOT}/fit/{kind}.webp') // 1024, 'KB')
