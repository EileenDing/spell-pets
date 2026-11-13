# Packs the 14 room sets -> ../../sprdata3.js (walls+floor backgrounds, small previews, every piece) and ../../sets2.js.
# Each set is an empty room background plus its pieces placed where compose_v9 puts them, so every piece can be moved.
import base64, io, json, os
from PIL import Image
here = os.path.dirname(os.path.abspath(__file__)); os.chdir(here)
from compose_v9 import SETS, SLOT, G, RW, background, compose, surface_frac
def enc(im, q=88):
    b = io.BytesIO(); im.save(b, 'WEBP', method=6, quality=q, alpha_quality=100); return 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()
WN = {'forest': ('Warm Wood', 'Honey Plank'), 'cottage': ('Cream Plaster', 'Wood Wainscot'), 'pastel': ('Pink Stripe', 'Pale Boards'), 'starry': ('Blue Star Panel', 'Medium Wood'),
      'tidal': ('Aqua Ripple', 'Blue Mosaic'), 'citrus': ('Orange Blossom', 'Terracotta Tile'), 'rainy': ('Slate Rain Stripe', 'Grey Herringbone'), 'clock': ('Brass Gear', 'Dark Walnut Board'),
      'alpine': ('Ivory Snowflake', 'Pale Timber'), 'paper': ('Origami Diagram', 'Honey Checker'), 'subway': ('Green Subway Tile', 'Speckled Terrazzo'), 'music': ('Purple Acoustic', 'Wood-Vinyl Checker'),
      'tea': ('Botanical Rice Paper', 'Tatami Grid'), 'desert': ('Peach Dune', 'Rose Adobe Tile'), 'midnight': ('Constellation', 'Midnight Plank'), 'library': ('Archive Green', 'Herringbone Oak')}
