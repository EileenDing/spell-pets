// ================= ROOMS, HOMES & SHOP (Pet Town art set) =================
// Each pet has a room (wallpaper, floor, furniture it can drag around) and, in Pet Town, a house made for its kind.
const ROOM_W = 768, ROOM_H = 512, WALL_Y = 300;
// key, name, group, price, place, size, default x, default y
// place: wall = hangs on the wall, floor = stands on the floor, rug = flat on the floor, ceil = hangs from the ceiling
// size = height in the room (rugs: width). x/y = centre-bottom (rugs: centre).
const FURN_LIST = [
  ['boxbed', 'Cardboard Box', 'beds', 0, 'floor', 118, 150, 456],
  ['basket', 'Woven Basket', 'beds', 15, 'floor', 64, 150, 452],
  ['cushion', 'Pink Cushion Bed', 'beds', 20, 'floor', 64, 150, 452],
  ['beanbag', 'Blue Beanbag', 'beds', 25, 'floor', 86, 150, 456],
  ['hammock', 'Leafy Hammock', 'beds', 35, 'floor', 110, 165, 446],
  ['bed', 'Cozy Bed', 'beds', 45, 'floor', 122, 150, 458],
  ['sofa', 'Green Sofa', 'beds', 40, 'floor', 98, 610, 486],
  ['armchair', 'Yellow Armchair', 'beds', 30, 'floor', 98, 640, 484],
  ['rocker', 'Rocking Chair', 'beds', 30, 'floor', 110, 640, 484],
  ['roundtable', 'Round Table', 'tables', 20, 'floor', 84, 480, 396],
  ['desk', 'Writing Desk', 'tables', 30, 'floor', 112, 520, 342],
  ['dining', 'Picnic Table', 'tables', 30, 'floor', 98, 480, 404],
  ['bookshelf', 'Bookshelf', 'tables', 35, 'floor', 192, 655, 334],
  ['wardrobe', 'Wardrobe', 'tables', 40, 'floor', 198, 655, 334],
  ['dresser', 'Dresser', 'tables', 30, 'floor', 120, 655, 338],
  ['toychest', 'Toy Chest', 'tables', 20, 'floor', 74, 330, 490],
  ['cubby', 'Cubby Shelf', 'tables', 25, 'floor', 102, 655, 338],
  ['mushlamp', 'Mushroom Lamp', 'lights', 12, 'floor', 74, 530, 352],
  ['floorlamp', 'Floor Lamp', 'lights', 18, 'floor', 170, 700, 352],
  ['starlight', 'Star Light', 'lights', 12, 'wall', 60, 500, 150],
  ['lantern', 'Hanging Lantern', 'lights', 12, 'ceil', 104, 470, 0],
  ['clock', 'Wall Clock', 'lights', 12, 'wall', 74, 500, 186],
  ['pawframe', 'Paw Picture', 'lights', 10, 'wall', 76, 92, 205],
  ['rainbow', 'Rainbow Picture', 'lights', 14, 'wall', 78, 500, 196],
  ['bunting', 'Party Bunting', 'lights', 10, 'wall', 64, 120, 96],
  ['plainwin', 'Sunny Window', 'rugs', 0, 'wall', 182, 300, 244],
  ['floralwin', 'Flower Curtain Window', 'rugs', 25, 'wall', 164, 300, 236],
  ['ginghamwin', 'Gingham Window', 'rugs', 25, 'wall', 164, 300, 236],
  ['mirror', 'Round Mirror', 'rugs', 15, 'wall', 108, 92, 236],
  ['coatstand', 'Coat Stand', 'rugs', 15, 'floor', 152, 42, 352],
  ['wovenrug', 'Woven Rug', 'rugs', 12, 'rug', 250, 400, 440],
  ['starrug', 'Star Rug', 'rugs', 18, 'rug', 272, 400, 440],
  ['leafrug', 'Leaf Rug', 'rugs', 15, 'rug', 250, 400, 440],
  ['pawrug', 'Paw Rug', 'rugs', 18, 'rug', 232, 400, 440],
  ['monstera', 'Monstera Plant', 'plants', 15, 'floor', 122, 48, 352],
  ['cactus', 'Little Cactus', 'plants', 8, 'floor', 74, 48, 348],
  ['flowerjug', 'Flower Jug', 'plants', 10, 'floor', 68, 48, 348],
  ['hangplant', 'Hanging Plant', 'plants', 15, 'ceil', 118, 175, 0],
  ['wheel', 'Exercise Wheel', 'plants', 25, 'floor', 112, 705, 424],
  ['cattree', 'Cat Tree', 'plants', 30, 'floor', 158, 712, 414],
  ['perch', 'Bird Perch', 'plants', 18, 'floor', 112, 712, 424],
  ['tunnel', 'Play Tunnel', 'plants', 15, 'floor', 68, 690, 494],
  ['teaset', 'Tea Set', 'cosy', 12, 'floor', 58, 560, 492],
  ['books', 'Book Stack', 'cosy', 8, 'floor', 54, 360, 494],
  ['pillows', 'Comfy Pillows', 'cosy', 10, 'floor', 60, 300, 496],
  ['teddy', 'Teddy Bear', 'cosy', 12, 'floor', 74, 250, 494],
  ['blocks', 'Toy Blocks', 'cosy', 10, 'floor', 58, 330, 498],
  ['fishtank', 'Fish Tank', 'cosy', 30, 'floor', 82, 520, 344],
  ['bowls', 'Food Bowls', 'cosy', 12, 'floor', 46, 92, 496],
  ['fireplace', 'Fireplace', 'cosy', 45, 'floor', 152, 520, 338],
  ['waterbowl', 'Water Bowl', 'cosy', 0, 'floor', 48, 92, 494],
  ['bone', 'Chew Bone', 'cosy', 0, 'floor', 34, 272, 482]
];
const FURN = {}; FURN_LIST.forEach(([k, name, group, price, place, size, x, y]) => { FURN[k] = { k, name, group, price, place, size, x, y }; });
const FURN_GROUPS = [['beds', 'Beds & seats'], ['tables', 'Tables & storage'], ['lights', 'Lights & walls'], ['rugs', 'Rugs & windows'], ['plants', 'Plants & play'], ['cosy', 'Cosy details']];
const WALLPAPERS = [['leafy', 'Leafy Cream', 0], ['cream', 'Cream', 12], ['sagestripe', 'Sage Stripe', 15], ['tinyblooms', 'Tiny Blooms', 15], ['forestleaves', 'Forest Leaves', 15], ['bluegingham', 'Blue Gingham', 15],
  ['peachdots', 'Peach Dots', 15], ['starrynight', 'Starry Night', 20], ['cloudsky', 'Cloud Sky', 20], ['pawprints', 'Paw Prints', 15], ['warmbrick', 'Warm Brick', 18], ['woodpanels', 'Wood Panels', 18], ['lavender', 'Lavender', 15]]
  .map(([k, name, price]) => ({ k, name, price }));
