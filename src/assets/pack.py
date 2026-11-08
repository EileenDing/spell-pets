import base64, io, json, glob, os
from PIL import Image
out = {}
def enc(im, **kw):
    b = io.BytesIO(); im.save(b, 'WEBP', method=6, **kw); return 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()
for f in sorted(glob.glob('cut/*.png')):
    n = os.path.basename(f)[:-4]
    out[n] = enc(Image.open(f), quality=90, alpha_quality=100)
out['town'] = enc(Image.open('town_clean.png').convert('RGB'), quality=86)
anc = json.load(open('anchors.json'))
anc['parrot'].update(ex=68, ey=50, es=40, er=5)
js = '// Pixel-art sprites cut from the asset sheet + the Pet Town map (WebP data URIs)\nconst SPR_SRC = ' + json.dumps(out) + ';\nconst PET_ANCHOR = ' + json.dumps(anc) + ';\n'
open('/home/claude/sprdata.js', 'w').write(js)
print(len(js))
