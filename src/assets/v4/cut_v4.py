# Cuts each piece of furniture out of the two interior-collection sheets (volA.png, volB.png).
# Items stand in front of patterned walls and floors, so the cut uses GrabCut seeded with:
#   - the item's box (outside = background),
#   - colours sampled from that room's bare wall and floor (probably background).
import numpy as np, os, cv2
from PIL import Image
from scipy import ndimage
os.makedirs('cut', exist_ok=True)
SHEETS = {k: cv2.cvtColor(cv2.imread(k + '.png'), cv2.COLOR_BGR2RGB) for k in ('volA', 'volB')}
def palette(sheet, boxes):
    px = np.concatenate([SHEETS[sheet][y0:y1, x0:x1].reshape(-1, 3) for x0, y0, x1, y1 in boxes]).astype(np.float32)
    k = min(10, len(px)); _, _, cen = cv2.kmeans(px, k, None, (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 1), 3, cv2.KMEANS_PP_CENTERS)
    return cen
def cut(sheet, box, name, bgpal=None, tol=22, pad=30, holes=True, keep=0.01, close=3, fgs=(), bgs=(), disk=None, kill=None, clear=()):
    img = SHEETS[sheet]; H, W = img.shape[:2]; x0, y0, x1, y1 = box
    X0, Y0, X1, Y1 = max(0, x0 - pad), max(0, y0 - pad), min(W, x1 + pad), min(H, y1 + pad)
    c = img[Y0:Y1, X0:X1].copy(); h, w = c.shape[:2]
    mask = np.full((h, w), cv2.GC_BGD, np.uint8)
    mask[y0 - Y0:y1 - Y0, x0 - X0:x1 - X0] = cv2.GC_PR_FGD
    if bgpal is not None:
        d = np.min(np.linalg.norm(c[:, :, None, :].astype(np.float32) - bgpal[None, None], axis=-1), axis=-1)
        inner = mask == cv2.GC_PR_FGD
        mask[inner & (d < tol)] = cv2.GC_PR_BGD
    for bx0, by0, bx1, by1 in bgs:                      # parts that are surely background (floor between legs, a neighbour)
        mask[max(0, by0 - Y0):by1 - Y0, max(0, bx0 - X0):bx1 - X0] = cv2.GC_BGD
    for fx0, fy0, fx1, fy1 in fgs:                      # parts that are surely the item
        mask[max(0, fy0 - Y0):fy1 - Y0, max(0, fx0 - X0):fx1 - X0] = cv2.GC_FGD
    bgd = np.zeros((1, 65), np.float64); fgd = np.zeros((1, 65), np.float64)
    cv2.grabCut(c[..., ::-1].copy(), mask, None, bgd, fgd, 8, cv2.GC_INIT_WITH_MASK)
    fg = (mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD)
    fg = ndimage.binary_opening(fg, iterations=1)
    # every item has a dark outline: pull in nearby outline pixels, close small gaps, then fill what the outline encloses
    inbox = np.zeros_like(fg); inbox[y0 - Y0:y1 - Y0, x0 - X0:x1 - X0] = True
    dark = (0.299 * c[..., 0] + 0.587 * c[..., 1] + 0.114 * c[..., 2] < 105) & inbox
    for _ in range(close):
        fg = fg | (dark & ndimage.binary_dilation(fg, iterations=3))
    fg = ndimage.binary_closing(fg, iterations=close) & inbox
    fl, fn = ndimage.label(fg)
    if not fn: print('EMPTY', name); return
    s = ndimage.sum(fg, fl, range(1, fn + 1)); fg = np.isin(fl, [i + 1 for i, v in enumerate(s) if v >= s.max() * keep])
    for bx0, by0, bx1, by1 in bgs: fg[max(0, by0 - Y0):by1 - Y0, max(0, bx0 - X0):bx1 - X0] = False
    if holes: fg = ndimage.binary_fill_holes(fg)
    if kill:                                            # drop wall-coloured pixels the cut still holds (gaps between tassels etc.)
        cols, tol2 = kill; cols = [cols] if isinstance(cols[0], (int, float)) else cols
        d = np.min([np.linalg.norm(c.astype(float) - np.array(col, float), axis=-1) for col in cols], axis=0)
        fg &= ~ndimage.binary_opening(d < tol2, iterations=1)
        fg = ndimage.binary_opening(fg, iterations=2)          # leftover groove lines
        fl2, n2 = ndimage.label(fg)
        if n2: s2 = ndimage.sum(fg, fl2, range(1, n2 + 1)); fg = np.isin(fl2, [i + 1 for i, v in enumerate(s2) if v >= s2.max() * 0.03])
    for qx0, qy0, qx1, qy1 in clear:                    # trim pieces of the neighbours after the cut
        fg[max(0, qy0 - Y0):qy1 - Y0, max(0, qx0 - X0):qx1 - X0] = False
    if disk:                                            # round things (portholes): take the whole disk, repaint what covered it
        cx, cy, r = disk; yy, xx = np.mgrid[0:h, 0:w]; D = (xx - (cx - X0)) ** 2 + (yy - (cy - Y0)) ** 2 <= r * r
        hole = (D & ~fg).astype(np.uint8) * 255
        if hole.any(): c = cv2.inpaint(c, hole, 4, cv2.INPAINT_TELEA)
        fg = D
    a = (fg * 255).astype(np.uint8); a = cv2.GaussianBlur(a, (3, 3), 0); a[a < 40] = 0
    im = Image.fromarray(np.dstack([c, a]), 'RGBA'); im = im.crop(im.getbbox())
    im.save(f'cut/it-{name}.png'); return im.size