const FLOORS = [['honeyoak', 'Honey Oak', 0], ['paleash', 'Pale Ash', 15], ['walnut', 'Walnut', 18], ['herringbone', 'Herringbone', 20], ['whitetile', 'White Tile', 15], ['bluetile', 'Blue Tile', 15],
  ['terracotta', 'Terracotta', 15], ['stone', 'Stone', 18], ['mossstone', 'Moss Stone', 20], ['cork', 'Cork', 12], ['pinkcheck', 'Pink Check', 15], ['woven', 'Woven Mat', 15]]
  .map(([k, name, price]) => ({ k, name, price }));
const HOUSES = { dragon: 'Dragon Castle', dinosaur: 'Fossil Jungle Hut', dog: 'Bone Cottage', cat: 'Kitty Townhouse', turtle: 'Shell Pond House', rabbit: 'Carrot Burrow', pig: 'Piggy Barn',
  rat: 'Acorn House', monkey: 'Big Treehouse', trex: 'Dino Lodge', snake: 'Swirl House', parrot: 'Tiki Hut', owl: 'Moon Tower' };
const HOUSE_PRICE = 60;
const ROOM_SETS = [
  { k: 'forest', name: 'Forest Room', wall: 'forestleaves', floor: 'honeyoak', items: [['hangplant', 130, 0], ['lantern', 560, 0], ['mirror', 330, 220], ['bookshelf', 655, 334], ['monstera', 48, 352], ['hammock', 175, 446], ['sofa', 590, 488], ['roundtable', 420, 380], ['leafrug', 400, 448]] },
  { k: 'cottage', name: 'Cottage Room', wall: 'cream', floor: 'honeyoak', items: [['floralwin', 300, 236], ['bookshelf', 655, 334], ['hangplant', 560, 0], ['roundtable', 520, 392], ['mushlamp', 520, 340], ['bed', 150, 458], ['wovenrug', 400, 446]] },
  { k: 'pastel', name: 'Pastel Room', wall: 'peachdots', floor: 'paleash', items: [['hangplant', 120, 0], ['rainbow', 120, 200], ['floralwin', 340, 236], ['cubby', 655, 338], ['cushion', 160, 456], ['roundtable', 470, 396], ['flowerjug', 470, 340], ['armchair', 640, 486], ['pawrug', 400, 448]] },
  { k: 'starry', name: 'Starry Room', wall: 'starrynight', floor: 'walnut', items: [['starlight', 110, 150], ['ginghamwin', 330, 236], ['bookshelf', 520, 334], ['dresser', 680, 338], ['bed', 150, 458], ['starrug', 410, 448], ['teddy', 260, 494]] }
];
const LEGACY_DECOR = { ball: 'blocks', plant: 'monstera', poster: 'pawframe', rug: 'wovenrug', lamp: 'floorlamp', lights: 'bunting', shelf: 'bookshelf', tank: 'fishtank' };
// old shelter/decor shop items are replaced by this set
SHOP.forEach(i => { if (i.cat === 'shelter' || i.cat === 'decor') i.legacy = 1; });

