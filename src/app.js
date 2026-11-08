// ================= core helpers =================
const ALL = parseWords();
const BY_ID = Object.fromEntries(ALL.map(w => [w.id, w]));
const gradeWords = g => ALL.filter(w => w.g === g);
const HEAD = 6; // empty rows above a pet for hats
const SESSION_SIZE = 10;
// ---- five levels, easy to hard; inside each level words go from easy/common to hard/rare ----
const LEVEL_INFO = [
  { k: 'A', name: 'Level 1', sub: 'Grades 1\u20132' }, { k: 'B', name: 'Level 2', sub: 'Grades 3\u20134' },
  { k: 'C', name: 'Level 3', sub: 'Grade 5' }, { k: 'D', name: 'Level 4', sub: 'Grades 5\u20136' }, { k: 'E', name: 'Level 5', sub: 'Grade 6 challenge' }];
const LEVELS = LEVEL_INFO.map((L, gi) => ({ ...L, gi, ids: LEVEL_GROUPS[L.k].split(',').map(x => { const [id, z] = x.split(':'); return { id, z: +z / 10 }; }).filter(x => BY_ID[x.id]) }));
let acc = 0; LEVELS.forEach(L => { L.off = acc; acc += L.ids.length; });
const ORDER = LEVELS.flatMap(L => L.ids.map(x => x.id));
const levelAt = pos => LEVELS.reduce((f, L) => (pos >= L.off ? L : f), LEVELS[0]);
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const today = () => iso(new Date());
const shiftDay = (s, n) => { const d = new Date(s + 'T12:00:00'); d.setDate(d.getDate() + n); return iso(d); };
const daysBetween = (a, b) => Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 864e5);
const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

// ================= small sprites =================
const ICONS = {
  coin: ["..ooo..",".okkko.","okwkkko","okkjkko","okkjkko",".okkko.","..ooo.."],
  flame: ["...z...","..zz...","..zjz..",".zjjjz.",".zjkjz.","zjkkkjz","zjkkkjz",".zjkjz.","..zzz.."],
  flameOff: ["...s...","..ss...","..s.s..",".s...s.",".s...s.","s.....s","s.....s",".s...s.","..sss.."],
  heart: [".zz.zz.","zwzzzzz","zzzzzzz",".zzzzz.","..zzz..","...z..."],
  lock: ["..ooo..",".o...o.",".o...o.","ooooooo","okkkkko","okkokko","okkkkko","ooooooo"],
  check: ["......i",".....ii","i...ii.","ii.ii..",".iii...","..i...."],
  cross: ["zz...zz",".zz.zz.","..zzz..",".zz.zz.","zz...zz"],
  egg: ["..ooo..",".owwwo.","owwcwwo","owwwwwo","owcwwco","owwwwwo","owwwcwo",".owwwo.","..ooo.."],
  speaker: ["...o....","..oo..o.","ooxo...o","oxxo.o.o","ooxo...o","..oo..o.","...o...."],
  star: ["...k...","...k...","kkkkkkk",".kkkkk.","..kkk..",".kk.kk.","k.....k"],
  cloud: [".....wwww.......","...wwwwwwww.ww..",".wwwwwwwwwwwwwww","wwwwwwwwwwwwwwww","swwwwwwwwwwwwwws",".ssssssssssssss."],
  cannon: ["....oooo....","....osso....","....osso....","....osso....","...ossxso...","..ozzzzzzo..",".ozzwzzzzzo.",".ozzzzzzzzo.","oooooooooooo",".okko..okko.","..oo....oo.."],
  burst: ["....k.....",".k..k..k..","..k.k.k...","...kkk....","kkkkwkkkk.","...kkk....","..k.k.k...",".k..k..k..","....k....."]
};
const BALLOON = ["..oooooo..",".obbbbbbo.","obwbbbbbbo","obwbbbbbbo","obbbbbbbbo","obbbbbbbbo",".obbbbbbo.","..obbbbo..","...oooo...","....oo....",".....o....","....o.....",".....o...."];
const BALLOON_COLORS = ['#ff5d73', '#4cc9f0', '#ffcc33', '#7be0b0'];

function drawSprite(c, rows, pal, x, y) {
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    for (let k = 0; k < row.length; k++) {
      const ch = row[k]; if (ch === '.') continue;
      const col = pal[ch]; if (!col) continue;
      c.fillStyle = col; c.fillRect(x + k, y + r, 1, 1);
    }
  }
}

