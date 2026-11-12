// ================= SPRITES from the asset sheet =================
// Pets, homes, food and clothes are bitmaps (SPR_SRC). Pets render into a fixed 200x240 canvas,
// standing on the bottom edge, so every view can scale them the same way.
const SPR = {};
const PET_CW = 200, PET_CH = 240;
function loadSprites() {
  return Promise.all(Object.entries(SPR_SRC).map(([k, src]) => new Promise(res => {
    const im = new Image(); im.onload = () => { SPR[k] = im; res(); }; im.onerror = () => res(); im.src = src;
  })));
}
const hasImg = k => !!SPR[k];
const IMG_HOMES = { cottage: 'home-cabin', house: 'home-house', treehouse: 'home-treehouse', castle: 'home-castle' };
const homeImg = key => SPR[IMG_HOMES[key]] || null;

// ---- colour helpers ----
function hexRGB(h) { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function rgbHSL(r, g, b) {
  r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn, s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
  const h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}
function lerp3(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }

// Where the body colour is: not outline, not cream/white, not the pink cheeks.
function isBodyPx(r, g, b, kind) {
  const lum = 0.299 * r + 0.587 * g + 0.114 * b; if (lum < 62) return false;
  const [h, s, l] = rgbHSL(r, g, b);
  const cream = kind === 'rabbit';                            // the rabbit's fur IS the cream colour
  if (!cream && s < 0.2 && l > 0.8) return false;             // cream belly, white highlights
  if (l > (cream ? 0.97 : 0.86)) return false;
  if (kind !== 'pig' && s > 0.3 && l > 0.62 && (h > 325 || h < 12)) return false; // cheeks
  return true;
}
// Recolour the body with a 3-stop gradient (dark, base, light) chosen by the original brightness.
function recolor(ctx, w, h, kind, pal, pat) {
  const id = ctx.getImageData(0, 0, w, h), d = id.data, lums = [];
  for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 120 && isBodyPx(d[i], d[i + 1], d[i + 2], kind)) lums.push(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
  if (!lums.length) return;
  lums.sort((a, b) => a - b);
  const lo = lums[Math.floor(lums.length * .04)], hi = lums[Math.floor(lums.length * .96)] + 1;
  const D = hexRGB(pal.d || pal.b), B = hexRGB(pal.b), L = hexRGB(pal.l || pal.b);
  for (let i = 0, p = 0; i < d.length; i += 4, p++) {
    if (d[i + 3] < 30 || !isBodyPx(d[i], d[i + 1], d[i + 2], kind)) continue;
    const t = Math.max(0, Math.min(1, ((0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) - lo) / (hi - lo)));
    let c = t < .5 ? lerp3(D, B, t * 2) : lerp3(B, L, (t - .5) * 2);
    if (pat) { const x = p % w, y = (p / w) | 0, pc = pat((x / 6) | 0, (y / 6) | 0); if (pc) c = hexRGB(pc); }
    d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2];
  }
  ctx.putImageData(id, 0, 0);
}

// ---- pet anchors in canvas coordinates ----
function petGeom(kind) {
  const im = SPR['pet-' + kind], A = PET_ANCHOR[kind] || {};
  const w = im ? im.width : 150, h = im ? im.height : 180;
  const ox = Math.round((PET_CW - w) / 2), oy = PET_CH - 2 - h;
  const es = A.es || 46, ex = ox + (A.ex != null ? A.ex : w / 2), ey = oy + (A.ey != null ? A.ey : h * .3);
  return { kind, ox, oy, w, h, ex, ey, es, er: A.er || 5, neckY: ey + es * 0.8 };
}
// widest run of pet pixels on one row, near the face centre
function rowSpan(ctx, y, cx) {
  const d = ctx.getImageData(0, Math.round(y), PET_CW, 1).data; let a = Math.round(cx), b = a;
  if (d[a * 4 + 3] < 100) return null;
  while (a > 0 && d[(a - 1) * 4 + 3] > 100) a--; while (b < PET_CW - 1 && d[(b + 1) * 4 + 3] > 100) b++;
  return [a, b];
}
// glasses with dark lenses for "Cool Shades"
let SHADES = null;
function shadesImg() {
  if (SHADES || !SPR['wear-glasses']) return SHADES;
  const g = SPR['wear-glasses'], c = document.createElement('canvas'); c.width = g.width; c.height = g.height;
  const x = c.getContext('2d'); x.drawImage(g, 0, 0); const id = x.getImageData(0, 0, c.width, c.height), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const [h, s, l] = rgbHSL(d[i], d[i + 1], d[i + 2]); if (d[i + 3] > 0 && l > .55 && h > 170 && h < 230) { d[i] = 34; d[i + 1] = 30; d[i + 2] = 48; } else if (d[i + 3] > 0 && l > .9) { d[i] = 60; d[i + 1] = 56; d[i + 2] = 80; } }
  x.putImageData(id, 0, 0); return SHADES = c;
}
// old pixel hats (party, crown, wizard) drawn big and crisp
function pixelHat(key) {
  const h = HATS[key]; if (!h) return null;
  const w = Math.max(...h.rows.map(r => r.length)), c = document.createElement('canvas'); c.width = w; c.height = h.rows.length;
  drawSprite(c.getContext('2d'), h.rows, BASEPAL, 0, 0); return c;
}
function drawFit(ctx, img, cx, top, width, smooth = true) {
  const hgt = img.height * width / img.width; ctx.imageSmoothingEnabled = smooth; ctx.drawImage(img, Math.round(cx - width / 2), Math.round(top), Math.round(width), Math.round(hgt)); return hgt;
}
const WEAR = { strawhat: 'wear-strawhat', cap: 'wear-cap', round: 'wear-glasses', bowtie: 'wear-bow', scarf: 'wear-scarf', backpack: 'wear-backpack', overalls: 'wear-overalls', raincoat: 'wear-raincoat' };