const ownsF = k => !FURN[k].price || !!S.owned['f-' + k];
const ownsW = k => { const w = WALLPAPERS.find(x => x.k === k); return !!w && (!w.price || !!S.owned['w-' + k]); };
const ownsFl = k => { const f = FLOORS.find(x => x.k === k); return !!f && (!f.price || !!S.owned['fl-' + k]); };
function defaultRoom() { return { wall: 'leafy', floor: 'honeyoak', items: [{ k: 'plainwin', x: 300, y: 244 }, { k: 'boxbed', x: 150, y: 456 }, { k: 'waterbowl', x: 92, y: 494 }, { k: 'bone', x: 272, y: 482 }] }; }
// called from migrate() for every pet
function migrateRoom(p, f) {
  if (p.shelter && p.shelter !== 'box') p.home = 1;           // anyone who bought a house before gets their pet's new house
  if (p.room) return;
  p.room = defaultRoom();
  Object.keys(LEGACY_DECOR).forEach(k => {
    if (!p.items['deco-' + k]) return;
    const nk = LEGACY_DECOR[k]; f.owned['f-' + nk] = 1;
    if (p.decor[k]) { const F = FURN[nk]; p.room.items.push({ k: nk, x: F.x, y: F.y }); }
  });
}

// ---- geometry ----
function itemSize(k) {
  const F = FURN[k], im = SPR['it-' + k]; const iw = im ? im.width : 100, ih = im ? im.height : 100;
  if (F.place === 'rug') { const w = F.size; return { w, h: w * ih / iw * 0.82 }; }
  return { h: F.size, w: F.size * iw / ih };
}
function itemRect(it) {
  const F = FURN[it.k], { w, h } = itemSize(it.k);
  if (F.place === 'rug') return { x0: it.x - w / 2, y0: it.y - h / 2, x1: it.x + w / 2, y1: it.y + h / 2, w, h };
  const y1 = F.place === 'ceil' ? h + 2 : it.y;
  return { x0: it.x - w / 2, y0: y1 - h, x1: it.x + w / 2, y1, w, h };
}
function clampItem(it) {
  const F = FURN[it.k], { w, h } = itemSize(it.k);
  const over = Math.min(20, w * 0.15); it.x = Math.round(Math.max(w / 2 - over, Math.min(ROOM_W - w / 2 + over, it.x)));
  if (F.place === 'wall') it.y = Math.round(Math.max(h + 14, Math.min(WALL_Y - 6, it.y)));
  else if (F.place === 'floor') it.y = Math.round(Math.max(WALL_Y + 26, Math.min(ROOM_H - 4, it.y)));
  else if (F.place === 'rug') it.y = Math.round(Math.max(WALL_Y + 20 + h / 2, Math.min(ROOM_H - h / 2 + 10, it.y)));
  else it.y = 0;
}
// only one bed and one rug at a time: a new one takes the old one's place (box -> basket -> bed)
const BED_KEYS = ['boxbed', 'basket', 'cushion', 'beanbag', 'hammock', 'bed'];
const swapGroup = k => BED_KEYS.includes(k) ? BED_KEYS : FURN[k].place === 'rug' ? FURN_LIST.filter(f => f[4] === 'rug').map(f => f[0]) : null;
function placeItem(room, k) {
  const F = FURN[k]; if (room.items.some(i => i.k === k)) return room.items.findIndex(i => i.k === k);
  const grp = swapGroup(k), old = grp && room.items.find(i => grp.includes(i.k) && i.k !== k);
  if (old) { room.items = room.items.filter(i => i !== old); const it = { k, x: old.x, y: F.place === 'rug' ? old.y : F.y, f: old.f }; clampItem(it); room.items.push(it); return room.items.length - 1; }
  const { w } = itemSize(k), same = room.items.filter(i => FURN[i.k].place === F.place);
  let best = F.x;
  for (const dx of [0, 90, -90, 180, -180, 270, -270, 360]) {
    const x = F.x + dx; if (x < w / 2 - 20 || x > ROOM_W - w / 2 + 20) continue;
    if (!same.some(i => Math.abs(i.x - x) < (itemSize(i.k).w + w) * 0.4 && Math.abs(i.y - F.y) < 90)) { best = x; break; }
  }
  const it = { k, x: best, y: F.y }; clampItem(it); room.items.push(it); return room.items.length - 1;
}

