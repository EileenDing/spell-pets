# Builds the 14 room sets as finished rooms (1536x1024) from the catalog pieces, on faded walls and floors.
import numpy as np, json, os
from PIL import Image, ImageFilter
here = os.path.dirname(os.path.abspath(__file__)); os.chdir(here)
G = 1.22                                # every piece a bit bigger than its slot
S2 = 2                                  # render scale (room is 768x512 in game units)
RW, RH, WALL = 768, 512, 380             # set rooms: tall walls and a shallow floor, like the room pictures
def fade(im, wash, white):
    a = np.array(im.convert('RGB')).astype(float); avg = a.reshape(-1, 3).mean(0)
    a = a * (1 - wash) + avg * wash; a = a * (1 - white) + 255 * white
    return Image.fromarray(a.clip(0, 255).astype(np.uint8))
def mirror_tile(t, w, h, scale):
    t = t.resize((round(t.width * scale), round(t.height * scale)), Image.LANCZOS); tw, th = t.size
    big = Image.new('RGB', (tw * 2, th * 2)); big.paste(t, (0, 0)); big.paste(t.transpose(Image.FLIP_LEFT_RIGHT), (tw, 0))
    big.paste(t.transpose(Image.FLIP_TOP_BOTTOM), (0, th)); big.paste(t.transpose(Image.ROTATE_180), (tw, th))
    out = Image.new('RGB', (w, h))
    for y in range(0, h, th * 2):
        for x in range(0, w, tw * 2): out.paste(big, (x, y))
    return out
WALL_FADE, FLOOR_FADE = (0.3, 0.05), (0.62, 0.14)          # (wash toward own colour, toward white)
def background(k):
    W, H, WY = RW * S2, RH * S2, WALL * S2
    bg = Image.new('RGB', (W, H))
    bg.paste(mirror_tile(fade(Image.open(f'cut/wall-{k}.png'), *WALL_FADE), W, WY, 1.6), (0, 0))
    bg.paste(mirror_tile(fade(Image.open(f'cut/floor-{k}.png'), *FLOOR_FADE), W, H - WY, 1.5), (0, WY))
    sh = Image.new('L', (W, H), 0); px = np.zeros((H, W), np.float32)
    ys = np.arange(H)[:, None]
    px += np.clip(1 - np.abs(ys - WY) / 70.0, 0, 1) * 70            # shadow along the wall / floor line
    px += np.clip((ys - (H - 90)) / 90.0, 0, 1) * 40                # darker front edge
    xs = np.arange(W)[None, :]; px += np.clip(1 - np.minimum(xs, W - xs) / 120.0, 0, 1) * 45
    dark = Image.new('RGB', (W, H), (60, 32, 12)); bg = Image.composite(dark, bg, Image.fromarray(px.clip(0, 255).astype(np.uint8)))
    a = np.array(bg)
    a[WY - 22:WY + 6] = (122, 74, 38); a[WY - 22:WY - 13] = (176, 122, 72); a[WY + 4:WY + 10] = (77, 44, 20)     # skirting
    a[0:30] = (143, 90, 46); a[0:10] = (196, 134, 80); a[28:34] = (77, 44, 20)                                      # ceiling beam
    return Image.fromarray(a)
