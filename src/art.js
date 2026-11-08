// ================= detailed pixel art (pets, food, shelters) =================
const INKC = '#1e1428';
const hex2k = h => parseInt(h.slice(1), 16);
const k2hex = k => '#' + (k & 0xffffff).toString(16).padStart(6, '0');
const mixHex = (a, b, f) => k2hex(mixKey(hex2k(a), hex2k(b), f));
const ART_OY = 8; // headroom above a pet for hats and long ears
const pE = (cx, cy, rx, ry, c, z, x = {}) => ({ k: 'e', a: [cx, cy + ART_OY, rx, ry], c, z, ...x });
const pT = (x1, y1, x2, y2, x3, y3, c, z, x = {}) => ({ k: 't', a: [x1, y1 + ART_OY, x2, y2 + ART_OY, x3, y3 + ART_OY], c, z, ...x });
const pR = (x, y, w, h, c, z, x2 = {}) => ({ k: 'r', a: [x, y + ART_OY, w, h], c, z, ...x2 });
// same helpers without the headroom offset (food, eggs)
const fE = (cx, cy, rx, ry, c, z, x = {}) => ({ k: 'e', a: [cx, cy, rx, ry], c, z, ...x });
const fT = (x1, y1, x2, y2, x3, y3, c, z, x = {}) => ({ k: 't', a: [x1, y1, x2, y2, x3, y3], c, z, ...x });
const fR = (x, y, w, h, c, z, x2 = {}) => ({ k: 'r', a: [x, y, w, h], c, z, ...x2 });

function inPrim(p, x, y) {
  const X = x + .5, Y = y + .5, a = p.a;
  if (p.k === 'e') { const nx = (X - a[0]) / a[2], ny = (Y - a[1]) / a[3]; return nx * nx + ny * ny > 1 ? null : [nx, ny]; }
  if (p.k === 'r') { if (X < a[0] || X > a[0] + a[2] || Y < a[1] || Y > a[1] + a[3]) return null; return [(X - a[0]) / a[2] * 2 - 1, (Y - a[1]) / a[3] * 2 - 1]; }
  const [x1, y1, x2, y2, x3, y3] = a;
  const d = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
  const l1 = ((y2 - y3) * (X - x3) + (x3 - x2) * (Y - y3)) / d, l2 = ((y3 - y1) * (X - x3) + (x1 - x3) * (Y - y3)) / d, l3 = 1 - l1 - l2;
  if (l1 < 0 || l2 < 0 || l3 < 0) return null;
  const mnx = Math.min(x1, x2, x3), mxx = Math.max(x1, x2, x3), mny = Math.min(y1, y2, y3), mxy = Math.max(y1, y2, y3);
  return [(X - mnx) / (mxx - mnx) * 2 - 1, (Y - mny) / (mxy - mny) * 2 - 1];
}
// Renders shapes with banded light from the top-left, a tinted silhouette outline,
// and soft inner lines where a front part overlaps a part behind it.
function renderArt(W, H, prims, sprites, colorOf) {
  const list = prims.map((p, i) => ({ ...p, i })).sort((a, b) => (a.z || 0) - (b.z || 0) || a.i - b.i);
  const owner = new Int16Array(W * H).fill(-1), NN = new Float32Array(W * H * 2);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    for (let j = list.length - 1; j >= 0; j--) {
      const p = list[j]; if (p.clip && y + .5 > p.clip) continue;
      const r = inPrim(p, x, y); if (r) { owner[y * W + x] = j; NN[(y * W + x) * 2] = r[0]; NN[(y * W + x) * 2 + 1] = r[1]; break; }
    }
  }
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d'), img = g.createImageData(W, H);
  const put = (i, hex) => { const k = hex2k(hex); img.data[i * 4] = k >> 16 & 255; img.data[i * 4 + 1] = k >> 8 & 255; img.data[i * 4 + 2] = k & 255; img.data[i * 4 + 3] = 255; };
  const own = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? -1 : owner[y * W + x];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const j = owner[y * W + x]; if (j < 0) continue;
    const p = list[j], base = colorOf(p.c);
    const ns = [own(x, y - 1), own(x + 1, y), own(x - 1, y), own(x, y + 1)];
    if (ns.includes(-1)) { put(y * W + x, mixHex(base, INKC, .62)); continue; }
    if (p.line && ns.some(n => n >= 0 && (list[n].z || 0) < (p.z || 0) && list[n].c !== p.c)) { put(y * W + x, mixHex(base, INKC, .4)); continue; }
    let col = base;
    if (p.pat) { const pc = p.pat(x, y - ART_OY * (p.flatY ? 0 : 1)); if (pc) col = colorOf(pc); }
    if (!p.flat) {
      const v = -(0.5 * NN[(y * W + x) * 2] + 0.85 * NN[(y * W + x) * 2 + 1]);
      if (v > 0.95) col = mixHex(col, '#ffffff', .42); else if (v > 0.45) col = mixHex(col, '#ffffff', .18); else if (v < -0.6) col = mixHex(col, '#2a1638', .2);
    }
    put(y * W + x, col);
  }
  g.putImageData(img, 0, 0);
  (sprites || []).forEach(s => {
    for (let r = 0; r < s.rows.length; r++) for (let k = 0; k < s.rows[r].length; k++) {
      const ch = s.rows[r][k]; if (ch === '.') continue; const col = s.pal[ch]; if (!col) continue;
      g.fillStyle = col; g.fillRect(s.x + k, s.y + r, 1, 1);
    }
  });
  return c;
}
const phash = (x, y, s = 0) => hash(x * 73856093 ^ y * 19349663 ^ s * 83492791);

