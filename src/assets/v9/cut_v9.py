# Cuts all pieces of the eight catalog sheets (s1..s8.png) into cut/it-<id>.png, and the 28 wall/floor swatches.
import numpy as np, os, json
from PIL import Image
from scipy import ndimage
from detect import boxes
os.makedirs('cut', exist_ok=True)
SHEETS = {}
def sheet(n):
    if n not in SHEETS:
        A = np.array(Image.open(f's{n}.png').convert('RGB')).astype(int)
        bg = np.median(np.concatenate([A[2, :], A[-3, :], A[:, 2], A[:, -3]]), axis=0); SHEETS[n] = (A, bg)
    return SHEETS[n]
def cut(n, core, name, up=45, side=22, down=4, keep=0.03, tol=30):
    A, bg = sheet(n); H, W = A.shape[:2]; x0, y0, x1, y1 = core
    X0, Y0, X1, Y1 = max(0, x0 - side), max(0, y0 - up), min(W, x1 + side), min(H, y1 + down)
    c = A[Y0:Y1, X0:X1]
    near = np.abs(c - bg).sum(-1) < tol
    lab, k = ndimage.label(near)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    fg = ~np.isin(lab, list(edge))
    # small enclosed pockets of background colour belong to the item (highlights); big ones are see-through gaps
    holes = ndimage.binary_fill_holes(fg) & ~fg; hl, hn = ndimage.label(holes)
    if hn:
        hs = ndimage.sum(holes, hl, range(1, hn + 1)); fg |= np.isin(hl, [i + 1 for i, s in enumerate(hs) if s < 500])
    fl, fn = ndimage.label(fg)
    coremask = np.zeros_like(fg); coremask[y0 - Y0 + 4:y1 - Y0 - 4, x0 - X0 + 4:x1 - X0 - 4] = True
    sizes = ndimage.sum(fg, fl, range(1, fn + 1)); big = sizes.max() if fn else 0
    objs = ndimage.find_objects(fl)
    thin = lambda o: (o[0].stop - o[0].start) <= 15 and (o[1].stop - o[1].start) > 50      # edge of a label plaque
    ids = [i + 1 for i in range(fn) if sizes[i] >= big * keep and (fl == i + 1)[coremask].any() and not thin(objs[i])]
    fg = np.isin(fl, ids)
    a = (fg * 255).astype(np.uint8); e = fg & ~ndimage.binary_erosion(fg); a[e] = 215
    im = Image.fromarray(np.dstack([c.astype(np.uint8), a]), 'RGBA'); bb = im.getbbox(); im = im.crop(bb)
    im.save(f'cut/it-{name}.png'); return im.size

ITEMS = []   # (sheet, core, id)
def add_detected(n, top, names, extra=()):
    _, res = boxes(f's{n}.png', top)
    res = list(res)
    for i, nm in enumerate(names):
        if nm is None: continue
        if isinstance(nm, tuple):                      # merge several detected boxes
            idx, nm = nm; bs = [res[j] for j in idx]
            b = [min(x[0] for x in bs), min(x[1] for x in bs), max(x[2] for x in bs), max(x[3] for x in bs)]
        else: b = res[i]
        if nm == 'scroll': b = [b[0], b[1], b[2], 1003]
        ITEMS.append((n, b, nm))
    for b, nm in extra: ITEMS.append((n, b, nm))
add_detected(1, 90, ['cranemobile', 'origamiprint', ((2, 3), 'paperbirds'), None, 'blossomvase', 'suitcases', 'transitmap', 'creammug', 'ivy', 'neonclef', 'loudspeaker',
                     'turntable', 'vinylrecords', 'scroll', 'teavase', 'teapot', 'jargroup', 'desertcactus', 'desertthrow', 'alpinequilt', 'tidalquilt'])
add_detected(3, 90, [None, 'vinebasket', 'monstera2', 'rainbowprint', 'daisyvase', 'teatray', 'teddy2', None, 'coral', 'shells', 'sailboat', 'starfishjar', 'openbook', 'pearllamp',
                     None, 'orangetree2', 'marmalade', 'fruitbowl', 'juicer', 'orangeframe', 'pancaketray', None, 'cloudshelf2', 'dropletprint', 'landscapeprint', 'clipsketches', 'paperbasket',
                     None, 'gearmodel', 'domemech', 'wrenchset', 'workvise', 'worklantern', 'drawerchest', None, 'pinecone', 'logbundle', 'redmug', 'snowpillow', 'knitpouf2'],
             extra=[((1330, 585, 1485, 700), 'umbrellalamp'), ((483, 890, 585, 992), 'evergreenframe')])
add_detected(4, 90, ['leafrug2', 'cushions', 'pawrug2', 'starrug2', 'braidedrug', 'quiltcheck', 'nestpillow', 'quiltstar', 'waverug', 'cushionpaw', 'wedgerug', 'boothcushion',
                     'raindroprug', 'cloudpillow', 'gearrug2', 'snowrunner', 'boatmat', 'sleeperblanket', 'recordpillow', 'floorcushion', 'oasisrug2', 'throw'])
