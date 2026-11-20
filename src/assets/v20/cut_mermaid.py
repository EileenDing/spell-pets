# New mermaid costume sheet (Nov 19 2026): 4x4, one picture per pet -> ../v14/fit/<kind>-mermaid.png (same size as the old ones), then repack_one.py per pet
import sys; sys.path.insert(0, '../v19')
import numpy as np; from PIL import Image; from scipy import ndimage
KINDS = ['dragon','dinosaur','dog','cat','turtle','rabbit','pig','rat','monkey','trex','snake','parrot','owl','capybara','frog','octopus']
exec(open('../v19/cut.py').read().split('spr = ')[0].split('KINDS = ')[0])   # imports
src = open('../v19/cut.py').read(); exec(src[src.index('def fgmask'):src.index('spr = ')])
grid = cells('mermaid_sheet.png', 4, 4)
for (r, c), img in sorted(grid.items()):
    k = KINDS[r * 4 + c]; old = Image.open(f'old/{k}-mermaid.png')
    h = old.height; w = round(img.width * h / img.height)
    img.resize((w, h), Image.LANCZOS).save(f'../v14/fit/{k}-mermaid.png'); print(k, img.size, '->', (w, h), 'old', old.size)