# slots in room units: (x, anchor y, height, max width, anchor)  anchor: 'bottom' | 'top' | 'centre'
OLD_SLOT = {
  'window': (330, 250, 150, 220, 'bottom'), 'ceil': (548, 17, 118, 200, 'top'), 'ceil2': (200, 17, 108, 150, 'top'),
  'walltop': (384, 22, 60, 360, 'top'), 'rack': (150, 34, 62, 250, 'top'),
  'wall_l': (105, 170, 80, 130, 'centre'), 'wall_m': (530, 172, 78, 170, 'centre'),
  'bed': (150, 480, 172, 280, 'bottom'), 'side': (300, 372, 84, 105, 'bottom'), 'big': (690, 366, 205, 150, 'bottom'),
  'mid': (515, 402, 118, 225, 'bottom'), 'front': (515, 476, 70, 160, 'bottom'), 'seat': (618, 482, 90, 125, 'bottom'),
  'plant': (45, 372, 150, 105, 'bottom'), 'plant_r': (735, 372, 145, 100, 'bottom'), 'lamp': (432, 368, 165, 95, 'bottom'),
  'rug': (400, 455, 0, 250, 'centre'), 'soft': (300, 506, 56, 115, 'bottom'), 'front_r': (722, 506, 88, 90, 'bottom'),
}
# real-world sizes: windows and tall cupboards grow the most, small things on tables barely
SLOT = {
  'window': (330, 312, 192, 270, 'bottom'), 'ceil': (548, 17, 128, 215, 'top'), 'ceil2': (200, 17, 118, 160, 'top'),
  'walltop': (384, 22, 70, 420, 'top'), 'rack': (150, 34, 72, 280, 'top'),
  'wall_l': (105, 205, 100, 160, 'centre'), 'wall_m': (530, 205, 96, 200, 'centre'),
  'bed': (140, 494, 190, 300, 'bottom'), 'side': (300, 410, 96, 118, 'bottom'), 'big': (680, 408, 262, 190, 'bottom'),
  'mid': (515, 440, 136, 255, 'bottom'), 'front': (515, 496, 78, 175, 'bottom'), 'seat': (618, 498, 100, 140, 'bottom'),
  'plant': (45, 410, 172, 120, 'bottom'), 'plant_r': (735, 410, 166, 115, 'bottom'), 'lamp': (432, 410, 192, 108, 'bottom'),
  'rug': (400, 470, 0, 300, 'centre'), 'soft': (300, 508, 60, 125, 'bottom'), 'front_r': (722, 508, 92, 100, 'bottom'),
}
RUG_SQ = 0.6                             # rugs seen from the side in a set room
WALL_SLOTS = ('window', 'walltop', 'rack', 'wall_l', 'wall_m', 'ceil', 'ceil2')
def regeo(plan):
    """overrides written for the old 300-unit wall -> the new tall-wall room"""
    out = []
    for piece, slot, o in plan:
        o = dict(o)
        if slot.startswith('on:') or slot == 'sill':
            if 'h' in o: o['h'] = o['h'] * 1.1
            if 'dx' in o: o['dx'] = o['dx'] * 1.15
        else:
            O, N = OLD_SLOT[slot], SLOT[slot]; f = (N[3] / O[3]) if slot == 'rug' else N[2] / O[2]
            if 'h' in o: o['h'] = o['h'] * f
            if 'mw' in o: o['mw'] = o['mw'] * (N[3] / O[3])
            if 'y' in o: o['y'] = o['y'] + (N[1] - O[1]) if slot in WALL_SLOTS else round(WALL + (o['y'] - 300) * (RH - WALL) / (RH - 300))
        out.append((piece, slot, o))
    return out