NAMES = {
 'forestlantern': 'Forest Lantern', 'vinebasket': 'Hanging Vine Basket', 'leafybookcase': 'Leafy Bookcase', 'forestsofa': 'Forest Sofa', 'leafrug2': 'Leaf Rug', 'coffeetable': 'Log Coffee Table',
 'monstera2': 'Monstera Pot', 'cushions': 'Floor Cushions', 'cottagenightstand': 'Cottage Nightstand', 'mushroomlamp': 'Mushroom Lamp', 'leafybookshelf': 'Leafy Bookshelf', 'braidedrug': 'Braided Rug',
 'daisyvase': 'Daisy Vase', 'teatray': 'Tea Tray', 'quiltcheck': 'Checked Quilt', 'cubbyshelf': 'Cubby Shelf', 'pastelpedestal': 'Pastel Side Table', 'yellowchair': 'Yellow Chair', 'pawrug2': 'Paw Rug',
 'rainbowprint': 'Rainbow Print', 'nestpillow': 'Nest Pillow', 'starrychest': 'Starry Chest', 'starlight2': 'Star Lamp', 'starrug2': 'Star Rug', 'quiltstar': 'Star Quilt', 'teddy2': 'Teddy Bear',
 'jellypendant': 'Jellyfish Pendant', 'wallbookcase': 'Wall Bookcase', 'stumptable': 'Stump Table', 'shelldresser2': 'Shell Dresser', 'driftbench2': 'Driftwood Bench', 'waverug': 'Wave Rug', 'coral': 'Coral',
 'sailboat': 'Toy Sailboat', 'cushionpaw': 'Paw Cushion', 'tidalquilt': 'Tidal Quilt', 'orangependant': 'Orange Pendant', 'orangeframe': 'Orange Picture', 'citruscounter2': 'Citrus Counter',
 'boothseats': 'Booth Seats', 'breakfasttable': 'Breakfast Table', 'wedgerug': 'Orange Slice Rug', 'orangetree2': 'Orange Tree', 'marmalade': 'Marmalade Jar', 'cloudshelf2': 'Cloud Shelf',
 'dropletprint': 'Raindrop Print', 'umbrellafloorlamp': 'Umbrella Floor Lamp', 'drawingdesk': 'Drawing Desk', 'roundstool': 'Round Stool', 'floorchest': 'Floor Chest', 'raindroprug': 'Raindrop Rug',
 'cloudpillow': 'Cloud Pillow', 'paperbasket': 'Paper Basket', 'pendulumpendant': 'Pendulum Pendant', 'workshopnightstand': 'Workshop Nightstand', 'tooldrawers': 'Tool Drawers', 'gearmodel': 'Gear Model',
 'workbench2': 'Workbench', 'gearrug2': 'Gear Rug', 'domemech': 'Glass Dome Gadget', 'snowflakependant': 'Snowflake Pendant', 'evergreenframe': 'Evergreen Picture', 'ironstove': 'Iron Stove',
 'lograck': 'Log Rack', 'alpinepouf': 'Alpine Pouf', 'snowrunner': 'Snow Runner Rug', 'pinecone': 'Pinecone', 'snowpillow': 'Snow Pillow', 'tablelantern': 'Table Lantern', 'geopendant': 'Paper Pendant',
 'cranemobile': 'Paper Crane Mobile', 'origamiprint': 'Origami Print', 'paperdrawers': 'Paper Drawers', 'paperbirds': 'Paper Birds', 'paperdesk': 'Paper Desk', 'geostool': 'Folded Stool',
 'boatmat': 'Paper Boat Mat', 'blossomvase': 'Blossom Vase', 'signalpendant': 'Signal Lamp', 'luggagerack2': 'Luggage Rack', 'ivy': 'Hanging Ivy', 'transitmap': 'Transit Map', 'subwaybench': 'Subway Bench',
 'creammug': 'Cream Mug', 'trunklamp': 'Trunk Lamp', 'sleeperblanket': 'Sleeper Blanket', 'suitcases': 'Suitcases', 'spottrack': 'Spotlight Track', 'neoneq': 'Neon Sound Sign', 'neonclef': 'Neon Clef Sign',
 'loudspeaker': 'Loudspeaker', 'keyboardstand': 'Keyboard', 'recordcabinet': 'Record Cabinet', 'recordpillow': 'Record Pillow', 'vinylrecords': 'Vinyl Records', 'paperlantern': 'Paper Lantern',
 'scroll': 'Hanging Scroll', 'ceramiccabinet': 'Ceramic Cabinet', 'teatraytable': 'Tea Table', 'shojilantern': 'Shoji Lantern', 'floorcushion': 'Floor Cushion', 'teavase': 'Tea Vase',
 'fairylights': 'Fairy Lights', 'cactuspendant': 'Cactus Pendant', 'desertbench': 'Desert Bench', 'oasisrug2': 'Oasis Rug', 'desertcactus': 'Potted Cactus', 'desertthrow': 'Desert Throw',
 'bed-midnight': 'Crescent Pet Bed', 'midnightstand': 'Bedside Table', 'moonorb': 'Moon Orb Lamp', 'win-midnight': 'Arched Night Window', 'starpendant': 'Glass Star Pendant', 'starchartrug': 'Star Chart Rug',
 'telescope': 'Telescope', 'midnightdresser': 'Three-Drawer Dresser', 'armillary': 'Armillary Sphere', 'bluebooks': 'Blue Books', 'chaise': 'Chaise', 'archivebookcase': 'Archive Bookcase',
 'libladder': 'Library Ladder', 'cardcatalog': 'Card Catalog', 'win-library': 'Leaded Window', 'chandelier': 'Chandelier', 'displaycase': 'Display Case', 'writingdesk': 'Writing Desk',
 'bankerlamp': 'Banker Lamp', 'footstool': 'Footstool', 'archiverug': 'Archive Rug', 'globe': 'Globe', 'pottedivy': 'Potted Ivy', 'archivebooks': 'Stacked Books',
}
GROUP_FIX = {'libladder': 'cosy', 'telescope': 'cosy', 'globe': 'cosy', 'moonorb': 'lights', 'bankerlamp': 'lights'}
SEATS = ('sofa', 'bench', 'booth', 'chair', 'stool', 'pouf')
def group(piece, slot):
    if piece in GROUP_FIX: return GROUP_FIX[piece]
    if slot == 'bed' or any(s in piece for s in SEATS): return 'beds'
    if slot in ('window', 'rug'): return 'rugs'
    if slot in ('ceil', 'ceil2', 'walltop', 'lamp', 'wall_l', 'wall_m', 'rack') or 'lamp' in piece or 'lantern' in piece: return 'lights'
    if slot in ('plant', 'plant_r'): return 'plants'
    if slot in ('big', 'side', 'mid', 'front'): return 'tables'
    return 'cosy'