def swatch(sheet, box, name):
    x0, y0, x1, y1 = box; Image.fromarray(SHEETS[sheet][y0:y1, x0:x1]).save(f'cut/{name}.png')

# ---------------- the ten rooms ----------------
# room: sheet, room box, set name, wall swatch, floor swatch, items
# item: id, name, place (floor/wall/rug/ceil), box, extra options
ROOMS = {
 'tidal': ('volA', (20, 75, 765, 500), 'Tidal Reading Room', (300, 104, 400, 140), (500, 440, 620, 470), [
   ('shellbed', 'Seashell Bed', 'floor', (60, 228, 302, 452), {}),
   ('crystaltable', 'Glow Orb Table', 'floor', (296, 322, 372, 428), {'fgs': [(330, 370, 340, 420), (300, 375, 368, 385), (315, 385, 360, 420)]}),
   ('driftbench', 'Driftwood Bench', 'floor', (376, 292, 600, 428), {'fgs': [(385, 400, 395, 420), (570, 400, 580, 420), (395, 385, 585, 395)], 'bgs': [(405, 408, 565, 428)]}),
   ('shelldresser', 'Seashell Dresser', 'floor', (595, 258, 737, 438), {'fgs': [(668, 262, 690, 295), (610, 300, 720, 420)]}),
   ('porthole', 'Aquarium Porthole', 'wall', (281, 148, 437, 330), {'disk': (359, 239, 86)}),
   ('jellylamp', 'Jellyfish Lamp', 'ceil', (408, 80, 507, 255), {'fgs': [(447, 82, 455, 100)]}),
   ('seashelf', 'Shell Shelf', 'wall', (83, 120, 292, 257), {'fgs': [(110, 185, 285, 195), (225, 140, 255, 170), (170, 145, 195, 175)]}),
   ('seabookshelf', 'Sailboat Bookshelf', 'wall', (515, 108, 692, 282), {}),
   ('bubblerug', 'Bubble Rug', 'rug', (328, 432, 482, 484), {})]),
 'citrus': ('volA', (775, 75, 1515, 500), 'Citrus Breakfast Room', (900, 100, 1035, 158), (1300, 438, 1480, 466), [
   ('orangetree', 'Orange Tree', 'floor', (797, 220, 898, 415), {}),
   ('orangebed', 'Orange Slice Chair', 'floor', (852, 288, 1021, 440), {}),
   ('breakfastnook', 'Breakfast Nook', 'floor', (1025, 263, 1293, 426), {'fgs': [(1100, 400, 1170, 420), (1095, 330, 1220, 365), (1105, 310, 1130, 330), (1140, 300, 1170, 330), (1170, 310, 1210, 335), (1145, 365, 1165, 400)], 'bgs': [(1030, 412, 1050, 426), (1270, 412, 1293, 426)]}),
   ('archwindow', 'Orange Lamp Window', 'wall', (1035, 85, 1252, 300), {'bgs': [(1030, 290, 1260, 305)]}),
   ('jamshelf', 'Jam Jar Shelf', 'wall', (862, 158, 1018, 257), {}),
   ('orangepic', 'Orange Picture', 'wall', (1265, 184, 1329, 256), {}),
   ('canistershelf', 'Canister Shelf', 'wall', (1345, 138, 1495, 257), {'fgs': [(1350, 190, 1490, 198), (1355, 145, 1412, 188), (1365, 198, 1385, 222)], 'clear': [(1340, 222, 1418, 257), (1340, 200, 1365, 257)]}),
   ('citruscounter', 'Juicer Counter', 'floor', (1305, 223, 1499, 426), {}),
   ('sliceRug', 'Orange Slice Rug', 'rug', (1075, 431, 1246, 479), {})]),
 'rainy': ('volA', (10, 565, 515, 960), 'Rainy Day Studio', (425, 598, 442, 642), (40, 905, 195, 940), [
   ('cloudbed', 'Cloud Bed', 'floor', (27, 697, 216, 904), {}),
   ('rainwindow', 'Rainy Window', 'wall', (209, 601, 331, 822), {'bgs': [(300, 776, 335, 830)]}),
   ('draftdesk', 'Drafting Desk', 'floor', (336, 746, 499, 894), {}),
   ('rollbasket', 'Paper Roll Basket', 'floor', (299, 774, 351, 874), {'fgs': [(305, 822, 345, 868)]}),
   ('tinychest', 'Little Chest', 'floor', (244, 834, 296, 874), {}),
   ('cloudshelf', 'Cloud Shelf', 'wall', (79, 614, 204, 721), {'bgs': [(79, 682, 138, 722)], 'clear': [(79, 682, 150, 722)]}),
   ('raindroppic', 'Raindrop Picture', 'wall', (36, 661, 76, 719), {}),
   ('mountainpic', 'Mountain Picture', 'wall', (439, 649, 489, 701), {}),
   ('cloudrug', 'Raindrop Rug', 'rug', (196, 879, 361, 941), {})]),
 'clock': ('volA', (525, 565, 1005, 960), 'Clockwork Workshop', (640, 595, 690, 640), (555, 910, 705, 937), [
   ('gearbed', 'Gear Bed', 'floor', (544, 734, 691, 911), {}),
   ('gearwindow', 'Pendulum Window', 'wall', (679, 574, 834, 769), {'fgs': [(705, 748, 810, 765), (683, 660, 695, 700), (820, 660, 832, 700)]}),
   ('gearstand', 'Lantern Nightstand', 'floor', (691, 769, 751, 876), {'fgs': [(697, 812, 745, 868)]}),
   ('workbench', 'Tinker Workbench', 'floor', (766, 764, 989, 899), {}),
   ('pegboard', 'Tool Pegboard', 'wall', (844, 644, 974, 788), {}),
   ('gearshelf', 'Gear Shelf', 'wall', (549, 634, 671, 739), {'fgs': [(565, 688, 665, 697)]}),
   ('gearrug', 'Gear Rug', 'rug', (706, 879, 856, 939), {})]),
 'alpine': ('volA', (1015, 565, 1525, 960), 'Alpine Snow Lodge', (1262, 799, 1348, 820), (1080, 926, 1240, 940), [
   ('sledbed', 'Sled Bed', 'floor', (1039, 751, 1259, 919), {}),
   ('snowwindow', 'Snowy Window', 'wall', (1191, 574, 1431, 796), {'fgs': [(1200, 655, 1238, 785), (1383, 655, 1425, 785), (1197, 648, 1425, 660), (1250, 585, 1295, 645)]}),
   ('woodstove', 'Wood Stove', 'floor', (1421, 621, 1509, 864), {}),
   ('firewood', 'Firewood Stack', 'floor', (1364, 799, 1429, 874), {}),
   ('knitpouf', 'Knitted Pouf', 'floor', (1261, 824, 1361, 886), {}),
   ('lanternshelf', 'Lantern Shelf', 'wall', (1036, 646, 1134, 751), {}),
   ('snowpic', 'Snowy Picture', 'wall', (1131, 664, 1189, 734), {}),
   ('snowrug', 'Snowflake Rug', 'rug', (1249, 891, 1456, 939), {})]),
 'paper': ('volB', (25, 100, 755, 512), 'Paper Fold Studio', (245, 235, 300, 265), (55, 478, 375, 500), [
   ('boatbed', 'Paper Boat Bed', 'floor', (136, 274, 371, 452), {}),
   ('blossomvase', 'Blossom Vase', 'floor', (44, 301, 139, 459), {'fgs': [(58, 405, 122, 452)], 'clear': [(124, 395, 139, 459), (44, 395, 57, 459)]}),
   ('geolamp', 'Folded Lamp', 'ceil', (236, 119, 324, 231), {}),
   ('diamondwindow', 'Diamond Window', 'wall', (299, 174, 474, 349), {'bgs': [(458, 230, 478, 275), (445, 192, 480, 228)]}),
   ('cranemobile', 'Crane Mobile', 'ceil', (424, 119, 551, 274), {'fgs': [(440, 140, 525, 160), (454, 119, 462, 145)], 'bgs': [(425, 242, 457, 280), (424, 119, 450, 138), (466, 119, 551, 138)], 'clear': [(424, 119, 451, 175), (463, 119, 551, 157)]}),
   ('origamidesk', 'Origami Desk', 'floor', (394, 262, 599, 476), {'bgs': [(455, 255, 515, 275), (565, 440, 600, 476), (582, 330, 600, 476)], 'fgs': [(474, 410, 548, 468), (410, 380, 440, 440), (540, 380, 580, 440)], 'clear': [(428, 446, 471, 477), (551, 446, 581, 477)]}),
   ('papercabinet', 'Paper Cabinet', 'floor', (581, 294, 729, 464), {'fgs': [(592, 345, 668, 455), (585, 298, 640, 340)]}),
   ('origamiposter', 'Origami Poster', 'wall', (621, 174, 726, 296), {})]),
 'subway': ('volB', (775, 100, 1510, 512), 'Subway Sleeper', (1300, 125, 1360, 200), (805, 467, 1155, 495), [
   ('capsulebed', 'Capsule Bed', 'floor', (804, 209, 1039, 451), {'fgs': [(810, 214, 1032, 222), (808, 220, 818, 400), (1025, 220, 1035, 400), (815, 395, 1030, 405), (822, 412, 1018, 446)]}),
   ('luggagerack', 'Luggage Rack', 'wall', (824, 121, 1164, 211), {}),
   ('trainwindow', 'Train Window', 'wall', (1074, 216, 1331, 339), {}),
   ('traintrunk', 'Travel Trunk', 'floor', (1156, 346, 1311, 466), {}),
   ('trainbench', 'Train Bench', 'floor', (1321, 339, 1476, 466), {'fgs': [(1335, 435, 1345, 463), (1450, 435, 1460, 463), (1325, 405, 1470, 428)]}),
   ('redlantern', 'Signal Lantern', 'wall', (1364, 126, 1419, 216), {}),
   ('metromap', 'Metro Map', 'wall', (1341, 219, 1461, 326), {})]),
 'music': ('volB', (5, 575, 515, 975), 'Mini Music Studio', (82, 745, 160, 772), (380, 920, 480, 950), [
   ('recordbed', 'Record Bed', 'floor', (64, 776, 266, 911), {}),
   ('speaker', 'Big Speaker', 'floor', (29, 751, 79, 884), {'fgs': [(33, 760, 62, 880)], 'clear': [(65, 790, 80, 885)], 'kill': ([(103, 50, 88), (158, 81, 120), (75, 36, 66), (51, 24, 48)], 22)}),
   ('keyboard', 'Keyboard & Stool', 'floor', (251, 756, 388, 889), {'fgs': [(262, 815, 280, 880), (360, 815, 380, 880), (300, 840, 345, 880), (255, 785, 385, 815)], 'kill': ([(103, 50, 88), (158, 81, 120), (75, 36, 66), (51, 24, 48)], 22)}),
   ('recordshelf', 'Record Player Shelf', 'floor', (396, 726, 503, 916), {}),
   ('musicplant', 'Plant Shelf', 'wall', (401, 626, 503, 731), {'kill': ([(103, 50, 88), (158, 81, 120), (75, 36, 66), (51, 24, 48)], 22)}),
   ('neoneq', 'Neon Sound Sign', 'wall', (51, 654, 161, 741), {}),
   ('neonclef', 'Neon Music Note', 'wall', (166, 669, 211, 751), {}),
   ('citywindow', 'City Night Window', 'wall', (211, 656, 408, 764), {'bgs': [(298, 757, 350, 770)]}),
   ('spotrail', 'Spotlight Rail', 'ceil', (166, 594, 351, 646), {})]),
 'tea': ('volB', (525, 575, 1010, 975), 'Tea Garden Room', (625, 640, 657, 785), (590, 905, 715, 955), [
   ('futon', 'Futon Bed', 'floor', (546, 786, 731, 904), {}),
   ('paperlantern', 'Paper Floor Lantern', 'floor', (534, 871, 591, 954), {}),
   ('gardenwindow', 'Garden Moon Window', 'wall', (656, 636, 829, 809), {'disk': (742, 722, 86)}),
   ('pawlantern', 'Paw Lantern', 'ceil', (824, 594, 894, 726), {}),
   ('teaset2', 'Tea Table', 'floor', (716, 829, 914, 931), {'bgs': [(856, 912, 916, 934)], 'fgs': [(722, 875, 900, 922), (850, 872, 880, 895)]}),
   ('teacushion', 'Floor Cushion', 'floor', (854, 911, 959, 956), {}),
   ('blossomjar', 'Blossom Pot', 'floor', (839, 766, 896, 854), {'fgs': [(846, 820, 884, 851)]}),
   ('jarcabinet', 'Tea Jar Cabinet', 'floor', (894, 634, 999, 869), {'fgs': [(900, 690, 995, 865)]}),
   ('blossomscroll', 'Blossom Scroll', 'wall', (554, 641, 621, 776), {})]),
 'desert': ('volB', (1020, 575, 1530, 975), 'Desert Camp', (1225, 640, 1265, 652), (1040, 905, 1140, 950), [
   ('tentbed', 'Tent Bed', 'floor', (1036, 656, 1231, 894), {}),
   ('oasiswindow', 'Oasis Window', 'wall', (1196, 661, 1314, 779), {}),
   ('cactuslamp', 'Cactus Lantern', 'ceil', (1299, 594, 1369, 716), {}),
   ('wovtrunk', 'Woven Trunk', 'floor', (1309, 700, 1514, 889), {'bgs': [(1309, 735, 1432, 782), (1503, 735, 1514, 790)], 'fgs': [(1315, 800, 1500, 880)], 'clear': [(1428, 700, 1514, 797)]}),
   ('cactuspot', 'Potted Cactus', 'floor', (1434, 704, 1504, 801), {'fgs': [(1446, 762, 1494, 799)]}),
   ('oasisrug', 'Oasis Rug', 'rug', (1146, 869, 1396, 956), {})]),
}
if __name__ == '__main__':
    import json, sys
    only = sys.argv[1:]
    meta = {}
    for rk, (sheet, rb, rname, wsw, fsw, items) in ROOMS.items():
        if only and rk not in only: continue
        swatch(sheet, wsw, 'wall-' + rk); swatch(sheet, fsw, 'floor-' + rk)
        Image.fromarray(SHEETS[sheet][rb[1]:rb[3], rb[0]:rb[2]]).save(f'cut/theme-{rk}.png')
        for iid, nm, place, box, opt in items:
            sz = cut(sheet, box, iid, **opt); print(rk, iid, sz)
    print('done')