// ---- drawing ----
const TILEC = {}, BGC = {};
function tileCanvas(key, s) {
  const id = key + s; if (TILEC[id]) return TILEC[id];
  const im = SPR[key]; if (!im) return null;
  const w = Math.round(im.width * s), h = Math.round(im.height * s);
  const t = document.createElement('canvas'); t.width = w * 2; t.height = h * 2; const g = t.getContext('2d');
  [[0, 0, 1, 1], [1, 0, -1, 1], [0, 1, 1, -1], [1, 1, -1, -1]].forEach(([i, j, sx, sy]) => { g.save(); g.translate(i * w + (sx < 0 ? w : 0), j * h + (sy < 0 ? h : 0)); g.scale(sx, sy); g.drawImage(im, 0, 0, w, h); g.restore(); });
  return TILEC[id] = t;
}
function roomBg(wall, floor) {
  const id = wall + '|' + floor; if (BGC[id]) return BGC[id];
  const c = document.createElement('canvas'); c.width = ROOM_W; c.height = ROOM_H; const x = c.getContext('2d');
  const wt = tileCanvas('wall-' + wall, wall === 'leafy' ? 0.9 : 1.15), ft = tileCanvas('floor-' + floor, 1.05);
  x.fillStyle = wt ? x.createPattern(wt, 'repeat') : '#f6e7c8'; x.fillRect(0, 0, ROOM_W, WALL_Y);
  x.save(); x.translate(0, WALL_Y); x.fillStyle = ft ? x.createPattern(ft, 'repeat') : '#d9a066'; x.fillRect(0, 0, ROOM_W, ROOM_H - WALL_Y); x.restore();
  let g = x.createLinearGradient(0, 14, 0, 110); g.addColorStop(0, 'rgba(70,40,15,.22)'); g.addColorStop(1, 'rgba(70,40,15,0)'); x.fillStyle = g; x.fillRect(0, 14, ROOM_W, 100);
  g = x.createLinearGradient(0, WALL_Y - 60, 0, WALL_Y); g.addColorStop(0, 'rgba(70,40,15,0)'); g.addColorStop(1, 'rgba(70,40,15,.14)'); x.fillStyle = g; x.fillRect(0, WALL_Y - 60, ROOM_W, 60);
  g = x.createLinearGradient(0, WALL_Y, 0, WALL_Y + 80); g.addColorStop(0, 'rgba(50,25,8,.30)'); g.addColorStop(1, 'rgba(50,25,8,0)'); x.fillStyle = g; x.fillRect(0, WALL_Y, ROOM_W, 80);
  g = x.createLinearGradient(0, ROOM_H - 50, 0, ROOM_H); g.addColorStop(0, 'rgba(50,25,8,0)'); g.addColorStop(1, 'rgba(50,25,8,.18)'); x.fillStyle = g; x.fillRect(0, ROOM_H - 50, ROOM_W, 50);
  [[0, 1], [ROOM_W, -1]].forEach(([ex, d]) => { const s = x.createLinearGradient(ex, 0, ex + d * 70, 0); s.addColorStop(0, 'rgba(60,30,10,.20)'); s.addColorStop(1, 'rgba(60,30,10,0)'); x.fillStyle = s; x.fillRect(d > 0 ? 0 : ROOM_W - 70, 0, 70, ROOM_H); });
  // skirting board and ceiling beam
  x.fillStyle = '#7a4a26'; x.fillRect(0, WALL_Y - 12, ROOM_W, 16); x.fillStyle = '#b07a48'; x.fillRect(0, WALL_Y - 12, ROOM_W, 5); x.fillStyle = '#4d2c14'; x.fillRect(0, WALL_Y + 3, ROOM_W, 3);
  x.fillStyle = '#8f5a2e'; x.fillRect(0, 0, ROOM_W, 16); x.fillStyle = '#c48650'; x.fillRect(0, 0, ROOM_W, 5); x.fillStyle = '#4d2c14'; x.fillRect(0, 15, ROOM_W, 3);
  return BGC[id] = c;
}
const ROAM = {};
function roam(id, dt, still) {
  let r = ROAM[id]; if (!r) r = ROAM[id] = { x: 430, y: 470, tx: 430, ty: 470, dir: -1, wait: 2 };
  if (still || reduceMotion) return r;
  const dx = r.tx - r.x, dy = r.ty - r.y, d = Math.hypot(dx, dy);
  if (d > 1) { const st = Math.min(d, 46 * dt); r.x += dx / d * st; r.y += dy / d * st; if (Math.abs(dx) > 1) r.dir = dx < 0 ? -1 : 1; r.moving = true; }
  else { r.moving = false; r.wait -= dt; if (r.wait <= 0) { r.tx = 250 + Math.random() * 330; r.ty = 420 + Math.random() * 70; r.wait = 3 + Math.random() * 5; } }
  return r;
}
let roomLast = {};
function drawRoom(c, t, pet, o = {}) {
  const id = o.id || 'home', dt = roomLast[id] ? Math.min(0.25, (t - roomLast[id]) / 1000) : 0; roomLast[id] = t;
  c.setTransform(c.canvas.width / ROOM_W, 0, 0, c.canvas.height / ROOM_H, 0, 0);
  c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high';
  const room = (pet && pet.room) || defaultRoom();
  c.drawImage(roomBg(room.wall, room.floor), 0, 0);
  // sunlight from windows
  room.items.forEach(it => {
    if (!/win$/.test(it.k)) return; const r = itemRect(it);
    c.save(); c.globalAlpha = 0.12; c.fillStyle = '#fff3c4'; c.beginPath();
    c.moveTo(r.x0 + r.w * 0.2, WALL_Y + 4); c.lineTo(r.x1 - r.w * 0.2, WALL_Y + 4); c.lineTo(r.x1 + 40, ROOM_H); c.lineTo(r.x0 + 20, ROOM_H); c.closePath(); c.fill(); c.restore();
  });
  const list = room.items.map((it, i) => ({ it, i, r: itemRect(it) }));
  list.filter(e => FURN[e.it.k].place === 'rug').forEach(e => drawItem(c, e, o));
  const pr = pet ? roam(id, dt, o.still) : null;
  const rest = list.filter(e => FURN[e.it.k].place !== 'rug').map(e => ({ ...e, z: e.r.y1 }));
  if (pr) rest.push({ pet: true, z: pr.y });
  rest.sort((a, b) => a.z - b.z).forEach(e => {
    if (!e.pet) return drawItem(c, e, o);
    const PH = 128, PW = PH * PET_CW / PET_CH;
    let y = pr.y - PH + 6 - (pr.moving ? (Math.floor(t / 140) % 2) * 3 : (reduceMotion ? 0 : Math.floor(t / 520) % 2));
    if (t < hopUntil) y -= Math.round(Math.abs(Math.sin((hopUntil - t) / 110)) * 14);
    c.save(); c.globalAlpha = 0.22; c.fillStyle = '#2a1d33'; c.beginPath(); c.ellipse(pr.x, pr.y + 2, 30, 7, 0, 0, Math.PI * 2); c.fill(); c.restore();
    const img = petCanvas(pet, { blink: t % 4200 < 160 });
    if (pr.dir > 0) { c.save(); c.translate(pr.x + PW / 2, y); c.scale(-1, 1); c.drawImage(img, 0, 0, PW, PH); c.restore(); } else c.drawImage(img, pr.x - PW / 2, y, PW, PH);
  });
  if (o.sel != null && list[o.sel]) {
    const r = list[o.sel].r; c.save(); c.strokeStyle = '#ffcc33'; c.lineWidth = 4; c.setLineDash([10, 6]); c.lineDashOffset = -(t / 40) % 16;
    c.strokeRect(r.x0 - 6, r.y0 - 6, r.w + 12, r.h + 12); c.restore();
  }
}
function drawItem(c, e, o) {
  const im = SPR['it-' + e.it.k]; if (!im) return; const r = e.r, F = FURN[e.it.k];
  if (F.place === 'floor') { c.save(); c.globalAlpha = 0.18; c.fillStyle = '#2a1d33'; c.beginPath(); c.ellipse(e.it.x, r.y1 - 2, r.w * 0.42, Math.max(5, r.w * 0.06), 0, 0, Math.PI * 2); c.fill(); c.restore(); }
  if (o.dragging === e.i) { c.save(); c.globalAlpha = 0.85; }
  if (e.it.f) { c.save(); c.translate(r.x1, r.y0); c.scale(-1, 1); c.drawImage(im, 0, 0, r.w, r.h); c.restore(); } else c.drawImage(im, r.x0, r.y0, r.w, r.h);
  if (o.dragging === e.i) c.restore();
}