// ---- refinement: 2x smooth upscale (Scale2x) + soft volume shading + tinted inner outlines ----
const INK = 0x2a1d33;
const lumOf = k => 0.299 * (k >> 16 & 255) + 0.587 * (k >> 8 & 255) + 0.114 * (k & 255);
function mixKey(k, to, f) { const r = k >> 16 & 255, g = k >> 8 & 255, b = k & 255, tr = to >> 16 & 255, tg = to >> 8 & 255, tb = to & 255; return (Math.round(r + (tr - r) * f) << 16) | (Math.round(g + (tg - g) * f) << 8) | Math.round(b + (tb - b) * f); }
function refine(src, shade = true) {
  const w = src.width, h = src.height, d = src.getContext('2d').getImageData(0, 0, w, h).data;
  const K = new Int32Array(w * h);
  for (let i = 0; i < w * h; i++) K[i] = d[i * 4 + 3] < 40 ? -1 : (d[i * 4] << 16) | (d[i * 4 + 1] << 8) | d[i * 4 + 2];
  const W = w * 2, H = h * 2, O = new Int32Array(W * H);
  const at = (x, y) => K[Math.min(h - 1, Math.max(0, y)) * w + Math.min(w - 1, Math.max(0, x))];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const P = K[y * w + x], A = at(x, y - 1), B = at(x + 1, y), C = at(x - 1, y), D = at(x, y + 1);
    let p1 = P, p2 = P, p3 = P, p4 = P;
    if (C === A && C !== D && A !== B) p1 = A;
    if (A === B && A !== C && B !== D) p2 = B;
    if (D === C && D !== B && C !== A) p3 = C;
    if (B === D && B !== A && D !== C) p4 = D;
    const o = (y * 2) * W + x * 2; O[o] = p1; O[o + 1] = p2; O[o + W] = p3; O[o + W + 1] = p4;
  }
  const F = O.slice();
  if (shade) {
    const get = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? -1 : O[y * W + x];
    const edge = k => k === -1 || lumOf(k) < 70;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const k = O[y * W + x]; if (k === -1) continue;
      const L = lumOf(k);
      if (k === INK) {
        const ns = [get(x, y - 1), get(x + 1, y), get(x - 1, y), get(x, y + 1)];
        if (ns.includes(-1)) continue;
        const fill = ns.find(n => n !== -1 && lumOf(n) >= 70);
        if (fill !== undefined) F[y * W + x] = mixKey(INK, fill, 0.38);
        continue;
      }
      if (L < 70 || L > 238) continue;
      let f = 0;
      if (edge(get(x, y - 1))) f += 0.2; else if (edge(get(x, y - 2))) f += 0.08;
      if (edge(get(x - 1, y))) f += 0.08;
      if (edge(get(x, y + 1))) f -= 0.16; else if (edge(get(x, y + 2))) f -= 0.06;
      if (edge(get(x + 1, y))) f -= 0.07;
      if (f > 0) F[y * W + x] = mixKey(k, 0xffffff, f); else if (f < 0) F[y * W + x] = mixKey(k, 0x1a1030, -f);
    }
  }
  const out = document.createElement('canvas'); out.width = W; out.height = H;
  const oc = out.getContext('2d'), img = oc.createImageData(W, H);
  for (let i = 0; i < W * H; i++) { const k = F[i]; if (k === -1) continue; img.data[i * 4] = k >> 16 & 255; img.data[i * 4 + 1] = k >> 8 & 255; img.data[i * 4 + 2] = k & 255; img.data[i * 4 + 3] = 255; }
  oc.putImageData(img, 0, 0);
  return out;
}
function lowCanvas(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')); return c; }
const URLS = {};
function spriteURL(key, rows, pal) {
  if (URLS[key]) return URLS[key];
  const c = lowCanvas(rows[0].length, rows.length, x => drawSprite(x, rows, pal || BASEPAL, 0, 0));
  return URLS[key] = refine(c).toDataURL();
}
const icon = (name, cls = '') => `<img class="pxi ${cls}" src="${spriteURL('i-' + name, ICONS[name], BASEPAL)}" alt="">`;
const money = n => String(Math.round(n * 10) / 10);
const coinAmt = n => `<span class="amt">${icon('coin','coin')}$${money(n)}</span>`;

// ================= pets =================
function petPal(pet, skinOverride) {
  const skin = skinOverride !== undefined ? skinOverride : pet.skin;
  return Object.assign({}, BASEPAL, PETS[pet.kind].pal, skin && SKINS[skin] ? SKINS[skin].pal : {});
}
function drawGlasses(c, kind, x, y, a) {
  const X = '#1d1724';
  const eyes = [a.eL, a.eR].filter(v => v != null);
  eyes.forEach(ex => {
    const gx = x + ex - 1, gy = y + a.ey - 1;
    c.fillStyle = X;
    if (kind === 'shades') {
      c.fillRect(gx, gy + 1, 4, 2); c.fillStyle = '#ffffff'; c.fillRect(gx + 1, gy + 1, 1, 1);
    } else {
      c.fillRect(gx + 1, gy, 2, 1); c.fillRect(gx + 1, gy + 3, 2, 1); c.fillRect(gx, gy + 1, 1, 2); c.fillRect(gx + 3, gy + 1, 1, 2);
    }
  });
  c.fillStyle = X;
  if (eyes.length === 2) { for (let bx = a.eL + 3; bx <= a.eR - 2; bx++) c.fillRect(x + bx, y + a.ey, 1, 1); }
  else c.fillRect(x + a.eL - 3, y + a.ey, 2, 1);
}
function drawNeck(c, kind, x, y) {
  const P = BASEPAL;
  if (kind === 'bowtie') drawSprite(c, ["z...z", "zzkzz", "z...z"], P, x - 2, y - 1);
  else { drawSprite(c, ["zzwzzwzz"], P, x - 4, y); drawSprite(c, ["z.", "zw"], P, x + 1, y + 1); }
}
function drawPet(c, pet, x, y, o = {}) {
  const P = PETS[pet.kind], a = P.a;
  let rows = P.rows;
  if (o.blink) rows = rows.map((row, r) => r === a.ey ? row.replace(/[ew]/g, 'b') : r === a.ey + 1 ? row.replace(/w/g, 'e') : row);
  const oy = y + HEAD;
  drawSprite(c, rows, petPal(pet, o.skin), x, oy);
  const neck = o.neck !== undefined ? o.neck : pet.neck;
  const eyes = o.eyes !== undefined ? o.eyes : pet.eyes;
  const hat = o.hat !== undefined ? o.hat : pet.hat;
  if (neck) drawNeck(c, neck, x + a.nx, oy + a.ny);
  if (eyes) drawGlasses(c, eyes, x, oy, a);
  if (hat) { const h = HATS[hat]; drawSprite(c, h.rows, BASEPAL, x + a.hx - 4, oy + a.hy - (h.rows.length - 1)); }
}
function petURL(pet, o = {}) {
  const key = 'p-' + JSON.stringify([pet.kind, pet.skin, pet.hat, pet.eyes, pet.neck, pet.back, pet.body, o]);
  if (URLS[key]) return URLS[key];
  return URLS[key] = petCanvas(pet, o).toDataURL();
}
const PETC = {};
function petCanvas(pet, o = {}) {
  const key = JSON.stringify([pet.kind, pet.skin, pet.hat, pet.eyes, pet.neck, pet.back, pet.body, o]);
  if (PETC[key]) return PETC[key];
  const keys = Object.keys(PETC); if (keys.length > 60) delete PETC[keys[0]];
  return PETC[key] = renderPet(pet, o);
}
const foodURL = k => foodImgURL(k) || URLS['f-' + k] || (URLS['f-' + k] = renderFood(k).toDataURL());

// ================= room scene =================
function R(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(x, y, w, h); }
function drawRoomBase(c) {
  R(c, 0, 0, 96, 46, '#ffe1b0'); for (let x = 0; x < 96; x += 8) R(c, x, 0, 4, 44, '#ffd89b');
  R(c, 0, 44, 96, 2, '#b5784a'); R(c, 0, 46, 96, 18, '#d9a066');
  for (let y = 46, k = 0; y < 64; y += 4, k++) { R(c, 0, y, 96, 1, '#c48a52'); for (let x = (k % 2) * 12; x < 96; x += 24) R(c, x, y, 1, 4, '#c48a52'); }
  R(c, 62, 7, 17, 15, '#8b5a2b'); R(c, 63, 8, 15, 13, '#9fdcff'); R(c, 64, 11, 5, 2, '#ffffff'); R(c, 65, 10, 3, 1, '#ffffff');
  R(c, 70, 8, 1, 13, '#8b5a2b'); R(c, 63, 14, 15, 1, '#8b5a2b'); R(c, 61, 22, 19, 2, '#a86a3a');
}
const SHELTERS = {
  box(c) {
    R(c, 4, 30, 30, 22, '#c8945a'); R(c, 4, 30, 30, 3, '#a87440'); R(c, 4, 50, 30, 2, '#9a6838');
    R(c, 9, 36, 20, 14, '#5a3a22'); R(c, 9, 36, 20, 2, '#40281a');
    R(c, 0, 26, 10, 5, '#d9a86c'); R(c, 28, 26, 10, 5, '#d9a86c'); R(c, 18, 30, 2, 6, '#efe0b8');
  },
  doghouse(c) {
    R(c, 6, 30, 28, 22, '#d1495b'); R(c, 6, 48, 28, 4, '#a83246');
    for (let i = 0; i < 14; i++) R(c, 18 - i, 16 + i, 4 + 2 * i, 1, i % 3 === 0 ? '#7a4f30' : '#5c3c24');
    R(c, 14, 38, 12, 14, '#2a1d1d'); R(c, 15, 37, 10, 1, '#2a1d1d'); R(c, 16, 36, 8, 1, '#2a1d1d'); R(c, 16, 31, 8, 3, '#ffcc33');
  },
  tent(c) {
    for (let i = 0; i < 34; i++) { const hw = Math.round(i * 0.55) + 1; R(c, 20 - hw, 18 + i, 2 * hw, 1, '#3a86ff'); R(c, 20 - hw, 18 + i, 1, 1, '#2459b3'); R(c, 19 + hw, 18 + i, 1, 1, '#2459b3'); }
    for (let i = 14; i < 34; i++) { const hw = Math.round((i - 14) * 0.35); if (hw) R(c, 20 - hw, 18 + i, 2 * hw, 1, '#1b3f8a'); }
    R(c, 20, 13, 1, 6, '#555555'); R(c, 21, 13, 4, 2, '#ffcc33'); R(c, 0, 51, 3, 1, '#8b5a2b'); R(c, 37, 51, 3, 1, '#8b5a2b');
  },
  igloo(c) {
    for (let yy = 34; yy <= 52; yy++) { const dy = 52 - yy; const hw = Math.floor(Math.sqrt(18 * 18 - dy * dy)); R(c, 20 - hw, yy, 2 * hw, 1, (yy - 34) % 4 === 0 ? '#c7dff0' : '#eef8ff'); if ((yy - 34) % 4 === 2) for (let x = 20 - hw + ((yy % 8) ? 3 : 7); x < 20 + hw; x += 8) R(c, x, yy - 1, 1, 3, '#c7dff0'); }
    for (let yy = 45; yy <= 52; yy++) { const dy = 52 - yy; const hw = Math.floor(Math.sqrt(49 - dy * dy)); R(c, 20 - hw, yy, 2 * hw, 1, '#2c3e57'); }
  },
  treehouse(c) {
    R(c, 2, 4, 36, 12, '#3e8948'); R(c, 6, 0, 28, 6, '#4fa357'); R(c, 0, 8, 40, 6, '#3e8948'); R(c, 10, 2, 4, 2, '#63c74d'); R(c, 26, 6, 4, 2, '#63c74d');
    R(c, 16, 30, 8, 22, '#7a4a2a'); R(c, 16, 30, 2, 22, '#5c3620');
    R(c, 7, 14, 26, 14, '#c97b3c'); R(c, 7, 14, 26, 2, '#a8602a'); R(c, 11, 18, 6, 6, '#ffe9a6'); R(c, 13, 18, 1, 6, '#a8602a'); R(c, 22, 18, 6, 10, '#5a3a22');
    R(c, 4, 28, 32, 3, '#8b5a2b'); R(c, 27, 31, 1, 21, '#a86a3a'); R(c, 32, 31, 1, 21, '#a86a3a'); for (let y = 33; y < 52; y += 3) R(c, 27, y, 6, 1, '#a86a3a');
  },
  castle(c) {
    R(c, 2, 20, 9, 32, '#8f98ab'); R(c, 29, 20, 9, 32, '#8f98ab'); R(c, 8, 28, 24, 24, '#a7b0c2');
    for (let x = 2; x < 11; x += 3) R(c, x, 17, 2, 3, '#8f98ab'); for (let x = 29; x < 38; x += 3) R(c, x, 17, 2, 3, '#8f98ab'); for (let x = 12; x < 29; x += 4) R(c, x, 25, 2, 3, '#a7b0c2');
    for (let y = 32; y < 52; y += 4) R(c, 11, y, 18, 1, '#8f98ab');
    R(c, 15, 40, 10, 12, '#3b2a2a'); R(c, 16, 38, 8, 2, '#3b2a2a'); R(c, 18, 40, 1, 12, '#6b4d3a'); R(c, 21, 40, 1, 12, '#6b4d3a');
    R(c, 5, 26, 2, 4, '#2a1d33'); R(c, 33, 26, 2, 4, '#2a1d33'); R(c, 6, 8, 1, 9, '#555555'); R(c, 7, 8, 5, 3, '#e5383b');
  }
};
const DECOR = {
  lights: { box: [0, 0, 40, 7], draw(c, t) { const cols = ['#ff5d73', '#ffcc33', '#4cc9f0', '#7be0b0']; for (let x = 0; x < 96; x++) R(c, x, 2 + Math.round(Math.sin(x / 6) * 1.2), 1, 1, '#2f6b3a'); for (let x = 3, k = 0; x < 96; x += 8, k++) R(c, x, 3 + Math.round(Math.sin(x / 6) * 1.2), 2, 2, cols[(k + Math.floor(t / 600)) % 4]); } },
  poster: { box: [44, 6, 13, 15], draw(c) { R(c, 44, 6, 13, 15, '#2a1d33'); R(c, 45, 7, 11, 13, '#3a3a8c'); drawSprite(c, ICONS.star, BASEPAL, 47, 10); R(c, 46, 8, 1, 1, '#ffffff'); R(c, 54, 17, 1, 1, '#ffffff'); } },
  shelf: { box: [82, 16, 13, 36], draw(c) { R(c, 82, 16, 13, 36, '#8b5a2b'); R(c, 83, 17, 11, 34, '#6b4423'); const books = ['#e5383b', '#3a86ff', '#ffcc33', '#57cc99', '#7b4fd6', '#ff9f1c']; [27, 38, 49].forEach((sy, s) => { R(c, 82, sy, 13, 2, '#8b5a2b'); for (let b = 0; b < 4; b++) { const h = 6 + ((b + s) % 3); R(c, 84 + b * 2 + (b > 1 ? 1 : 0), sy - h, 2, h, books[(b + s * 2) % 6]); } }); } },
  plant: { box: [71, 34, 11, 18], draw(c) { R(c, 73, 46, 8, 6, '#c8553d'); R(c, 72, 45, 10, 2, '#a8432e'); R(c, 74, 38, 2, 7, '#3e8948'); R(c, 77, 36, 2, 9, '#4fa357'); R(c, 71, 40, 4, 2, '#4fa357'); R(c, 78, 39, 4, 2, '#3e8948'); R(c, 75, 35, 2, 2, '#57cc99'); } },
  lamp: { box: [58, 20, 17, 32], draw(c) { c.globalAlpha = .2; R(c, 58, 26, 17, 10, '#fff3b0'); c.globalAlpha = 1; R(c, 63, 50, 7, 2, '#4a4a4a'); R(c, 66, 26, 1, 24, '#4a4a4a'); R(c, 62, 21, 9, 5, '#ffcc33'); R(c, 63, 20, 7, 1, '#ffcc33'); R(c, 62, 25, 9, 1, '#d69e1a'); } },
  rug: { box: [29, 51, 46, 13], draw(c) { const cols = ['#e5383b', '#ffcc33', '#e5383b', '#ffe9c9', '#ffe9c9']; for (let y = 52; y <= 62; y++) { const dy = y - 57; const hw = Math.round(22 * Math.sqrt(Math.max(0, 1 - dy * dy / 30))); R(c, 52 - hw, y, 2 * hw, 1, cols[Math.min(4, Math.abs(dy))]); } } },
  tank: { box: [3, 46, 16, 15], draw(c, t) { R(c, 3, 46, 16, 11, '#2a1d33'); R(c, 4, 47, 14, 9, '#9fdcff'); R(c, 4, 47, 14, 2, '#c6ecff'); R(c, 4, 54, 14, 2, '#e8c872'); R(c, 6, 50, 1, 4, '#3e8948'); R(c, 15, 51, 1, 3, '#3e8948'); const p = Math.floor(t / 150) % 18, fx = 5 + (p < 9 ? p : 18 - p); R(c, fx, 51, 3, 2, '#ff9f1c'); R(c, 4, 57, 2, 4, '#5a3a22'); R(c, 16, 57, 2, 4, '#5a3a22'); } },
  ball: { box: [77, 52, 8, 8], draw(c) { drawSprite(c, ["..oooo..", ".ozzzzo.", "ozwzzzzo", "owwwwwwo", "ozzzzzzo", ".ozzzzo.", "..oooo.."], BASEPAL, 77, 53); } }
};
const DECOR_BACK = ['lights', 'poster', 'shelf'], DECOR_FRONT = ['lamp', 'plant', 'rug', 'tank', 'ball'];
let FRONTROOM = null;
let hopUntil = 0;
let LOWROOM = null;
function hash(n) { n = (n ^ 61) ^ (n >>> 16); n = n + (n << 3); n = n ^ (n >>> 4); n = Math.imul(n, 0x27d4eb2d); return ((n ^ (n >>> 15)) >>> 0) / 4294967296; }
function drawScene(c, t, pet) {
  pet = pet || S.pets[S.active];
  const homeOf = pet || { decor: {}, items: {}, shelter: 'box' };
  // low-res room, smoothed to 2x, then fine details at full resolution
  LOWROOM = LOWROOM || document.createElement('canvas'); LOWROOM.width = 96; LOWROOM.height = 64;
  const lc = LOWROOM.getContext('2d'); lc.clearRect(0, 0, 96, 64); drawRoomBase(lc);
  DECOR_BACK.forEach(k => { if (homeOf.decor[k] && homeOf.items['deco-' + k]) DECOR[k].draw(lc, t); });
  FRONTROOM = FRONTROOM || document.createElement('canvas'); FRONTROOM.width = 96; FRONTROOM.height = 64;
  const fc = FRONTROOM.getContext('2d'); fc.clearRect(0, 0, 96, 64);
  DECOR_FRONT.forEach(k => { if (homeOf.decor[k] && homeOf.items['deco-' + k]) DECOR[k].draw(fc, t); });
  c.imageSmoothingEnabled = false;
  c.setTransform(c.canvas.width / 192, 0, 0, c.canvas.width / 192, 0, 0); c.imageSmoothingEnabled = false;
  c.clearRect(0, 0, 192, 128); c.drawImage(refine(LOWROOM, false), 0, 0);
  // wallpaper motif and wood grain
  c.fillStyle = 'rgba(214,150,80,.18)';
  for (let y = 6; y < 86; y += 12) for (let x = (y / 12 % 2) * 8 + 4; x < 192; x += 16) { c.fillRect(x, y, 2, 2); }
  c.fillStyle = 'rgba(120,70,30,.16)';
  for (let i = 0; i < 70; i++) { const x = Math.floor(hash(i * 7 + 1) * 190), y = 94 + Math.floor(hash(i * 13 + 5) * 32); c.fillRect(x, y, 3 + Math.floor(hash(i) * 6), 1); }
  // light from the window
  c.save(); c.globalAlpha = 0.13; c.fillStyle = '#fff6d8';
  c.beginPath(); c.moveTo(126, 44); c.lineTo(156, 44); c.lineTo(150, 128); c.lineTo(84, 128); c.closePath(); c.fill(); c.restore();
  // soft shadows along the floor line
  const g = c.createLinearGradient(0, 88, 0, 100); g.addColorStop(0, 'rgba(60,30,10,.22)'); g.addColorStop(1, 'rgba(60,30,10,0)');
  c.fillStyle = g; c.fillRect(0, 92, 192, 8);
  c.save(); c.globalAlpha = .18; c.fillStyle = '#2a1d33'; c.beginPath(); c.ellipse(42, 105, 40, 4, 0, 0, Math.PI * 2); c.fill(); c.restore();
  const hImg = homeImg(homeOf.shelter);
  if (hImg) { const hw = 84, hh = hImg.height * hw / hImg.width; c.imageSmoothingEnabled = true; c.drawImage(hImg, 0, 107 - hh, hw, hh); c.imageSmoothingEnabled = false; }
  else (SHELTERS_HI[homeOf.shelter] || SHELTERS_HI.box)(c);
  c.drawImage(refine(FRONTROOM, false), 0, 0);
  if (!pet) return;
  const PH = 60, PW = PH * PET_CW / PET_CH;
  let y = 122 - PH + (reduceMotion ? 0 : Math.floor(t / 520) % 2);
  if (t < hopUntil) y -= Math.round(Math.abs(Math.sin((hopUntil - t) / 110)) * 8);
  c.save(); c.globalAlpha = 0.22; c.fillStyle = '#2a1d33'; c.beginPath(); c.ellipse(104, 120, 12, 3, 0, 0, Math.PI * 2); c.fill(); c.restore();
  c.imageSmoothingEnabled = true; c.drawImage(petCanvas(pet, { blink: t % 4200 < 160 }), 104 - PW / 2, y, PW, PH); c.imageSmoothingEnabled = false;
}
function itemURL(kind, key) {
  const id = kind + key; if (URLS[id]) return URLS[id];
  if (kind === 'shelter' && homeImg(key)) return URLS[id] = homeImg(key).src;
  if (kind === 'shelter') { const big = document.createElement('canvas'); big.width = 192; big.height = 128; SHELTERS_HI[key](big.getContext('2d')); return URLS[id] = trimCanvas(big).toDataURL(); }
  const full = document.createElement('canvas'); full.width = 96; full.height = 64;
  const fc = full.getContext('2d'); let box;
  DECOR[key].draw(fc, 0); box = DECOR[key].box;
  const c = lowCanvas(box[2], box[3], x => x.drawImage(full, box[0], box[1], box[2], box[3], 0, 0, box[2], box[3]));
  return URLS[id] = refine(c, false).toDataURL();
}

// ================= state & saving =================
const LS_KEY = 'spellpets-save-v1';
function freshState() { return { v: 1, savedAt: 0, coins: 0, earned: 0, streak: 0, best: 0, lastDay: null, days: [], seen: {}, mistakes: {}, pets: [], active: 0, owned: {}, food: {}, shelter: 'box', decor: {}, rewards: [], petMode: 'eggs', partner: {}, sessions: 0, rate: 0.85, sound: true }; }
function migrate(o) {
  const f = Object.assign(freshState(), o || {});
  const fix = obj => { const r = {}; for (const [k, v] of Object.entries(obj || {})) r[k.includes(':') ? k.split(':').pop() : k] = v; return r; };
  f.seen = fix(f.seen); f.mistakes = fix(f.mistakes);
  if (f.petMode !== 'eggs') { f.rewards = []; f.petMode = 'eggs'; f.eggBase = f.sessions || 0; }
  f.partner = f.partner || {};
  f.zh = f.zh || { done: {}, mistakes: {}, rewarded: [] };
  (f.pets || []).forEach(p => { p.items = p.items || {}; p.decor = p.decor || {}; p.shelter = p.shelter || 'box'; });
  if (!f.perPetHomes && f.pets && f.pets.length) {
    const p = f.pets[f.active] || f.pets[0];
    Object.keys(f.owned || {}).forEach(k => { if (/^(home|deco)-/.test(k)) { p.items[k] = 1; delete f.owned[k]; } });
    p.shelter = f.shelter || 'box'; p.decor = Object.assign({}, f.decor || {});
    f.perPetHomes = 1;
  }
  (f.pets || []).forEach(p => migrateRoom(p, f));
  return f;
}
// Each child has a player profile. Saves live in the artifact's database at profiles/<id>, so they follow
// the artifact to any device or browser; this device also keeps a copy in localStorage.
const LS_PROF = 'spellpets-profiles-v1', LS_ACTIVE = 'spellpets-active-profile';
const lsKey = id => LS_KEY + ':' + id;
function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }
let PROFILES = (() => { try { return JSON.parse(lsGet(LS_PROF)) || []; } catch (e) { return []; } })();
const storeProfiles = () => lsSet(LS_PROF, JSON.stringify(PROFILES));
function localSave(id) { try { const t = lsGet(lsKey(id)); return t ? migrate(JSON.parse(t)) : null; } catch (e) { return null; } }
let LEGACY = (() => { try { const t = lsGet(LS_KEY); const o = t ? migrate(JSON.parse(t)) : null; return o && (o.pets.length || o.sessions) ? o : null; } catch (e) { return null; } })();
let PROFILE = PROFILES.find(p => p.id === lsGet(LS_ACTIVE) && !p.test) || null;
let S = (PROFILE && localSave(PROFILE.id)) || freshState();
let cloudDb = null, cloudTimer = null, cloudBusy = false, cloudAgain = false, cloudReady = false;
const newId = () => 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const isTester = () => !!PROFILE && !!PROFILE.test;
// Developer mode: only the artifact's owner sees the Developer button, and it needs a password.
// The Test profile lives at dev/test, a path only the owner can read or write.
const TEST_ID = 'ptest';
let IS_OWNER = false, DEV_OPEN = false;
const profDoc = id => cloudDb.doc(id === TEST_ID ? 'dev/test' : 'profiles/' + id);
const visibleProfiles = () => PROFILES.filter(p => !p.test || DEV_OPEN);
const isEddie = () => !!PROFILE && (/^eddie$/i.test(PROFILE.name.trim()) || isTester());
let REMOTE_IDS = new Set();
function save() {
  S.savedAt = Date.now();
  if (!PROFILE) return;
  lsSet(lsKey(PROFILE.id), JSON.stringify(S));
  const e = PROFILES.find(p => p.id === PROFILE.id); if (e) { e.savedAt = S.savedAt; storeProfiles(); }
  if (cloudDb) { clearTimeout(cloudTimer); cloudTimer = setTimeout(flushCloud, 1500); }
}
async function pushProfile(id) {
  const prof = PROFILES.find(p => p.id === id); if (!prof || !cloudDb) return;
  const st = id === (PROFILE && PROFILE.id) ? S : localSave(id); if (!st) return;
  await profDoc(id).set({ name: prof.name, test: !!prof.test, json: JSON.stringify(st), savedAt: st.savedAt || 0, created: prof.created || 0 });
  REMOTE_IDS.add(id);
}
async function flushCloud() {
  if (!cloudDb || !PROFILE) return;
  if (cloudBusy) { cloudAgain = true; return; }
  cloudBusy = true;
  try { await pushProfile(PROFILE.id); setCloudNote(''); } catch (e) { setCloudNote('Could not save online just now. Progress is kept on this device and will sync later.'); }
  cloudBusy = false;
  if (cloudAgain) { cloudAgain = false; flushCloud(); }
}
function setCloudNote(t) { const el = document.getElementById('cloudNote'); if (el) el.textContent = t; }
// merge one remote profile doc into this device
function takeRemote(id, d) {
  if (!d || !d.name) return;
  let prof = PROFILES.find(p => p.id === id);
  if (!prof) { prof = { id, name: d.name, created: d.created || 0, savedAt: 0 }; PROFILES.push(prof); }
  prof.name = d.name; prof.test = !!d.test; REMOTE_IDS.add(id);
  const local = localSave(id), localAt = local ? local.savedAt || 0 : 0;
  if ((d.savedAt || 0) > localAt && d.json) {
    lsSet(lsKey(id), d.json); prof.savedAt = d.savedAt;
    if (PROFILE && PROFILE.id === id && !P) { S = migrate(JSON.parse(d.json)); PROFILE.name = d.name; PROFILE.test = !!d.test; if (currentScreen !== 'who') route(currentScreen); }
  }
}
async function initCloud() {
  try {
    const offline = () => { cloudReady = true; if (currentScreen === 'who') renderWho(); };
    if (!window.claude || !window.claude.use) return offline();
    const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
    if (!db) return offline();
    cloudDb = db;
    const snap = await db.collection('profiles').get();
    const remoteIds = new Set();
    snap.docs.forEach(doc => { if (doc.id === TEST_ID) return; remoteIds.add(doc.id); takeRemote(doc.id, doc.data()); });
    IS_OWNER = !!(user && await user.isOwner().catch(() => false));
    if (IS_OWNER) { try { const t = await db.doc('dev/test').get(); if (t.exists) { remoteIds.add(TEST_ID); takeRemote(TEST_ID, { ...t.data(), test: true }); } } catch (e) {} }
    else { PROFILES = PROFILES.filter(p => !p.test); }
    // players made on this device before it could reach the database
    for (const prof of PROFILES) if (!remoteIds.has(prof.id) && (!prof.test || IS_OWNER)) { try { await pushProfile(prof.id); } catch (e) {} }
    // progress from before profiles existed (this account's private save)
    if (!PROFILES.length && user) {
      try {
        const uid = await user.id();
        const old = uid && await db.collection('data/users/' + uid).doc('save').get();
        if (old && old.exists) { const o = migrate(JSON.parse(old.data().json)); if ((o.pets.length || o.sessions) && (!LEGACY || (o.savedAt || 0) > (LEGACY.savedAt || 0))) LEGACY = o; }
      } catch (e) {}
    }
    storeProfiles(); cloudReady = true;
    if (PROFILE && !PROFILES.some(p => p.id === PROFILE.id)) PROFILE = null;
    if (PROFILE) PROFILE.test = !!(PROFILES.find(p => p.id === PROFILE.id) || {}).test;
    if (PROFILE && PROFILE.test && !DEV_OPEN) { PROFILE = null; lsDel(LS_ACTIVE); S = freshState(); }
    if (!PROFILE && !P) route('who'); else if (currentScreen === 'who') renderWho();
    // live updates from other devices
    db.collection('profiles').onSnapshot(qs => { qs.docChanges().forEach(ch => { if (ch.type === 'removed' || ch.doc.id === TEST_ID) return; takeRemote(ch.doc.id, ch.doc.data()); }); storeProfiles(); if (currentScreen === 'who') renderWho(); }, () => {});
  } catch (e) { cloudReady = true; if (currentScreen === 'who') renderWho(); }
}

