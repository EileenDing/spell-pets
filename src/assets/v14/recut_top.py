# Nov 2026: hats on the first row were cut because the page header mask (header=92) reached into the cells.
# Re-cut every page with header=72 and keep a new picture where it is taller than the old one.
import json
from PIL import Image
from pets_cut4 import page_figs
from cells import SPECIAL, EVERYDAY, PAGES
SKIP = {'dragon', 'snake'}            # these came from the separate replacement sheets
changed = []
for p in range(32):
    kind = PAGES[p // 2]
    if kind in SKIP: continue
    names = SPECIAL if p % 2 == 0 else EVERYDAY
    figs = page_figs(p, header=72)
    if len(figs) != len(names): print('page', p, kind, len(figs), 'want', len(names)); continue
    for nm, f in zip(names, figs):
        old = Image.open(f'fit/{kind}-{nm}.png')
        if f.height > old.height + 2 and abs(f.width - old.width) <= max(12, old.width * 0.12):
            f.save(f'fit_h72/{kind}-{nm}.png'); changed.append((kind, nm, old.size, f.size))
for c in changed: print(c)
print(len(changed))
json.dump(changed, open('recut_top.json', 'w'))