// ---- hit testing (by the picture's own pixels) ----
const HITD = {};
function hitData(k) {
  if (HITD[k]) return HITD[k]; const im = SPR['it-' + k]; if (!im) return null;
  const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0);
  return HITD[k] = x.getImageData(0, 0, im.width, im.height);
}
function hitItem(room, px, py) {
  const order = room.items.map((it, i) => ({ it, i, r: itemRect(it), rug: FURN[it.k].place === 'rug' }))
    .sort((a, b) => (a.rug - b.rug) || (b.r.y1 - a.r.y1));
  for (const e of order) {
    const r = e.r; if (px < r.x0 || px > r.x1 || py < r.y0 || py > r.y1) continue;
    const d = hitData(e.it.k); if (!d) return e.i;
    let u = (px - r.x0) / r.w; if (e.it.f) u = 1 - u;
    const ix = Math.min(d.width - 1, Math.floor(u * d.width)), iy = Math.min(d.height - 1, Math.floor((py - r.y0) / r.h * d.height));
    if (d.data[(iy * d.width + ix) * 4 + 3] > 40) return e.i;
  }
  return -1;
}

// ---- buying ----
function buyThing(kind, k, pet) {
  const item = kind === 'f' ? FURN[k] : kind === 'w' ? WALLPAPERS.find(x => x.k === k) : FLOORS.find(x => x.k === k);
  if (!item) return false;
  if (S.coins < item.price) { toast(`You need $${money(item.price - S.coins)} more. Play a session to earn coins!`); return false; }
  S.coins -= item.price; S.owned[kind + '-' + k] = 1;
  if (pet) {
    pet.room = pet.room || defaultRoom();
    if (kind === 'f') placeItem(pet.room, k); else if (kind === 'w') pet.room.wall = k; else pet.room.floor = k;
  }
  save(); SFX.coin(); renderHud();
  toast(pet ? `Bought ${item.name}! It's in ${pet.name}'s home now.` : `Bought ${item.name}!`);
  return true;
}
function setPrice(set) {
  let p = 0; set.items.forEach(([k]) => { if (!ownsF(k)) p += FURN[k].price; });
  if (!ownsW(set.wall)) p += WALLPAPERS.find(x => x.k === set.wall).price;
  if (!ownsFl(set.floor)) p += FLOORS.find(x => x.k === set.floor).price;
  return Math.round(p * 0.75);
}
function applySet(set, pet) {
  set.items.forEach(([k]) => { S.owned['f-' + k] = 1; }); S.owned['w-' + set.wall] = 1; S.owned['fl-' + set.floor] = 1;
  pet.room = { wall: set.wall, floor: set.floor, items: [...set.items.map(([k, x, y]) => ({ k, x, y })), { k: 'waterbowl', x: 92, y: 494 }] };
}