// ================= players =================
function choosePlayer(id) {
  if (P) return;
  if (PROFILE) { clearTimeout(cloudTimer); flushCloud(); }
  PROFILE = PROFILES.find(p => p.id === id); if (!PROFILE) return;
  lsSet(LS_ACTIVE, id);
  S = localSave(id) || freshState();
  roomIdx = 0; shopPet = 0; zhPartSel = 0;
  route('home'); maybeFirstPet();
}
function addPlayer(name, fromState) {
  name = (name || '').trim().slice(0, 20); if (!name) return null;
  const id = newId(), prof = { id, name, created: Date.now(), savedAt: 0 };
  PROFILES.push(prof); storeProfiles();
  const st = fromState || freshState(); st.savedAt = Date.now();
  lsSet(lsKey(id), JSON.stringify(st));
  if (cloudDb) pushProfile(id).catch(() => {});
  return id;
}
function renderWho() {
  const cards = visibleProfiles().map(p => {
    const st = (PROFILE && PROFILE.id === p.id) ? S : localSave(p.id) || freshState();
    const pet = st.pets[st.active] || st.pets[0];
    return `<button class="whocard" data-who="${esc(p.id)}">${pet ? `<img class="pxi petimg" src="${petURL(pet)}" alt="">` : '<span class="whoegg"></span>'}
      <b>${esc(p.name)}</b><span class="muted small">${icon('flame', 'flame')} ${st.streak || 0} · $${money(st.coins || 0)}</span>
      ${p.test ? '<span class="whotag test">Test</span>' : ''}${cloudDb ? (REMOTE_IDS.has(p.id) ? '<span class="whotag ok">Saved online</span>' : '<span class="whotag warn">Uploading…</span>') : cloudReady ? '<span class="whotag warn">This device only</span>' : ''}</button>`;
  }).join('');
  $('#whoBody').innerHTML = `
    ${LEGACY ? `<div class="panel legacy"><h2>Saved progress found</h2><p>This device already has a player with ${LEGACY.pets.length} pet${LEGACY.pets.length === 1 ? '' : 's'} and ${LEGACY.sessions || 0} sessions. Whose progress is it?</p>
      <div class="row"><input id="legacyName" class="nameinput" maxlength="20" placeholder="Name, e.g. Eddie"><button class="btn go" id="legacySave">Save for this player</button></div></div>` : ''}
    <div class="whogrid">${cards}<button class="whocard add" id="whoAdd"><span class="plus">+</span><b>Add a player</b></button></div>
    <div class="row hidden" id="addRow"><input id="newName" class="nameinput" maxlength="20" placeholder="Player's name"><button class="btn go" id="newSave">Add</button></div>
    ${IS_OWNER ? `<p class="center small"><button class="linkbtn devbtn" id="devBtn">${DEV_OPEN ? 'Developer mode is on \u00b7 turn off' : 'Developer'}</button>${DEV_OPEN ? ' \u00b7 <button class="linkbtn devbtn" id="importBtn">Import players from a backup file</button>' : ''}</p>` : ''}
    <p class="muted small center">${cloudDb ? 'Every player’s progress is saved online with this game, so it is there on any computer or tablet you open it on.' : cloudReady ? 'Progress is saved on this device. Sign in to Claude to keep it online on every device.' : 'Connecting…'}</p>`;
}
function whoClick(e) {
  const c = e.target.closest('[data-who]'); if (c) return choosePlayer(c.dataset.who);
  if (e.target.closest('#devBtn')) return devClick();
  if (e.target.closest('#importBtn')) return $('#importFile').click();
  if (e.target.closest('#whoAdd')) { $('#addRow').classList.remove('hidden'); $('#newName').focus(); return; }
  if (e.target.closest('#newSave')) { const id = addPlayer($('#newName').value); if (id) choosePlayer(id); return; }
  if (e.target.closest('#legacySave')) { const id = addPlayer($('#legacyName').value, LEGACY); if (id) { LEGACY = null; lsDel(LS_KEY); choosePlayer(id); } }
}

// ================= progress rules =================
function liveStreak() { if (!S.lastDay) return 0; return daysBetween(S.lastDay, today()) <= 1 ? S.streak : 0; }
// Hidden rhythm: about every 30 finished sessions an egg hatches into a new pet.
// Each pet's limited-edition skin unlocks after about 25 sessions played with that pet.
// Neither number is ever shown to the player.
const EGG_EVERY = 30, LTD_AFTER = 25;
const eggSessions = () => Math.max(0, S.sessions - (S.eggBase || 0));
const milestonesReached = () => Math.min(PET_ORDER.length - 1, Math.floor(eggSessions() / EGG_EVERY));
const seenTotal = () => ALL.filter(w => S.seen[w.id]).length;
function currentLevel() {
  const start = (S.place && S.place.pos) || 0;
  let pos = ORDER.findIndex((id, i) => i >= start && !S.seen[id] && !S.mistakes[id]);
  if (pos < 0) pos = ORDER.findIndex(id => !S.seen[id] && !S.mistakes[id]);
  if (pos < 0) return { L: LEVELS[4], done: LEVELS[4].ids.length, pos: ORDER.length };
  const L = levelAt(pos); return { L, done: L.ids.filter(x => S.seen[x.id]).length, pos };
}
const dueMistakes = () => { const t = today(); return Object.keys(S.mistakes).filter(id => BY_ID[id] && S.mistakes[id] < t); };
const laterMistakes = () => { const t = today(); return Object.keys(S.mistakes).filter(id => BY_ID[id] && S.mistakes[id] >= t); };
function petFull(pet) { if (!pet) return 0; const gap = pet.fedDay ? Math.max(0, daysBetween(pet.fedDay, today())) : 0; return Math.max(0, Math.min(100, (pet.full ?? 70) - gap * 20)); }