// ---------- pets ----------
function chibi() {
  return [
    pE(16, 24, 9.5, 7.5, 'b', 2, { big: 1 }), pE(16, 25.6, 6, 5, 'l', 3),
    pE(11.5, 30.3, 3.3, 1.9, 'b', 4, { line: 1 }), pE(20.5, 30.3, 3.3, 1.9, 'b', 4, { line: 1 }),
    pE(16, 13, 11, 9.5, 'b', 5, { line: 1, big: 1 }),
    pE(9.3, 23.4, 2.4, 3.3, 'b', 6, { line: 1 }), pE(22.7, 23.4, 2.4, 3.3, 'b', 6, { line: 1 })
  ];
}
const tailChain = (pts, c, r) => pts.map(([x, y], i) => pE(x, y, r - i * 0.12, r - i * 0.12, c, 1, { line: 1 }));
const PET_ART = {
  cat: { pal: { b: '#f6a65a', l: '#fff3e2', d: '#de7a30', p: '#ffa3b5', n: '#e2687e' },
    parts: () => [...chibi(), pE(16, 17.2, 4.3, 2.7, 'l', 5.5, { flat: 1 }),
      pT(4.5, 10, 8, -0.5, 14.5, 5, 'b', 1, { line: 1 }), pT(7.3, 8, 8.5, 2.5, 12.2, 5.4, 'p', 1.5, { flat: 1 }),
      pT(27.5, 10, 24, -0.5, 17.5, 5, 'b', 1, { line: 1 }), pT(24.7, 8, 23.5, 2.5, 19.8, 5.4, 'p', 1.5, { flat: 1 }),
      ...tailChain([[26, 27.5], [28, 25], [29, 22.2], [29.2, 19.4]], 'b', 2.5), pE(29.1, 18.2, 1.9, 1.9, 'd', 1.2, { line: 1 })],
    extra: [{ x: 13, y: 4, rows: ['...d...', 'd..d..d', 'd..d..d'] }] },
  dog: { pal: { b: '#e3b27c', l: '#fff3e3', d: '#9a643f', p: '#ffa3b5', n: '#3b2a2a' },
    parts: () => [...chibi(), pE(16, 17.6, 5, 3.3, 'l', 5.5, { flat: 1 }), pE(20.5, 11.8, 3.6, 3.2, 'd', 5.4, { flat: 1 }),
      pE(5.6, 13.5, 3.2, 6.6, 'd', 6.5, { line: 1 }), pE(26.4, 13.5, 3.2, 6.6, 'd', 6.5, { line: 1 }),
      pE(26.8, 24.5, 2, 3.4, 'b', 1, { line: 1 })],
    tongue: 1 },
  rabbit: { pal: { b: '#f1ecf6', l: '#ffffff', d: '#cfc4e0', p: '#ffb3c6', n: '#ff8fab' },
    parts: () => [...chibi(), pE(11, 0, 3, 8, 'b', 1, { line: 1 }), pE(11, 0.6, 1.4, 6, 'p', 1.5, { flat: 1 }),
      pE(21, 0, 3, 8, 'b', 1, { line: 1 }), pE(21, 0.6, 1.4, 6, 'p', 1.5, { flat: 1 }), pE(25.8, 28, 3, 3, 'l', 1, { line: 1 })],
    teeth: 1 },
  pig: { pal: { b: '#ffb6c8', l: '#ffd9e3', d: '#f2849f', p: '#ff6f96', n: '#b8466c' },
    parts: () => [...chibi(), pE(16, 16.6, 4.4, 3.1, 'd', 6.5, { line: 1 }),
      pT(5.5, 8.5, 7, 0.5, 13.5, 4, 'b', 1, { line: 1 }), pT(7.8, 6.5, 8, 2.8, 11.5, 4.5, 'd', 1.5, { flat: 1 }),
      pT(26.5, 8.5, 25, 0.5, 18.5, 4, 'b', 1, { line: 1 }), pT(24.2, 6.5, 24, 2.8, 20.5, 4.5, 'd', 1.5, { flat: 1 })],
    snout: 1, extra: [{ x: 25, y: 23, rows: ['.dd', 'd.d', '.d.'] }] },
  rat: { pal: { b: '#a9a3b8', l: '#e8e3f0', d: '#7d7590', p: '#ffb3c6', n: '#ff8fab' },
    parts: () => [...chibi(), pE(16, 17.2, 3.6, 2.4, 'l', 5.5, { flat: 1 }),
      pE(5.4, 4.6, 4.8, 4.8, 'b', 1, { line: 1 }), pE(5.6, 5, 3, 3, 'p', 1.5, { flat: 1 }),
      pE(26.6, 4.6, 4.8, 4.8, 'b', 1, { line: 1 }), pE(26.4, 5, 3, 3, 'p', 1.5, { flat: 1 }),
      ...[[25, 29.5], [27, 30.4], [29, 29.8], [30.2, 28], [30.4, 26]].map(([x, y]) => pE(x, y, 1.3, 1.3, 'p', 1, { line: 1 }))],
    extra: [{ x: 2, y: 16, rows: ['ddd.', '.ddd'] }, { x: 26, y: 16, rows: ['.ddd', 'ddd.'] }] },
  monkey: { pal: { b: '#9c6a49', l: '#f3cfa6', d: '#6f4630', p: '#ffb08f', n: '#5a3825' },
    parts: () => [...chibi(), pE(11.8, 12.8, 4.3, 4, 'l', 5.5, { flat: 1 }), pE(20.2, 12.8, 4.3, 4, 'l', 5.5, { flat: 1 }), pE(16, 17.6, 6, 3.8, 'l', 5.6, { flat: 1 }),
      pE(4.4, 13, 3.4, 3.4, 'b', 4, { line: 1 }), pE(4.4, 13, 2, 2, 'l', 4.5, { flat: 1 }),
      pE(27.6, 13, 3.4, 3.4, 'b', 4, { line: 1 }), pE(27.6, 13, 2, 2, 'l', 4.5, { flat: 1 }),
      pT(13.5, 5, 16, 1, 18.5, 5, 'b', 5.5, { flat: 1 }),
      ...tailChain([[26, 27.5], [28.6, 25.2], [29.6, 22.2], [28.6, 19.6], [26.6, 18.8]], 'b', 1.7)] },
  turtle: { pal: { b: '#8fcf63', l: '#f4e09a', d: '#3f8f4f', g: '#77c070', p: '#ffa3b5', n: '#2f5a33' },
    parts: () => [pE(16, 21.5, 14, 10.5, 'd', 1.5, { line: 1, pat: (x, y) => ((x + 2 * y) % 10 === 0 || (x - 2 * y + 200) % 10 === 0) ? 'g' : null }),
      ...chibi().map(p => p.c === 'l' ? { ...p, a: [16, 25.6 + ART_OY, 6.8, 5.6], pat: (x, y) => (y % 3 === 0 ? 'ls' : null) } : p)] },
  dinosaur: { pal: { b: '#7ccc6a', l: '#e2f5b8', d: '#3f9a52', p: '#ffb3c6', n: '#2f6b3a' },
    parts: () => [...chibi(),
      pT(10, 6.5, 12.3, 0, 14.6, 5, 'd', 4, { line: 1 }), pT(13.8, 4.5, 16, -1.5, 18.2, 4.5, 'd', 4, { line: 1 }), pT(17.4, 5, 19.7, 0, 22, 6.5, 'd', 4, { line: 1 }),
      pE(25.5, 27, 3.6, 3, 'b', 1, { line: 1 }), pE(28.5, 24.6, 2.8, 2.4, 'b', 1, { line: 1 }), pE(30.4, 22.4, 1.6, 1.6, 'b', 1, { line: 1 }),
      pT(26, 24.5, 27.5, 21.5, 29, 23.6, 'd', 0.5, { line: 1 })],
    extra: [{ x: 7, y: 7, rows: ['d.....', '...d..'] }, { x: 21, y: 8, rows: ['..d', 'd..'] }], nostrils: 1 },
  dragon: { pal: { b: '#e8505b', l: '#ffd37a', d: '#a8323f', y: '#fff2cc', g: '#ff8a7a', p: '#ff9bb0', n: '#7a1f2a' },
    parts: () => [...chibi().map(p => p.c === 'l' ? { ...p, pat: (x, y) => (y % 3 === 0 ? 'ls' : null) } : p),
      pT(8.5, 6.5, 4.5, -5, 12, 4, 'y', 4, { line: 1 }), pT(23.5, 6.5, 27.5, -5, 20, 4, 'y', 4, { line: 1 }),
      pT(8, 19, -0.5, 11, 4, 27, 'g', 1, { line: 1, pat: (x, y) => ((x + y) % 4 === 0 ? 'd' : null) }), pT(24, 19, 32.5, 11, 28, 27, 'g', 1, { line: 1, pat: (x, y) => ((x - y + 64) % 4 === 0 ? 'd' : null) }),
      pE(25.6, 28, 3.2, 2.2, 'b', 1.2, { line: 1 }), pE(28.6, 26.4, 2.2, 1.8, 'b', 1.2, { line: 1 }), pT(28.5, 23, 32, 25.5, 28.6, 27.4, 'd', 1.1, { line: 1 })],
    nostrils: 1 }
};
const LTD = {
  dragon: { name: 'Galaxy', pal: { b: '#2f3180', d: '#1b1c4a', l: '#a8b0ff', g: '#6a5acd' }, pat: (x, y) => phash(x, y, 1) < .07 ? '#fff6b0' : null },
  dinosaur: { name: 'Fossil', pal: { b: '#e9e2cf', d: '#b9ab8c', l: '#fffaf0' }, pat: (x, y) => phash(x >> 1, y >> 1, 2) < .12 ? '#cfc3a6' : null },
  dog: { name: 'Dalmatian', pal: { b: '#f7f7f7', d: '#2b2b2b', l: '#ffffff' }, pat: (x, y) => phash(x / 3 | 0, y / 3 | 0, 3) < .2 ? '#2b2b2b' : null },
  cat: { name: 'Calico', pal: { b: '#fffaf3', d: '#e98a3c', l: '#ffffff' }, pat: (x, y) => { const h = phash(x / 6 | 0, y / 5 | 0, 4); return h < .25 ? '#f0943f' : h < .4 ? '#3a3030' : null; } },
  turtle: { name: 'Golden Shell', pal: { d: '#d9a520', g: '#ffe17a', b: '#9bd06a', l: '#fff1b8' } },
  rabbit: { name: 'Sakura', pal: { b: '#ffd6e6', l: '#fff5f8', d: '#f5a8c4' }, pat: (x, y) => phash(x, y, 5) < .05 ? '#ff7fae' : null },
  pig: { name: 'Choco', pal: { b: '#c9906b', l: '#e8c3a5', d: '#8a5a3c' }, pat: (x, y) => phash(x >> 1, y >> 1, 6) < .1 ? '#a8714f' : null },
  rat: { name: 'Ninja', pal: { b: '#3a3647', l: '#6d6880', d: '#24212e', p: '#e5383b' }, pat: (x, y) => (y === 6 || y === 7) ? '#e5383b' : null },
  monkey: { name: 'Golden', pal: { b: '#f2b632', d: '#c4861a', l: '#fff0c2' }, pat: (x, y) => phash(x, y, 7) < .045 ? '#ffffff' : null },
  trex: { name: 'Volcano', pal: { b: '#4a3b46', d: '#2a2028', l: '#ff8c42' }, pat: (x, y) => phash(x, y, 8) < .07 ? '#ff5d2e' : null },
  snake: { name: 'Emerald', pal: { b: '#2fbf71', d: '#1b7a48', l: '#b8f5d0' }, pat: (x, y) => ((x + y) % 5 === 0 ? '#ffd23f' : null) },
  parrot: { name: 'Snowy', pal: { b: '#eef3ff', d: '#9fb0d4', l: '#ffffff' }, pat: (x, y) => phash(x, y, 9) < .06 ? '#9fd8ff' : null },
  owl: { name: 'Moonlight', pal: { b: '#3b4a7a', d: '#232c4f', l: '#c9d4ff' }, pat: (x, y) => phash(x, y, 10) < .05 ? '#fff6b0' : null }
};
const HAT_ART = {
  party: () => [pT(10, 5, 16, -8.5, 22, 5, '#4cc9f0', 20, { line: 1, pat: (x, y) => ((x + y + 64) % 5 < 2 ? '#f72585' : null) }), pE(16, -8.5, 2, 2, '#ffcc33', 21, { line: 1 })],
  crown: () => [pR(10, -1, 12, 6, '#ffcc33', 20), pT(10, -1, 11, -6.5, 13.5, -1, '#ffcc33', 20), pT(13.5, -1, 16, -7.5, 18.5, -1, '#ffcc33', 20), pT(18.5, -1, 21, -6.5, 22, -1, '#ffcc33', 20)],
  wizard: () => [pT(9, 5, 17, -13, 23, 5, '#7b4fd6', 20, { line: 1 }), pE(16, 5, 10, 2.3, '#5b35b0', 21, { line: 1 })],
  cap: () => [pE(16, 4.6, 7.6, 6, '#e5383b', 20, { line: 1, clip: 5 + ART_OY }), pE(21.5, 4.6, 6, 1.8, '#c22f33', 21, { line: 1 })]
};
const HAT_SPRITES = {
  crown: [{ x: 15, y: 1, rows: ['zz', 'zz'] }, { x: 11, y: 2, rows: ['c'] }, { x: 20, y: 2, rows: ['i'] }],
  wizard: [{ x: 14, y: -4, rows: ['.k.', 'kkk', '.k.'] }],
  cap: [{ x: 15, y: -1, rows: ['ww'] }]
};
const NECK_ART = {
  bowtie: () => [pT(16, 22.5, 11.5, 19.5, 11.5, 25.5, '#e5383b', 22, { line: 1 }), pT(16, 22.5, 20.5, 19.5, 20.5, 25.5, '#e5383b', 22, { line: 1 }), pE(16, 22.5, 1.6, 1.6, '#c22f33', 23, { line: 1 })],
  scarf: () => [pR(8.5, 20.6, 15, 3.4, '#e5383b', 22, { line: 1, pat: x => (x % 4 === 0 ? '#ffffff' : null) }), pR(18.5, 23, 3.2, 6, '#d62f35', 23, { line: 1, pat: (x, y) => (y % 3 === 0 ? '#ffffff' : null) })]
};
const EYE_OPEN = ['.ee.', 'ewee', 'eeee', '.ee.'];
const EYE_SHUT = ['....', 'e..e', '.ee.', '....'];
function renderPetOld(pet, o = {}) {
  const art = PET_ART[pet.kind];
  const skin = o.skin !== undefined ? o.skin : pet.skin;
  const ltd = skin === 'ltd' ? LTD[pet.kind] : null;
  const pal = Object.assign({}, art.pal, ltd ? ltd.pal : (skin && SKINS[skin] ? SKINS[skin].pal : {}));
  const colorOf = k => pal[k] || (k === 'ls' ? mixHex(pal.l, '#7a4a20', .16) : k);
  let prims = art.parts();
  if (ltd && ltd.pat) prims = prims.map(p => p.big && p.c === 'b' ? { ...p, pat: ltd.pat } : p);
  const hat = o.hat !== undefined ? o.hat : pet.hat, neck = o.neck !== undefined ? o.neck : pet.neck, eyes = o.eyes !== undefined ? o.eyes : pet.eyes;
  if (hat && HAT_ART[hat]) prims = prims.concat(HAT_ART[hat]());
  if (neck && NECK_ART[neck]) prims = prims.concat(NECK_ART[neck]());
  const Y = ART_OY, ink = '#1d1426';
  const fp = { e: ink, w: '#ffffff', p: mixHex(pal.p || '#ff9bb0', '#ffffff', .1), n: pal.n || ink, m: mixHex(pal.b, INKC, .62), d: pal.d, r: '#ff6f86', t: '#ffffff' };
  const eye = o.blink ? EYE_SHUT : EYE_OPEN;
  const sp = [{ x: 10, y: 11 + Y, rows: eye, pal: fp }, { x: 19, y: 11 + Y, rows: eye, pal: fp },
    { x: 6, y: 16 + Y, rows: ['ppp'], pal: fp }, { x: 23, y: 16 + Y, rows: ['ppp'], pal: fp }];
  if (art.snout) { sp.push({ x: 14, y: 16 + Y, rows: ['n..n'], pal: fp }, { x: 14, y: 19 + Y, rows: ['m..m', '.mm.'], pal: fp }); }
  else {
    if (art.nostrils) sp.push({ x: 14, y: 15 + Y, rows: ['n..n'], pal: fp }); else sp.push({ x: 15, y: 15 + Y, rows: ['nn'], pal: fp });
    sp.push({ x: 14, y: 16 + Y, rows: ['m..m', '.mm.'], pal: fp });
    if (art.tongue) sp.push({ x: 15, y: 18 + Y, rows: ['rr'], pal: fp });
    if (art.teeth) sp.push({ x: 15, y: 18 + Y, rows: ['tt'], pal: fp });
  }
  if (!hat && art.extra) art.extra.forEach(s => sp.push({ x: s.x, y: s.y + Y, rows: s.rows, pal: fp }));
  else if (art.extra) art.extra.filter(s => s.y > 6).forEach(s => sp.push({ x: s.x, y: s.y + Y, rows: s.rows, pal: fp }));
  if (hat && HAT_SPRITES[hat]) HAT_SPRITES[hat].forEach(s => sp.push({ x: s.x, y: s.y + Y, rows: s.rows, pal: BASEPAL }));
  const c = renderArt(32, 32 + Y, prims, sp, colorOf);
  if (eyes) drawGlasses32(c.getContext('2d'), eyes);
  return c;
}
function drawGlasses32(g, kind) {
  const ink = '#1d1724', Y = ART_OY;
  [10, 19].forEach(x0 => {
    const x = x0 - 1, y = 11 + Y - 1;
    if (kind === 'shades') { g.fillStyle = ink; g.fillRect(x, y + 1, 6, 4); g.fillRect(x + 1, y + 5, 4, 1); g.fillStyle = 'rgba(255,255,255,.85)'; g.fillRect(x + 1, y + 2, 2, 1); }
    else { g.fillStyle = 'rgba(200,235,255,.35)'; g.fillRect(x + 1, y + 1, 4, 4); g.fillStyle = ink; g.fillRect(x + 1, y, 4, 1); g.fillRect(x + 1, y + 5, 4, 1); g.fillRect(x, y + 1, 1, 4); g.fillRect(x + 5, y + 1, 1, 4); }
  });
  g.fillStyle = ink; g.fillRect(15, 11 + Y + 1, 3, 1);
}

