// ================= TEST TOOLS (only in the Test profile) =================
function renderTestTools() {
  const el = $('#testTools'); if (!el) return;
  el.hidden = !isTester(); if (!isTester()) return;
  const z = zhState(), lvNow = S.place ? (S.place.gi ?? levelAt(S.place.pos || 0).gi) : -1;
  el.innerHTML = `<h3>Test tools</h3><p class="small muted">Only the Test profile has these. Everything is open here: Eddie's Lab, every Chinese stage and every shop.</p>
    <div class="row"><button class="btn small go" data-tt="coins">+ $1,000</button><button class="btn small" data-tt="pets">Get all pets</button><button class="btn small" data-tt="egg">Hatch an egg now</button><button class="btn small" data-tt="unlock">Unlock all shop items</button></div>
    <div class="row"><label>English level <select data-tt="en">${['Not tested', ...LEVELS.map(L => L.name + ' · ' + L.sub)].map((n, i) => `<option value="${i - 1}" ${i - 1 === lvNow ? 'selected' : ''}>${n}</option>`).join('')}</select></label></div>
    <div class="row"><label><span class="zh">中文</span> <select data-tt="zh">${['Not tested', ...ZH_PARTS.map(p => p.title)].map((n, i) => `<option value="${i - 1}" ${z.place ? (i - 1 === z.place.k ? 'selected' : '') : (i === 0 ? 'selected' : '')} class="zh">${n}</option>`).join('')}</select></label></div>
    <div class="row"><button class="btn small" data-tt="streak">Streak +1 day</button><button class="btn small" data-tt="hungry">Make pets hungry</button><button class="btn small bad" data-tt="reset">Start the test profile over</button></div>`;
  el.querySelectorAll('select').forEach(s => s.addEventListener('change', testToolChange));
}
function testAllPets() {
  PET_ORDER.forEach(k => { if (!S.pets.some(p => p.kind === k)) S.pets.push({ kind: k, name: PETS[k].name, skin: null, hat: null, eyes: null, neck: null, back: null, body: null, full: 80, fedDay: today(), shelter: 'box', decor: {}, items: {}, room: defaultRoom() }); });
}
function testToolClick(e) {
  const b = e.target.closest('button[data-tt]'); if (!b || !isTester() || P) return;
  const t = b.dataset.tt;
  if (t === 'coins') { S.coins += 1000; toast('Added $1,000.'); }
  if (t === 'pets') { testAllPets(); toast('All 13 pets are here.'); }
  if (t === 'egg') {
    if (S.pets.length >= PET_ORDER.length) { toast('You already have every pet. Start over to test hatching.'); return; }
    S.sessions = (S.eggBase || 0) + (S.rewards.length + 1) * EGG_EVERY; save(); renderHud(); claimRewards(() => route('home')); return;
  }
  if (t === 'unlock') {
    SHOP.forEach(i => { if (!i.legacy && i.cat !== 'food') S.owned[i.id] = 1; });
    FURN_LIST.forEach(f => { S.owned['f-' + f[0]] = 1; }); WALLPAPERS.forEach(w => { S.owned['w-' + w.k] = 1; }); FLOORS.forEach(f => { S.owned['fl-' + f.k] = 1; });
    PET_ORDER.forEach(k => { S.owned['ltd-' + k] = 1; }); HOUSE_LIST.forEach(([k]) => { S.owned['h-' + k] = 1; S.owned['hu-' + k] = 1; }); S.pets.forEach(p => { p.house = p.house || p.kind; });
    Object.keys(FOODS).forEach(k => { S.food[k] = (S.food[k] || 0) + 10; });
    toast('Everything in the shop is unlocked, every house is built, and every limited skin is yours.');
  }
  if (t === 'streak') { S.streak = liveStreak() + 1; S.best = Math.max(S.best || 0, S.streak); S.lastDay = today(); S.days = [...new Set([...S.days, today()])]; toast(`Streak is now ${S.streak} days.`); }
  if (t === 'hungry') { S.pets.forEach(p => { p.full = 20; p.fedDay = today(); }); toast('Every pet is hungry now.'); }
  if (t === 'reset') {
    if (!b.dataset.armed) { b.dataset.armed = 1; b.textContent = 'Tap again to start over'; setTimeout(() => { if (b.isConnected) { delete b.dataset.armed; b.textContent = 'Start the test profile over'; } }, 4000); return; }
    S = freshState(); S.coins = 5000; testAllPets(); S.active = 0; toast('The test profile starts fresh, with all pets and $5,000.');
  }
  save(); renderHud(); renderHome(); renderTestTools();
}
function testToolChange(e) {
  if (!isTester() || P) return;
  const v = +e.target.value;
  if (e.target.dataset.tt === 'en') {
    if (v < 0) S.place = null; else S.place = { gi: v, start: 0, pos: LEVELS[v].off, at: today(), skipped: true };
    toast(v < 0 ? 'The English level test will run before the next session.' : `English starts at ${LEVELS[v].name} now.`);
  } else {
    const z = zhState(); z.place = v < 0 ? null : { k: v, lv: 0, at: today(), skipped: true }; zhPartSel = Math.max(0, v);
    toast(v < 0 ? 'The Chinese test will run next time.' : `Chinese starts at ${ZH_PARTS[v].title} now.`);
  }
  save(); renderHome();
}
// ================= DEVELOPER MODE =================
async function hashPw(pw, salt) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + '|' + pw));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}
async function devClick() {
  if (!IS_OWNER || !cloudDb) return;
  if (DEV_OPEN) { DEV_OPEN = false; if (PROFILE && PROFILE.test) { PROFILE = null; lsDel(LS_ACTIVE); S = freshState(); } renderHud(); renderWho(); toast('Developer mode is off.'); return; }
  let lock = null; try { const d = await cloudDb.doc('dev/lock').get(); lock = d.exists ? d.data() : null; } catch (e) {}
  const first = !lock || !lock.hash;
  openModal(`<h2 class="mtitle">${first ? 'Set a developer password' : 'Developer'}</h2>
    <p class="msub">${first ? 'Choose a password. You will need it every time you open Developer mode.' : 'Enter the developer password.'}</p>
    <input id="devPw" class="nameinput" type="password" autocomplete="off" placeholder="Password">
    ${first ? '<input id="devPw2" class="nameinput" type="password" autocomplete="off" placeholder="Type it again">' : ''}
    <p class="small badtxt" id="devMsg"></p>
    <div class="row"><button class="btn go" id="devOk">${first ? 'Save password' : 'Open'}</button><button class="btn" id="devCancel">Cancel</button></div>`);
  const pw = $('#devPw'); pw.focus();
  const go = async () => {
    const v = pw.value;
    if (first) {
      if (v.length < 4) { $('#devMsg').textContent = 'Use at least 4 characters.'; return; }
      if (v !== $('#devPw2').value) { $('#devMsg').textContent = 'The two passwords are different.'; return; }
      const salt = Math.random().toString(36).slice(2) + Date.now().toString(36);
      try { await cloudDb.doc('dev/lock').set({ salt, hash: await hashPw(v, salt) }); } catch (e) { $('#devMsg').textContent = 'Could not save it. Try again.'; return; }
    } else if (await hashPw(v, lock.salt) !== lock.hash) { $('#devMsg').textContent = 'Wrong password.'; pw.value = ''; pw.focus(); return; }
    DEV_OPEN = true; closeModal(true); devEnsureTest(); renderWho(); toast('Developer mode is on. The Test profile is showing.');
  };
  $('#devOk').addEventListener('click', go);
  pw.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  const pw2 = $('#devPw2'); if (pw2) pw2.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  $('#devCancel').addEventListener('click', () => closeModal(true));
}
// make sure the Test profile exists (created on first unlock if it was never made)
function devEnsureTest() {
  if (PROFILES.some(p => p.id === TEST_ID)) return;
  const prof = { id: TEST_ID, name: 'Test', test: true, created: Date.now(), savedAt: 0 };
  PROFILES.push(prof); storeProfiles();
  const keep = S; S = freshState(); S.coins = 5000; testAllPets(); S.savedAt = Date.now(); lsSet(lsKey(TEST_ID), JSON.stringify(S)); S = keep;
  if (cloudDb) pushProfile(TEST_ID).catch(() => {});
}
// ================= BACKUP & MOVE =================
// A backup file holds every player on this device (including ones not yet uploaded),
// so progress can be moved to the stand-alone website or restored later.
function backupData() {
  const profiles = PROFILES.map(p => { const st = (PROFILE && PROFILE.id === p.id) ? S : localSave(p.id); return st ? { id: p.id, name: p.name, test: !!p.test, created: p.created || 0, savedAt: st.savedAt || 0, json: JSON.stringify(st) } : null; }).filter(Boolean);
  return { app: 'spell-pets', version: 1, exportedAt: new Date().toISOString(), profiles };
}
async function exportAll() {
  const data = JSON.stringify(backupData()), name = 'spell-pets-backup-' + today() + '.json';
  try { const dl = window.claude && window.claude.use && await window.claude.use('downloads'); if (dl) { await dl.save({ filename: name, data }); return; } } catch (e) { if (e && e.code === 'declined') return; }
  try { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); }
  catch (e) { toast('Could not make the backup file here.'); }
}
async function importBackup(file) {
  let d; try { d = JSON.parse(await file.text()); } catch (e) { toast('That file is not a Spell Pets backup.'); return; }
  if (!d || d.app !== 'spell-pets' || !Array.isArray(d.profiles)) { toast('That file is not a Spell Pets backup.'); return; }
  let n = 0;
  for (const p of d.profiles) {
    if (!p || !p.id || !p.name || !p.json) continue;
    const isTest = !!p.test || p.id === TEST_ID, id = isTest ? TEST_ID : p.id;
    let prof = PROFILES.find(x => x.id === id);
    const local = localSave(id);
    if (local && (local.savedAt || 0) > (p.savedAt || 0)) continue;   // never overwrite newer progress
    if (!prof) { prof = { id, name: p.name, test: isTest, created: p.created || Date.now(), savedAt: 0 }; PROFILES.push(prof); }
    prof.name = p.name; prof.test = isTest; prof.savedAt = p.savedAt || 0;
    lsSet(lsKey(id), p.json);
    if (PROFILE && PROFILE.id === id) S = migrate(JSON.parse(p.json));
    if (cloudDb) { try { await pushProfile(id); } catch (e) {} }
    n++;
  }
  storeProfiles(); renderWho(); toast(n ? `Imported ${n} player${n === 1 ? '' : 's'}.` : 'Nothing new to import: the players here are already up to date.');
}
function renderAccount() {
  const acc = window.SPELLPETS_ACCOUNT && window.SPELLPETS_ACCOUNT();
  const line = $('#accountLine'), btn = $('#signOutBtn'); if (!line || !btn) return;
  line.hidden = btn.hidden = !acc;
  if (acc) line.textContent = `Signed in as ${acc.name || acc.email}${acc.email && acc.name ? ' (' + acc.email + ')' : ''}.`;
}