// ================= SHOP =================
let shopTab = 'homes', shopPet = 0;
const SHOP_TABS = [['homes', 'Homes'], ['furniture', 'Furniture'], ['decor', 'Decor'], ['walls', 'Walls & Floors'], ['sets', 'Room Sets'], ['food', 'Food'], ['clothes', 'Clothes'], ['skins', 'Skins']];
const imgSrc = k => SPR[k] ? SPR[k].src : '';
function priceBtn(data, price, owned, label) {
  if (owned) return `<span class="ownedtag">${icon('check')} ${label || 'Owned'}</span>`;
  const can = S.coins >= price;
  return `<button class="btn buy ${can ? 'go' : 'off'}" ${data} ${can ? '' : 'aria-disabled="true"'}>${icon('coin', 'coin')} $${price}</button>`;
}
function itemPreview(it) {
  const pet = S.pets[S.active] || { kind: 'cat' };
  if (it.cat === 'skins') return `<img class="pxi prev pet" src="${petURL(pet, { skin: it.key, hat: null, eyes: null, neck: null, back: null, body: null })}" alt="">`;
  if (it.cat === 'clothes') {
    const bare = { hat: null, eyes: null, neck: null, back: null, body: null, [it.slot]: it.key };
    const wear = WEAR[it.key] && SPR[WEAR[it.key]];
    return `${wear ? `<img class="prev wear" src="${wear.src}" alt="">` : ''}<img class="pxi prev pet ${wear ? 'onpet' : ''}" src="${petURL(pet, bare)}" alt="">`;
  }
  return `<img class="pxi prev food" src="${foodURL(it.key)}" alt="">`;
}
function furnCards(groups) {
  return groups.map(([g, label]) => `<h2 class="shophead">${label}</h2><div class="shopgrid">${FURN_LIST.filter(f => f[2] === g && f[3] > 0).map(([k, name, , price]) =>
    `<div class="card ${ownsF(k) ? 'owned' : ''}"><div class="prevbox"><img class="prev furn" src="${imgSrc('it-' + k)}" alt=""></div><b>${esc(name)}</b>${priceBtn(`data-buy="f:${k}"`, price, ownsF(k))}</div>`).join('')}</div>`).join('');
}
function swatchCards(list, kind) {
  return `<div class="shopgrid">${list.filter(x => x.price > 0).map(x => { const own = kind === 'w' ? ownsW(x.k) : ownsFl(x.k);
    return `<div class="card ${own ? 'owned' : ''}"><div class="prevbox swatch" style="background-image:url(${imgSrc((kind === 'w' ? 'wall-' : 'floor-') + x.k)})"></div><b>${esc(x.name)}</b>${priceBtn(`data-buy="${kind}:${x.k}"`, x.price, own)}</div>`; }).join('')}</div>`;
}
function renderShop() {
  $('#shopTabs').innerHTML = SHOP_TABS.map(([k, n]) => `<button class="tab ${k === shopTab ? 'sel' : ''}" data-t="${k}" aria-pressed="${k === shopTab}">${n}</button>`).join('');
  $('#shopWallet').innerHTML = `You have ${coinAmt(S.coins)}`;
  if (shopPet >= S.pets.length) shopPet = S.active;
  const perPet = shopTab === 'sets';
  $('#shopFor').hidden = !perPet || !S.pets.length;
  $('#shopFor').innerHTML = `<span>For the room of</span>` + S.pets.map((p, i) => `<button class="petthumb mini ${i === shopPet ? 'sel' : ''}" data-shoppet="${i}" aria-pressed="${i === shopPet}"><img class="pxi" src="${petURL(p)}" alt=""><span>${esc(p.name)}</span></button>`).join('');
  const me = S.pets[S.active];
  const note = t => `<p class="muted shopnote">${t}</p>`;
  let h = '';
  if (shopTab === 'homes') {
    h = note('Every pet can build its very own house in Pet Town.') + `<div class="shopgrid wide">${S.pets.map((p, i) => `<div class="card house ${p.home ? 'owned' : ''}"><div class="prevbox tall"><img class="prev house" src="${imgSrc('house-' + p.kind)}" alt=""></div>
      <b>${esc(HOUSES[p.kind] || 'House')}</b><span class="muted small">for ${esc(p.name)} the ${esc(PETS[p.kind].name)}</span>${priceBtn(`data-buy="h:${i}"`, HOUSE_PRICE, p.home, 'Built')}</div>`).join('')}</div>`;
  } else if (shopTab === 'furniture') h = note(`New things go straight into ${me ? esc(me.name) + "'s" : 'your'} home. Use Decorate to move them around.`) + furnCards(FURN_GROUPS.slice(0, 2));
  else if (shopTab === 'decor') h = note(`New things go straight into ${me ? esc(me.name) + "'s" : 'your'} home. Use Decorate to move them around.`) + furnCards(FURN_GROUPS.slice(2));
  else if (shopTab === 'walls') h = `<h2 class="shophead">Wallpaper</h2>${swatchCards(WALLPAPERS, 'w')}<h2 class="shophead">Floors</h2>${swatchCards(FLOORS, 'fl')}`;
  else if (shopTab === 'sets') {
    const tp = S.pets[shopPet];
    h = note('A whole new look in one go: wallpaper, floor and furniture, a quarter off. Things already in the room go back into storage.') + `<div class="shopgrid wide">${ROOM_SETS.map(st => {
      const p = setPrice(st);
      return `<div class="card set"><div class="prevbox tall"><img class="prev theme" src="${imgSrc('theme-' + st.k)}" alt=""></div><b>${st.name}</b><span class="muted small">${st.items.length} things + wallpaper + floor</span>
        ${tp ? `<button class="btn buy ${S.coins >= p ? 'go' : 'off'}" data-buy="s:${st.k}">${p ? `${icon('coin', 'coin')} $${p}` : 'Use this look'}</button>` : ''}</div>`; }).join('')}</div>`;
  } else {
    const items = SHOP.filter(i => i.cat === shopTab && !i.legacy);
    const ltd = shopTab !== 'skins' ? '' : S.pets.map(p => {
      const has = S.owned['ltd-' + p.kind];
      return `<div class="card ltd ${has ? 'owned' : 'locked'}"><span class="ltdtag">Limited</span><div class="prevbox"><img class="pxi prev pet ${has ? '' : 'shadow'}" src="${petURL(p, { skin: 'ltd' })}" alt=""></div>
        <b>${has ? esc(LTD[p.kind].name) + ' ' + esc(PETS[p.kind].name) : '???'}</b><span class="muted small">${has ? 'Unlocked! Wear it in the room.' : 'Not for sale. Keep playing with ' + esc(p.name) + ' to discover it.'}</span></div>`;
    }).join('');
    h = `<div class="shopgrid">${ltd}${items.map(it => {
      const owned = it.cat !== 'food' && S.owned[it.id];
      const extra = it.cat === 'food' ? `<span class="muted small">Fills ${FOODS[it.key].fill}% · you have ${S.food[it.key] || 0}</span>` : `<span class="muted small">Preview on ${esc((me || {}).name || 'your pet')}</span>`;
      return `<div class="card ${owned ? 'owned' : ''}"><div class="prevbox">${itemPreview(it)}</div><b>${esc(it.name)}</b>${extra}${priceBtn(`data-id="${it.id}"`, it.price, owned)}</div>`;
    }).join('')}</div>`;
  }
  $('#shopGrid').innerHTML = h;
}
function buy(id) {
  const it = SHOP.find(i => i.id === id); if (!it) return;
  if (S.coins < it.price) { toast(`You need $${money(it.price - S.coins)} more. Play a session to earn coins!`); return; }
  S.coins -= it.price;
  if (it.cat === 'food') S.food[it.key] = (S.food[it.key] || 0) + 1;
  else { S.owned[it.id] = 1; const pet = S.pets[S.active]; if (it.cat === 'skins' && pet) pet.skin = it.key; if (it.cat === 'clothes' && pet) pet[it.slot] = it.key; }
  save(); SFX.coin(); renderHud(); renderShop();
  toast(it.cat === 'food' ? `Bought ${it.name}. Feed it in a pet's room.` : `Bought ${it.name}!`);
}
function shopBuy(code) {
  const [kind, k] = code.split(':'), me = S.pets[S.active];
  if (kind === 'h') {
    const p = S.pets[+k]; if (!p || p.home) return;
    if (S.coins < HOUSE_PRICE) { toast(`You need $${money(HOUSE_PRICE - S.coins)} more. Play a session to earn coins!`); return; }
    S.coins -= HOUSE_PRICE; p.home = 1; save(); SFX.fanfare(); renderHud(); toast(`${p.name}'s ${HOUSES[p.kind]} is built! Go see it in Pet Town.`);
  } else if (kind === 's') {
    const st = ROOM_SETS.find(x => x.k === k), tp = S.pets[shopPet]; if (!st || !tp) return;
    const p = setPrice(st); if (S.coins < p) { toast(`You need $${money(p - S.coins)} more. Play a session to earn coins!`); return; }
    S.coins -= p; applySet(st, tp); save(); SFX.fanfare(); renderHud(); toast(`${tp.name}'s room is now the ${st.name}!`);
  } else buyThing(kind, k, me);
  renderShop();
}

