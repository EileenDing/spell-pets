# writes the outlined wallpapers: set walls into assets/v9/cut (originals kept as .orig.png), shop walls into ../../sprdata8.js
import base64, io, json, os, shutil
from PIL import Image
from walls import tiles, outline, OUT
T = tiles(); SETW = {'clock', 'subway', 'desert'}; over = {}
for k in OUT:
    name = k[5:]
    if name in SETW:
        p = f'../v9/cut/wall-{name}.png'; o = p.replace('.png', '.orig.png')
        if not os.path.exists(o): shutil.copy(p, o)
        outline(Image.open(o).convert('RGB')).save(p)
    else:
        b = io.BytesIO(); outline(T[k]).save(b, 'WEBP', quality=92); over[k] = 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()
open('../../sprdata8.js', 'w').write('// Wallpapers whose tone-on-tone pattern is drawn as white lines (assets/v13/apply_walls.py)\nObject.assign(SPR_SRC, ' + json.dumps(over) + ');\n')
print('set walls', sorted(SETW), 'shop walls', list(over))
