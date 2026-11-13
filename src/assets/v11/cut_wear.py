from PIL import Image, ImageDraw; import numpy as np; from scipy import ndimage
from panels import panels
FIX = {'army': 800}
def comps(im, box, T=30, minpx=150):
    a = np.array(im.crop(box)).astype(int); bg = np.median(np.concatenate([a[:3].reshape(-1, 3), a[-3:].reshape(-1, 3)]), 0)
    d = np.sqrt(((a - bg) ** 2).sum(2)); m = d > T
    lab, n = ndimage.label(m); objs = ndimage.find_objects(lab); out = []
    for i, o in enumerate(objs):
        s = (lab[o] == i + 1).sum()
        if s < minpx: continue
        mm = ndimage.binary_fill_holes(lab[o] == i + 1)
        rgba = np.dstack([a[o], mm * 255]).astype(np.uint8)
        out.append(((o[1].start + box[0], o[0].start + box[1]), Image.fromarray(rgba, 'RGBA'), s))
    return sorted(out, key=lambda t: t[0][0])
if __name__ == '__main__':
    import os; os.makedirs('wear', exist_ok=True)
    rows = []
    for p in panels():
        im = Image.open(p['file'] + '.png').convert('RGB'); div = FIX.get(p['name'], p['div'])
        x0, y0, x1, y1 = p['box']
        pcs = comps(im, (x0 + 3, y0 + 3, div - 4, y1 - 3))
        for j, (pos, piece, s) in enumerate(pcs): piece.save(f"wear/{p['name']}-{j}.png")
        im.crop((div + 4, y0 + 3, x1 - 3, y1 - 3)).save(f"wear/{p['name']}-sample.png")
        rows.append((p['name'], [pc[1] for pc in pcs]))
    # contact sheet
    H = 160; W = 1500; sheet = Image.new('RGB', (W, H * len(rows)), (90, 160, 210)); dr = ImageDraw.Draw(sheet)
    for r, (nm, pcs) in enumerate(rows):
        x = 110; dr.text((5, r * H + 70), nm, fill=(255, 255, 255))
        for j, pc in enumerate(pcs):
            sc = min(1, 140 / pc.height, 200 / pc.width); t = pc.resize((max(1, int(pc.width * sc)), max(1, int(pc.height * sc))))
            sheet.paste(t, (x, r * H + 10), t); dr.text((x, r * H + 145), str(j), fill=(255, 255, 0)); x += t.width + 25
    sheet.save('wear_sheet.png'); print([ (n, len(p)) for n, p in rows])