// ---------- food (16x16) ----------
const FOOD_ART = {
  apple: () => [fE(8, 9.6, 5.8, 5.2, '#e5383b', 1), fR(7.4, 1.5, 1.4, 4, '#7a4a2a', 2), fE(11, 3.3, 2.4, 1.3, '#57cc99', 2, { line: 1 })],
  carrot: () => [fT(3, 5, 13, 5, 8, 15.8, '#ff9f1c', 1, { pat: (x, y) => (y % 3 === 0 && x > 5 && x < 10 ? '#d97a0b' : null), flatY: 1 }), fT(6, 5.5, 6.5, 0, 8.4, 5.5, '#57cc99', 0), fT(7.6, 5.5, 9, 0.5, 10, 5.5, '#3e9e5f', 0)],
  fish: () => [fE(7, 8, 5.6, 3.6, '#4cc9f0', 2), fT(11, 8, 15.6, 4, 15.6, 12, '#2f9fd0', 1)],
  bone: () => [fR(3.5, 6.2, 9, 3.6, '#eadcb0', 1), fE(3.6, 6.3, 2.5, 2.5, '#eadcb0', 1), fE(3.6, 9.7, 2.5, 2.5, '#eadcb0', 1), fE(12.4, 6.3, 2.5, 2.5, '#eadcb0', 1), fE(12.4, 9.7, 2.5, 2.5, '#eadcb0', 1)],
  cake: () => [fR(2, 7, 12, 7.5, '#ffd37a', 1, { pat: (x, y) => (y === 10 || y === 11 ? '#ff7eb6' : null), flatY: 1 }), fE(8, 7.2, 6.4, 2.2, '#fff5f8', 2), fE(8, 3.8, 1.8, 1.8, '#e5383b', 3)],
  seeds: () => [fE(8, 7.5, 4.2, 5.6, '#3d332f', 1, { pat: x => (x === 6 || x === 9 ? '#cfc6b8' : null), flatY: 1 }), fT(8, 15.6, 4.2, 9.5, 11.8, 9.5, '#3d332f', 1, { pat: x => (x === 6 || x === 9 ? '#cfc6b8' : null), flatY: 1 })]
};
const FOOD_SPRITES = { fish: [{ x: 3, y: 6, rows: ['xw', 'xx'] }], apple: [{ x: 5, y: 7, rows: ['w', 'w'] }] };
function renderFood(key) {
  return renderArt(16, 16, FOOD_ART[key](), (FOOD_SPRITES[key] || []).map(s => ({ ...s, pal: BASEPAL })), k => k);
}