# set: name, [(piece, slot, overrides)]; slot 'on:<piece>' sits on that piece, 'sill' sits on the window sill
SETS = {
 'forest': ('Forest Room', [('win-forest', 'window', {}), ('forestlantern', 'ceil', {}), ('vinebasket', 'ceil2', {'x': 135}), ('bed-forest', 'bed', {'h': 150}),
   ('leafybookcase', 'big', {}), ('forestsofa', 'mid', {'h': 100}), ('leafrug2', 'rug', {'x': 470}), ('coffeetable', 'front', {'h': 66}), ('monstera2', 'plant', {'x': 300, 'h': 120}), ('cushions', 'soft', {'x': 250})]),
 'cottage': ('Cottage Room', [('win-cottage', 'window', {}), ('bed-cottage', 'bed', {}), ('cottagenightstand', 'side', {}), ('mushroomlamp', 'on:cottagenightstand', {'h': 62}),
   ('leafybookshelf', 'big', {}), ('braidedrug', 'rug', {'x': 470}), ('daisyvase', 'sill', {'h': 52}), ('teatray', 'front', {'h': 48, 'x': 500}), ('quiltcheck', 'front_r', {'h': 70, 'mw': 120, 'x': 700})]),
 'pastel': ('Pastel Room', [('win-pastel', 'window', {}), ('bed-pastel', 'bed', {'h': 115, 'mw': 230}), ('cubbyshelf', 'big', {'h': 150}), ('pastelpedestal', 'mid', {'h': 100, 'x': 500}),
   ('teatray', 'on:pastelpedestal', {'h': 40}), ('yellowchair', 'seat', {'x': 640}), ('pawrug2', 'rug', {'x': 420}), ('rainbowprint', 'wall_l', {}), ('nestpillow', 'soft', {'x': 330, 'h': 50})]),
 'starry': ('Starry Room', [('win-starry', 'window', {}), ('bed-starry', 'bed', {}), ('starrychest', 'big', {'h': 135}), ('starlight2', 'on:starrychest', {'h': 60}),
   ('starrug2', 'rug', {'x': 450}), ('quiltstar', 'soft', {'x': 330, 'h': 60}), ('teddy2', 'front_r', {'x': 600, 'h': 85, 'y': 470})]),
 'tidal': ('Tidal Reading Room', [('win-tidal', 'window', {'h': 150}), ('jellypendant', 'ceil', {'h': 115, 'x': 520}), ('wallbookcase', 'wall_m', {'mw': 160, 'h': 70, 'x': 655, 'y': 135}), ('bed-tidal', 'bed', {'h': 150}),
   ('stumptable', 'side', {'h': 92}), ('shelldresser2', 'big', {'h': 150}), ('driftbench2', 'mid', {'h': 100, 'x': 500}), ('waverug', 'rug', {'x': 450}), ('coral', 'plant', {'x': 380, 'h': 80, 'y': 372}),
   ('sailboat', 'sill', {'h': 50, 'dx': 60}), ('cushionpaw', 'soft', {'x': 320, 'h': 48}), ('tidalquilt', 'front_r', {'h': 62, 'mw': 115, 'x': 690})]),
 'citrus': ('Citrus Breakfast Room', [('win-citrus', 'window', {}), ('orangependant', 'ceil', {'h': 105}), ('orangeframe', 'wall_l', {'h': 70}), ('bed-citrus', 'bed', {'h': 130, 'mw': 200}),
   ('citruscounter2', 'big', {'h': 135, 'mw': 175}), ('boothseats', 'mid', {'h': 105, 'mw': 240, 'x': 505}), ('breakfasttable', 'mid', {'h': 100, 'x': 505, 'y': 410}),
   ('wedgerug', 'rug', {'x': 470, 'mw': 210}), ('orangetree2', 'plant', {'x': 300, 'h': 110}), ('marmalade', 'sill', {'h': 38, 'dx': -50})]),
 'rainy': ('Rainy Day Studio', [('win-rainy', 'window', {'h': 160}), ('cloudshelf2', 'wall_l', {'mw': 150, 'h': 75, 'x': 115, 'y': 120}), ('dropletprint', 'wall_m', {'h': 62, 'x': 560}),
   ('bed-rainy', 'bed', {'h': 185}), ('umbrellafloorlamp', 'lamp', {'x': 440}), ('drawingdesk', 'mid', {'h': 110, 'x': 560}), ('roundstool', 'seat', {'x': 610, 'h': 70}),
   ('floorchest', 'front_r', {'h': 60, 'mw': 100}), ('raindroprug', 'rug', {'x': 440}), ('cloudpillow', 'soft', {'x': 310, 'h': 55}), ('paperbasket', 'plant_r', {'h': 80})]),
 'clock': ('Clockwork Workshop', [('win-clock', 'window', {'h': 155}), ('pendulumpendant', 'ceil', {'h': 125}), ('bed-clock', 'bed', {}), ('workshopnightstand', 'side', {'h': 95}),
   ('tooldrawers', 'big', {'h': 125}), ('gearmodel', 'on:tooldrawers', {'h': 55}), ('workbench2', 'mid', {'h': 125, 'mw': 230, 'x': 520}), ('gearrug2', 'rug', {'x': 450}),
   ('domemech', 'front_r', {'h': 70, 'x': 630})]),
 'alpine': ('Alpine Snow Lodge', [('win-alpine', 'window', {'h': 145, 'mw': 235}), ('snowflakependant', 'ceil', {'h': 110, 'x': 560}), ('evergreenframe', 'wall_l', {'h': 70}),
   ('bed-alpine', 'bed', {'h': 150}), ('ironstove', 'big', {'h': 150, 'x': 700}), ('lograck', 'side', {'h': 72, 'x': 600, 'y': 372}), ('alpinepouf', 'seat', {'x': 560, 'h': 70}),
   ('snowrunner', 'rug', {'x': 430, 'mw': 260}), ('pinecone', 'sill', {'h': 36}), ('snowpillow', 'soft', {'x': 330, 'h': 50}), ('tablelantern', 'front_r', {'h': 75})]),
 'paper': ('Paper Fold Studio', [('win-paper', 'window', {'h': 150}), ('geopendant', 'ceil', {'h': 105, 'x': 560}), ('cranemobile', 'ceil2', {'x': 215}), ('origamiprint', 'wall_m', {'h': 78, 'x': 560}),
   ('bed-paper', 'bed', {'h': 140}), ('paperdrawers', 'big', {'h': 115}), ('paperbirds', 'on:paperdrawers', {'h': 42}), ('paperdesk', 'mid', {'h': 105, 'x': 530}),
   ('geostool', 'seat', {'x': 620, 'h': 70}), ('boatmat', 'rug', {'x': 440, 'mw': 200}), ('blossomvase', 'plant', {'x': 300, 'h': 115})]),
 'subway': ('Subway Sleeper', [('win-subway', 'window', {'h': 100, 'mw': 250, 'x': 420, 'y': 240}), ('signalpendant', 'ceil', {'h': 95, 'x': 600}), ('luggagerack2', 'rack', {}),
   ('ivy', 'ceil2', {'x': 742, 'h': 120}), ('transitmap', 'wall_m', {'h': 80, 'x': 640, 'y': 190}), ('bed-subway', 'bed', {'h': 195}),
   ('subwaybench', 'mid', {'h': 95, 'x': 560}), ('creammug', 'on:subwaybench', {'h': 30, 'dx': 55}), ('trunklamp', 'side', {'h': 85, 'x': 330}), ('sleeperblanket', 'soft', {'x': 470, 'h': 55}),
   ('suitcases', 'front_r', {'h': 70, 'mw': 130, 'x': 680})]),
 'music': ('Mini Music Studio', [('win-music', 'window', {'h': 95, 'mw': 230, 'x': 420, 'y': 225}), ('spottrack', 'walltop', {'mw': 230, 'x': 420}), ('neoneq', 'wall_l', {'h': 70, 'mw': 120}),
   ('neonclef', 'wall_m', {'h': 70, 'x': 600}), ('bed-music', 'bed', {'h': 140, 'mw': 240}), ('loudspeaker', 'side', {'h': 105, 'x': 305}), ('keyboardstand', 'mid', {'h': 100, 'x': 500}),
   ('recordcabinet', 'big', {'h': 125}), ('recordpillow', 'rug', {'x': 470, 'mw': 120}), ('vinylrecords', 'front_r', {'h': 70, 'mw': 110})]),
 'tea': ('Tea Garden Room', [('win-tea', 'window', {'h': 155}), ('paperlantern', 'ceil', {'h': 120, 'x': 560}), ('scroll', 'wall_l', {'h': 110, 'y': 160}), ('bed-tea', 'bed', {'h': 118, 'mw': 220}),
   ('ceramiccabinet', 'big', {'h': 135}), ('teatraytable', 'front', {'h': 62, 'mw': 190, 'x': 500, 'y': 460}), ('shojilantern', 'side', {'h': 95, 'x': 300}),
   ('floorcushion', 'soft', {'x': 640, 'h': 55, 'y': 500}), ('teavase', 'plant_r', {'h': 85, 'x': 590, 'y': 372})]),
 'desert': ('Desert Camp', [('win-desert', 'window', {'h': 140}), ('fairylights', 'walltop', {'mw': 420, 'y': 34}), ('cactuspendant', 'ceil', {'h': 120, 'x': 590}), ('bed-desert', 'bed', {'h': 195}),
   ('desertbench', 'mid', {'h': 80, 'mw': 220, 'x': 560}), ('oasisrug2', 'rug', {'x': 440}), ('desertcactus', 'plant_r', {'h': 120}), ('desertthrow', 'soft', {'x': 330, 'h': 52})]),
 'midnight': ('Midnight Room', [('win-midnight', 'window', {'h': 197, 'x': 392, 'y': 290, 'mw': 246}), ('starpendant', 'ceil2', {'x': 192, 'h': 135, 'mw': 164}),
   ('bed-midnight', 'bed', {'h': 176, 'mw': 246, 'x': 130, 'y': 494}), ('midnightstand', 'side', {'h': 75, 'x': 280, 'y': 420}), ('moonorb', 'on:midnightstand', {'h': 59}),
   ('telescope', 'lamp', {'x': 528, 'h': 164, 'mw': 139, 'y': 425}), ('midnightdresser', 'big', {'h': 121, 'mw': 164, 'x': 676, 'y': 418}),
   ('armillary', 'on:midnightdresser', {'h': 89, 'dx': 48}), ('bluebooks', 'on:midnightdresser', {'h': 41, 'dx': -48}), ('starchartrug', 'rug', {'x': 430, 'y': 468, 'mw': 287})]),
 'library': ('Library Archive', [('win-library', 'window', {'h': 182, 'x': 400, 'y': 292, 'mw': 189}), ('chandelier', 'ceil', {'x': 400, 'h': 92, 'mw': 139}),
   ('archivebookcase', 'big', {'x': 130, 'h': 234, 'mw': 213, 'y': 418}), ('pottedivy', 'on:archivebookcase', {'h': 56, 'dx': -50}),
   ('archivebookcase2', 'big', {'x': 638, 'h': 234, 'mw': 213, 'y': 418}), ('globe', 'on:archivebookcase2', {'h': 66, 'dx': 40}),
   ('cardcatalog', 'big', {'x': 92, 'h': 86, 'mw': 102, 'y': 426}), ('libladder', 'lamp', {'x': 232, 'h': 223, 'mw': 164, 'y': 430}),
   ('displaycase', 'mid', {'x': 400, 'y': 430, 'h': 123, 'mw': 184}), ('chaise', 'bed', {'h': 115, 'mw': 221, 'x': 140, 'y': 496}),
   ('writingdesk', 'mid', {'x': 616, 'y': 450, 'h': 113, 'mw': 184}), ('bankerlamp', 'on:writingdesk', {'h': 82, 'dx': 58}), ('archivebooks', 'on:writingdesk', {'h': 34, 'dx': -55}),
   ('footstool', 'seat', {'x': 615, 'h': 69, 'y': 504}), ('archiverug', 'rug', {'x': 410, 'y': 474, 'mw': 344})]),
}
NEWGEO = {'midnight', 'library'}       # laid out straight from the room pictures
for _k in list(SETS):
    if _k not in NEWGEO: SETS[_k] = (SETS[_k][0], regeo(SETS[_k][1]))