// garments trimmed to their own pixels; the raincoat loses its empty hood so it reads as a coat on any pet
const GARM = {};
function garment(key) {
  if (GARM[key] !== undefined) return GARM[key];
  const im = SPR[WEAR[key]]; if (!im) return null;
  const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0);
  const d = x.getImageData(0, 0, c.width, c.height).data, W = c.width, H = c.height;
  let top = 0;
  if (key === 'raincoat') {                                   // first row below the dark hood opening
    let last = 0;                                             // rows with a wide run of dark brown = the hood opening (buttons are small)
    for (let y = 0; y < H * 0.6; y++) { let n = 0; for (let i = 0; i < W; i++) { const k = (y * W + i) * 4; if (d[k + 3] > 200) { const [h, s, l] = rgbHSL(d[k], d[k + 1], d[k + 2]); if (h > 15 && h < 45 && s > 0.3 && l < 0.42) n++; } } if (n >= W * 0.12) last = y; }
    top = last + 1;
  }
  let x0 = W, x1 = 0, y0 = H, y1 = 0;
  for (let y = top; y < H; y++) for (let i = 0; i < W; i++) if (d[(y * W + i) * 4 + 3] > 40) { x0 = Math.min(x0, i); x1 = Math.max(x1, i); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  if (x1 <= x0) return GARM[key] = null;
  const o = document.createElement('canvas'); o.width = x1 - x0 + 1; o.height = y1 - y0 + 1; o.getContext('2d').drawImage(c, x0, y0, o.width, o.height, 0, 0, o.width, o.height);
  return GARM[key] = o;
}
// per-pet nudges for body clothes: dx, dy (in eye-spacings), width factor
const BODY_FIT = { dinosaur: { raincoat: [0.35, 1.5, 0.95] }, parrot: { raincoat: [0, 0.4, 0.95] }, trex: { raincoat: [0.15, 0.35, 1] }, dog: { raincoat: [0, 0.15, 1] } };
function tailor(lx, img, G, key) {
  const feet = G.oy + G.h - 3, chest = G.neckY + G.es * 0.1;
  const by = Math.round(chest + (feet - chest) * 0.45), bs = rowSpan(lx, by, G.ex) || rowSpan(lx, by, G.ox + G.w / 2) || [G.ex - G.es, G.ex + G.es];
  const f = (BODY_FIT[G.kind] || {})[key] || [0, 0, 1];
  let w = (bs[1] - bs[0]) * (key === 'raincoat' ? 1.12 : 1.04) * f[2], h = img.height * w / img.width;
  if (key === 'overalls' && h > (feet - chest) * 1.05) { h = (feet - chest) * 1.05; w = img.width * h / img.height; }
  const cx = (bs[0] + bs[1]) / 2 + f[0] * G.es;
  const top = (key === 'raincoat' ? G.neckY + G.es * 0.02 : feet - h + 2) + f[1] * G.es;
  lx.save(); lx.globalCompositeOperation = 'source-atop'; lx.imageSmoothingEnabled = true;
  lx.drawImage(img, Math.round(cx - w / 2), Math.round(top), Math.round(w), Math.round(h)); lx.restore();
}

