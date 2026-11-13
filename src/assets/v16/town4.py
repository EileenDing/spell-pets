# Pet Town as a 4x4 grid of lots: the second row of the painted map is repeated four times, the shops band moves down,
# painted animal signs are wiped (the game draws each pet's sign), and only the greenery around the lots is lightened.
import json, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
O = np.array(Image.open('town_orig.png').convert('RGB')).astype(float)
B0, B1 = 250, 440; P = B1 - B0                  # one row of lots incl. the road under it
TOP = 60; ROWS = 4; MID = TOP + ROWS * P        # lots region 60..820
BOT0 = 640; W = 1536; H = MID + (1024 - BOT0)   # 1204
N = np.zeros((H, W, 3))
N[:TOP] = O[:TOP]
L, R = 140, 1395                                 # the lots part of a band; outside it is river and trees
for r in range(ROWS):
    N[TOP + r * P:TOP + (r + 1) * P, L:R] = O[B0:B1, L:R]
# sides: the original side strips from 60 down, with the last band repeated for the extra height
side = np.concatenate([O[TOP:BOT0], O[BOT0 - (MID - BOT0):BOT0]], 0)[:MID - TOP]
N[TOP:MID, :L] = side[:, :L]; N[TOP:MID, R:] = side[:, R:]
# soften the seams (left/right edges of the band, the repeated side strip)
N[MID:] = O[BOT0:]
img = Image.fromarray(N.clip(0, 255).astype(np.uint8))
blur = img.filter(ImageFilter.GaussianBlur(3)); m = Image.new('L', (W, H), 0); mp = m.load()
for x in list(range(L - 6, L + 6)) + list(range(R - 6, R + 6)):
    for y in range(TOP, MID): mp[x, y] = 255
for y in list(range(BOT0 - 6, BOT0 + 6)) + list(range(MID - 4, MID + 4)):
    for x in list(range(0, L + 6)) + list(range(R - 6, W)): mp[x, y] = 200
img = Image.composite(blur, img, m.filter(ImageFilter.GaussianBlur(3)))
N = np.array(img).astype(float)
# wipe the painted animal signs (interiors measured on the original row)
BOARDS = [(203, 390, 251, 425), (520, 391, 568, 425), (828, 390, 876, 425), (1137, 391, 1186, 425)]
for r in range(ROWS):
    for (x0, y0, x1, y1) in BOARDS:
        y0n, y1n = y0 - B0 + TOP + r * P, y1 - B0 + TOP + r * P
        reg = N[y0n:y1n, x0:x1]; ring = np.concatenate([reg[:2].reshape(-1, 3), reg[-2:].reshape(-1, 3), reg[:, :2].reshape(-1, 3), reg[:, -2:].reshape(-1, 3)]); med = np.median(ring, 0)
        yy, xx = np.mgrid[0:y1n - y0n, 0:x1 - x0]; tone = 1 + 0.04 * np.sin(yy / 3.0)            # faint wood grain
        reg[2:-2, 2:-2] = (med * tone[..., None])[2:-2, 2:-2]
# lighten the greenery around the lots (not lots, not shops): lighter colour, not a white film
def hsv_lift(px, k=0.28, desat=0.82):
    mx = px.max(2, keepdims=True); out = px + (255 - px) * k
    g = out.mean(2, keepdims=True); return g + (out - g) * desat
mask = np.ones((H, W), float)
LOT_X = [(160, 455), (473, 758), (780, 1065), (1085, 1375)]
for r in range(ROWS):
    for (x0, x1) in LOT_X: mask[TOP + r * P + 2:TOP + r * P + 196, x0:x1] = 0
SHOPS = [(70, 670, 340, 900), (375, 660, 640, 905), (630, 660, 900, 960), (915, 660, 1175, 905), (1200, 660, 1490, 905)]   # incl. the fountain and the gate
for (x0, y0, x1, y1) in SHOPS: mask[y0 - BOT0 + MID:y1 - BOT0 + MID, x0:x1] = 0
mask[:TOP, 600:940] = 0                                                                   # the HOMES sign
mask = np.array(Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(10))).astype(float) / 255
N = N * (1 - mask[..., None]) + hsv_lift(N) * mask[..., None]
Image.fromarray(N.clip(0, 255).astype(np.uint8)).save('town4.png')
# lot data for the game
KINDS = [['dragon', 'dinosaur', 'dog', 'cat'], ['turtle', 'rabbit', 'pig', 'rat'], ['monkey', 'trex', 'snake', 'parrot'], ['owl', 'frog', 'octopus', 'capybara']]
COLS = [dict(lx=323, x0=170, x1=445, src='rabbit', bx=227), dict(lx=629, x0=483, x1=748, src='pig', bx=544), dict(lx=939, x0=790, x1=1055, src='rat', bx=852), dict(lx=1248, x0=1095, x1=1365, src='monkey', bx=1161)]
PATCH = {'rabbit': [160, 253, 455, 449], 'pig': [473, 253, 758, 449], 'rat': [780, 253, 1065, 449], 'monkey': [1085, 253, 1375, 449]}
lots = {}
for r, row in enumerate(KINDS):
    dy = TOP + r * P - B0
    for c, k in enumerate(row):
        C = COLS[c]; p = PATCH[C['src']]
        lots[k] = dict(lx=C['lx'], ly=421 + dy, x0=C['x0'], x1=C['x1'], row=r, src=C['src'], patch=[p[0], p[1] + dy, p[2], p[3] + dy], sign=[C['bx'], 408 + dy])
json.dump(dict(H=H, roads=[457 - B0 + TOP + r * P for r in range(ROWS)], shopDy=MID - BOT0, lots=lots), open('town4.json', 'w'))
print(H, 'ok')
