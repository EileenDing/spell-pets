import base64,io,glob,json
from PIL import Image
out={}
for f in sorted(glob.glob('cut_*.png')):
    k=f[4:-4]; key=k if k.startswith('potion-') else 'food-'+k
    if k.startswith('potion-'): key='food-'+k
    b=io.BytesIO(); Image.open(f).save(b,'WEBP',lossless=True,quality=100,method=6)
    out[key]='data:image/webp;base64,'+base64.b64encode(b.getvalue()).decode()
open('/home/claude/spell-pets/src/sprdata11.js','w').write('// New foods and the three potions (assets/v17)\nObject.assign(SPR_SRC, '+json.dumps(out)+');\n')
print(len(out), sum(len(v) for v in out.values())//1024,'KB')