def place(slot): return 'wall' if slot in ('window', 'wall_l', 'wall_m', 'walltop', 'rack') else 'ceil' if slot in ('ceil', 'ceil2') else 'rug' if slot == 'rug' else 'floor'
def layout(k):
    """the same placement compose_v9 uses -> [(piece, slot, box, host)]"""
    name, plan = SETS[k]; placed = {}; out = []
    for piece, slot, o in plan:
        im = Image.open(f'cut/it-{piece}.png').convert('RGBA'); host = None
        if slot.startswith('on:') or slot == 'sill':
            host = slot[3:] if slot != 'sill' else next(kk for kk in placed if kk.startswith('win-'))
            hp = placed[host]; h = o.get('h', 50) * G; w = im.width * h / im.height; x = hp['x'] + o.get('dx', 0)
            y = hp['y1'] - 6 if slot == 'sill' else hp['y0'] + (hp['y1'] - hp['y0']) * hp['surf']
            box = (x - w / 2, y - h, x + w / 2, y)
        else:
            x, ay, h, mw, anc = SLOT[slot]; x = o.get('x', x); ay = o.get('y', ay); h = o.get('h', h) * G; mw = o.get('mw', mw) * G
            if slot == 'rug': w = mw; h = im.height * w / im.width
            else:
                w = im.width * h / im.height
                if w > mw: w = mw; h = im.height * w / im.width
            x = min(max(x, w / 2 + 4), RW - w / 2 - 4)
            y0 = ay - h if anc == 'bottom' else ay if anc == 'top' else ay - h / 2
            box = (x - w / 2, y0, x + w / 2, y0 + h)
        placed[piece] = dict(x=(box[0] + box[2]) / 2, y0=box[1], y1=box[3], surf=surface_frac(im))
        out.append((piece, slot, box, host))
    return out
imgs, rooms, walls, floors, furn = {}, [], [], [], {}
for k, (name, plan) in SETS.items():
    imgs['theme-' + k] = enc(background(k).resize((1152, 768), Image.LANCZOS), 84)
    full, _, _ = compose(k); imgs['setprev-' + k] = enc(full.resize((480, 320), Image.LANCZOS), 84)
    imgs['wall-' + k] = enc(Image.open(f'cut/wall-{k}.png'), 90); imgs['floor-' + k] = enc(Image.open(f'cut/floor-{k}.png'), 90)
    items = []
    for piece, slot, (x0, y0, x1, y1), host in layout(k):
        pl = place(slot); w, h = x1 - x0, y1 - y0
        size = round(w) if pl == 'rug' else round(h)
        y = round((y0 + y1) / 2) if pl == 'rug' else 0 if pl == 'ceil' else round(y1)
        it = {'k': piece, 'x': round((x0 + x1) / 2), 'y': y}
        if host: it['on'] = host
        items.append(it)
        if piece not in furn:
            nm = NAMES.get(piece) or (piece.startswith('win-') and name.split(' ')[0] + ' Window') or (piece.startswith('bed-') and name.split(' ')[0] + ' Bed') or piece
            furn[piece] = [piece, nm, group(piece, slot), 0, pl, size, it['x'], y, [k]]
            if 'it-' + piece not in imgs: imgs['it-' + piece] = enc(Image.open(f'cut/it-{piece}.png').convert('RGBA'), 88)
        elif k not in furn[piece][8]: furn[piece][8].append(k)
    price = int(5 * round((80 + 10 * len(plan)) / 5))
    rooms.append({'k': k, 'name': name, 'wall': k, 'floor': k, 'items': items, 'scene': 1, 'floorY': 380, 'wy': 380, 'price': price, 'pieces': len(plan)})
    walls.append([k, WN[k][0], 20]); floors.append([k, WN[k][1], 20])
out = os.path.join(here, '..', '..')
open(os.path.join(out, 'sprdata3.js'), 'w').write('// Room sets: empty room backgrounds, small previews, walls, floors and every set piece (WebP data URIs)\nObject.assign(SPR_SRC, ' + json.dumps(imgs) + ');\n')
open(os.path.join(out, 'sets2.js'), 'w').write('\n'.join([
  '// Fourteen room sets built from the Pet Town catalog pieces (assets/v9). Generated by assets/v9/pack_v9.py.',
  '// Each set is a wall+floor background plus its pieces; every piece can be moved, put away and put back.',
  '// SET_FURN: key, name, group, price, place, size, x, y, [sets it belongs to]',
  'const SET_FURN = ' + json.dumps(list(furn.values())) + ';', 'const SET_WALLS = ' + json.dumps(walls) + ';', 'const SET_FLOORS = ' + json.dumps(floors) + ';', 'const SET_ROOMS = ' + json.dumps(rooms) + ';']) + '\n')
print(len(rooms), 'sets', len(furn), 'pieces', sum(len(v) for v in imgs.values()) // 1024, 'KB')
