from PIL import Image; from cutlib import cut, sheet
im = Image.open('skins.png')
NAMES = {'frog': ['leaf', 'mint', 'gold', 'pond', 'plum'], 'octopus': ['coral', 'peach', 'lagoon', 'berry', 'ink'], 'capybara': ['natural', 'honey', 'cocoa', 'cream', 'mist']}
ROWS = {'frog': (128, 340), 'octopus': (440, 652), 'capybara': (750, 960)}
CX = [205, 487, 768, 1050, 1330]
outs = []
for kind, (ya, yb) in ROWS.items():
    for i, sk in enumerate(NAMES[kind]):
        o = cut(im, (CX[i] - 128, ya if i else {'frog': 136, 'octopus': 445, 'capybara': 755}[kind], CX[i] + 128, yb), keep='all', minfrac=0.01)
        if i == 0:                                     # the panel tab line touches the first pet's head: drop it
            import numpy as np; from scipy import ndimage
            a = np.array(o); al = a[..., 3] > 0; al[:3] = False
            near = np.sqrt(((a[..., :3].astype(int) - [254, 248, 237]) ** 2).sum(2)) < 30; al[:16] &= ~near[:16]
            lab, n = ndimage.label(al); sz = ndimage.sum(al, lab, range(1, n + 1)); keep = np.isin(lab, [j + 1 for j, v in enumerate(sz) if v > sz.max() * 0.01])
            # thin horizontal strays: rows where the run is wider than the row below by a lot near the top
            a[..., 3] = np.where(keep, a[..., 3], 0); o = Image.fromarray(a); o = o.crop(o.getbbox())
        name = f'pet-{kind}' if i == 0 else f'pet-{kind}-{sk}'
        o.save(f'cut/{name}.png'); outs.append(o); print(name, o.size)
sheet(outs, 'pets_sheet.png', scale=0.6)