function buildSession() {
  const due = shuffle(dueMistakes()).slice(0, SESSION_SIZE);
  const items = due.map(id => ({ id, review: true }));
  const used = new Set(due);
  // new words come in level order, starting where the level test placed the child
  const start = (S.place && S.place.pos) || 0;
  const fresh = id => BY_ID[id] && !S.seen[id] && !S.mistakes[id] && !used.has(id);
  for (const id of [...ORDER.slice(start), ...ORDER.slice(0, start)]) { if (items.length >= SESSION_SIZE) break; if (fresh(id)) { items.push({ id, review: false }); used.add(id); } }
  if (items.length < SESSION_SIZE) {
    for (const id of ORDER) { if (items.length >= SESSION_SIZE) break; if (S.seen[id] && !S.mistakes[id] && !used.has(id)) { items.push({ id, review: false, practice: true }); used.add(id); } }
  }
  return shuffle(items);
}

// ================= sound & speech =================
let AC = null;
function beep(seq) {
  if (!S.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const t0 = AC.currentTime;
    seq.forEach(([f, d, st, type]) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = type || 'square'; o.frequency.value = f; g.gain.setValueAtTime(.05, t0 + st); g.gain.exponentialRampToValueAtTime(.0001, t0 + st + d); o.connect(g).connect(AC.destination); o.start(t0 + st); o.stop(t0 + st + d + .02); });
  } catch (e) {}
}
const SFX = {
  good: () => beep([[660, .08, 0], [880, .14, .08]]), bad: () => beep([[220, .18, 0, 'sawtooth'], [160, .22, .12, 'sawtooth']]),
  shoot: () => beep([[1000, .05, 0], [520, .07, .04]]), coin: () => beep([[988, .07, 0], [1319, .16, .07]]),
  fanfare: () => beep([[523, .1, 0], [659, .1, .1], [784, .1, .2], [1047, .3, .3]]), tap: () => beep([[700, .03, 0]])
};
let VOICE = null;
function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  const vs = speechSynthesis.getVoices();
  VOICE = vs.find(v => /en[-_]CA/i.test(v.lang)) || vs.find(v => /en[-_]US/i.test(v.lang) && /Samantha|Google|Aria|Jenny|Ava/i.test(v.name)) || vs.find(v => /en[-_]US/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
}
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
function say(text, slow) {
  if (!('speechSynthesis' in window)) { toast("This browser can't read words aloud. Try Chrome or Safari."); return; }
  try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = VOICE ? VOICE.lang : 'en-US'; if (VOICE) u.voice = VOICE; u.rate = slow ? 0.55 : S.rate; speechSynthesis.speak(u); } catch (e) {}
}

// ================= UI shell =================
let currentScreen = 'home', PLAY_FROM = 'en';
function route(name) {
  currentScreen = name;
  if (name !== 'who' && name !== 'play' && !PROFILE) name = 'who';
  currentScreen = name;
  if (name === 'play' && P) PLAY_FROM = P.mode || 'en';
  if (name === 'who') $('#whoBack').hidden = !PROFILE;
  ['who', 'home', 'play', 'shop', 'room', 'book', 'town', 'chal', 'deco'].forEach(n => { $('#scr-' + n).hidden = n !== name; });
  renderHud();
  if (name === 'who') renderWho(); else if (name === 'home') renderHome(); else if (name === 'shop') renderShop(); else if (name === 'room') renderRoom(); else if (name === 'book') renderBook(); else if (name === 'town') renderTown(); else if (name === 'chal') renderChal(); else if (name === 'deco') renderDeco();
  window.scrollTo(0, 0);
}
function renderHud() {
  const st = liveStreak();
  $('#chipStreak').innerHTML = `${icon(st ? 'flame' : 'flameOff', 'flame')}<span>${st}</span><small>day${st === 1 ? '' : 's'}</small>`;
  $('#chipStreak').title = S.lastDay === today() ? 'You played today!' : 'Play one session today to keep your streak';
  $('#chipStreak').classList.toggle('lit', S.lastDay === today());
  $('#chipCoins').innerHTML = `${icon('coin', 'coin')}<span>$${money(S.coins)}</span>`;
  $('#chipWho').textContent = PROFILE ? PROFILE.name : 'Players'; $('#chipWho').hidden = currentScreen === 'who' && !PROFILE;
  $('#chipStreak').hidden = $('#chipCoins').hidden = !PROFILE;
}
let toastTimer;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 2600); }
let modalLocked = false;
function openModal(html, locked) { modalLocked = !!locked; $('#modalBody').innerHTML = html; $('#modal').hidden = false; }
function closeModal(force) { if (modalLocked && !force) return; $('#modal').hidden = true; $('#modalBody').innerHTML = ''; modalLocked = false; }

// ================= HOME =================
function renderHome() {
  const pet = S.pets[S.active];
  $('#homePetName').textContent = pet ? pet.name : 'No pet yet';
  $('#homePetKind').textContent = pet ? PETS[pet.kind].name : '';
  const full = petFull(pet);
  $('#homeFull').style.width = full + '%';
  $('#homeFull').className = full < 35 ? 'low' : '';
  $('#homeFullNum').textContent = full + '%';
  const due = dueMistakes().length, later = laterMistakes().length;
  const left = ALL.length - seenTotal();
  const bubble = !pet ? '' : full < 35 ? "I'm hungry! Can we buy a snack?" : S.lastDay === today() ? 'Great job today! Want to play more?' : liveStreak() > 0 ? `Keep our ${liveStreak()}-day streak going!` : "Let's spell together!";
  $('#bubble').textContent = bubble; $('#bubble').hidden = !bubble;
  let note;
  if (due) note = `${due} word${due > 1 ? 's' : ''} from your Mistake Notebook ${due > 1 ? 'are' : 'is'} in this session. Each one you get right is worth ${coinAmt(2)}.`;
  else if (left) { const c = currentLevel(); note = !S.place ? `First, a quick level test finds the right words for you. Then every word you get right in all 3 rounds earns ${coinAmt(1)}.` : `<b>${c.L.name}</b> <span class="muted">(${c.L.sub})</span> \u00b7 ${c.done} of ${c.L.ids.length} words done. Every word you get right in all 3 rounds earns ${coinAmt(1)}.`; }
  else note = `You have seen all ${ALL.length.toLocaleString()} words! Practice sessions still earn ${coinAmt(1)} a word.`;
  if (later) note += ` <span class="muted">${later} mistake word${later > 1 ? 's' : ''} from today will come back tomorrow.</span>`;
  $('#playNote').innerHTML = note;
  $('#questSub').textContent = !S.place ? 'Level test first' : S.lastDay === today() ? 'Play 10 more words' : 'Spell 10 words';
  renderTestTools(); renderAccount();
  $('#btnPlay').setAttribute('aria-label', 'Daily Quest: ' + $('#questSub').textContent);
  $('#homeTitle').textContent = pet ? `${pet.name}'s Home` : 'My First Home';
  const stD = liveStreak(); $('#homeDay').innerHTML = `${icon(stD ? 'flame' : 'flameOff', 'flame')} Day ${Math.max(1, stD)}`;

  // week strip
  const t = today(); const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const set = new Set(S.days);
  let wk = '';
  for (let i = 6; i >= 0; i--) {
    const d = shiftDay(t, -i); const on = set.has(d); const dow = names[new Date(d + 'T12:00:00').getDay()];
    wk += `<div class="day ${on ? 'on' : ''} ${i === 0 ? 'today' : ''}"><span>${i === 0 ? 'Today' : dow}</span>${icon(on ? 'flame' : 'flameOff', 'flame')}</div>`;
  }
  $('#week').innerHTML = wk;
  const st = liveStreak();
  $('#streakNote').innerHTML = S.lastDay === today() ? `Streak safe for today. Best ever: <b>${Math.max(S.best, st)}</b> days.` : st > 0 ? `Play one session today to make it <b>${st + 1}</b> days!` : `Play one session a day to build a streak.`;

  // mystery egg: a hint, never a number
  const allPets = S.pets.length >= PET_ORDER.length;
  $('#eggPanel').hidden = !S.pets.length;
  const stage = allPets ? 0 : Math.min(2, Math.floor((eggSessions() % EGG_EVERY) / 10));
  $('#eggImg').src = allPets ? petURL(S.pets[S.active]) : (URLS['egg' + stage] || (URLS['egg' + stage] = renderEgg(stage).toDataURL()));
  $('#eggImg').className = 'pxi egg wob' + (allPets ? 0 : stage);
  $('#eggNote').innerHTML = allPets ? 'You have found every pet! Keep playing with each one to discover their limited-edition looks.'
    : ['A mystery egg is resting in your nest. What could be inside?', 'The egg is wiggling&hellip; something is moving in there!', 'Crack! Crack! It looks like it will hatch soon!'][stage];
  renderChallenges();
  $('#bookCount').textContent = Object.keys(S.mistakes).length || '';
  $('#rate').value = String(S.rate); $('#sound').checked = !!S.sound;
}

// ================= PET PICKER =================
function petPicker(title, sub, kinds, onPick, locked) {
  let chosen = kinds[0];
  const html = `<h2 class="mtitle">${title}</h2><p class="msub">${sub}</p>
   <div class="petgrid">${kinds.map(k => `<button class="petpick ${k === chosen ? 'sel' : ''}" data-k="${k}" aria-pressed="${k === chosen}"><img class="pxi petimg" src="${petURL({ kind: k })}" alt=""><span>${PETS[k].name}</span></button>`).join('')}</div>
   <label class="namefield" for="petName">Give your pet a name</label>
   <input id="petName" maxlength="14" autocomplete="off" value="${esc(PETS[chosen].name)}">
   <button class="btn big go" id="petGo">Choose ${esc(PETS[chosen].name)}</button>`;
  openModal(html, locked);
  const nameEl = $('#petName'); let touched = false;
  nameEl.addEventListener('input', () => { touched = true; });
  document.querySelectorAll('.petpick').forEach(b => b.addEventListener('click', () => {
    chosen = b.dataset.k; SFX.tap();
    document.querySelectorAll('.petpick').forEach(x => { x.classList.toggle('sel', x === b); x.setAttribute('aria-pressed', x === b); });
    if (!touched) nameEl.value = PETS[chosen].name;
    $('#petGo').textContent = 'Choose ' + PETS[chosen].name;
  }));
  $('#petGo').addEventListener('click', () => {
    const name = nameEl.value.trim() || PETS[chosen].name;
    S.pets.push({ kind: chosen, name, skin: null, hat: null, eyes: null, neck: null, back: null, body: null, full: 80, fedDay: today(), shelter: 'box', decor: {}, items: {}, room: defaultRoom() });
    S.perPetHomes = 1;
    S.active = S.pets.length - 1; save(); SFX.fanfare(); hopUntil = performance.now() + 1500;
    closeModal(true); onPick && onPick();
  });
}
function maybeFirstPet() {
  if (!PROFILE || S.pets.length) return false;
  petPicker('Pick your first pet!', 'Your pet lives in your room and cheers you on. Keep spelling and you might discover new friends\u2026', PET_ORDER, () => route('home'), true);
  return true;
}
function rewardQueue() {
  const pending = [];
  for (let k = 1; k <= milestonesReached(); k++) if (!S.rewards.includes(k)) pending.push(k);
  return pending;
}
function claimRewards(then) {
  if (LTD_QUEUE.length) { const kind = LTD_QUEUE.shift(); return ltdModal(kind, () => claimRewards(then)); }
  const zp = zhPendingReward();
  if (zp) {
    zhState().rewarded.push(zp.id); save();
    const leftZ = PET_ORDER.filter(x => !S.pets.some(p => p.kind === x));
    if (!leftZ.length) { claimRewards(then); return; }
    SFX.fanfare();
    petPicker(`<span class="zh">${zp.title}\u901a\u5173\uff01</span>`, `<span class="zh">\u4f60\u5b66\u4f1a\u4e86\u8fd9\u4e00\u5173\u7684\u6240\u6709\u751f\u5b57\uff0c\u9009\u4e00\u53ea\u65b0\u5ba0\u7269\u5427\uff01</span>`, leftZ, () => claimRewards(then), true);
    return;
  }
  const pending = rewardQueue();
  if (!pending.length) { then && then(); return; }
  const k = pending[0]; S.rewards.push(k); save();
  const left = PET_ORDER.filter(x => !S.pets.some(p => p.kind === x));
  if (!left.length) { claimRewards(then); return; }
  SFX.fanfare();
  petPicker('Your egg hatched!', 'All your hard work warmed up the mystery egg. Choose who popped out!', left, () => claimRewards(then), true);
}