add_detected(7, 90, ['forestlantern', 'mushroomlamp', 'starlight2', 'jellypendant', 'orblamp', 'orangependant', 'umbrellafloorlamp', 'bedlantern', 'pendulumpendant', 'bedsidelamp',
                     'snowflakependant', 'tablelantern', 'ironstove', 'geopendant', 'desklamp', 'signalpendant', 'trunklamp', 'neoneq', 'paperlantern', 'shojilantern', 'cactuspendant', 'fairylights'],
             extra=[((392, 717, 548, 777), 'berthlight'), ((946, 704, 1186, 781), 'spottrack')])
add_detected(8, 90, ['forestsofa', 'coffeetable', 'leafybookcase', 'cottagenightstand', 'leafybookshelf', 'pastelpedestal', 'yellowchair', 'cubbyshelf', 'starrychest', 'driftbench2',
                     'stumptable', 'wallbookcase', 'shelldresser2', 'boothseats', 'breakfasttable', 'citruscounter2', 'drawingdesk', 'roundstool', 'floorchest', 'workbench2', 'tooldrawers',
                     'workshopnightstand', 'alpinepouf', 'lograck', 'paperdesk', 'geostool', 'paperdrawers', 'subwaybench', 'luggagerack2', 'metaltrunk', 'keyboardstand', 'recordcabinet',
                     'teatraytable', 'ceramiccabinet', 'desertbench'])
WIN = [('win-forest', (107, 70, 324, 270)), ('win-cottage', (427, 70, 727, 270)), ('win-pastel', (800, 70, 1087, 270)), ('win-starry', (1167, 70, 1453, 270)),
       ('win-tidal', (93, 324, 344, 541)), ('win-citrus', (460, 324, 689, 550)), ('win-rainy', (847, 324, 1036, 550)), ('win-clock', (1191, 324, 1424, 550)),
       ('win-alpine', (67, 598, 367, 785)), ('win-paper', (460, 598, 683, 785)), ('win-subway', (763, 598, 1117, 785)), ('win-music', (1167, 598, 1477, 785)),
       ('win-tea', (273, 827, 473, 974)), ('win-desert', (1013, 827, 1233, 985))]
for nm, b in WIN: ITEMS.append((5, b, nm))
BC = [(25, 368), (399, 755), (783, 1137), (1167, 1511)]; BR = [(48, 250), (284, 505), (538, 745), (778, 982)]
BEDS = ['bed-forest', 'bed-cottage', 'bed-pastel', 'bed-starry', 'bed-tidal', 'bed-citrus', 'bed-rainy', 'bed-clock', 'bed-alpine', 'bed-paper', 'bed-subway', 'bed-music', 'bed-tea', 'bed-desert']
for i, nm in enumerate(BEDS):
    r, c = divmod(i, 4); ITEMS.append((6, (BC[c][0] + 20, BR[r][0] + 20, BC[c][1] - 20, BR[r][1] - 4), nm))
if __name__ == '__main__':
    out = {}
    for n, b, nm in ITEMS:
        o = dict(up=12, side=8, down=0) if n in (5, 6) else {}
        out[nm] = cut(n, b, nm, **o)
    json.dump(out, open('sizes.json', 'w')); print(len(out), 'items')
    # wall and floor swatches (sheet 2): inner part of each square
    A = np.array(Image.open('s2.png').convert('RGB'))
    SW = {'forest': (32, 100, 200, 100), 'cottage': (385, 100, 553, 100), 'pastel': (735, 100, 903, 100), 'starry': (1085, 100, 1253, 100), 'tidal': (1435, 100, 1603, 100),
          'citrus': (32, 367, 200, 367), 'rainy': (385, 367, 553, 367), 'clock': (735, 367, 903, 367), 'alpine': (1085, 367, 1253, 367), 'paper': (1435, 367, 1603, 367),
          'subway': (94, 628, 286, 628), 'music': (500, 628, 688, 628), 'tea': (910, 628, 1098, 628), 'desert': (1320, 628, 1508, 628)}
    for k, (wx, wy, fx, fy) in SW.items():
        Image.fromarray(A[wy + 12:wy + 140, wx + 12:wx + 148]).save(f'cut/wall-{k}.png')
        Image.fromarray(A[fy + 12:fy + 140, fx + 10:fx + 128]).save(f'cut/floor-{k}.png')
    # the tea window's label covers the bottom of its round frame: rebuild the bottom by mirroring the top of the ring
    a = np.array(Image.open('cut/it-win-tea.png')); h, w = a.shape[:2]; r = w / 2; cx = (w - 1) / 2; cy = r - 0.5
    H = int(round(2 * r)); b = np.zeros((H, w, 4), np.uint8); b[:h] = a
    yy, xx = np.mgrid[0:H, 0:w]; dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    last = h - 3
    for y in range(h - 30, H):
        my = int(round(2 * cy - y)); ring = (dist[y] >= r - 15) & (dist[y] <= r + 0.5); inner = dist[y] < r - 15
        b[y, ring] = a[my, ring]
        if y >= last: b[y, inner] = a[max(0, 2 * last - y - 1), inner]
    b[dist > r + 0.5, 3] = 0
    Image.fromarray(b).save('cut/it-win-tea.png')
