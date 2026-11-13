// ================= ROOMS, HOMES & SHOP (Pet Town art set) =================
// Each pet has a room (wallpaper, floor, furniture it can drag around) and, in Pet Town, a house.
const ROOM_W = 768, ROOM_H = 512, WALL_Y = 300;
// set rooms have taller walls (room.wy); CUR_WY is the wall line of the room being worked on
let CUR_WY = WALL_Y; const useRoom = r => (CUR_WY = (r && r.wy) || WALL_Y);
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
  ['bone', 'Chew Bone', 'cosy', 0, 'floor', 34, 272, 482],
  ...CAT2_FURN,                                 // Interior Items Catalog (catalog2.js)
  ...CAT3_FURN,                                 // single catalog pieces (catalog3.js)
  ...SET_FURN                                   // room set pieces (sets2.js); their 9th field lists the sets they belong to
];
const FURN_PRICE_UP = 1.05;                     // all furniture 5% dearer than the listed price
FURN_LIST.forEach(f => { if (f[3]) f[3] = Math.round(f[3] * FURN_PRICE_UP); });
const FURN = {}; FURN_LIST.forEach(([k, name, group, price, place, size, x, y, set]) => { FURN[k] = { k, name, group, price, place, size, x, y, set }; });
const FURN_GROUPS = [['beds', 'Beds & seats'], ['tables', 'Tables & storage'], ['lights', 'Lights & walls'], ['rugs', 'Rugs & windows'], ['plants', 'Plants & play'], ['cosy', 'Cosy details']];
const WALLPAPERS = [['leafy', 'Leafy Cream', 0], ['cream', 'Cream', 12], ['sagestripe', 'Sage Stripe', 15], ['tinyblooms', 'Tiny Blooms', 15], ['forestleaves', 'Forest Leaves', 15], ['bluegingham', 'Blue Gingham', 15],
  ['peachdots', 'Peach Dots', 15], ['starrynight', 'Starry Night', 20], ['cloudsky', 'Cloud Sky', 20], ['pawprints', 'Paw Prints', 15], ['warmbrick', 'Warm Brick', 18], ['woodpanels', 'Wood Panels', 18], ['lavender', 'Lavender', 15]]
  .concat(SET_WALLS).map(([k, name, price]) => ({ k, name, price: Math.round(price * 1.05) }));   // +5% like furniture
const FLOORS = [['honeyoak', 'Honey Oak', 0], ['paleash', 'Pale Ash', 15], ['walnut', 'Walnut', 18], ['herringbone', 'Herringbone', 20], ['whitetile', 'White Tile', 15], ['bluetile', 'Blue Tile', 15],
  ['terracotta', 'Terracotta', 15], ['stone', 'Stone', 18], ['mossstone', 'Moss Stone', 20], ['cork', 'Cork', 12], ['pinkcheck', 'Pink Check', 15], ['woven', 'Woven Mat', 15]]
  .concat(SET_FLOORS).map(([k, name, price]) => ({ k, name, price: Math.round(price * 1.05) }));   // +5% like furniture
// Houses for Pet Town. Every house is made for one kind of animal.
// A pet can also live in another animal's house: that costs a one-time unlock fee (5-10% of the price, more for fancier houses),
// after which any of your pets can use that house.
// id, made for, name, price (the 13 first houses use the animal's name as their id)
const HOUSE_LIST = [
  ['dragon', 'dragon', 'Dragon Castle', 495], ['ember', 'dragon', 'Ember Spire', 720], ['crystal', 'dragon', 'Crystal Overlook', 675], ['cloudkeep', 'dragon', 'Cloud Keep', 585],
  ['dinosaur', 'dinosaur', 'Fossil Jungle Hut', 480], ['fern', 'dinosaur', 'Fern Greenhouse', 615], ['orchard', 'dinosaur', 'High Branch Orchard', 675], ['canopy', 'dinosaur', 'Tall Canopy Lodge', 645],
  ['trex', 'trex', 'Dino Lodge', 540], ['eggshell', 'trex', 'Eggshell Nursery', 660], ['diner', 'trex', 'Tiny Arms Diner', 630], ['footprint', 'trex', 'Footprint Fort', 600],
  ['snake', 'snake', 'Swirl House', 510], ['spiral', 'snake', 'Spiral Tower', 645], ['desertden', 'snake', 'Desert Rock Den', 570], ['silk', 'snake', 'Shed Silk Pavilion', 660],
  ['turtle', 'turtle', 'Shell Pond House', 540], ['beacon', 'turtle', 'Tidal Beacon Cottage', 645], ['mosaic', 'turtle', 'Mosaic Shell House', 585], ['teahouse', 'turtle', 'Slow Trail Teahouse', 660],
  ['pig', 'pig', 'Piggy Barn', 450], ['mudpark', 'pig', 'Mud Splash Park', 660], ['truffle', 'pig', 'Truffle Underground', 540], ['windmill', 'pig', 'Snout Windmill Barn', 600],
  ['monkey', 'monkey', 'Big Treehouse', 570], ['banana', 'monkey', 'Banana Bungalow', 540], ['vinegym', 'monkey', 'Vine Gym House', 660], ['drum', 'monkey', 'Jungle Drum House', 630],
  ['dog', 'dog', 'Bone Cottage', 450], ['fetchball', 'dog', 'Fetch Ball House', 555], ['snifftrail', 'dog', 'Sniff Trail House', 600], ['wagon', 'dog', 'Rescue Wagon House', 690],
  ['cat', 'cat', 'Kitty Townhouse', 510], ['sunbeam', 'cat', 'Sunbeam Window Pod', 660], ['yarn', 'cat', 'Yarn Ball Cottage', 555], ['pounce', 'cat', 'Pounce Loft', 600],
  ['rabbit', 'rabbit', 'Bunny Burrow', 450], ['clover', 'rabbit', 'Clover Burrow', 555], ['carrot', 'rabbit', 'Carrot House', 495], ['bunnyhop', 'rabbit', 'Bunny Hop House', 585],
  ['rat', 'rat', 'Acorn House', 480], ['seedsilo', 'rat', 'Seed Silo', 570], ['wheelshop', 'rat', 'Wheel Workshop', 645], ['tunnel', 'rat', 'Tunnel Home', 690],
  ['parrot', 'parrot', 'Tiki Hut', 480], ['feather', 'parrot', 'Rainbow Feather House', 645], ['beakbay', 'parrot', 'Beak Bay House', 555], ['echo', 'parrot', 'Echo House', 600],
  ['owl', 'owl', 'Moon Tower', 480], ['moonlib', 'owl', 'Moon Library', 555], ['hollowoak', 'owl', 'Hollow Oak House', 615], ['observatory', 'owl', 'Silent Flight Observatory', 720],
  ['frog', 'frog', 'Reed Hop House', 465], ['stonehop', 'frog', 'Stone Hop Arch', 555], ['raindrop', 'frog', 'Raindrop Glasshouse', 645], ['pondchorus', 'frog', 'Pond Chorus House', 690],
  ['octopus', 'octopus', 'Tide Rock Nook', 465], ['inkbottle', 'octopus', 'Ink Bottle House', 585], ['coralcurl', 'octopus', 'Coral Curl House', 615], ['tideglass', 'octopus', 'Tide Glass Studio', 690],
  ['capybara', 'capybara', 'Moonlight House', 495], ['orangecottage', 'capybara', 'Orange Cottage', 585], ['hotspring', 'capybara', 'Hot Spring Cabin', 645], ['lotuslodge', 'capybara', 'Lotus Lodge', 690],
];
const HOUSES = Object.fromEntries(HOUSE_LIST.map(([k, kind, name, price]) => [k, { k, kind, name, price, fee: Math.round(price * Math.min(0.10, Math.max(0.05, 0.05 + 0.05 * (price / 3 - 150) / 90))) }]));
const ownsH = k => !!S.owned['h-' + k];
const unlockedH = k => !!S.owned['hu-' + k];
const canLive = (pet, k) => !!pet && !!HOUSES[k] && (HOUSES[k].kind === pet.kind || unlockedH(k));
const houseKindName = k => (PETS[k] || {}).name || k;
// Fourteen room sets (sets2.js): a wall+floor background plus pieces that can each be moved, put away and put back.
const ROOM_SETS = SET_ROOMS;
const LEGACY_DECOR = { ball: 'blocks', plant: 'monstera', poster: 'pawframe', rug: 'wovenrug', lamp: 'floorlamp', lights: 'bunting', shelf: 'bookshelf', tank: 'fishtank' };
// old shelter/decor shop items are replaced by this set
SHOP.forEach(i => { if (i.cat === 'shelter' || i.cat === 'decor') i.legacy = 1; });
// Party Hat and Wizard Hat have no picture of their own yet: out of the shop; anyone who bought one gets the coins back
const RETIRED = [];   // Party Hat and Wizard Hat are back (Nov 2026): every pet has a drawn picture wearing them
SHOP.forEach(i => { if (RETIRED.includes(i.id)) i.legacy = 1; });