// ================= PLAY =================
let P = null, raf = 0;
const ROUND_INFO = {
  1: { name: 'Round 1 · Shoot it', how: 'Listen, then shoot the balloon with the word you hear.' },
  2: { name: 'Round 2 · Spell it', how: 'Listen, then type the word. No peeking!' },
  3: { name: 'Round 3 · Use it', how: 'Pick the form of the word that fits the sentence. Watch the tense!' }
};
function startSession() {
  if (!S.pets.length) { maybeFirstPet(); return; }
  if (!S.place) { placementIntro(); return; }
  const items = buildSession();
  if (!items.length) { toast('No words left for today. Your mistake words come back tomorrow!'); return; }
  P = { items, round: 1, idx: 0, order: { 1: shuffle(items), 2: shuffle(items), 3: shuffle(items) }, res: Object.fromEntries(items.map(i => [i.id, [null, null, null]])), busy: false, typed: '' };
  route('play');
  roundIntro();
}
function cur() { return P.order[P.round][P.idx]; }
function renderPlayTop() {
  $('#roundLabel').textContent = P.mode === 'place' ? `Level test \u00b7 part ${P.gi + 1} of 3` : P.round <= 3 ? (P.mode === 'zh' ? ZH_ROUND : ROUND_INFO)[P.round].name : 'Results';
  $('#roundLabel').classList.toggle('zh', P.mode === 'zh');
  setQuitLabel();
  const list = P.mode === 'place' ? P.list : P.round <= 3 ? P.order[P.round] : [];
  $('#pips').innerHTML = list.map((it, i) => { const r = P.res[it.id][(P.mode === 'place' ? it.type : P.round) - 1]; return `<i class="${r === true ? 'ok' : r === false ? 'no' : ''} ${i === P.idx ? 'now' : ''}"></i>`; }).join('');
  $('#quitBar').hidden = true;
}
function roundIntro() {
  stopArena(); renderPlayTop();
  const n = P.round;
  const reviews = P.items.filter(i => i.review).length;
  if (P.mode === 'zh') {
    $('#stage').innerHTML = `<div class="panel intro zh"><p class="eyebrow">\u7b2c ${n} \u8f6e / \u5171 3 \u8f6e</p><h2 class="rt zh">${ZH_ROUND[n].short}</h2><p class="zhhow">${ZH_ROUND[n].how}</p>
      ${n === 1 ? `<p class="muted">\u8fd9\u4e00\u8bfe\u6709 ${P.items.length} \u4e2a\u5b57${reviews ? `\uff0c\u5176\u4e2d ${reviews} \u4e2a\u662f\u590d\u4e60\u7684\u9519\u5b57\uff08\u6bcf\u4e2a $2\uff09` : ''}\u3002\u4e09\u8f6e\u90fd\u5bf9\u624d\u5f97\u91d1\u5e01\u3002</p>` : ''}
      <button class="btn big go" id="goRound"><span class="zh">\u5f00\u59cb\uff01</span></button></div>`;
    $('#goRound').addEventListener('click', () => { P.idx = 0; showQuestion(); }); $('#goRound').focus(); return;
  }
  $('#stage').innerHTML = `<div class="panel intro">
    <p class="eyebrow">${P.mode === 'lab' ? `Brainpower Lab \u00b7 Unit ${P.unit} \u00b7 ` : ''}Round ${n} of 3</p>
    <h2 class="rt">${['', 'Shoot it', 'Spell it', 'Use it'][n]}</h2>
    <p>${P.mode === 'lab' && n === 3 ? 'Read the sentence and pick the vocabulary word that fits best.' : ROUND_INFO[n].how}</p>
    ${n === 1 ? `<p class="muted">${P.items.length} words this session${reviews ? `, including ${reviews} from your Mistake Notebook (worth $2 each)` : ''}. A word earns coins when you get it right in all 3 rounds.</p>` : ''}
    <button class="btn big go" id="goRound">Go!</button></div>`;
  $('#goRound').addEventListener('click', () => { P.idx = 0; showQuestion(); });
  $('#goRound').focus();
}
function showQuestion() {
  if (P.mode === 'place') P.round = P.list[P.idx].type;
  P.busy = false; renderPlayTop();
  if (P.round === 1) qShoot(); else if (P.mode === 'zh') { if (P.round === 2) zhSpell(); else zhSentence(); } else if (P.round === 2) qSpell(); else qSentence();
}
function next() {
  if (P.mode === 'place') { P.idx++; return P.idx >= P.list.length ? placeGroupDone() : showQuestion(); }
  P.idx++;
  if (P.idx >= P.order[P.round].length) { P.round++; if (P.round > 3) return P.mode === 'zh' ? finishZh() : finishSession(); roundIntro(); }
  else showQuestion();
}
function mark(ok) {
  P.res[cur().id][P.round - 1] = ok;
  if (!ok) noteMistake(cur().id); ok ? SFX.good() : SFX.bad(); renderPlayTop(); if (P.mode === 'zh') zhReveal(); else revealMeaning();
}
// a missed word goes into the notebook right away, even if the session is never finished
function noteMistake(id) {
  const t = today();
  if (P.mode === 'lab') { const L = labState(); L.seen[id] = 1; L.miss[id] = t; delete L.ok[id]; }
  else if (P.mode === 'zh') { zhState().mistakes[id] = t; }
  else if (P.mode !== 'place') { S.mistakes[id] = t; S.seen[id] = 1; }
  else return;
  save();
}
const exHtml = (t, show) => esc(t).replace(/\{([^}]+)\}/g, (m, x) => show ? `<b class="exw">${x}</b>` : '<span class="mask">?</span>');
const exampleHtml = (w, show) => exHtml(w.ex, show);
// lab words: every meaning with its part of speech and its own example
const senseHtml = w => { const cnt = {}, seen = {}; w.senses.forEach(s => cnt[s.pos] = (cnt[s.pos] || 0) + 1);
  return w.senses.map((s, i) => { seen[s.pos] = (seen[s.pos] || 0) + 1; return `<div class="sense"><p class="def">${posTag(s.pos, cnt[s.pos] > 1 ? seen[s.pos] : 0)} ${esc(s.def)}</p>${s.ex ? `<p class="ex"><span class="exlab">Example</span><span class="exText" data-i="${i}">${exHtml(s.ex, false)}</span></p>` : ''}</div>`; }).join(''); };
const meaningCard = w => w.senses ? `<div class="panel meaning" id="meaning"><p class="eyebrow">What it means</p>${senseHtml(w)}<p class="muted small" id="exNote">The word in each example shows up after you answer.</p></div>`
  : w.mean ? `<div class="panel meaning" id="meaning"><p class="eyebrow">What it means</p><p class="def">${esc(w.mean)}</p><p class="ex"><span class="exlab">Example</span><span class="exText">${exampleHtml(w, false)}</span></p><p class="muted small" id="exNote">The word in the example shows up after you answer.</p></div>` : '';
function revealMeaning() {
  const w = P && cur() && BY_ID[cur().id]; if (!w) return;
  document.querySelectorAll('.exText').forEach(el => { el.innerHTML = w.senses ? exHtml(w.senses[+el.dataset.i].ex, true) : exampleHtml(w, true); });
  const n = $('#exNote'); if (n) n.hidden = true;
}
const hearText = w => w.cue ? `${w.w}. ${w.cue.replace('_', w.w)}` : w.w;
const cueLine = w => w.cue ? `<p class="cue">Sounds like another word? Listen to the hint: <b>${esc(w.cue.replace('_', '___'))}</b></p>` : '';
const hearBtns = (w, extra = '') => `<div class="ask"><button class="btn speak" id="hear">${icon('speaker', 'spk')} Hear it</button><button class="btn speak slow" id="hearSlow">Slow</button>${extra}</div>`;
function wireHear(word) {
  const w = typeof word === 'string' ? { w: word, cue: '' } : word;
  $('#hear').addEventListener('click', () => say(hearText(w)));
  $('#hearSlow').addEventListener('click', () => say(hearText(w), true));
}

// ---- leaving a game screen ----
const isZhMode = () => { const m = P ? P.mode : PLAY_FROM; return m === 'zh' || m === 'zhplace'; };
function setQuitLabel() { const zh = isZhMode(); $('#quit').innerHTML = zh ? '\u2715 <span class="zh">\u9000\u51fa</span>' : '\u2715 Exit'; $('#quit').setAttribute('aria-label', zh ? '\u9000\u51fa' : 'Exit'); }
function askExit() {
  if (!P) return exitPlay();
  const answered = P.res && Object.values(P.res).some(r => r.some(v => v !== null));
  const finished = P.mode !== 'place' && P.mode !== 'zhplace' && P.round > 3;
  if (!answered || finished) return exitPlay();
  const bar = $('#quitBar'), zh = isZhMode(), test = P.mode === 'place' || P.mode === 'zhplace';
  bar.querySelector('span').innerHTML = zh ? `<span class="zh">${test ? '\u73b0\u5728\u9000\u51fa\u6d4b\u8bd5\u5417\uff1f\u4ee5\u540e\u53ef\u4ee5\u91cd\u65b0\u6d4b\u3002' : '\u73b0\u5728\u9000\u51fa\u5417\uff1f\u8fd9\u4e00\u8bfe\u7684\u91d1\u5e01\u4e0d\u4f1a\u4fdd\u5b58\u3002'}</span>` : test ? 'Leave the level test? You can take it again any time.' : "Leave this session? Coins from it won't be saved.";
  $('#keepPlaying').innerHTML = zh ? '<span class="zh">\u7ee7\u7eed</span>' : 'Keep playing';
  $('#quitYes').innerHTML = zh ? '<span class="zh">\u9000\u51fa</span>' : 'Exit';
  bar.hidden = !bar.hidden;
}
function exitPlay() {
  const m = P ? P.mode : PLAY_FROM; stopArena(); P = null; $('#quitBar').hidden = true;
  if (m === 'lab') { chalId = 'en'; route('chal'); } else if (m === 'zh' || m === 'zhplace') { chalId = 'zh'; route('chal'); } else route('home');
}

// ---- Round 1: shooting gallery ----
let targets = [], lastT = 0;
function qShoot() {
  const it = cur(), zh = P.mode === 'zh', w = zh ? ZH_BY[it.id] : BY_ID[it.id];
  const choices = shuffle([w.w, ...w.d]);
  $('#stage').innerHTML = `${zh ? zhHearBtns() + `<p class="zhhint zh">\u542c\u5230\u7684\u662f\u54ea\u4e2a\u5b57\uff1f <span class="zhword">${[...w.words[0]].map(ch => ch === w.id ? '<i class="zhblank"></i>' : esc(ch)).join('')}</span></p>` : hearBtns(w.w) + cueLine(w)}
   <div class="arena" id="arena"><div class="sun"></div><img class="pxi cloudA" src="${spriteURL('i-cloud', ICONS.cloud)}" alt=""><div class="ground"></div>
     <img class="pxi cannon" id="cannon" src="${spriteURL('i-cannon', ICONS.cannon)}" alt=""><div class="bullet" id="bullet" hidden></div></div>
   ${zh ? zhAnsBox(w, '点气球，或者按 1–4。按空格键再听一遍。') : '<div class="fb" id="fb" aria-live="polite"><span class="muted">Tap a balloon, or press 1–4. Press space to hear it again.</span></div>' + meaningCard(w)}`;
  if (zh) zhWireHear(w); else wireHear(w);
  $('#arena').classList.toggle('zharena', zh);
  const arena = $('#arena'); const W = arena.clientWidth;
  const lanes = shuffle([10, 78, 146, 214]);
  targets = choices.map((txt, i) => {
    const el = document.createElement('button'); el.className = 'target'; el.type = 'button';
    const pal = Object.assign({}, BASEPAL, { b: BALLOON_COLORS[i] });
    el.innerHTML = `<img class="pxi balloon" src="${spriteURL('bal' + i, BALLOON, pal)}" alt=""><span class="plaque${P.mode === 'zh' ? ' zh zhplaque' : ''}"><b>${i + 1}</b>${esc(txt)}</span>`;
    el.setAttribute('aria-label', `Shoot ${txt}`);
    arena.appendChild(el);
    const tw = el.offsetWidth;
    const t = { el, txt, i, tw, y: lanes[i], x: Math.random() * Math.max(1, W - tw), vx: reduceMotion ? 0 : (Math.random() < .5 ? -1 : 1) * (22 + Math.random() * 26), ph: Math.random() * 6, frozen: false };
    el.addEventListener('click', () => shoot(t));
    return t;
  });
  lastT = performance.now(); stopArena(); raf = requestAnimationFrame(tick); tick(lastT);
  setTimeout(() => zh ? zhSay(w.id, 'call') : say(hearText(w)), 250);
}
function tick(now) {
  const arena = $('#arena'); if (!arena) return;
  const dt = Math.min(.05, (now - lastT) / 1000); lastT = now;
  const W = arena.clientWidth;
  targets.forEach(t => {
    if (!t.frozen) { t.x += t.vx * dt; if (t.x < 0) { t.x = 0; t.vx = Math.abs(t.vx); } if (t.x > W - t.tw) { t.x = Math.max(0, W - t.tw); t.vx = -Math.abs(t.vx); } }
    const bob = reduceMotion ? 0 : Math.round(Math.sin(now / 420 + t.ph) * 4);
    t.el.style.transform = `translate(${Math.round(t.x)}px,${t.y + bob}px)`;
  });
  raf = requestAnimationFrame(tick);
}
function stopArena() { cancelAnimationFrame(raf); raf = 0; }
function shoot(t) {
  if (P.busy) return; P.busy = true; SFX.shoot();
  targets.forEach(x => x.frozen = true);
  const arena = $('#arena'), b = $('#bullet'), can = $('#cannon');
  const ar = arena.getBoundingClientRect(), tr = t.el.querySelector('.balloon').getBoundingClientRect(), cr = can.getBoundingClientRect();
  const sx = cr.left + cr.width / 2 - ar.left - 4, sy = cr.top - ar.top, ex = tr.left + tr.width / 2 - ar.left - 4, ey = tr.top + tr.height / 2 - ar.top;
  b.hidden = false; const t0 = performance.now(), dur = reduceMotion ? 1 : 220;
  (function fly(now) {
    const k = Math.min(1, (now - t0) / dur);
    b.style.transform = `translate(${sx + (ex - sx) * k}px,${sy + (ey - sy) * k}px)`;
    if (k < 1) requestAnimationFrame(fly); else { b.hidden = true; resolveShot(t); }
  })(t0);
}
function resolveShot(t) {
  const zh = P.mode === 'zh', w = zh ? ZH_BY[cur().id] : BY_ID[cur().id], ok = t.txt === w.w;
  mark(ok);
  t.el.querySelector('.balloon').src = spriteURL('i-burst', ICONS.burst);
  t.el.classList.add(ok ? 'hit' : 'miss');
  targets.forEach(x => { if (x !== t) x.el.classList.add(x.txt === w.w ? 'right' : 'dim'); x.el.disabled = true; });
  if (zh) {
    zhDone(ok, ok ? `\u6253\u4e2d\u4e86\uff01<b>${esc(w.w)}</b>` : `\u8fd9\u662f\u300c${esc(t.txt)}\u300d\uff0c\u8981\u627e\u7684\u662f\u300c${esc(w.w)}\u300d\u3002`);
    return;
  }
  if (ok) { $('#fb').innerHTML = `<span class="good">${icon('check')} Got it! <b>${esc(w.w)}</b></span>`; setTimeout(next, 900); }
  else { $('#fb').innerHTML = `<span class="badtxt">${icon('cross')} That was <b>${esc(t.txt)}</b>. The word was <b>${esc(w.w)}</b>.</span> <button class="btn go" id="nextBtn">Next</button>`; $('#nextBtn').addEventListener('click', next); $('#nextBtn').focus(); }
}