def surface_frac(im):
    a = np.array(im)[..., 3] > 120; H, W = a.shape
    for y in range(H):
        if a[y].mean() >= 0.6: return (y + H * 0.04) / H
    return 0.1
def compose(k):
    name, plan = SETS[k]; bg = background(k); placed = {}; layers = []
    for piece, slot, o in plan:
        im = Image.open(f'cut/it-{piece}.png').convert('RGBA')
        if slot.startswith('on:') or slot == 'sill':
            host = placed[slot[3:]] if slot != 'sill' else next(v for kk, v in placed.items() if kk.startswith('win-'))
            h = o.get('h', 50) * G; w = im.width * h / im.height
            x = host['x'] + o.get('dx', 0)
            y = host['y1'] - 6 if slot == 'sill' else host['y0'] + (host['y1'] - host['y0']) * host['surf']
            z = host['z'] + 0.5
            box = (x - w / 2, y - h, x + w / 2, y)
        else:
            x, ay, h, mw, anc = SLOT[slot]; x = o.get('x', x); ay = o.get('y', ay); h = o.get('h', h) * G; mw = o.get('mw', mw) * G
            if slot == 'rug':                                   # lying flat on a shallow floor: squashed, and never deeper than the floor
                w = mw; h = im.height * w / im.width * RUG_SQ
                cap = (RH - WALL) - 16
                if h > cap: w *= cap / h; h = cap
                ay = min(ay, RH - h / 2 - 6)
            else:
                w = im.width * h / im.height
                if w > mw: w = mw; h = im.height * w / im.width
            x = min(max(x, w / 2 + 4), RW - w / 2 - 4)                 # keep it inside the room
            y0 = ay - h if anc == 'bottom' else ay if anc == 'top' else ay - h / 2
            box = (x - w / 2, y0, x + w / 2, y0 + h)
            z = -100 if slot == 'rug' else (-200 + box[3] if slot in ('window', 'wall_l', 'wall_m', 'walltop', 'rack') else (1000 if slot in ('ceil', 'ceil2') else box[3]))
        placed[piece] = dict(x=(box[0] + box[2]) / 2, y0=box[1], y1=box[3], z=z, surf=surface_frac(im))
        layers.append((z, im, box))
    layers.sort(key=lambda t: t[0])
    out = bg.convert('RGBA')
    for z, im, (x0, y0, x1, y1) in layers:
        w, h = round((x1 - x0) * S2), round((y1 - y0) * S2)
        if z >= -100 and z < 1000:                       # soft floor shadow under standing pieces
            pass
        out.alpha_composite(im.resize((w, h), Image.LANCZOS), (round(x0 * S2), round(y0 * S2)))
    return out.convert('RGB'), name, len(plan)
if __name__ == '__main__':
    import sys
    os.makedirs('rooms', exist_ok=True)
    for k in (sys.argv[1:] or SETS):
        im, name, n = compose(k); im.save(f'rooms/{k}.png')
    print('done')