const ownsF = k => { const F = FURN[k]; return F.set ? F.set.some(s => !!S.owned['set-' + s]) : (!F.price || !!S.owned['f-' + k]); };   // set pieces come with their set
const ownsW = k => { const w = WALLPAPERS.find(x => x.k === k); return !!w && (!w.price || !!S.owned['w-' + k]); };
const ownsFl = k => { const f = FLOORS.find(x => x.k === k); return !!f && (!f.price || !!S.owned['fl-' + k]); };
function defaultRoom() { return { wall: 'leafy', floor: 'honeyoak', items: [{ k: 'plainwin', x: 300, y: 244 }, { k: 'boxbed', x: 150, y: 456 }, { k: 'waterbowl', x: 92, y: 494 }, { k: 'bone', x: 272, y: 482 }] }; }
// called from migrate() for every pet
function migrateRoom(p, f) {
  // a pet that already had a house (old shop, or the one-house-per-kind version) keeps it
  const hadHouse = (p.shelter && p.shelter !== 'box') || p.home;
  if (hadHouse && !p.house) { f.owned['h-' + p.kind] = 1; p.house = p.kind; }
  if (p.house && !HOUSES[p.house]) p.house = null;
  if (p.house && HOUSES[p.house].kind !== p.kind) f.owned['hu-' + p.house] = 1;   // already living in another animal's house: keeps it, no fee
  p.shelter = 'box'; delete p.home;
  RETIRED.forEach(id => { const it = SHOP.find(i => i.id === id); if (!it) return; if (f.owned[id]) { f.coins = (f.coins || 0) + it.price; delete f.owned[id]; } if (p[it.slot] === it.key) p[it.slot] = null; });
  if (p.room) {                                            // sets are whole rooms now; drop pieces that no longer exist
    if (p.room.set) { p.room.scene = p.room.set; delete p.room.set; p.room.items = p.room.items.filter(i => !i.lock); }
    p.room.items = (p.room.items || []).filter(i => FURN[i.k]);
    if (p.room.scene && !SET_ROOMS.some(s => s.k === p.room.scene)) delete p.room.scene;
    const st = p.room.scene && SET_ROOMS.find(s => s.k === p.room.scene);
    if (st && (p.room.sp !== 2 || (st.k === 'library' && p.room.lv !== 1))) {   // (the Library also gained a second bookcase)                          // set rooms got taller walls and real-size furniture (Nov 2026): lay the set out again, keep the extras
      p.room.items = setItems(st).concat(p.room.items.filter(i => !FURN[i.k].set && FURN[i.k].place !== 'wall' && FURN[i.k].place !== 'rug' && !BED_KEYS.includes(i.k)));
      p.room.sp = 2; p.room.lv = 1; p.room.wy = st.wy || 380; useRoom(p.room); p.room.items.forEach(i => { if (!FURN[i.k].set) clampItem(i); }); useRoom(null);
    }
  }
  if (p.room && !p.room.fit1) {                               // Nov 2026: rugs flatter and nothing past the room's edges
    useRoom(p.room); p.room.items.forEach(i => { if (FURN[i.k] && !i.on) clampItem(i); }); useRoom(null); p.room.fit1 = 1;
  }
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
  if (F.place === 'rug') {                                    // flatter on a set room's shallow floor; never deeper than the floor
    let w = F.size, h = w * ih / iw * (CUR_WY > WALL_Y ? 0.6 : 0.82); const cap = ROOM_H - CUR_WY - 16;
    if (h > cap) { w *= cap / h; h = cap; } return { w, h };
  }
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
  it.x = Math.round(Math.max(w / 2 + 2, Math.min(ROOM_W - w / 2 - 2, it.x)));     // whole piece stays inside the room
  if (it.on) return;                                         // sitting on another piece: its y comes from that piece
  if (F.place === 'wall') it.y = Math.round(Math.max(h + 14, Math.min(CUR_WY - 6, it.y)));
  else if (F.place === 'floor') it.y = Math.round(Math.max(CUR_WY + 26, Math.min(ROOM_H - 4, it.y)));
  else if (F.place === 'rug') it.y = Math.round(Math.max(Math.min(CUR_WY + 8 + h / 2, ROOM_H - h / 2 - 4), Math.min(ROOM_H - h / 2 - 4, it.y)));
  else it.y = 0;
}
// ---- stacking: small things can sit on tables, beds, shelves and window sills ----
const STACKABLE_EXTRA = ['tinychest', 'rollbasket', 'bowls', 'gearstand'];
const isStackable = k => { const F = FURN[k]; return !!F && F.place === 'floor' && (STACKABLE_EXTRA.includes(k) || (F.size <= 90 && F.group !== 'beds' && F.group !== 'tables')); };
const SURF_CACHE = {};
// where things can sit on a piece, as a fraction of its height from the top (null = not a surface)
function surfaceFrac(k) {
  if (k in SURF_CACHE) return SURF_CACHE[k];
  const F = FURN[k]; let f = null;
  const win = /win$|window|porthole/i.test(k + ' ' + F.name);
  const host = !isStackable(k) && F.place !== 'rug' && F.place !== 'ceil' && (win || F.group === 'tables' || F.group === 'beds' || ['fireplace', 'toychest', 'woodstove'].includes(k));
  const d = host && hitData(k);
  if (d) {
    const W = d.width, H = d.height, rowFill = y => { let n = 0; for (let x = 0; x < W; x++) if (d.data[(y * W + x) * 4 + 3] > 120) n++; return n / W; };
    if (win) { let y = H - 1; while (y > 0 && rowFill(y) < 0.5) y--; f = Math.max(0.6, (y - H * 0.03) / H); }
    else { const need = F.group === 'beds' ? 0.72 : 0.6; for (let y = F.group === 'beds' ? Math.floor(H * 0.4) : 0; y < H; y++) if (rowFill(y) >= need) { f = Math.min(0.75, Math.max(0.03, (y + H * 0.04) / H)); break; } }
  }
  return SURF_CACHE[k] = f;
}
function surfaceY(it) { const f = surfaceFrac(it.k); if (f == null) return null; const r = itemRect(it); return r.y0 + r.h * f; }
// snap a small thing onto the piece under it, or let it drop to the floor
function snapStack(room, it) {
  useRoom(room);
  if (!isStackable(it.k)) { delete it.on; return; }
  let best = null, bd = 46;
  room.items.forEach(h => {
    if (h === it || h.on) return; const s = surfaceY(h); if (s == null) return;
    const r = itemRect(h), m = r.w * 0.08; if (it.x < r.x0 + m || it.x > r.x1 - m) return;
    const dd = Math.abs(it.y - s); if (dd < bd) { bd = dd; best = { h, s }; }
  });
  if (best) { it.on = best.h.k; it.y = Math.round(best.s); } else { delete it.on; clampItem(it); }
}
const ridersOf = (room, k) => room.items.filter(i => i.on === k);
function dropRiders(room, k) { useRoom(room); ridersOf(room, k).forEach(r => { delete r.on; clampItem(r); }); }
function itemZ(room, it, r) { if (FURN[it.k].place === 'ceil') return WALL_Y;   // hanging lamps in front of things on the wall
  const h = it.on && room.items.find(x => x.k === it.on); return h ? itemRect(h).y1 + 0.5 : (r || itemRect(it)).y1; }