// ---- Round 2: spelling ----
const KB = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
function qSpell() {
  stopArena();
  const w = BY_ID[cur().id]; P.typed = '';
  $('#stage').innerHTML = `${hearBtns(w.w)}${cueLine(w)}
   <div class="panel spell"><p class="muted center">Type what you hear</p><div class="typed" id="typed" aria-live="polite"></div></div>
   <div class="kb" id="kb">${KB.map((row, i) => `<div class="kbrow">${i === 2 ? '<button class="key wide" data-k="back">Back</button>' : ''}${[...row].map(ch => `<button class="key" data-k="${ch}">${ch}</button>`).join('')}${i === 2 ? '<button class="key" data-k="\'" aria-label="apostrophe">\'</button><button class="key wide go" data-k="enter">Check</button>' : ''}</div>`).join('')}</div>
   <div class="fb" id="fb" aria-live="polite"></div>${meaningCard(w)}`;
  wireHear(w);
  $('#kb').addEventListener('click', e => { const k = e.target.closest('.key'); if (!k) return; typeKey(k.dataset.k); });
  renderTyped(); setTimeout(() => say(hearText(w)), 250);
}
function renderTyped(state, correct) {
  const el = $('#typed'); if (!el) return;
  const tiles = [...P.typed].map((ch, i) => `<span class="tile ${state === 'ok' ? 'ok' : state === 'no' ? (correct && correct[i] && correct[i].toLowerCase() === ch ? '' : 'no') : ''}">${esc(ch)}</span>`).join('');
  el.innerHTML = tiles + (state ? '' : '<span class="tile caret"></span>');
}
function typeKey(k) {
  if (!P || P.round !== 2 || P.busy) return;
  if (k === 'back') P.typed = P.typed.slice(0, -1);
  else if (k === 'enter') return checkSpell();
  else if (/^[a-z']$/.test(k) && P.typed.length < 18) { P.typed += k; SFX.tap(); }
  renderTyped();
}
function checkSpell() {
  if (!P.typed) { toast('Type the word first.'); return; }
  P.busy = true;
  const w = BY_ID[cur().id]; const ok = w.alt.includes(P.typed.toLowerCase().replace(/\u2019/g, "'"));
  mark(ok); renderTyped(ok ? 'ok' : 'no', w.w);
  if (ok) { $('#fb').innerHTML = `<span class="good">${icon('check')} Perfect spelling!</span>`; setTimeout(next, 950); }
  else {
    $('#fb').innerHTML = `<div class="answer"><span class="badtxt">${icon('cross')} Not quite. The right spelling is</span><div class="typed">${[...w.w].map(c => `<span class="tile ok">${esc(c)}</span>`).join('')}</div></div><button class="btn go" id="nextBtn">Next</button>`;
    $('#nextBtn').addEventListener('click', next); $('#nextBtn').focus(); say(hearText(w));
  }
}

// ---- Round 3: sentence ----
function qSentence() {
  stopArena();
  const w = BY_ID[cur().id]; const opts = shuffle(w.o); const [a, b] = w.s.split('_');
  $('#stage').innerHTML = `<div class="ask"><button class="btn speak" id="hearS">${icon('speaker', 'spk')} Read it to me</button></div>
   <div class="panel sentence"><p class="sent">${esc(a)}<span class="blank" id="blank">?</span>${esc(b)}</p></div>
   <div class="opts">${opts.map((o, i) => `<button class="btn opt" data-o="${esc(o)}"><b>${i + 1}</b>${esc(o)}</button>`).join('')}</div>
   <div class="fb" id="fb" aria-live="polite"><span class="muted">Which one fits? Look at the words around the blank.</span></div>${meaningCard(w)}`;
  $('#hearS').addEventListener('click', () => say(w.s.replace('_', 'blank')));
  document.querySelectorAll('.opt').forEach(btn => btn.addEventListener('click', () => pickOpt(btn)));
}
function pickOpt(btn) {
  if (P.busy) return; P.busy = true;
  const w = BY_ID[cur().id], choice = btn.dataset.o, ok = choice === w.o[0];
  mark(ok);
  $('#blank').textContent = w.o[0]; $('#blank').classList.add('filled');
  document.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (x.dataset.o === w.o[0]) x.classList.add('right'); else if (x === btn) x.classList.add('wrong'); });
  if (ok) { $('#fb').innerHTML = `<span class="good">${icon('check')} Yes! <b>${esc(w.o[0])}</b> fits.</span>`; setTimeout(next, 1100); }
  else { $('#fb').innerHTML = `<span class="badtxt">${icon('cross')} <b>${esc(choice)}</b> doesn't fit here. It's <b>${esc(w.o[0])}</b>.</span> <button class="btn go" id="nextBtn">Next</button>`; $('#nextBtn').addEventListener('click', next); $('#nextBtn').focus(); }
}

// ---- level test: 7 words from each of levels 1-3 (5 common + 2 less common), spelling and sentence questions mixed ----
const PLACE_TYPES_COMMON = [2, 3, 2, 3, 2], PLACE_TYPES_RARE = [2, 3];
function pickFrom(arr) { return arr.length ? arr[Math.floor(Math.random() * arr.length)] : null; }
function placementSet(L) {
  const ids = L.ids.filter(x => { const w = BY_ID[x.id]; return w && w.w.length >= 3 && w.o && w.o.length === 4 && /^[a-z]+$/i.test(w.w); });
  const n = ids.length, zs = ids.map(x => x.z).sort((a, b) => a - b), med = zs[Math.floor(n * 0.5)], low = zs[Math.floor(n * 0.3)];
  const seg = k => ids.slice(Math.floor(k * n / 5), Math.floor((k + 1) * n / 5));
  const used = new Set(), take = x => { if (x) used.add(x.id); return x; };
  const common = [0, 1, 2, 3, 4].map(k => take(pickFrom(seg(k).filter(x => x.z >= med && !used.has(x.id))) || pickFrom(seg(k).filter(x => !used.has(x.id)))));
  const rare = [2, 4].map(k => take(pickFrom(seg(k).filter(x => x.z <= low && !used.has(x.id))) || pickFrom(seg(k).filter(x => x.z < med && !used.has(x.id)))));
  const items = [...common.map((x, i) => ({ id: x.id, type: PLACE_TYPES_COMMON[i], rare: false })), ...rare.map((x, i) => ({ id: x.id, type: PLACE_TYPES_RARE[i], rare: true }))];
  return shuffle(items);
}
function placementIntro() {
  openModal(`<h2 class="mtitle">Let's find your level!</h2>
    <p class="msub">Before we start, a quick check with up to 21 words. Some ask you to spell a word you hear, some ask you to pick the right word for a sentence. There are no coins in this test, so just try your best.</p>
    <ul class="placelist">${LEVELS.map(L => `<li><b>${L.name}</b> <span class="muted">${L.sub} \u00b7 ${L.ids.length} words</span></li>`).join('')}</ul>
    <button class="btn big go" id="placeGo">Start the test</button>
    <p class="center small"><button class="linkbtn" id="placeSkip">Skip and start from Level 1</button></p>
    <p class="center small"><button class="linkbtn" id="placeLater">✕ Not now, go back</button></p>`, true);
  $('#placeLater').addEventListener('click', () => { closeModal(true); if (P && P.mode === 'place') { P = null; } route('home'); });
  $('#placeGo').addEventListener('click', () => { closeModal(true); startPlacement(); });
  $('#placeSkip').addEventListener('click', () => { S.place = { pos: 0, gi: 0, start: 0, at: today(), skipped: true }; save(); closeModal(true); renderHome(); startSession(); });
}
function startPlacement() {
  const sets = LEVELS.slice(0, 3).map(placementSet);
  P = { mode: 'place', sets, gi: 0, idx: 0, list: sets[0], res: {}, round: 2, busy: false, typed: '', wrongs: [] };
  sets.flat().forEach(it => { P.res[it.id] = [null, null, null]; });
  route('play'); placePartIntro();
}
function placePartIntro() {
  stopArena(); P.list = P.sets[P.gi]; P.order = { 2: P.list, 3: P.list }; P.idx = 0; P.round = P.list[0].type; renderPlayTop();
  const L = LEVELS[P.gi];
  $('#stage').innerHTML = `<div class="panel intro"><p class="eyebrow">Level test \u00b7 part ${P.gi + 1} of 3</p><h2 class="rt">${L.name} words</h2>
    <p>${L.sub}. 7 words: spell some, and pick the right word in a sentence for others.</p>
    <button class="btn big go" id="goRound">Go!</button></div>`;
  $('#goRound').addEventListener('click', showQuestion); $('#goRound').focus();
}
function placeGroupDone() {
  stopArena();
  const L = LEVELS[P.gi], n = L.ids.length;
  const wrong = P.list.filter(it => P.res[it.id][it.type - 1] !== true), rareWrong = wrong.some(it => it.rare);
  P.wrongs.push(wrong.length);
  let start = null;
  if (wrong.length <= 1) { if (P.gi < 2) { P.gi++; return placePartIntro(); } return placeFinish(3, 0); }
  if (wrong.length === 2 && rareWrong) start = Math.floor(n * 2 / 3);
  else if (wrong.length <= 4) start = Math.floor(n / 2);
  else start = 0;
  placeFinish(P.gi, start);
}
function placeFinish(gi, start) {
  const L = LEVELS[gi];
  S.place = { gi, start, pos: L.off + start, at: today(), wrongs: P.wrongs };
  save(); P = null;
  const where = start === 0 ? 'from the beginning' : start >= L.ids.length * 0.6 ? 'from the harder words' : 'from the middle';
  route('home');
  openModal(`<h2 class="mtitle">Your level: ${L.name}</h2>
    <p class="msub">${L.sub}. You will start ${where} of this level, and the words get a little harder as you go.</p>
    <button class="btn big go" id="placeOk">Start playing</button>
    <p class="center small"><button class="linkbtn" id="placeLater2">Not now, back home</button></p>`, true);
  $('#placeLater2').addEventListener('click', () => { closeModal(true); renderHome(); });
  $('#placeOk').addEventListener('click', () => { closeModal(true); renderHome(); startSession(); });
}

