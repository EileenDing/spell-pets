// ================= PET TOWN (painted map; one lot per kind of pet) =================
const TOWN_W = 1536, TOWN_H = 1024;
// lx/ly = centre of the lot's gate (where the lock is); x0..x1 = lot width
const LOTS = {
  dragon: { lx: 264, ly: 236, x0: 118, x1: 378, row: 0 }, dinosaur: { lx: 535, ly: 235, x0: 408, x1: 632, row: 0 },
  dog: { lx: 784, ly: 235, x0: 660, x1: 878, row: 0 }, cat: { lx: 1043, ly: 236, x0: 910, x1: 1146, row: 0 },
  turtle: { lx: 1304, ly: 236, x0: 1165, x1: 1412, row: 0 },
  rabbit: { lx: 323, ly: 421, x0: 170, x1: 445, row: 1 }, pig: { lx: 629, ly: 421, x0: 483, x1: 748, row: 1 },
  rat: { lx: 939, ly: 421, x0: 790, x1: 1055, row: 1 }, monkey: { lx: 1248, ly: 421, x0: 1095, x1: 1365, row: 1 },
  trex: { lx: 311, ly: 614, x0: 152, x1: 440, row: 2 }, snake: { lx: 628, ly: 614, x0: 480, x1: 745, row: 2 },
  parrot: { lx: 939, ly: 614, x0: 790, x1: 1055, row: 2 }, owl: { lx: 1257, ly: 614, x0: 1100, x1: 1385, row: 2 }
};
const ROAD_Y = [268, 457, 655];          // the sandy road in front of each row of lots
const V_ROADS = [464, 769, 1075];        // north-south roads between the lots
const TOWN_SHOPS = [                      // painted buildings along the bottom
  { id: 'skins', x0: 92, y0: 690, x1: 330, y1: 880, label: 'Pet Salon' },
  { id: 'food', x0: 385, y0: 680, x1: 622, y1: 890, label: 'Food Shop' },
  { id: 'clothes', x0: 925, y0: 680, x1: 1162, y1: 890, label: 'Clothes Shop' },
  { id: 'shelter', x0: 1215, y0: 680, x1: 1478, y1: 890, label: 'Home Builder' }
];
const lotOf = pet => LOTS[pet.kind];
const SHELTER_C = {};
function shelterCanvas(key) {
  if (SHELTER_C[key]) return SHELTER_C[key];
  const big = document.createElement('canvas'); big.width = 192; big.height = 128;
  (SHELTERS_HI[key] || SHELTERS_HI.box)(big.getContext('2d'));
  return SHELTER_C[key] = trimCanvas(big);
}
function drawLotHome(c, L, pet) {
  const w = (L.x1 - L.x0), cx = (L.x0 + L.x1) / 2;
  const has = !!(pet.house && SPR['house-' + pet.house]), img = has ? SPR['house-' + pet.house] : SPR['it-boxbed'];
  const kind = Object.keys(LOTS).find(k => LOTS[k] === L), R = LOT_PATCH[kind];
  if (has && R && SPR['lot-' + kind]) c.drawImage(SPR['lot-' + kind], R[0], R[1], R[2] - R[0], R[3] - R[1]);   // a house needs no fence
  else c.drawImage(SPR['gate-open'], L.lx - 49, L.ly - 24, 100, 47);
  if (!img) return;
  let hw = has ? w * 1.04 : 92, hh = img.height * hw / img.width;
  if (has && hh > 200) { hw *= 200 / hh; hh = 200; }
  c.drawImage(img, cx - hw / 2 + (has ? 0 : -40), L.ly + (has ? 6 : -34) - hh, hw, hh);
}
// pets walking around town
const WALKERS = {};
const homeSpot = pet => { const L = lotOf(pet); return { x: L.lx + 64, y: L.ly + 4 }; };
const gateFront = L => ({ x: L.lx, y: ROAD_Y[L.row] });
function walkPath(from, to) {
  // from/to carry a row (-1 = inside a lot). Go out to the road, across rows by the nearest side road, then in.
  const pts = [];
  let cur = { x: from.x, y: from.y };
  const fromRow = from.row, toRow = to.row;
  if (from.inLot) { pts.push({ x: from.gx, y: from.y }, { x: from.gx, y: ROAD_Y[fromRow] }); cur = { x: from.gx, y: ROAD_Y[fromRow] }; }
  if (fromRow !== toRow) {
    const vx = V_ROADS.reduce((a, b) => Math.abs(b - (cur.x + to.x) / 2) < Math.abs(a - (cur.x + to.x) / 2) ? b : a);
    pts.push({ x: vx, y: ROAD_Y[fromRow] }, { x: vx, y: ROAD_Y[toRow] });
  }
  if (to.inLot) pts.push({ x: to.gx, y: ROAD_Y[toRow] }, { x: to.gx, y: to.y }, { x: to.x, y: to.y });
  else pts.push({ x: to.x, y: ROAD_Y[toRow] });
  return pts;
}
function updateWalkers(dt) {
  const n = S.pets.length;
  for (let i = 0; i < n; i++) {
    const pet = S.pets[i], L = lotOf(pet); if (!L) continue;
    let w = WALKERS[i];
    if (!w || w.kind !== pet.kind) { const h = homeSpot(pet); w = WALKERS[i] = { kind: pet.kind, x: h.x, y: h.y, wp: [], wait: 1 + hash(i * 7) * 4, mode: 'home', dir: -1, guest: -1 }; }
    if (w.wp.length) {
      const t = w.wp[0], dx = t.x - w.x, dy = t.y - w.y, d = Math.hypot(dx, dy), step = 70 * dt;
      if (Math.abs(dx) > 0.5) w.dir = dx < 0 ? -1 : 1;
      if (d <= step) { w.x = t.x; w.y = t.y; w.wp.shift(); if (!w.wp.length) { w.wait = w.mode === 'visit' ? 3 + Math.random() * 4 : 4 + Math.random() * 6; if (w.mode === 'home') w.dir = -1; } }
      else { w.x += dx / d * step; w.y += dy / d * step; }
      continue;
    }
    w.wait -= dt; if (w.wait > 0) continue;
    const home = homeSpot(pet);
    const here = w.mode === 'home' ? { x: w.x, y: w.y, row: L.row, inLot: true, gx: L.lx } : { x: w.x, y: w.y, row: w.row };
    if (w.mode === 'visit') { w.mode = 'home'; w.guest = -1; w.wp = walkPath(here, { ...home, row: L.row, inLot: true, gx: L.lx }); continue; }
    if (n > 1 && Math.random() < 0.6) {
      let j = Math.floor(Math.random() * (n - 1)); if (j >= i) j++;
      const L2 = lotOf(S.pets[j]); if (!L2) continue;
      const spot = { x: L2.lx + (Math.random() < .5 ? -70 : 70), row: L2.row };
      w.mode = 'visit'; w.guest = j; w.row = L2.row; w.wp = walkPath(here, spot);
    } else { w.wp = [{ x: home.x + Math.round((Math.random() - .5) * 40), y: home.y - Math.round(Math.random() * 30) }]; }
  }
}
let townLast = 0;
function drawTown(c, t) {
  const dt = townLast ? Math.min(0.25, (t - townLast) / 1000) : 0; townLast = t;
  if (!reduceMotion) updateWalkers(dt);
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high';
  if (SPR.town) c.drawImage(SPR.town, 0, 0, TOWN_W, TOWN_H);
  c.fillStyle = 'rgba(255,248,232,0.3)'; c.fillRect(0, 0, TOWN_W, TOWN_H);            // softer surroundings so the houses stand out
  S.pets.forEach(pet => { const L = lotOf(pet); if (L) drawLotHome(c, L, pet); });
  const PH = 92, PW = PH * PET_CW / PET_CH;
  const order = S.pets.map((pet, i) => ({ pet, i })).filter(o => lotOf(o.pet)).map(o => ({ ...o, w: WALKERS[o.i] || { ...homeSpot(o.pet), dir: -1, wp: [] } })).sort((a, b) => a.w.y - b.w.y);
  order.forEach(({ pet, i, w }) => {
    const moving = w.wp && w.wp.length;
    const img = petCanvas(pet, { blink: !moving && (t + i * 900) % 4200 < 160 });
    const bob = moving ? (Math.floor(t / 140) % 2) * 3 : 0;
    const x = w.x - PW / 2, y = w.y - PH + 6 - bob;
    c.save(); c.globalAlpha = .25; c.fillStyle = '#2a1d33'; c.beginPath(); c.ellipse(w.x, w.y + 4, 18, 5, 0, 0, Math.PI * 2); c.fill(); c.restore();
    if (w.dir > 0) { c.save(); c.translate(x + PW, y); c.scale(-1, 1); c.drawImage(img, 0, 0, PW, PH); c.restore(); } else c.drawImage(img, x, y, PW, PH);
    if (w.mode === 'visit' && !moving) { c.save(); c.imageSmoothingEnabled = false; drawSpriteScaled(c, ICONS.heart, BASEPAL, w.x - 12, y - 4 - (Math.floor(t / 300) % 2) * 4, 4); c.restore(); }
  });
}
function drawSpriteScaled(c, rows, pal, x, y, s) {
  for (let r = 0; r < rows.length; r++) for (let k = 0; k < rows[r].length; k++) { const col = pal[rows[r][k]]; if (!col || rows[r][k] === '.') continue; c.fillStyle = col; c.fillRect(Math.round(x + k * s), Math.round(y + r * s), s, s); }
}
