# Re-encodes the house pictures into sprdata2.js after editing assets/v2/cut/house-*.png
import base64, io, json, glob, os
from PIL import Image
here = os.path.dirname(os.path.abspath(__file__)); js_path = os.path.join(here, '..', '..', 'sprdata2.js')
js = open(js_path).read(); pre = 'Object.assign(SPR_SRC, '; i = js.index(pre) + len(pre); j = js.rindex(');')
data = json.loads(js[i:j])
for f in sorted(glob.glob(os.path.join(here, 'cut', 'house-*.png'))):
    b = io.BytesIO(); Image.open(f).save(b, 'WEBP', method=6, quality=88, alpha_quality=100)
    data[os.path.basename(f)[:-4]] = 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()
open(js_path, 'w').write(js[:i] + json.dumps(data) + js[j:]); print('houses packed', len(data))