// only one bed and one rug at a time: a new one takes the old one's place (box -> basket -> bed)
const BED_KEYS = ['boxbed', 'basket', 'cushion', 'beanbag', 'hammock', 'bed'];
const swapGroup = k => BED_KEYS.includes(k) ? BED_KEYS : FURN[k].place === 'rug' ? FURN_LIST.filter(f => f[4] === 'rug').map(f => f[0]) : null;
function placeItem(room, k) {
  useRoom(room); const F = FURN[k]; if (room.items.some(i => i.k === k)) return room.items.findIndex(i => i.k === k);
  const grp = swapGroup(k), old = grp && room.items.find(i => grp.includes(i.k) && i.k !== k);
  if (old) { room.items = room.items.filter(i => i !== old); const it = { k, x: old.x, y: F.place === 'rug' ? old.y : F.y, f: old.f }; clampItem(it); room.items.push(it); return room.items.length - 1; }
  const { w } = itemSize(k), same = room.items.filter(i => FURN[i.k].place === F.place);
  let best = F.x;
  for (const dx of [0, 90, -90, 180, -180, 270, -270, 360]) {
    const x = F.x + dx; if (x < w / 2 - 20 || x > ROOM_W - w / 2 + 20) continue;
    if (!same.some(i => Math.abs(i.x - x) < (itemSize(i.k).w + w) * 0.4 && Math.abs(i.y - F.y) < 90)) { best = x; break; }
  }
  const it = { k, x: best, y: F.y }; clampItem(it); room.items.push(it); if (isStackable(k) && F.set) { it.y = F.y; snapStack(room, it); } return room.items.length - 1;
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
function roomBg(wall, floor, WALL_Y = 300) {
  const id = wall + '|' + floor + '|' + WALL_Y; if (BGC[id]) return BGC[id];
  const c = document.createElement('canvas'); c.width = ROOM_W; c.height = ROOM_H; const x = c.getContext('2d');
  const wt = tileCanvas('wall-' + wall, wall === 'leafy' ? 0.9 : 1.15), ft = tileCanvas('floor-' + floor, 1.05);
  x.fillStyle = wt ? x.createPattern(wt, 'repeat') : '#f6e7c8'; x.fillRect(0, 0, ROOM_W, WALL_Y);
  if (wt) {                                              // soften the wallpaper pattern: wash it with its own average colour
    const a = document.createElement('canvas'); a.width = a.height = 1; const ax = a.getContext('2d'); ax.drawImage(wt, 0, 0, 1, 1);
    const [r, g, b] = ax.getImageData(0, 0, 1, 1).data; x.fillStyle = `rgba(${r},${g},${b},${wall === 'leafy' ? 0.15 : 0.3})`; x.fillRect(0, 0, ROOM_W, WALL_Y);
    x.fillStyle = `rgba(255,255,255,${wall === 'leafy' ? 0.02 : 0.05})`; x.fillRect(0, 0, ROOM_W, WALL_Y);
  }
  if (ft) {                                              // floors: softer too
    const a = document.createElement('canvas'); a.width = a.height = 1; const ax = a.getContext('2d'); ax.drawImage(ft, 0, 0, 1, 1);
    const [r, g, b] = ax.getImageData(0, 0, 1, 1).data; x.fillStyle = `rgba(${r},${g},${b},${floor === 'honeyoak' ? 0.2 : 0.7})`; x.fillRect(0, WALL_Y, ROOM_W, ROOM_H - WALL_Y);
    x.fillStyle = `rgba(255,255,255,${floor === 'honeyoak' ? 0.03 : 0.2})`; x.fillRect(0, WALL_Y, ROOM_W, ROOM_H - WALL_Y);
  }
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
function roam(id, dt, still, floorY = 420) {
  let r = ROAM[id]; if (!r) r = ROAM[id] = { x: 430, y: 470, tx: 430, ty: 470, dir: -1, wait: 2 };
  const fy = Math.min(470, Math.max(400, floorY + 60)); if (r.y < fy - 5) { r.y = r.ty = fy + 20; }
  if (still || reduceMotion) return r;
  const dx = r.tx - r.x, dy = r.ty - r.y, d = Math.hypot(dx, dy);
  if (d > 1) { const st = Math.min(d, 46 * dt); r.x += dx / d * st; r.y += dy / d * st; if (Math.abs(dx) > 1) r.dir = dx < 0 ? -1 : 1; r.moving = true; }
  else { r.moving = false; r.wait -= dt; if (r.wait <= 0) { r.tx = 250 + Math.random() * 330; r.ty = fy + Math.random() * (500 - fy); r.wait = 3 + Math.random() * 5; } }
  return r;
}
let roomLast = {};
// starry wallpapers: find the stars painted on the wall once, then let some of them sparkle
const STARRY_WALLS = ['midnight', 'starry', 'starrynight'], STARS = {};
function starsOf(key, img, wy) {
  if (STARS[key]) return STARS[key];
  if (img.complete === false || !(img.width || img.naturalWidth)) return [];
  const cv = document.createElement('canvas'); cv.width = ROOM_W; cv.height = ROOM_H; const x = cv.getContext('2d', { willReadFrequently: true });
  x.drawImage(img, 0, 0, ROOM_W, ROOM_H); const d = x.getImageData(0, 0, ROOM_W, ROOM_H).data, cell = 22, out = [];
  let sum = 0, n = 0; for (let y = 30; y < wy - 20; y += 7) for (let xx = 8; xx < ROOM_W - 8; xx += 7) { const i = (y * ROOM_W + xx) * 4; sum += (d[i] + d[i + 1]) / 2 - d[i + 2] * 0.35; n++; } const base = sum / n;
  for (let gy = 30; gy < wy - 20; gy += cell) for (let gx = 8; gx < ROOM_W - 8; gx += cell) {
    let best = 0, bx = 0, by = 0;
    for (let y = gy; y < Math.min(gy + cell, wy - 20); y++) for (let xx = gx; xx < Math.min(gx + cell, ROOM_W - 8); xx++) {
      const i = (y * ROOM_W + xx) * 4, r = d[i], g = d[i + 1], b = d[i + 2], sc = (r + g) / 2 - b * 0.35;   // bright and warm: a painted star
      if (sc > best) { best = sc; bx = xx; by = y; }
    }
    if (best > base + 45) out.push({ x: bx, y: by, s: best });
  }
  out.sort((a, b) => b.s - a.s);
  return STARS[key] = out.slice(0, 46).map((p, i) => ({ x: p.x, y: p.y, ph: hash(i * 13 + 7) * 6.28, sp: 0.9 + hash(i * 5 + 1) * 1.1, r: 5 + hash(i * 3 + 2) * 5 }));
}
function twinkle(c, t, stars) {
  if (reduceMotion) return;
  c.save(); c.lineCap = 'round';
  for (const p of stars) {
    const a = Math.pow(Math.max(0, Math.sin(t / 700 * p.sp + p.ph)), 3); if (a < 0.03) continue;
    const r = p.r * (0.9 + a * 0.7);
    c.globalAlpha = a * 0.7; c.fillStyle = '#fff6c8'; c.beginPath(); c.arc(p.x, p.y, r * 0.55, 0, Math.PI * 2); c.fill();
    c.globalAlpha = a; c.strokeStyle = '#ffffff'; c.lineWidth = 2.2;
    c.beginPath(); c.moveTo(p.x - r, p.y); c.lineTo(p.x + r, p.y); c.moveTo(p.x, p.y - r); c.lineTo(p.x, p.y + r); c.stroke();
    c.lineWidth = 1; c.beginPath(); c.moveTo(p.x - r * 0.45, p.y - r * 0.45); c.lineTo(p.x + r * 0.45, p.y + r * 0.45); c.moveTo(p.x + r * 0.45, p.y - r * 0.45); c.lineTo(p.x - r * 0.45, p.y + r * 0.45); c.stroke();
  }
  c.restore();
}
function drawRoom(c, t, pet, o = {}) {
  const id = o.id || 'home', dt = roomLast[id] ? Math.min(0.25, (t - roomLast[id]) / 1000) : 0; roomLast[id] = t;
  c.setTransform(c.canvas.width / ROOM_W, 0, 0, c.canvas.height / ROOM_H, 0, 0);
  c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high';
  const room = (pet && pet.room) || defaultRoom(), sceneSet = room.scene && ROOM_SETS.find(s => s.k === room.scene); useRoom(room);
  const bgImg = sceneSet && SPR['theme-' + room.scene] ? SPR['theme-' + room.scene] : roomBg(room.wall, room.floor, CUR_WY);
  c.drawImage(bgImg, 0, 0, ROOM_W, ROOM_H);
  if (STARRY_WALLS.includes(sceneSet ? room.scene : room.wall)) twinkle(c, t, starsOf((sceneSet ? 'set-' + room.scene : room.wall) + '|' + CUR_WY, bgImg, CUR_WY));
  // sunlight from windows
  room.items.forEach(it => {
    if (sceneSet || !/win$/.test(it.k)) return; const r = itemRect(it);
    c.save(); c.globalAlpha = 0.12; c.fillStyle = '#fff3c4'; c.beginPath();
    c.moveTo(r.x0 + r.w * 0.2, CUR_WY + 4); c.lineTo(r.x1 - r.w * 0.2, CUR_WY + 4); c.lineTo(r.x1 + 40, ROOM_H); c.lineTo(r.x0 + 20, ROOM_H); c.closePath(); c.fill(); c.restore();
  });
  const list = room.items.map((it, i) => ({ it, i, r: itemRect(it) }));
  list.filter(e => FURN[e.it.k].place === 'rug').forEach(e => drawItem(c, e, o));
  const pr = pet ? roam(id, dt, o.still, room.wy || (sceneSet ? sceneSet.floorY : 420)) : null;
  const rest = list.filter(e => FURN[e.it.k].place !== 'rug').map(e => ({ ...e, z: itemZ(room, e.it, e.r) }));
  if (pr) rest.push({ pet: true, z: pr.y });
  rest.sort((a, b) => a.z - b.z).forEach(e => {
    if (!e.pet) return drawItem(c, e, o);
    const PH = 152, PW = PH * PET_CW / PET_CH;
    let y = pr.y - PH + 6 - (pr.moving ? (Math.floor(t / 140) % 2) * 3 : (reduceMotion ? 0 : Math.floor(t / 520) % 2));
    if (t < hopUntil) y -= Math.round(Math.abs(Math.sin((hopUntil - t) / 110)) * 14);
    c.save(); c.globalAlpha = 0.22; c.fillStyle = '#2a1d33'; c.beginPath(); c.ellipse(pr.x, pr.y + 2, 36, 8, 0, 0, Math.PI * 2); c.fill(); c.restore();
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
  if (F.place === 'floor' && !e.it.on) { c.save(); c.globalAlpha = 0.18; c.fillStyle = '#2a1d33'; c.beginPath(); c.ellipse(e.it.x, r.y1 - 2, r.w * 0.42, Math.max(5, r.w * 0.06), 0, 0, Math.PI * 2); c.fill(); c.restore(); }
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
  const order = room.items.map((it, i) => ({ it, i, r: itemRect(it), rug: FURN[it.k].place === 'rug' })).map(e => ({ ...e, z: itemZ(room, e.it, e.r) }))
    .sort((a, b) => (a.rug - b.rug) || (b.z - a.z));
  for (const e of order) {
    const r = e.r; if (e.it.lock || px < r.x0 || px > r.x1 || py < r.y0 || py > r.y1) continue;
    const d = hitData(e.it.k); if (!d) return e.i;
    let u = (px - r.x0) / r.w; if (e.it.f) u = 1 - u;
    const ix = Math.min(d.width - 1, Math.floor(u * d.width)), iy = Math.min(d.height - 1, Math.floor((py - r.y0) / r.h * d.height));
    if (d.data[(iy * d.width + ix) * 4 + 3] > 40) return e.i;
  }
  return -1;
}

// ---- selling back (40% of the price) ----
const RESELL = 0.4;
const sellPrice = p => Math.max(1, Math.floor(p * RESELL));
function armSell(b) {                                       // first tap asks, second tap sells
  if (b.dataset.armed) return true;
  b.dataset.armed = 1; const t = b.innerHTML; b.innerHTML = 'Tap again to sell'; b.classList.add('armed');
  setTimeout(() => { if (b.isConnected) { delete b.dataset.armed; b.innerHTML = t; b.classList.remove('armed'); } }, 3000);
  return false;
}
function sellThing(code) {
  const i = code.indexOf(':'), kind = code.slice(0, i), k = code.slice(i + 1); let name = '', price = 0;
  if (kind === 'f') {
    if (!FURN[k] || !ownsF(k) || !FURN[k].price) return; name = FURN[k].name; price = FURN[k].price;
    delete S.owned['f-' + k]; S.pets.forEach(p => { if (!p.room) return; dropRiders(p.room, k); p.room.items = p.room.items.filter(x => x.k !== k); });
  } else if (kind === 'w' || kind === 'fl') {
    const list = kind === 'w' ? WALLPAPERS : FLOORS, x = list.find(y => y.k === k); if (!x || !x.price || !S.owned[kind + '-' + k]) return;
    name = x.name; price = x.price; delete S.owned[kind + '-' + k];
    S.pets.forEach(p => { if (!p.room) return; if (kind === 'w' && p.room.wall === k) p.room.wall = 'leafy'; if (kind === 'fl' && p.room.floor === k) p.room.floor = 'honeyoak'; });
  } else if (kind === 'h') {
    const H = HOUSES[k]; if (!H || !ownsH(k)) return; name = H.name; price = S.owned['h-' + k] === 1 ? Math.round(H.price / 3) : H.price;
    delete S.owned['h-' + k]; delete S.owned['hu-' + k]; S.pets.forEach(p => { if (p.house === k) p.house = null; });
  } else if (kind === 'i') {
    const it = SHOP.find(x => x.id === k); if (!it || it.cat === 'food' || !S.owned[k]) return; name = it.name; price = it.price;
    delete S.owned[k]; S.pets.forEach(p => { if (it.cat === 'skins' && p.skin === it.key) p.skin = null; if (it.cat === 'clothes' && p[it.slot] === it.key) p[it.slot] = null; });
  } else return;
  const got = sellPrice(price); S.coins += got; save(); SFX.coin(); renderHud(); toast(`Sold ${name} for $${got}.`);
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
function setPrice(set) { return S.owned['set-' + set.k] ? 0 : Math.round(set.price * FURN_PRICE_UP); }
const setItems = set => set.items.map(i => ({ ...i }));
function fixRiders(room) { useRoom(room); room.items.forEach(i => { if (i.on && !room.items.some(h => h.k === i.on)) { delete i.on; clampItem(i); } }); }
function applySet(set, pet, own = true) {
  if (own) S.owned['set-' + set.k] = 1;
  const keep = (pet.room && pet.room.items || []).filter(i => !i.lock && FURN[i.k] && !FURN[i.k].set && FURN[i.k].place !== 'rug' && !BED_KEYS.includes(i.k) && FURN[i.k].place !== 'wall' && FURN[i.k].size <= 90);
  pet.room = { wall: set.wall, floor: set.floor, scene: set.k, sp: 2, lv: 1, wy: set.wy || 380, items: setItems(set).concat(keep) };
  fixRiders(pet.room); pet.room.items.forEach(i => { if (!i.on) clampItem(i); }); useRoom(null);
}
const roomSet = room => room && (room.scene || room.set) ? ROOM_SETS.find(s => s.k === (room.scene || room.set)) : null;
function takeSetOff(room) { const r = defaultRoom(); room.wall = r.wall; room.floor = r.floor; delete room.scene; delete room.set; delete room.wy; useRoom(room); room.items = room.items.filter(i => !i.lock && !FURN[i.k].set); room.items = room.items.concat(r.items.filter(d => !room.items.some(i => i.k === d.k))); fixRiders(room); }

// ================= SHOP =================
let shopTab = 'homes', shopPet = 0, shopHouseKind = null;
const SHOP_TABS = [['homes', 'Homes'], ['room', 'Room & Furniture'], ['clothes', 'Clothes'], ['costumes', 'Costumes'], ['skins', 'Skins'], ['food', 'Food']];
const ROOM_TABS = { room: null, furniture: 'beds', decor: 'lights', walls: 'walls', sets: 'sets' };   // these open the room shop (Decorate) to try things in the room
// costume sets are sold and worn as a whole
if (typeof COSTUMES !== 'undefined') SHOP.push(...Object.entries(COSTUMES).map(([k, c]) => ({ id: 'cos-' + k, cat: 'costumes', key: k, name: c.name, price: c.price, slot: 'costume' })));
const imgSrc = k => SPR[k] ? SPR[k].src : '';
function priceBtn(data, price, owned, label, sell) {
  if (owned) return `<span class="ownedtag">${icon('check')} ${label || 'Owned'}</span>${sell && price ? `<button class="btn small sellbtn" data-sell="${sell}">Sell $${sellPrice(price)}</button>` : ''}`;
  const can = S.coins >= price;
  return `<button class="btn buy ${can ? 'go' : 'off'}" ${data} ${can ? '' : 'aria-disabled="true"'}>${icon('coin', 'coin')} $${price}</button>`;
}
function itemPreview(it, forPet) {
  let pet = forPet || S.pets[S.active] || { kind: 'cat' };
  if (it.petKind && pet.kind !== it.petKind) pet = S.pets.find(p => p.kind === it.petKind) || { kind: it.petKind };
  if (it.cat === 'costumes') return `<img class="prev wear cosset" src="${imgSrc('cosset-' + it.key)}" alt=""><img class="pxi prev pet onpet" src="${petURL(pet, { costume: it.key, look: null, hat: null, eyes: null, neck: null, back: null, body: null })}" alt="">`;
  if (it.cat === 'skins') return `<img class="pxi prev pet" src="${petURL(pet, { skin: it.key, hat: null, eyes: null, neck: null, back: null, body: null, costume: null, look: null })}" alt="">`;
  if (it.cat === 'clothes') {
    const bare = { hat: null, eyes: null, neck: null, back: null, body: null, look: null, costume: null, [it.slot]: it.key };
    const wear = WEAR[it.key] && SPR[WEAR[it.key]];
    return `${wear ? `<img class="prev wear" src="${wear.src}" alt="">` : ''}<img class="pxi prev pet ${wear ? 'onpet' : ''}" src="${petURL(pet, bare)}" alt="">`;
  }
  return `<img class="pxi prev food" src="${foodURL(it.key)}" alt="">`;
}
function furnCards(groups) {
  return groups.map(([g, label]) => `<h2 class="shophead">${label}</h2><div class="shopgrid">${FURN_LIST.filter(f => f[2] === g && f[3] > 0 && !f[8]).map(([k, name, , price]) =>
    `<div class="card ${ownsF(k) ? 'owned' : ''}"><div class="prevbox"><img class="prev furn" src="${imgSrc('it-' + k)}" alt=""></div><b>${esc(name)}</b>${priceBtn(`data-buy="f:${k}"`, price, ownsF(k), '', 'f:' + k)}</div>`).join('')}</div>`).join('');
}
function swatchCards(list, kind) {
  return `<div class="shopgrid">${list.filter(x => x.price > 0).map(x => { const own = kind === 'w' ? ownsW(x.k) : ownsFl(x.k);
    return `<div class="card ${own ? 'owned' : ''}"><div class="prevbox swatch" style="background-image:url(${imgSrc((kind === 'w' ? 'wall-' : 'floor-') + x.k)})"></div><b>${esc(x.name)}</b>${priceBtn(`data-buy="${kind}:${x.k}"`, x.price, own, '', kind + ':' + x.k)}</div>`; }).join('')}</div>`;
}
// ---- the dressing room: clothes, costumes and skins are tried on the chosen pet before buying ----
let TRY = null;                                             // id of the shop item being tried on
const WEARS = ['clothes', 'costumes', 'skins'];
function tryLook(pet, it) {                                  // what the pet looks like wearing it
  if (!it) return {};
  if (it.cat === 'skins') return { skin: it.key };
  if (it.cat === 'costumes') return { costume: it.key, look: null };
  return it.slot === 'look' ? { look: it.key, costume: null } : { [it.slot]: it.key, costume: null, look: null };
}
const wearing = (pet, it) => it.cat === 'skins' ? pet.skin === it.key : it.cat === 'costumes' ? pet.costume === it.key : it.slot === 'look' ? pet.look === it.key && !pet.costume : pet[it.slot] === it.key && !pet.costume && !pet.look;
function dressingRoom(pet) {
  const it = TRY && SHOP.find(i => i.id === TRY);
  const can = it && S.coins >= it.price;
  return `<div class="tryroom"><div class="trystage"><img class="pxi trypet" src="${petURL(pet, tryLook(pet, it))}" alt=""></div><div class="tryinfo">
    ${it ? `<span class="trytag">Trying on</span><h3>${esc(it.name)}</h3><p class="muted small">on ${esc(pet.name)}${it.cat === 'costumes' ? ' · a whole set, worn all together' : ''}</p>
      <div class="row"><button class="btn ${can ? 'go' : 'off'}" id="tryBuyC">${can ? `${icon('coin', 'coin')} Buy $${it.price}` : `Need $${money(it.price - S.coins)} more`}</button><button class="btn" id="tryOffC">Take it off</button></div>`
    : `<h3>${esc(pet.name)}'s dressing room</h3><p class="muted small">Tap anything below to try it on ${esc(pet.name)}. Nothing is bought until you tap Buy and confirm.</p>`}</div></div>`;
}
function renderShop() {
  if (shopTab in ROOM_TABS) { const t = ROOM_TABS[shopTab]; if (t) DECO.tab = t; shopTab = 'homes'; openDeco(Math.min(shopPet, S.pets.length - 1) >= 0 ? shopPet : S.active, 'shop'); return; }
  if (!WEARS.includes(shopTab)) TRY = null;
  $('#shopTabs').innerHTML = SHOP_TABS.map(([k, n]) => `<button class="tab ${k === shopTab ? 'sel' : ''}" data-t="${k}" aria-pressed="${k === shopTab}">${n}</button>`).join('');
  $('#shopWallet').innerHTML = `You have ${coinAmt(S.coins)}`;
  if (shopPet >= S.pets.length) shopPet = S.active;
  const perPet = shopTab === 'sets' || shopTab === 'homes' || WEARS.includes(shopTab);
  $('#shopFor').hidden = !perPet || !S.pets.length;
  $('#shopFor').innerHTML = `<span>${shopTab === 'homes' ? 'Moving in' : WEARS.includes(shopTab) ? 'Dressing' : 'For the room of'}</span>` + S.pets.map((p, i) => `<button class="petthumb mini ${i === shopPet ? 'sel' : ''}" data-shoppet="${i}" aria-pressed="${i === shopPet}"><img class="pxi" src="${petURL(p)}" alt=""><span>${esc(p.name)}</span></button>`).join('');
  const me = S.pets[S.active];
  const note = t => `<p class="muted shopnote">${t}</p>`;
  let h = '';
  if (shopTab === 'homes') {
    const tp = S.pets[shopPet] || S.pets[0];
    if (!tp) h = note('Hatch a pet first, then build it a house.');
    else {
      if (!shopHouseKind || shopHouseKind === tp.kind) shopHouseKind = PET_ORDER.find(k => k !== tp.kind && HOUSE_LIST.some(h => h[1] === k));
      const card = k => {
        const H = HOUSES[k], own = ownsH(k), here = tp.house === k, other = H.kind !== tp.kind, ok = canLive(tp, k);
        const who = S.pets.filter(p => p.house === k).map(p => p.name), total = H.price + (other ? H.fee : 0);
        const btn = here ? `<span class="ownedtag">${icon('check')} ${esc(tp.name)} lives here</span>`
          : own && ok ? `<button class="btn buy go" data-buy="hm:${k}">Move ${esc(tp.name)} in</button>`
          : own ? `<button class="btn buy ${S.coins >= H.fee ? 'go' : 'off'}" data-buy="hu:${k}">${icon('coin', 'coin')} Unlock $${H.fee}</button>`
          : priceBtn(`data-buy="h:${k}"`, total, false);
        const sub = who.length ? 'Home of ' + esc(who.join(', ')) : own ? (ok ? 'Yours, empty' : `Yours \u00b7 unlock for ${esc(tp.name)}`) : other ? `$${H.price} + $${H.fee} unlock fee` : '&nbsp;';
        return `<div class="card house ${own ? 'owned' : ''}"><div class="prevbox tall"><img class="prev house" src="${imgSrc('house-' + k)}" alt=""></div><b>${esc(H.name)}</b><span class="muted small">${sub}</span>${btn}${own ? `<button class="btn small sellbtn" data-sell="h:${k}">Sell $${sellPrice(S.owned['h-' + k] === 1 ? Math.round(H.price / 3) : H.price)}</button>` : ''}</div>`;
      };
      const ofKind = kind => HOUSE_LIST.filter(x => x[1] === kind).sort((a, b) => a[3] - b[3]).map(x => card(x[0])).join('');
      h = `<h2 class="shophead">${esc(houseKindName(tp.kind))} houses <small class="muted">for ${esc(tp.name)}</small></h2>${ofKind(tp.kind) ? `<div class="shopgrid wide">${ofKind(tp.kind)}</div>` : note(`${esc(houseKindName(tp.kind))} houses and a ${esc(houseKindName(tp.kind)).toLowerCase()} lot in Pet Town are coming soon. ${esc(tp.name)} can already move into another animal's house below and decorate the room inside.`)}
        <h2 class="shophead">Other animals\u2019 houses</h2>
        <p class="muted shopnote">${esc(tp.name)} can live in another animal's house too, for a one-time unlock fee (5\u201310% of the price). Once a house is unlocked, any of your pets can use it.</p>
        <div class="chips housekinds">${PET_ORDER.filter(k => k !== tp.kind && HOUSE_LIST.some(h => h[1] === k)).map(k => chip(houseKindName(k), k === shopHouseKind, `data-hkind="${k}"`)).join('')}</div>
        <div class="shopgrid wide">${ofKind(shopHouseKind)}</div>`;
    }
  } else if (shopTab === 'furniture') h = note(`New things go straight into ${me ? esc(me.name) + "'s" : 'your'} home. Use Decorate to move them around.`) + furnCards(FURN_GROUPS.slice(0, 2));
  else if (shopTab === 'decor') h = note(`New things go straight into ${me ? esc(me.name) + "'s" : 'your'} home. Use Decorate to move them around.`) + furnCards(FURN_GROUPS.slice(2));
  else if (shopTab === 'walls') h = `<h2 class="shophead">Wallpaper</h2>${swatchCards(WALLPAPERS, 'w')}<h2 class="shophead">Floors</h2>${swatchCards(FLOORS, 'fl')}`;
  else if (shopTab === 'sets') {
    const tp = S.pets[shopPet];
    h = note('A whole finished room in one go. Every piece can be moved in Decorate, and you can switch sets there any time.') + `<div class="shopgrid wide">${ROOM_SETS.map(st => {
      const p = setPrice(st);
      return `<div class="card set"><div class="prevbox tall"><img class="prev theme" src="${imgSrc('setprev-' + st.k)}" alt=""></div><b>${st.name}</b><span class="muted small">${S.owned['set-' + st.k] ? 'Yours' : st.pieces + ' pieces + wallpaper + floor'}</span>
        ${tp ? `<button class="btn buy ${S.coins >= p ? 'go' : 'off'}" data-buy="s:${st.k}">${p ? `${icon('coin', 'coin')} $${p}` : 'Use this look'}</button>` : ''}</div>`; }).join('')}</div>`;
  } else {
    const items = SHOP.filter(i => i.cat === shopTab && !i.legacy && (!i.petKind || S.pets.some(p => p.kind === i.petKind)));
    const ltd = shopTab !== 'skins' ? '' : S.pets.map(p => {
      const has = S.owned['ltd-' + p.kind];
      return `<div class="card ltd ${has ? 'owned' : 'locked'}"><span class="ltdtag">Limited</span><div class="prevbox"><img class="pxi prev pet ${has ? '' : 'shadow'}" src="${petURL(p, { skin: 'ltd' })}" alt=""></div>
        <b>${has ? esc(LTD[p.kind].name) + ' ' + esc(PETS[p.kind].name) : '???'}</b><span class="muted small">${has ? 'Unlocked! Wear it in the room.' : 'Not for sale. Keep playing with ' + esc(p.name) + ' to discover it.'}</span></div>`;
    }).join('');
    const dp = S.pets[shopPet] || me, wears = WEARS.includes(shopTab);
    if (wears && dp) preloadFits(dp.kind, items.filter(i => i.cat !== 'skins').map(i => i.key));
    h = (wears && dp ? dressingRoom(dp) : '') + `<div class="shopgrid">${ltd}${items.map(it => {
      const owned = it.cat !== 'food' && S.owned[it.id];
      if (wears && dp) {                                      // dressing-room cards: tap to try; owned things are worn straight away
        const fits = !it.petKind || it.petKind === dp.kind, on = owned && wearing(dp, it), tr = TRY === it.id;
        const btn = !fits ? `<span class="muted small">Only for ${esc(PETS[it.petKind].name)}s</span>`
          : owned ? `<button class="btn small ${on ? '' : 'go'}" data-wear="${it.id}">${on ? 'Take off' : 'Wear'}</button>${it.price ? `<button class="btn small sellbtn" data-sell="i:${it.id}">Sell $${sellPrice(it.price)}</button>` : ''}`
          : `<button class="btn small ${tr ? 'trying' : ''}" data-try="${it.id}">${tr ? 'Trying on' : `Try on · $${it.price}`}</button>`;
        return `<div class="card ${owned ? 'owned' : ''} ${tr ? 'tryingcard' : ''} ${fits ? 'tryable' : 'nofit'}" ${fits ? `data-try="${it.id}"` : ''}><div class="prevbox">${itemPreview(it, dp)}</div><b>${esc(it.name)}</b>${on ? `<span class="ownedtag">${icon('check')} Wearing</span>` : owned ? '<span class="muted small">Yours</span>' : ''}${btn}</div>`;
      }
      const forPet = it.petKind ? S.pets.find(p => p.kind === it.petKind) : me;
      const extra = it.cat === 'food' ? `<span class="muted small">Fills ${FOODS[it.key].fill}% · you have ${S.food[it.key] || 0}</span>`
        : it.cat === 'costumes' ? `<span class="muted small">Whole set · on ${esc((me || {}).name || "your pet")}</span>`
        : it.petKind ? `<span class="muted small">Only for ${esc(PETS[it.petKind].name)}s · on ${esc((forPet || {}).name || '')}</span>` : `<span class="muted small">Preview on ${esc((me || {}).name || 'your pet')}</span>`;
      return `<div class="card ${owned ? 'owned' : ''}"><div class="prevbox">${itemPreview(it)}</div><b>${esc(it.name)}</b>${extra}${priceBtn(`data-id="${it.id}"`, it.price, owned, '', 'i:' + it.id)}</div>`;
    }).join('')}</div>`;
  }
  $('#shopGrid').innerHTML = h;
}
function buy(id) {
  const it = SHOP.find(i => i.id === id); if (!it) return;
  if (S.coins < it.price) { toast(`You need $${money(it.price - S.coins)} more. Play a session to earn coins!`); return; }
  S.coins -= it.price;
  if (it.cat === 'food') S.food[it.key] = (S.food[it.key] || 0) + 1;
  else {
    S.owned[it.id] = 1; let pet = WEARS.includes(it.cat) ? (S.pets[shopPet] || S.pets[S.active]) : S.pets[S.active];
    if (it.petKind && (!pet || pet.kind !== it.petKind)) pet = S.pets.find(p => p.kind === it.petKind);
    if (it.cat === 'skins' && pet) pet.skin = it.key; if (it.cat === 'clothes' && pet) { pet[it.slot] = it.key; pet.costume = null; if (it.slot !== 'look') pet.look = null; } if (it.cat === 'costumes' && pet) { pet.costume = it.key; pet.look = null; }
  }
  save(); SFX.coin(); renderHud(); renderShop();
  const wp = WEARS.includes(it.cat) && (S.pets[shopPet] || S.pets[S.active]);
  toast(it.cat === 'food' ? `Bought ${it.name}. Feed it in a pet's room.` : wp ? `Bought ${it.name}! ${wp.name} is wearing it now.` : `Bought ${it.name}!`);
}
function shopBuy(code) {
  const [kind, k] = code.split(':'), me = S.pets[S.active];
  if (kind === 'h') {
    const H = HOUSES[k], p = S.pets[shopPet]; if (!H || !p || ownsH(k)) return;
    const other = H.kind !== p.kind, cost = H.price + (other ? H.fee : 0);
    if (S.coins < cost) { toast(`You need $${money(cost - S.coins)} more. Play a session to earn coins!`); return; }
    S.coins -= cost; S.owned['h-' + k] = H.price;   // remember what it cost (houses bought before the price rise hold 1) if (other) S.owned['hu-' + k] = 1; p.house = k; save(); SFX.fanfare(); renderHud(); toast(`${p.name} moved into the ${H.name}! Go see it in Pet Town.`);
  } else if (kind === 'hu') {
    const H = HOUSES[k], p = S.pets[shopPet]; if (!H || !p || !ownsH(k) || unlockedH(k)) return;
    if (S.coins < H.fee) { toast(`You need $${money(H.fee - S.coins)} more. Play a session to earn coins!`); return; }
    S.coins -= H.fee; S.owned['hu-' + k] = 1; p.house = k; save(); SFX.fanfare(); renderHud(); toast(`Unlocked! ${p.name} moved into the ${H.name}.`);
  } else if (kind === 'hm') {
    const p = S.pets[shopPet]; if (!p || !ownsH(k) || !canLive(p, k)) return;
    p.house = k; save(); SFX.good(); toast(`${p.name} moved into the ${HOUSES[k].name}!`);
  } else if (kind === 's') {
    const st = ROOM_SETS.find(x => x.k === k), tp = S.pets[shopPet]; if (!st || !tp) return;
    const p = setPrice(st); if (S.coins < p) { toast(`You need $${money(p - S.coins)} more. Play a session to earn coins!`); return; }
    S.coins -= p; applySet(st, tp); save(); SFX.fanfare(); renderHud(); toast(`${tp.name}'s room is now the ${st.name}!`);
  } else if (kind === 'put') {
    const tp = S.pets[shopPet]; if (!tp || !ownsF(k)) return; tp.room = tp.room || defaultRoom(); placeItem(tp.room, k); save(); SFX.tap(); toast(`${FURN[k].name} is in ${tp.name}'s room now.`);
  } else if (kind === 'usew' || kind === 'usefl') {
    const tp = S.pets[shopPet]; if (!tp) return; tp.room = tp.room || defaultRoom(); if (kind === 'usew') tp.room.wall = k; else tp.room.floor = k; save(); SFX.tap();
  } else buyThing(kind, k, shopTab === 'sets' ? S.pets[shopPet] : me);
  renderShop();
}

// ================= DECORATE =================
const DECO = { pet: 0, tab: 'beds', sel: -1, drag: null, trial: null, from: 'home' };
// ---- try before you buy: an unbought thing goes into the room for a look; only "Buy" + a second tap pays for it ----
function endTrial(keep) { const t = DECO.trial; if (!t) return; const pet = S.pets[t.pet]; if (!keep && pet) pet.room = t.backup; DECO.trial = null; DECO.sel = -1; }
function startTrial(pet, kind, k) {
  endTrial(false);
  const backup = JSON.parse(JSON.stringify(pet.room)); let name, price;
  if (kind === 'f') { name = FURN[k].name; price = FURN[k].price; DECO.sel = placeItem(pet.room, k); }
  else if (kind === 's') { const st = ROOM_SETS.find(x => x.k === k); name = st.name; price = setPrice(st); applySet(st, pet, false); DECO.sel = -1; }
  else {
    const x = (kind === 'w' ? WALLPAPERS : FLOORS).find(v => v.k === k); name = x.name + (kind === 'w' ? ' wallpaper' : ' floor'); price = x.price;
    if (pet.room.scene) { const st = roomSet(pet.room); delete pet.room.scene; delete pet.room.wy; if (st) { pet.room.wall = st.wall; pet.room.floor = st.floor; } }
    pet.room[kind === 'w' ? 'wall' : 'floor'] = k; DECO.sel = -1;
  }
  DECO.trial = { pet: DECO.pet, kind, k, name, price, backup }; SFX.tap();
}
function buyTrial() {
  const t = DECO.trial; if (!t) return;
  if (S.coins < t.price) { toast(`You need $${money(t.price - S.coins)} more. Play a session to earn coins!`); return; }
  S.coins -= t.price; S.owned[(t.kind === 's' ? 'set' : t.kind) + '-' + t.k] = 1; DECO.trial = null;
  save(); renderHud(); SFX.fanfare(); toast(`Bought ${t.name}! It's in ${S.pets[t.pet].name}'s room now.`);
}
function armBuy(b, label) {                                     // first tap asks, second tap pays
  if (b.dataset.armed) return true;
  b.dataset.armed = 1; const t = b.innerHTML; b.innerHTML = label; b.classList.add('armed');
  setTimeout(() => { if (b.isConnected) { delete b.dataset.armed; b.innerHTML = t; b.classList.remove('armed'); } }, 4000);
  return false;
}
const trying = (kind, k) => !!DECO.trial && DECO.trial.kind === kind && DECO.trial.k === k;
const DECO_TABS = [['sets', 'Room sets'], ...FURN_GROUPS.map(([k, n]) => [k, n.split(' ')[0]]), ['walls', 'Wallpaper'], ['floors', 'Floor']];
function openDeco(i, from) { endTrial(false); DECO.pet = i; DECO.sel = -1; DECO.from = from || 'home'; route('deco'); }
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
  if (DECO.tab === 'sets') {
    h = ROOM_SETS.map(st => { const own = !!S.owned['set-' + st.k], on = room.scene === st.k, p = setPrice(st), can = S.coins >= p;
      const tr = trying('s', st.k);
      return `<button class="decocard setcard ${on && !tr ? 'on' : ''} ${tr ? 'trying' : ''} ${own ? '' : 'locked'}" data-set="${st.k}"><img src="${imgSrc('setprev-' + st.k)}" alt=""><b>${esc(st.name)}</b><em class="${own ? '' : can ? 'buyable' : 'pricey'}">${tr ? 'Trying on' : on ? 'Using' : own ? 'Use' : 'Try · $' + p}</em></button>`; }).join('');
  } else if (DECO.tab === 'walls' || DECO.tab === 'floors') {
    const list = DECO.tab === 'walls' ? WALLPAPERS : FLOORS, kind = DECO.tab === 'walls' ? 'w' : 'fl', cur = DECO.tab === 'walls' ? room.wall : room.floor;
    h = list.map(x => { const own = kind === 'w' ? ownsW(x.k) : ownsFl(x.k), on = cur === x.k, can = S.coins >= x.price;
      const tr = trying(kind, x.k);
      return `<button class="decocard ${on && !tr ? 'on' : ''} ${tr ? 'trying' : ''} ${own ? '' : 'locked'}" data-${kind}="${x.k}"><span class="swatch" style="background-image:url(${imgSrc((kind === 'w' ? 'wall-' : 'floor-') + x.k)})"></span><b>${esc(x.name)}</b><em class="${own ? '' : can ? 'buyable' : 'pricey'}">${tr ? 'Trying on' : on ? 'Using' : own ? 'Use' : 'Try · $' + x.price}</em></button>`; }).join('');
  } else {
    h = FURN_LIST.filter(f => f[2] === DECO.tab && (!f[8] || ownsF(f[0]))).map(([k, name, , price]) => { const own = ownsF(k), on = room.items.some(i => i.k === k), can = S.coins >= price;
      const swap = !on && swapGroup(k) && room.items.some(i => swapGroup(k).includes(i.k));
      const tr = trying('f', k);
      return `<button class="decocard ${on && !tr ? 'on' : ''} ${tr ? 'trying' : ''} ${own ? '' : 'locked'}" data-f="${k}"><img src="${imgSrc('it-' + k)}" alt=""><b>${esc(name)}</b><em class="${own ? '' : can ? 'buyable' : 'pricey'}">${tr ? 'Trying on' : on ? 'In the room' : own ? (swap ? 'Swap in' : 'Put in') : 'Try · $' + price}</em></button>`; }).join('');
  }
  $('#decoGrid').innerHTML = h;
}
function renderDecoTools() {
  const pet = S.pets[DECO.pet], it = pet && pet.room.items[DECO.sel], st = pet && roomSet(pet.room), t = DECO.trial;
  if (t) {
    const can = S.coins >= t.price;
    $('#decoTools').innerHTML = `<span class="trytag">Trying on</span><b>${esc(t.name)}</b>${t.kind === 'f' ? '<span class="muted small">Drag it to see it in different spots.</span>' : ''}
      <button class="btn small ${can ? 'go' : 'off'}" id="tryBuy">${can ? `${icon('coin', 'coin')} Buy $${t.price}` : `Need $${money(t.price - S.coins)} more`}</button><button class="btn small" id="tryOff">Take it off</button>`;
    return;
  }
  if (!it && st) { $('#decoTools').innerHTML = `<span class="muted">This room is the <b>${esc(st.name)}</b>. Drag any piece to move it, or tap it to flip or put it away. Put-away pieces wait in the tabs below.</span><button class="btn small" id="decoSetOff">Take the set off</button>`; return; }
  $('#decoTools').innerHTML = it ? `<b>${esc(FURN[it.k].name)}</b><button class="btn small" id="decoFlip">Flip</button><button class="btn small" id="decoAway">Put away</button>${FURN[it.k].price ? `<button class="btn small bad" data-sell="f:${it.k}">Sell $${sellPrice(FURN[it.k].price)}</button>` : ''}<button class="btn small go" id="decoDone">Done</button>`
    : `<span class="muted">Tap anything below with a price to try it in the room first; nothing is bought until you tap Buy and confirm. Drag things to move them; tap one to flip, put away or sell it.</span>`;
}
function decoClick(e) {
  const pet = S.pets[DECO.pet]; if (!pet) return;
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.decopet !== undefined) { endTrial(false); DECO.pet = +b.dataset.decopet; DECO.sel = -1; return renderDeco(); }
  if (b.id === 'tryOff') { endTrial(false); SFX.tap(); return renderDeco(); }
  if (b.id === 'tryBuy') { const t = DECO.trial; if (!t) return; if (S.coins < t.price) { toast(`You need $${money(t.price - S.coins)} more. Play a session to earn coins!`); return; }
    if (!armBuy(b, `Tap again to pay $${t.price}`)) return; buyTrial(); return renderDeco(); }
  if (b.dataset.t) { DECO.tab = b.dataset.t; return renderDeco(); }
  // trying something on: an unbought thing goes in for a look (tapping the same card again takes it off)
  const tk = b.dataset.f ? ['f', b.dataset.f, ownsF(b.dataset.f)] : b.dataset.w ? ['w', b.dataset.w, ownsW(b.dataset.w)] : b.dataset.fl ? ['fl', b.dataset.fl, ownsFl(b.dataset.fl)] : b.dataset.set ? ['s', b.dataset.set, !!S.owned['set-' + b.dataset.set]] : null;
  if (tk && !tk[2]) { if (trying(tk[0], tk[1])) endTrial(false); else startTrial(pet, tk[0], tk[1]); renderDeco(); $('#sceneDeco').scrollIntoView({ block: 'nearest', behavior: 'smooth' }); return; }
  if (DECO.trial && (tk || ['decoAway', 'decoSetOff'].includes(b.id) || b.dataset.sell)) endTrial(false);
  if (b.id === 'decoFlip') { const it = pet.room.items[DECO.sel]; if (it) { it.f = it.f ? 0 : 1; save(); SFX.tap(); } return; }
  if (b.id === 'decoAway') { const it = pet.room.items[DECO.sel]; if (it) dropRiders(pet.room, it.k); pet.room.items.splice(DECO.sel, 1); DECO.sel = -1; save(); SFX.tap(); return renderDeco(); }
  if (b.dataset.sell) { if (!armSell(b)) return; sellThing(b.dataset.sell); DECO.sel = -1; return renderDeco(); }
  if (b.id === 'decoDone') { DECO.sel = -1; return renderDecoTools(); }
  if (b.id === 'decoSetOff') { takeSetOff(pet.room); DECO.sel = -1; save(); SFX.tap(); toast('The set is off. Your room is back to the starter look; buy the set again any time for free.'); return renderDeco(); }
  if (b.dataset.set) {
    const st = ROOM_SETS.find(x => x.k === b.dataset.set); if (!st || pet.room.scene === st.k) return;
    const p = setPrice(st); if (S.coins < p) { toast(`You need $${money(p - S.coins)} more. Play a session to earn coins!`); return; }
    S.coins -= p; applySet(st, pet); DECO.sel = -1; save(); renderHud(); p ? SFX.fanfare() : SFX.tap(); toast(`${pet.name}'s room is now the ${st.name}!`); return renderDeco();
  }
  const k = b.dataset.f, w = b.dataset.w, fl = b.dataset.fl;
  if (k) {
    const idx = pet.room.items.findIndex(i => i.k === k);
    if (idx >= 0) { DECO.sel = idx; renderDecoTools(); $('#sceneDeco').scrollIntoView({ block: 'nearest', behavior: 'smooth' }); return; }
    if (!ownsF(k) && !buyThing('f', k, null)) return;
    DECO.sel = placeItem(pet.room, k); save(); SFX.tap(); renderDeco(); $('#sceneDeco').scrollIntoView({ block: 'nearest', behavior: 'smooth' }); return;
  }
  if ((w || fl) && pet.room.scene) {                      // a set's background covers walls and floor: a new wallpaper or floor replaces it, the furniture stays
    const own = w ? ownsW(w) : ownsFl(fl), price = (w ? WALLPAPERS.find(x => x.k === w) : FLOORS.find(x => x.k === fl)).price;
    if (!own && S.coins < price) { toast(`You need $${money(price - S.coins)} more. Play a session to earn coins!`); return; }
    const st = roomSet(pet.room); delete pet.room.scene; if (st) { pet.room.wall = st.wall; pet.room.floor = st.floor; }
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
    const ox = it.x, oy = it.y; delete it.on;
    useRoom(pet.room); it.x = p.x + d.dx; it.y = p.y + d.dy; clampItem(it);
    if (isStackable(it.k)) { it.y = p.y + d.dy; snapStack(pet.room, it); }
    else ridersOf(pet.room, it.k).forEach(r => { r.x += it.x - ox; const s = surfaceY(it); if (s != null) r.y = Math.round(s); });
    d.moved = true;
  });
  const end = () => { if (DECO.drag) { if (DECO.drag.moved) save(); DECO.drag = null; } };
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
  $('#scr-deco').addEventListener('click', decoClick);
  $('#decoBack').addEventListener('click', () => { endTrial(false); DECO.sel = -1; route(DECO.from === 'shop' ? 'shop' : 'home'); });
}