// ---- results ----
function finishSession() {
  stopArena();
  const t = today(); let earned = 0, right = 0; const pet0 = S.pets[S.active];
  const LB = P.mode === 'lab' ? labState() : null, labU = LB ? P.unit : 0;
  const rows = P.items.map(it => {
    const r = P.res[it.id], all = r.every(v => v === true), w = BY_ID[it.id];
    const pay = all ? (it.review ? 2 : 1) : 0; earned += pay; if (all) right++;
    if (LB) { LB.seen[it.id] = 1; if (all) { LB.ok[it.id] = 1; delete LB.miss[it.id]; } else LB.miss[it.id] = t; }
    else { S.seen[it.id] = 1; if (all) delete S.mistakes[it.id]; else S.mistakes[it.id] = t; }
    return { w, r, pay, review: it.review };
  });
  const prevDay = S.lastDay, firstToday = prevDay !== t;
  if (firstToday) { S.streak = prevDay && daysBetween(prevDay, t) === 1 ? S.streak + 1 : 1; S.lastDay = t; S.days = [...S.days.filter(d => d !== t), t].slice(-60); }
  S.best = Math.max(S.best || 0, S.streak);
  S.coins += earned; S.earned += earned; S.sessions++;
  if (pet0) { S.partner[pet0.kind] = (S.partner[pet0.kind] || 0) + 1; if (S.partner[pet0.kind] >= LTD_AFTER && !S.owned['ltd-' + pet0.kind]) { S.owned['ltd-' + pet0.kind] = 1; LTD_QUEUE.push(pet0.kind); } }
  save(); renderHud(); SFX.coin(); if (firstToday) setTimeout(SFX.fanfare, 250);
  const pet = S.pets[S.active];
  $('#roundLabel').textContent = 'Results'; $('#pips').innerHTML = ''; $('#quitBar').hidden = true;
  $('#stage').innerHTML = `<div class="panel results">
    <div class="res-head"><img class="pxi petimg big" src="${petURL(pet)}" alt=""><div>
      <p class="eyebrow">${LB ? `Brainpower Lab \u00b7 Unit ${labU}` : 'Session done'}</p><h2 class="rt">${right} of ${P.items.length} words mastered</h2>
      <p class="earn">You earned ${coinAmt(earned)}</p>
      ${firstToday ? `<p class="streakwin">${icon('flame', 'flame')} ${S.streak}-day streak!</p>` : ''}</div></div>
    <ul class="reslist">${rows.map(x => `<li><span class="rw">${esc(x.w.w)}${x.review ? '<em>review</em>' : ''}</span><span class="marks">${x.r.map((v, i) => `<span title="Round ${i + 1}">${icon(v ? 'check' : 'cross')}</span>`).join('')}</span><span class="pay ${x.pay ? '' : 'zero'}">${x.pay ? '+$' + x.pay : '$0'}</span></li>`).join('')}</ul>
    ${rows.some(x => !x.pay) ? `<p class="muted">${LB ? 'Missed words come back first next time you play this unit, worth $2 each.' : 'Missed words go into your Mistake Notebook and come back tomorrow, worth $2 each.'}</p>` : ''}
    <div class="row"><button class="btn go big" id="again">${LB ? 'Play again' : 'Play 10 more'}</button><button class="btn" id="toHome">${LB ? 'Back to the Lab' : 'Home'}</button></div></div>`;
  P = null;
  const backTo = () => { if (LB) { chalId = 'en'; route('chal'); } else route('home'); };
  $('#again').addEventListener('click', () => claimRewards(LB ? () => startLab(labU) : startSession));
  $('#toHome').addEventListener('click', () => claimRewards(backTo));
  setTimeout(() => { if (rewardQueue().length || LTD_QUEUE.length) claimRewards(backTo); }, 900);
}

let LTD_QUEUE = [];
function ltdModal(kind, then) {
  const pet = S.pets.find(p => p.kind === kind) || { kind };
  openModal(`<h2 class="mtitle">Limited edition unlocked!</h2><p class="msub">You and ${esc(pet.name || PETS[kind].name)} have been practising together so much that a rare look appeared.</p>
    <div class="ltdshow"><img class="pxi petimg big" src="${petURL(pet)}" alt=""><span class="arrow">\u2192</span><img class="pxi petimg big" src="${petURL(pet, { skin: 'ltd' })}" alt=""></div>
    <p class="center"><b>${esc(LTD[kind].name)} ${esc(PETS[kind].name)}</b></p>
    <div class="row"><button class="btn big go" id="ltdWear">Wear it now</button><button class="btn" id="ltdLater">Later</button></div>`, true);
  SFX.fanfare();
  $('#ltdWear').addEventListener('click', () => { if (pet.name) { pet.skin = 'ltd'; save(); } closeModal(true); then && then(); });
  $('#ltdLater').addEventListener('click', () => { closeModal(true); then && then(); });
}
// ================= CHALLENGES (words to be added) =================
const CHALLENGES = [
  { id: 'zh', title: '\u4e2d\u6587\u6311\u6218', sub: 'Chinese Challenge', words: ZH_PARTS.flatMap(p => p.chars) },
  { id: 'en', title: 'English Challenge', sub: 'Harder words', words: [] }
];
function renderChallenges() {
  $('#challenges').innerHTML = CHALLENGES.map(c => `<div class="chal ${c.id}"><div><b class="${c.id === 'zh' ? 'zh' : ''}">${esc(c.title)}</b><span class="muted small">${esc(c.sub)}</span></div>
    <p class="muted small ${c.id === 'zh' ? 'zh' : ''}">${c.id === 'zh' ? '\u4e00\u4e8c\u5e74\u7ea7 1600 \u5b57 \u00b7 \u56db\u5173' : c.words.length ? c.words.length + ' words' : isEddie() ? 'Something secret is waiting inside\u2026' : 'Coming soon. New words are on the way!'}</p>
    <button class="btn small go" data-chal="${c.id}">${c.id === 'zh' ? '<span class="zh">\u8fdb\u5165</span>' : 'Open'}</button></div>`).join('');
}

// (shop lives in home2.js)
// ================= ROOM =================
let roomTab = 'outfit', roomIdx = 0;
function openRoom(i) { roomIdx = i; hopUntil = performance.now() + 900; route('room'); }
function chip(label, sel, data, img = '') { return `<button class="chip-opt ${sel ? 'sel' : ''}" ${data} aria-pressed="${sel}">${img}<span>${esc(label)}</span></button>`; }
function renderRoom() {
  if (roomIdx >= S.pets.length) roomIdx = S.active;
  const pet = S.pets[roomIdx];
  $('#roomTitle').textContent = pet ? `${pet.name}'s house` : 'House';
  $('#roomPets').innerHTML = !pet ? '' : roomIdx === S.active ? `<p class="muted small">${esc(pet.name)} is your study buddy. Buddies cheer you on during sessions.</p>`
    : `<button class="btn small" data-buddy="${roomIdx}">Make ${esc(pet.name)} my study buddy</button>`;
  $('#roomTabs').innerHTML = [['outfit', 'Outfit'], ['food', 'Feed'], ['home', 'Home']].map(([k, n]) => `<button class="tab ${k === roomTab ? 'sel' : ''}" data-t="${k}" aria-pressed="${k === roomTab}">${n}</button>`).join('');
  const full = petFull(pet);
  $('#roomFull').style.width = full + '%'; $('#roomFull').className = full < 35 ? 'low' : ''; $('#roomFullNum').textContent = full + '%';
  $('#roomName').textContent = pet ? `${pet.name} the ${PETS[pet.kind].name}` : '';
  let h = '';
  const emptyShop = what => `<p class="muted">No ${what} yet. <button class="linkbtn" data-go="shop">Visit the shop</button></p>`;
  if (!pet) { $('#roomPanel').innerHTML = ''; return; }
  if (roomTab === 'outfit' && pet) {
    const skins = Object.keys(SKINS).filter(k => S.owned['skin-' + k]);
    const ltdChip = S.owned['ltd-' + pet.kind] ? chip(LTD[pet.kind].name + ' (limited)', pet.skin === 'ltd', 'data-set="skin" data-v="ltd"', '<i class="sw ltdsw"></i>') : '';
    h += `<h3>Skin</h3><div class="chips">${chip('Normal', !pet.skin, 'data-set="skin" data-v=""')}${ltdChip}${skins.map(k => chip(SKINS[k].name, pet.skin === k, `data-set="skin" data-v="${k}"`, `<i class="sw" style="background:${SKINS[k].pal.b}"></i>`)).join('')}</div>`;
    for (const [slot, label] of [['hat', 'Hat'], ['eyes', 'Glasses'], ['neck', 'Neck'], ['back', 'Back'], ['body', 'Outfit']]) {
      const own = SHOP.filter(i => i.slot === slot && S.owned[i.id]);
      h += `<h3>${label}</h3>${own.length ? `<div class="chips">${chip('None', !pet[slot], `data-set="${slot}" data-v=""`)}${own.map(i => chip(i.name, pet[slot] === i.key, `data-set="${slot}" data-v="${i.key}"`)).join('')}</div>` : emptyShop(label.toLowerCase())}`;
    }
  } else if (roomTab === 'home') {
    h += `<div class="roomhouse"><img src="${imgSrc('house-' + pet.kind)}" alt="" class="${pet.home ? '' : 'shadow'}"><div><h3>${esc(HOUSES[pet.kind])}</h3>
      <p class="muted small">${pet.home ? `Built! ${esc(pet.name)} lives here in Pet Town.` : `${esc(pet.name)} lives in a cardboard box for now. Build this house in the shop for $${HOUSE_PRICE}.`}</p>
      ${pet.home ? '' : '<button class="btn small go" data-house="1">Go to the shop</button>'}</div></div>
      <h3>Inside</h3><p class="muted small">Change the wallpaper and floor, add furniture and drag things where you like.</p><button class="btn go" data-deco="1">Decorate ${esc(pet.name)}'s home</button>`;
  } else if (roomTab === 'food') {
    const foods = Object.keys(FOODS).filter(k => S.food[k] > 0);
    h += `<h3>Feed ${esc(pet ? pet.name : '')}</h3>${foods.length ? `<div class="chips">${foods.map(k => `<button class="chip-opt" data-feed="${k}"><img class="pxi fd" src="${foodURL(k)}" alt=""><span>${FOODS[k].name} ×${S.food[k]}</span></button>`).join('')}</div><p class="muted small">Pets get 20% hungrier each day.</p>` : emptyShop('food')}`;
  }
  $('#roomPanel').innerHTML = h;
}
function roomClick(e) {
  const b = e.target.closest('button'); if (!b) return;
  const pet = S.pets[roomIdx];
  if (b.dataset.go) { if (b.dataset.go === 'shop') { shopPet = roomIdx; shopTab = roomTab === 'food' ? 'food' : roomTab === 'outfit' ? 'clothes' : 'decor'; } return route(b.dataset.go); }
  if (b.dataset.t) { roomTab = b.dataset.t; return renderRoom(); }
  if (b.dataset.deco) return openDeco(roomIdx);
  if (b.dataset.house) { shopTab = 'homes'; return route('shop'); }
  if (b.dataset.buddy !== undefined) { S.active = +b.dataset.buddy; hopUntil = performance.now() + 900; save(); SFX.good(); toast(`${pet.name} is your study buddy now!`); return renderRoom(); }
  if (b.dataset.set && pet) { pet[b.dataset.set] = b.dataset.v || null; save(); SFX.tap(); return renderRoom(); }
  if (b.dataset.shel && pet) { pet.shelter = b.dataset.shel; save(); SFX.tap(); return renderRoom(); }
  if (b.dataset.dec && pet) { pet.decor[b.dataset.dec] = !pet.decor[b.dataset.dec]; save(); SFX.tap(); return renderRoom(); }
  if (b.dataset.feed && pet) {
    const k = b.dataset.feed; if (!S.food[k]) return;
    const before = petFull(pet);
    if (before >= 100) { toast(`${pet.name} is full!`); return; }
    S.food[k]--; pet.full = Math.min(100, before + FOODS[k].fill); pet.fedDay = today();
    hopUntil = performance.now() + 1400; save(); SFX.good(); toast(`${pet.name} loved the ${FOODS[k].name.toLowerCase()}!`); renderRoom();
  }
}

// ================= TOWN =================
function renderTown() {
  const pct = (v, tot) => (v / tot * 100).toFixed(2) + '%';
  const lots = S.pets.map((pet, i) => {
    const L = lotOf(pet); if (!L) return '';
    const st = `left:${pct(L.x0, TOWN_W)};top:${pct(L.ly - 185, TOWN_H)};width:${pct(L.x1 - L.x0, TOWN_W)};height:${pct(205, TOWN_H)}`;
    return `<button class="plot" data-house="${i}" style="${st}" aria-label="Go into ${esc(pet.name)}'s house"><span class="plotname">${esc(pet.name)}</span></button>`;
  }).join('');
  const shops = TOWN_SHOPS.map(b => `<button class="plot shopspot" data-townshop="${b.id}" style="left:${pct(b.x0, TOWN_W)};top:${pct(b.y0, TOWN_H)};width:${pct(b.x1 - b.x0, TOWN_W)};height:${pct(b.y1 - b.y0, TOWN_H)}" aria-label="${b.label}"><span class="plotname">${b.label}</span></button>`).join('');
  $('#townPlots').innerHTML = lots + shops;
  $('#townNote').innerHTML = (S.pets.length > 1 ? 'Tap a house to go inside, or a shop to go shopping. Watch your pets visit each other!' : 'Tap your house to go inside, or a shop to go shopping. The locked lots are waiting for new friends\u2026') + '<span class="swipehint"> Swipe the map sideways to see all of Pet Town.</span>';
  const sc = $('.townscroll'), me = S.pets[S.active] && lotOf(S.pets[S.active]);
  if (sc && me) requestAnimationFrame(() => { sc.scrollLeft = Math.max(0, me.lx / TOWN_W * sc.scrollWidth - sc.clientWidth / 2); });
}
// ================= CHALLENGES =================
let chalId = 'zh';
function renderChal() {
  const ch = CHALLENGES.find(c => c.id === chalId) || CHALLENGES[0];
  const pet = S.pets[S.active];
  $('#chalTitle').textContent = ch.title; $('#chalTitle').className = ch.id === 'zh' ? 'zh' : '';
  if (ch.id === 'zh') { $('#chalBody').innerHTML = renderZhHub(); return; }
  const secret = ch.id === 'en' && isEddie() ? labHub() : '';
  if (ch.id === 'en' && secret) { $('#chalBody').innerHTML = secret + `<p class="center"><button class="btn" data-back-home>Back home</button></p>`; return; }
  if (ch.id === 'en') { $('#chalBody').innerHTML = `<div class="panel chalempty">${pet ? `<img class="pxi petimg big" src="${petURL(pet)}" alt="">` : ''}<p class="zhbig">No words here yet!</p><p>Harder words are coming soon. Check back later for the English Challenge.</p><button class="btn" data-back-home>Back home</button></div>`; return; }
  $('#chalBody').innerHTML = ch.words.length ? '' : `<div class="panel chalempty ${ch.id === 'zh' ? 'zhbox' : ''}">
    ${pet ? `<img class="pxi petimg big" src="${petURL(pet)}" alt="">` : ''}
    ${ch.id === 'zh' ? `<p class="zh zhbig">\u8fd9\u91cc\u8fd8\u6ca1\u6709\u8bcd\u8bed\u54e6\uff01</p><p class="zh">\u7b49\u65b0\u7684\u8bcd\u8bed\u52a0\u8fdb\u6765\uff0c\u5c31\u53ef\u4ee5\u5f00\u59cb\u4e2d\u6587\u6311\u6218\u5566\u3002</p>`
      : `<p class="zhbig">No words here yet!</p><p>Harder words are coming soon. Check back later for the English Challenge.</p>`}
    <button class="btn" data-back-home>${ch.id === 'zh' ? '<span class="zh">\u8fd4\u56de</span>' : 'Back home'}</button></div>`;
}