function renderPet(pet, o = {}) {
  const kind = pet.kind, im = SPR['pet-' + kind];
  const c = document.createElement('canvas'); c.width = PET_CW; c.height = PET_CH;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!im) return c;
  const G = petGeom(kind);
  const get = k => (o[k] !== undefined ? o[k] : pet[k]);
  const skin = get('skin'), hat = get('hat'), eyes = get('eyes'), neck = get('neck'), back = get('back'), body = get('body');
  // the pet itself (own layer so skins only touch the pet)
  const L = document.createElement('canvas'); L.width = PET_CW; L.height = PET_CH;
  const lx = L.getContext('2d', { willReadFrequently: true }); lx.drawImage(im, G.ox, G.oy);
  // backpack sits behind the pet, peeking out beside its back
  if (back && SPR[WEAR[back]]) {
    const sp = rowSpan(lx, G.neckY + G.es * 0.5, G.ex) || [G.ex - G.es, G.ex + G.es], bw = G.es * 1.45;
    drawFit(ctx, SPR[WEAR[back]], sp[1] - bw * 0.12, G.neckY - G.es * 0.15, bw);
  }
  const ltd = skin === 'ltd' ? LTD[kind] : null;
  if (ltd) recolor(lx, PET_CW, PET_CH, kind, ltd.pal, ltd.pat);
  else if (skin && SKINS[skin]) recolor(lx, PET_CW, PET_CH, kind, SKINS[skin].pal);
  if (o.blink && PET_ANCHOR[kind] && PET_ANCHOR[kind].ex != null) {
    const half = kind === 'parrot' ? [0] : [-G.es / 2, G.es / 2];
    half.forEach(dx => {
      const x = G.ex + dx, r = G.er + 1.5, smp = lx.getImageData(Math.round(x), Math.round(G.ey + r + 3), 1, 1).data;
      lx.fillStyle = `rgb(${smp[0]},${smp[1]},${smp[2]})`; lx.beginPath(); lx.ellipse(x, G.ey, r + 1, r + 1.5, 0, 0, Math.PI * 2); lx.fill();
      lx.strokeStyle = '#1d1426'; lx.lineWidth = 3; lx.lineCap = 'round'; lx.beginPath(); lx.moveTo(x - r, G.ey); lx.quadraticCurveTo(x, G.ey + r * .9, x + r, G.ey); lx.stroke();
    });
  }
  // body clothes are tailored: each row is stretched to the pet's own width there, then clipped to its outline
  if (body && garment(body)) tailor(lx, garment(body), G, body);
  ctx.drawImage(L, 0, 0);
  // neck, glasses, hat on top
  if (neck === 'scarf' && SPR['wear-scarf']) drawFit(ctx, SPR['wear-scarf'], G.ex + G.es * 0.08, G.neckY - G.es * 0.42, G.es * 1.75);
  if (neck === 'bowtie' && SPR['wear-bow']) drawFit(ctx, SPR['wear-bow'], G.ex, G.neckY - G.es * 0.3, G.es * 0.95);
  if (eyes === 'round' && SPR['wear-glasses']) { const gw = G.es * 1.8; drawFit(ctx, SPR['wear-glasses'], G.ex, G.ey - gw * 56 / 139 / 2, gw); }
  if (eyes === 'shades' && shadesImg()) { const gw = G.es * 1.8; drawFit(ctx, shadesImg(), G.ex, G.ey - gw * 56 / 139 / 2, gw); }
  if (hat) {
    const bottom = G.ey - G.es * 0.42;
    if (WEAR[hat] && SPR[WEAR[hat]]) { const img = SPR[WEAR[hat]], wd = G.es * (hat === 'strawhat' ? 2.35 : 1.95); drawFit(ctx, img, G.ex + (hat === 'cap' ? -G.es * .12 : 0), bottom - img.height * wd / img.width, wd); }
    else { const ph = pixelHat(hat); if (ph) { const wd = G.es * 1.7; drawFit(ctx, ph, G.ex, bottom - ph.height * wd / ph.width + G.es * .12, wd, false); } }
  }
  // limited editions sparkle
  if (ltd) {
    ctx.fillStyle = '#fff6b0';
    for (let k = 0; k < 6; k++) {
      const x = G.ox + 10 + hash(k * 31 + kind.length) * (G.w - 20), y = G.oy + 10 + hash(k * 17 + 3) * (G.h - 30);
      if (lx.getImageData(Math.round(x), Math.round(y), 1, 1).data[3] < 100) continue;
      ctx.fillRect(x - 1, y - 5, 3, 11); ctx.fillRect(x - 5, y - 1, 11, 3);
    }
  }
  return c;
}

// ---- food & homes as images ----
function foodImgURL(k) {
  const im = SPR['food-' + k]; if (!im) return null;
  return im.src;
}