// ================= DECORATE =================
const DECO = { pet: 0, tab: 'beds', sel: -1, drag: null };
const DECO_TABS = [...FURN_GROUPS.map(([k, n]) => [k, n.split(' ')[0]]), ['walls', 'Wallpaper'], ['floors', 'Floor']];
function openDeco(i) { DECO.pet = i; DECO.sel = -1; route('deco'); }
function renderDeco() {
  if (DECO.pet >= S.pets.length) DECO.pet = S.active;
  const pet = S.pets[DECO.pet]; if (!pet) { route('home'); return; }
  pet.room = pet.room || defaultRoom();
  $('#decoTitle').textContent = `${pet.name}'s home`;
  $('#decoWallet').innerHTML = coinAmt(S.coins);
  $('#decoFor').innerHTML = S.pets.length < 2 ? '' : `<span>Decorating</span>` + S.pets.map((p, i) => `<button class="petthumb mini ${i === DECO.pet ? 'sel' : ''}" data-decopet="${i}" aria-pressed="${i === DECO.pet}"><img class="pxi" src="${petURL(p)}" alt=""><span>${esc(p.name)}</span></button>`).join('');
  renderDecoTools();
  $('#decoTabs').innerHTML = DECO_TABS.map(([k, n]) => `<button class="tab ${k === DECO.tab ? 'sel' : ''}" data-t="${k}" aria-pressed="${k === DECO.tab}">${n}</button>`).join('');
  const room = pet.room; let h = '';
  if (DECO.tab === 'walls' || DECO.tab === 'floors') {
    const list = DECO.tab === 'walls' ? WALLPAPERS : FLOORS, kind = DECO.tab === 'walls' ? 'w' : 'fl', cur = DECO.tab === 'walls' ? room.wall : room.floor;
    h = list.map(x => { const own = kind === 'w' ? ownsW(x.k) : ownsFl(x.k), on = cur === x.k, can = S.coins >= x.price;
      return `<button class="decocard ${on ? 'on' : ''} ${own ? '' : 'locked'}" data-${kind}="${x.k}"><span class="swatch" style="background-image:url(${imgSrc((kind === 'w' ? 'wall-' : 'floor-') + x.k)})"></span><b>${esc(x.name)}</b><em class="${own ? '' : can ? 'buyable' : 'pricey'}">${on ? 'Using' : own ? 'Use' : '$' + x.price}</em></button>`; }).join('');
  } else {
    h = FURN_LIST.filter(f => f[2] === DECO.tab).map(([k, name, , price]) => { const own = ownsF(k), on = room.items.some(i => i.k === k), can = S.coins >= price;
      const swap = !on && swapGroup(k) && room.items.some(i => swapGroup(k).includes(i.k));
      return `<button class="decocard ${on ? 'on' : ''} ${own ? '' : 'locked'}" data-f="${k}"><img src="${imgSrc('it-' + k)}" alt=""><b>${esc(name)}</b><em class="${own ? '' : can ? 'buyable' : 'pricey'}">${on ? 'In the room' : own ? (swap ? 'Swap in' : 'Put in') : '$' + price}</em></button>`; }).join('');
  }
  $('#decoGrid').innerHTML = h;
}
function renderDecoTools() {
  const pet = S.pets[DECO.pet], it = pet && pet.room.items[DECO.sel];
  $('#decoTools').innerHTML = it ? `<b>${esc(FURN[it.k].name)}</b><button class="btn small" id="decoFlip">Flip</button><button class="btn small bad" id="decoAway">Put away</button><button class="btn small go" id="decoDone">Done</button>`
    : `<span class="muted">Drag things to move them. Tap one to flip it or put it away.</span>`;
}
function decoClick(e) {
  const pet = S.pets[DECO.pet]; if (!pet) return;
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.decopet !== undefined) { DECO.pet = +b.dataset.decopet; DECO.sel = -1; return renderDeco(); }
  if (b.dataset.t) { DECO.tab = b.dataset.t; return renderDeco(); }
  if (b.id === 'decoFlip') { const it = pet.room.items[DECO.sel]; if (it) { it.f = it.f ? 0 : 1; save(); SFX.tap(); } return; }
  if (b.id === 'decoAway') { pet.room.items.splice(DECO.sel, 1); DECO.sel = -1; save(); SFX.tap(); return renderDeco(); }
  if (b.id === 'decoDone') { DECO.sel = -1; return renderDecoTools(); }
  const k = b.dataset.f, w = b.dataset.w, fl = b.dataset.fl;
  if (k) {
    const idx = pet.room.items.findIndex(i => i.k === k);
    if (idx >= 0) { DECO.sel = idx; renderDecoTools(); $('#sceneDeco').scrollIntoView({ block: 'nearest', behavior: 'smooth' }); return; }
    if (!ownsF(k) && !buyThing('f', k, null)) return;
    DECO.sel = placeItem(pet.room, k); save(); SFX.tap(); renderDeco(); $('#sceneDeco').scrollIntoView({ block: 'nearest', behavior: 'smooth' }); return;
  }
  if (w) { if (!ownsW(w) && !buyThing('w', w, null)) return; pet.room.wall = w; save(); SFX.tap(); return renderDeco(); }
  if (fl) { if (!ownsFl(fl) && !buyThing('fl', fl, null)) return; pet.room.floor = fl; save(); SFX.tap(); return renderDeco(); }
}
function decoPoint(e) { const r = e.currentTarget.getBoundingClientRect(); return { x: (e.clientX - r.left) * ROOM_W / r.width, y: (e.clientY - r.top) * ROOM_H / r.height }; }
function wireDeco() {
  const cv = $('#sceneDeco');
  cv.addEventListener('pointerdown', e => {
    const pet = S.pets[DECO.pet]; if (!pet) return; const p = decoPoint(e), i = hitItem(pet.room, p.x, p.y);
    DECO.sel = i; renderDecoTools();
    if (i >= 0) { const it = pet.room.items[i]; DECO.drag = { i, dx: it.x - p.x, dy: it.y - p.y, moved: false }; cv.setPointerCapture(e.pointerId); e.preventDefault(); }
  });
  cv.addEventListener('pointermove', e => {
    const d = DECO.drag, pet = S.pets[DECO.pet]; if (!d || !pet) return; const p = decoPoint(e), it = pet.room.items[d.i]; if (!it) return;
    it.x = p.x + d.dx; it.y = p.y + d.dy; clampItem(it); d.moved = true;
  });
  const end = () => { if (DECO.drag) { if (DECO.drag.moved) save(); DECO.drag = null; } };
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
  $('#scr-deco').addEventListener('click', decoClick);
  $('#decoBack').addEventListener('click', () => { DECO.sel = -1; route('home'); });
}