// ================= NOTEBOOK =================
function renderBook() {
  const due = dueMistakes(), later = laterMistakes();
  const row = (id, ready) => { const w = BY_ID[id]; return `<li><button class="btn speak tiny" data-say="${esc(hearText(w))}" aria-label="Hear ${esc(w.w)}">${icon('speaker', 'spk')}</button><span class="rw">${esc(w.w)}<small class="bdef">${esc(w.mean)}</small></span><span class="gtag">${w.g === 6 ? 'Grade 5\u20136' : 'Grade ' + w.g}</span><span class="${ready ? 'pay' : 'muted small'}">${ready ? '$2' : 'tomorrow'}</span></li>`; };
  const LBk = isEddie() ? labState() : null, labMiss = LBk ? Object.keys(LBk.miss).filter(id => BY_ID[id]) : [];
  const labBox = labMiss.length ? `<div class="panel"><h2>Brainpower Lab <small>${labMiss.length}</small></h2><p class="muted">These come first the next time you play their unit in the Lab.</p><ul class="booklist">${labMiss.map(id => { const w = BY_ID[id]; return `<li><button class="btn speak tiny" data-say="${esc(w.w)}" aria-label="Hear ${esc(w.w)}">${icon('speaker', 'spk')}</button><span class="rw">${esc(w.w)}<small class="bdef">${esc(w.mean)}</small></span><span class="gtag">Unit ${w.unit}</span><span class="pay">$2</span></li>`; }).join('')}</ul></div>` : '';
  const zhMiss = Object.keys(zhState().mistakes).filter(c => ZH_BY[c]);
  const zhBox = zhMiss.length ? `<div class="panel"><h2 class="zh">\u4e2d\u6587\u9519\u5b57 <small>${zhMiss.length}</small></h2><p class="muted zh">\u8fd9\u4e9b\u5b57\u4f1a\u6df7\u5728\u4e2d\u6587\u6311\u6218\u7684\u4e0b\u4e00\u8bfe\u91cc\u590d\u4e60\u3002</p><p class="zh zhbookchars">${zhMiss.map(c => `<span>${esc(c)}</span>`).join('')}</p></div>` : '';
  $('#bookBody').innerHTML = (!due.length && !later.length) ? (labBox || zhBox ? labBox + zhBox : `<div class="panel"><p>No mistakes saved right now. Nice work!</p></div>`) : `
    ${due.length ? `<div class="panel"><h2>Ready to review <small>${due.length}</small></h2><p class="muted">These words are mixed into your next session. Get one right in all 3 rounds to earn $2 and clear it.</p><ul class="booklist">${due.map(id => row(id, true)).join('')}</ul><button class="btn go big" id="bookPlay">Practice them now</button></div>` : ''}
    ${later.length ? `<div class="panel"><h2>Back tomorrow <small>${later.length}</small></h2><p class="muted">Words you missed today. Study them, and they will come back in tomorrow's sessions.</p><ul class="booklist">${later.map(id => row(id, false)).join('')}</ul></div>` : ''}${labBox}${zhBox}`;
  const bp = $('#bookPlay'); if (bp) bp.addEventListener('click', startSession);
}

// ================= wiring =================
function boot() {
  $('#brand').addEventListener('click', () => { if (!P) route('home'); });
  $('#chipWho').addEventListener('click', () => { if (!P) { if (PROFILE) flushCloud(); route('who'); } });
  $('#whoBody').addEventListener('click', whoClick);
  $('#whoBody').addEventListener('keydown', e => { if (e.key === 'Enter') { if (e.target.id === 'newName') $('#newSave').click(); if (e.target.id === 'legacyName') $('#legacySave').click(); } });
  $('#renamePlayer').addEventListener('click', () => { if (!PROFILE) return; const n = prompt('New name for this player', PROFILE.name); if (n && n.trim()) { PROFILE.name = n.trim().slice(0, 20); const e = PROFILES.find(p => p.id === PROFILE.id); if (e) e.name = PROFILE.name; storeProfiles(); save(); renderHud(); } });
  let removeArmed = 0;
  $('#removePlayer').addEventListener('click', async () => {
    if (!PROFILE) return;
    if (Date.now() - removeArmed > 4000) { removeArmed = Date.now(); $('#removePlayer').textContent = 'Tap again to remove ' + PROFILE.name; setTimeout(() => { $('#removePlayer').textContent = 'Remove this player'; }, 4000); return; }
    const id = PROFILE.id; PROFILES = PROFILES.filter(p => p.id !== id); storeProfiles(); lsDel(lsKey(id)); lsDel(LS_ACTIVE);
    PROFILE = null; S = freshState(); $('#removePlayer').textContent = 'Remove this player';
    if (cloudDb) { try { await cloudDb.doc('profiles/' + id).delete(); } catch (e) {} }
    route('who');
  });
  $('#btnPlay').addEventListener('click', startSession);
  $('#goShop').addEventListener('click', () => route('shop'));
  $('#goRoom').addEventListener('click', () => route('town'));
  $('#hfTown').addEventListener('click', () => route('town'));
  $('#goDeco').addEventListener('click', () => { if (S.pets.length) openDeco(S.active); });
  $('#goPets').addEventListener('click', () => { if (S.pets.length) openRoom(S.active); });
  document.querySelectorAll('img[data-spr]').forEach(im => { im.src = imgSrc(im.dataset.spr); });
  wireDeco();
  $('#townPlots').addEventListener('click', e => { const b = e.target.closest('[data-house]'); if (b) return openRoom(+b.dataset.house); const sh = e.target.closest('[data-townshop]'); if (sh) { shopTab = sh.dataset.townshop === 'shelter' ? 'homes' : sh.dataset.townshop; route('shop'); } });
  $('#challenges').addEventListener('click', e => { const b = e.target.closest('[data-chal]'); if (b) { chalId = b.dataset.chal; route('chal'); } });
  $('#chalBody').addEventListener('click', e => { if (e.target.closest('[data-back-home]')) return route('home'); if (chalId === 'en' && labClick(e)) return; zhHubClick(e); });
  $('#chalBody').addEventListener('change', e => { if (e.target.id === 'zhVoicePick') { S.zhVoice = e.target.value; save(); ZHVOICE = zhVoices().find(v => v.name === S.zhVoice) || ZHVOICE; zhVoiceDemo(); } });
  $('#roomBack').addEventListener('click', () => route('town'));
  $('#shopFor').addEventListener('click', e => { const b = e.target.closest('[data-shoppet]'); if (b) { shopPet = +b.dataset.shoppet; renderShop(); } });
  $('#goBook').addEventListener('click', () => route('book'));
  $('#sceneHome').addEventListener('click', () => openRoom(S.active));
  document.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', () => route('home')));
  $('#shopTabs').addEventListener('click', e => { const b = e.target.closest('.tab'); if (b) { shopTab = b.dataset.t; renderShop(); } });
  $('#shopGrid').addEventListener('click', e => { const b = e.target.closest('.buy'); if (!b) return; if (b.dataset.buy) shopBuy(b.dataset.buy); else buy(b.dataset.id); });
  $('#scr-room').addEventListener('click', roomClick);
  $('#bookBody').addEventListener('click', e => { const b = e.target.closest('[data-say]'); if (b) say(b.dataset.say); });
  $('#quit').addEventListener('click', askExit);
  $('#keepPlaying').addEventListener('click', () => { $('#quitBar').hidden = true; });
  $('#quitYes').addEventListener('click', exitPlay);
  $('#whoBack').addEventListener('click', () => { if (PROFILE) route('home'); });
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
  $('#rate').addEventListener('change', e => { S.rate = +e.target.value; save(); say('practice'); });
  $('#sound').addEventListener('change', e => { S.sound = e.target.checked; save(); });
  $('#retest').addEventListener('click', () => { if (P) return; placementIntro(); });
  $('#testTools').addEventListener('click', testToolClick);
  $('#exportAll').addEventListener('click', exportAll);
  $('#signOutBtn').addEventListener('click', () => { if (PROFILE) flushCloud(); setTimeout(() => window.SPELLPETS_SIGNOUT && window.SPELLPETS_SIGNOUT(), 400); });
  $('#importFile').addEventListener('change', e => { const f = e.target.files[0]; if (f) importBackup(f); e.target.value = ''; });
  let resetArmed = 0;
  $('#reset').addEventListener('click', () => {
    if (Date.now() - resetArmed > 4000) { resetArmed = Date.now(); $('#reset').textContent = 'Tap again to erase everything'; setTimeout(() => { $('#reset').textContent = 'Reset all progress'; }, 4000); return; }
    S = freshState(); save(); flushCloud(); $('#reset').textContent = 'Reset all progress'; route('home'); maybeFirstPet();
  });
  document.addEventListener('keydown', e => {
    if (!$('#modal').hidden) { if (e.key === 'Escape') closeModal(); return; }
    if (!P || currentScreen !== 'play' || e.metaKey || e.ctrlKey || e.altKey) return;
    if (P.mode === 'zhplace') { if (e.key === ' ') { e.preventDefault(); const it = P.list[P.idx]; if (it) zhSay(it.id, 'call'); return; } if (e.key === 'Enter') { const nb = $('#goRound') || $('#zhPlaceMore'); if (nb) { e.preventDefault(); nb.click(); } return; } if (/^[1-4]$/.test(e.key)) { const b = document.querySelectorAll('.zhplaceopts .zhc')[+e.key - 1]; if (b && !b.disabled) b.click(); } return; }
    if (P.mode === 'zh') { const zw = P.round <= 3 && P.order[P.round][P.idx] ? ZH_BY[cur().id] : null; if (e.key === ' ' && zw) { e.preventDefault(); zhSay(zw.id, P.round === 3 ? 'blank' : 'call'); return; } if (e.key === 'Enter') { const nb = $('#nextBtn') || $('#goRound'); if (nb) { e.preventDefault(); nb.click(); return; } } zhKeydown(e); return; }
    const w = P.round <= 3 && P.order[P.round][P.idx] ? BY_ID[cur().id] : null;
    if (e.key === ' ' && w) { e.preventDefault(); say(P.round === 3 ? w.s.replace('_', 'blank') : hearText(w)); return; }
    if (e.key === 'Enter') { const nb = $('#nextBtn') || $('#goRound'); if (nb) { e.preventDefault(); nb.click(); return; } }
    if (P.round === 1 && /^[1-4]$/.test(e.key) && targets.length) { const t = targets.find(x => x.i === +e.key - 1); if (t) shoot(t); }
    else if (P.round === 2 && $('#typed')) { if (e.key === 'Backspace') { e.preventDefault(); typeKey('back'); } else if (e.key === 'Enter') { e.preventDefault(); typeKey('enter'); } else if (/^[a-zA-Z'\u2019]$/.test(e.key)) typeKey(e.key.toLowerCase().replace('\u2019', "'")); }
    else if (P.round === 3 && /^[1-4]$/.test(e.key)) { const o = document.querySelectorAll('.opt')[+e.key - 1]; if (o && !o.disabled) o.click(); }
  });
  // scene loop
  const home = $('#sceneHome'), room = $('#sceneRoom'), town = $('#townMap'), deco = $('#sceneDeco');
  const hc = home.getContext('2d'), rc = room.getContext('2d'), tc = town.getContext('2d'), dc = deco.getContext('2d');
  let lastDraw = 0;
  (function loop(t) {
    if (t - lastDraw > (deco.offsetParent ? 33 : 66)) {
      lastDraw = t;
      if (home.offsetParent) drawRoom(hc, t, S.pets[S.active], { id: 'home' });
      if (room.offsetParent) drawRoom(rc, t, S.pets[roomIdx], { id: 'room' });
      if (deco.offsetParent) drawRoom(dc, t, S.pets[DECO.pet], { id: 'deco', still: true, sel: DECO.sel >= 0 ? DECO.sel : null, dragging: DECO.drag ? DECO.drag.i : -1 });
      if (town.offsetParent) drawTown(tc, t); else townLast = 0;
    }
    requestAnimationFrame(loop);
  })(0);
  // decorative clouds
  $('#skyA').src = $('#skyB').src = spriteURL('i-cloud', ICONS.cloud);
  route(PROFILE ? 'home' : 'who');
  maybeFirstPet();
  initCloud();
  window.addEventListener('pagehide', () => { if (PROFILE) flushCloud(); });
}
loadSprites().then(boot);