// ---------- shelters, drawn on the 192x128 room ----------
function H_(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(x, y, w, h); }
function Hbox(c, x, y, w, h, fill, line) { H_(c, x, y, w, h, line); H_(c, x + 1, y + 1, w - 2, h - 2, fill); }
function Hell(c, cx, cy, rx, ry, col, topOnly) { for (let y = Math.ceil(cy - ry); y <= (topOnly ? cy : cy + ry); y++) { const t = 1 - ((y - cy) / ry) ** 2; if (t < 0) continue; const hw = Math.round(rx * Math.sqrt(t)); H_(c, cx - hw, y, hw * 2, 1, col); } }
function Hroof(c, cx, top, bottom, halfTop, halfBottom, cols, edge) {
  for (let y = top; y < bottom; y++) {
    const f = (y - top) / Math.max(1, bottom - top - 1), hw = Math.round(halfTop + (halfBottom - halfTop) * f);
    H_(c, cx - hw, y, hw * 2, 1, cols[Math.floor((y - top) / 3) % cols.length]);
    if ((y - top) % 3 === 2) for (let x = cx - hw + ((y / 3 | 0) % 2) * 3; x < cx + hw; x += 6) H_(c, x, y, 1, 1, edge);
    H_(c, cx - hw, y, 1, 1, edge); H_(c, cx + hw - 1, y, 1, 1, edge);
  }
}
function Hwindow(c, x, y, w, h, cols) {
  Hbox(c, x - 1, y - 1, w + 2, h + 2, '#ffffff', '#3a3f5c');
  H_(c, x + 1, y + 1, w - 2, h - 2, '#2b3150');
  for (let i = 0; i < cols - 1; i++) H_(c, x + Math.round((w / cols) * (i + 1)), y + 1, 1, h - 2, '#ffffff');
  H_(c, x + 2, y + 2, 2, 1, '#7a86c2'); H_(c, x + 2, y + 3, 1, 2, '#7a86c2');
}
const SHELTERS_HI = {
  box(c) {
    Hbox(c, 12, 66, 56, 38, '#c8945a', '#5a3a22'); H_(c, 13, 67, 54, 4, '#d9a86c'); H_(c, 13, 98, 54, 5, '#ad7a46');
    Hbox(c, 22, 78, 36, 26, '#4a2f1c', '#3a2214'); H_(c, 23, 79, 34, 4, '#2e1c10');
    c.save(); c.fillStyle = '#d9a86c'; c.strokeStyle = '#5a3a22';
    c.beginPath(); c.moveTo(12, 66); c.lineTo(2, 56); c.lineTo(26, 56); c.lineTo(36, 66); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(68, 66); c.lineTo(78, 56); c.lineTo(54, 56); c.lineTo(44, 66); c.closePath(); c.fill(); c.stroke(); c.restore();
    H_(c, 38, 67, 4, 10, '#efe0b8'); H_(c, 50, 88, 10, 5, '#c0392b'); H_(c, 51, 89, 8, 3, '#e8705f');
  },
  doghouse(c) {
    Hbox(c, 12, 66, 56, 38, '#d1495b', '#5a1f2a');
    for (let x = 19; x < 66; x += 7) H_(c, x, 67, 1, 36, '#b83a4c'); H_(c, 13, 67, 1, 36, '#e8707e');
    Hroof(c, 40, 42, 66, 3, 36, ['#6b4a32', '#5d3f2a'], '#3e2a1c'); H_(c, 3, 66, 74, 3, '#3e2a1c');
    Hbox(c, 28, 78, 24, 26, '#2a1d1d', '#1a1010'); H_(c, 30, 76, 20, 3, '#2a1d1d'); H_(c, 33, 74, 14, 2, '#2a1d1d');
    Hbox(c, 31, 69, 18, 5, '#f5ecd0', '#8a7a5a'); H_(c, 0, 103, 80, 1, '#3a2a20');
  },
  cottage(c) {
    H_(c, 60, 34, 12, 18, '#a36b4c'); H_(c, 58, 32, 16, 3, '#7d4d35'); for (let y = 37; y < 52; y += 4) H_(c, 61, y, 10, 1, '#8a5a3e');
    Hbox(c, 8, 68, 70, 32, '#e9c79a', '#6b4a32'); for (let y = 72; y < 100; y += 4) H_(c, 9, y, 68, 1, '#d9b383');
    Hroof(c, 43, 40, 68, 30, 42, ['#3b3f5c', '#33374f'], '#22253a'); H_(c, 0, 67, 86, 3, '#22253a'); H_(c, 1, 67, 84, 1, '#a9c4ff');
    // front gable
    for (let i = 0; i < 18; i++) { const hw = 3 + Math.round(i * 1.1); H_(c, 28 - hw, 52 + i, hw * 2, 1, i < 2 ? '#a9c4ff' : '#d8c2a6'); H_(c, 28 - hw, 52 + i, 2, 1, '#a9c4ff'); H_(c, 28 + hw - 2, 52 + i, 2, 1, '#a9c4ff'); }
    H_(c, 26, 59, 4, 4, '#ffffff'); H_(c, 27, 60, 2, 2, '#a9c4ff');
    Hbox(c, 15, 80, 10, 20, '#8a5a34', '#4a2e1a'); H_(c, 14, 79, 12, 1, '#ffffff'); H_(c, 22, 89, 1, 2, '#ffcc33'); H_(c, 17, 83, 6, 1, '#6e4426'); H_(c, 17, 91, 6, 1, '#6e4426');
    Hwindow(c, 30, 81, 12, 10, 2); Hwindow(c, 50, 77, 22, 14, 3);
    H_(c, 4, 100, 78, 4, '#5b5f6e'); H_(c, 4, 100, 78, 1, '#8a8fa3'); H_(c, 4, 103, 78, 1, '#3b3d4a');
  },
  tent(c) {
    for (let i = 0; i < 56; i++) { const y = 48 + i, hw = Math.round(i * 0.62) + 1; for (let x = 40 - hw; x < 40 + hw; x++) H_(c, x, y, 1, 1, (Math.floor((x - 40 + 60) / 6) % 2) ? '#3a86ff' : '#e8f1ff'); H_(c, 40 - hw, y, 1, 1, '#1b3f8a'); H_(c, 39 + hw, y, 1, 1, '#1b3f8a'); }
    for (let i = 26; i < 56; i++) { const hw = Math.round((i - 26) * 0.42); if (hw) H_(c, 40 - hw, 48 + i, 2 * hw, 1, '#1b2f5a'); }
    for (let i = 30; i < 56; i++) { const w = Math.round((i - 30) * 0.3); H_(c, 41, 48 + i, w + 1, 1, '#cfe0ff'); }
    H_(c, 39, 40, 2, 9, '#555555'); H_(c, 41, 40, 8, 5, '#ffcc33'); H_(c, 41, 44, 8, 1, '#d69e1a');
    c.save(); c.strokeStyle = '#8b6b4a'; c.beginPath(); c.moveTo(14, 90); c.lineTo(2, 104); c.moveTo(66, 90); c.lineTo(78, 104); c.stroke(); c.restore();
  },
  igloo(c) {
    for (let y = 70; y <= 104; y++) {
      const dy = 104 - y, hw = Math.floor(Math.sqrt(Math.max(0, 1 - (dy / 34) ** 2)) * 38);
      for (let x = 40 - hw; x < 40 + hw; x++) {
        const nx = (x - 40) / 38, ny = -dy / 34, v = -(0.6 * nx + 0.8 * ny);
        let col = v > 0.9 ? '#ffffff' : v < 0.15 ? '#cfe3f3' : '#eaf6ff';
        if ((y - 70) % 6 === 0) col = '#b9d4ea'; else if ((x + ((Math.floor((y - 70) / 6) % 2) * 6)) % 12 === 0) col = '#c7dff0';
        H_(c, x, y, 1, 1, col);
      }
      H_(c, 40 - hw, y, 1, 1, '#7d9ab3'); H_(c, 39 + hw, y, 1, 1, '#7d9ab3');
    }
    Hbox(c, 26, 86, 28, 18, '#e2f1fb', '#7d9ab3'); Hell(c, 40, 104, 8, 13, '#2c3e57', true); Hell(c, 40, 104, 6, 11, '#1d2b40', true);
  },
  treehouse(c) {
    Hbox(c, 34, 58, 12, 46, '#7a4a2a', '#3e2414'); for (let y = 62; y < 102; y += 6) H_(c, 37 + (y % 12 ? 0 : 4), y, 3, 1, '#5c3620');
    [[40, 20, 32, 16, '#3e8948'], [16, 30, 14, 10, '#3e8948'], [64, 30, 14, 10, '#3e8948'], [36, 14, 18, 8, '#4fa357'], [22, 24, 8, 5, '#4fa357'], [58, 22, 9, 5, '#5fb35f']].forEach(e => Hell(c, e[0], e[1], e[2], e[3], e[4]));
    for (let i = 0; i < 40; i++) H_(c, 10 + Math.floor(hash(i * 3) * 60), 8 + Math.floor(hash(i * 5 + 1) * 28), 2, 1, '#7fd07a');
    Hroof(c, 40, 30, 40, 4, 26, ['#a8432e', '#943a28'], '#5a2416');
    Hbox(c, 18, 40, 44, 20, '#c97b3c', '#5a3418'); for (let y = 44; y < 60; y += 4) H_(c, 19, y, 42, 1, '#b56a30');
    Hwindow(c, 24, 45, 10, 8, 2); Hbox(c, 46, 46, 9, 14, '#5a3a22', '#3a2414'); H_(c, 53, 52, 1, 1, '#ffcc33');
    H_(c, 8, 60, 64, 4, '#8b5a2b'); H_(c, 8, 60, 64, 1, '#a8733e');
    H_(c, 58, 64, 2, 40, '#a86a3a'); H_(c, 66, 64, 2, 40, '#a86a3a'); for (let y = 68; y < 104; y += 6) H_(c, 58, y, 10, 2, '#a86a3a');
  },
  castle(c) {
    const stone = (x, y, w, h, base) => { Hbox(c, x, y, w, h, base, '#3c4152'); for (let yy = y + 5; yy < y + h - 1; yy += 5) { H_(c, x + 1, yy, w - 2, 1, '#8a93a6'); for (let xx = x + 1 + ((yy / 5 | 0) % 2) * 4; xx < x + w - 1; xx += 8) H_(c, xx, yy - 4, 1, 4, '#8a93a6'); } };
    stone(2, 44, 20, 60, '#a7b0c2'); stone(58, 44, 20, 60, '#a7b0c2'); stone(18, 60, 44, 44, '#b8c0d0');
    for (let x = 18; x < 62; x += 8) Hbox(c, x, 54, 5, 7, '#b8c0d0', '#3c4152');
    Hroof(c, 12, 22, 44, 1, 12, ['#3a5ba8', '#32508f'], '#1f3366'); Hroof(c, 68, 22, 44, 1, 12, ['#3a5ba8', '#32508f'], '#1f3366');
    H_(c, 12, 10, 1, 12, '#555555'); H_(c, 13, 10, 7, 4, '#e5383b'); H_(c, 68, 10, 1, 12, '#555555'); H_(c, 69, 10, 7, 4, '#ffcc33');
    Hbox(c, 30, 80, 20, 24, '#3b2a2a', '#1a1010'); Hell(c, 40, 80, 10, 5, '#3b2a2a', true); for (let x = 33; x < 48; x += 4) H_(c, x, 80, 1, 24, '#6b4d3a'); H_(c, 31, 90, 18, 1, '#6b4d3a');
    H_(c, 10, 58, 3, 8, '#2a1d33'); H_(c, 66, 58, 3, 8, '#2a1d33'); H_(c, 38, 66, 4, 7, '#2a1d33');
  }
};
function trimCanvas(src) {
  const g = src.getContext('2d'), d = g.getImageData(0, 0, src.width, src.height).data;
  let x0 = src.width, y0 = src.height, x1 = -1, y1 = -1;
  for (let y = 0; y < src.height; y++) for (let x = 0; x < src.width; x++) if (d[(y * src.width + x) * 4 + 3] > 10) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
  if (x1 < 0) return src;
  const c = document.createElement('canvas'); c.width = x1 - x0 + 1; c.height = y1 - y0 + 1;
  c.getContext('2d').drawImage(src, x0, y0, c.width, c.height, 0, 0, c.width, c.height);
  return c;
}
function renderEgg(stage) {
  const prims = [fE(12, 16, 9.5, 12.5, '#fff4dc', 1, { pat: (x, y) => phash(x >> 1, y >> 1, 9) < .14 ? '#f2c66b' : null, flatY: 1 })];
  const cracks = stage >= 1 ? [{ x: 7, y: 12, rows: stage >= 2 ? ['x.....x...', '.x...x.x..', '..x.x...x.', '...x.....x'] : ['x...x', '.x.x.', '..x..'], pal: { x: '#6b4a32' } }] : [];
  return renderArt(24, 30, prims, cracks, k => k);
}
