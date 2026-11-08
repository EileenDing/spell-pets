// ================= EDDIE'S BRAINPOWER LAB (only in a profile named Eddie) =================
const LAB_PARTS = [{ k: 'A', name: 'Mission A', units: [1, 2, 3, 4] }, { k: 'B', name: 'Mission B', units: [5, 6, 7, 8] }];
const LAB_SESS = 12;
const POS_FULL = { n: 'noun', v: 'verb', adj: 'adjective', adv: 'adverb', prep: 'preposition', conj: 'conjunction' };
const LAB = LAB_RAW.trim().split('\n').filter(l => l.trim() && !l.startsWith('#')).map((line, i) => {
  const [u, w, d, sn, us] = line.split('|');
  const sp = w.split('/');
  const senses = sn.split(' ~ ').map(x => { const [pd, ex] = x.split('=>'), k = pd.indexOf('='); return { pos: pd.slice(0, k).trim(), def: pd.slice(k + 1).trim(), ex: (ex || '').trim() }; });
  const uses = us.split(' ~ ').map(x => { const [s, o] = x.split('::'); return { s: s.trim(), o: o.split(',').map(t => t.trim()) }; });
  return { id: 'lab:' + sp[0].toLowerCase(), lab: true, unit: +u, i, w: sp[0], alt: sp.map(x => x.toLowerCase()), d: d.split(','), senses, uses, s: uses[0].s, o: uses[0].o, ex: '', cue: '', mean: senses.map(x => x.pos + '. ' + x.def).join(' / ') };
});
LAB.forEach(w => { BY_ID[w.id] = w; });
const labUnit = u => LAB.filter(w => w.unit === u);
function labState() { if (!S.lab) S.lab = { seen: {}, ok: {}, miss: {} }; return S.lab; }
function labBuild(u) {
  const L = labState(), ws = labUnit(u);
  const miss = ws.filter(w => L.miss[w.id]), fresh = ws.filter(w => !L.miss[w.id] && !L.ok[w.id]), old = shuffle(ws.filter(w => L.ok[w.id] && !L.miss[w.id]));
  return shuffle([...miss.map(w => ({ id: w.id, review: true })), ...fresh.map(w => ({ id: w.id, review: false })), ...old.map(w => ({ id: w.id, review: false, practice: true }))].slice(0, LAB_SESS));
}
function startLab(u) {
  if (!S.pets.length) { maybeFirstPet(); return; }
  const items = labBuild(u);
  if (!items.length) { toast('No words in this unit yet.'); return; }
  items.forEach(it => { const w = BY_ID[it.id], k = w.uses.length > 1 ? (w.useNext = ((w.useNext ?? Math.floor(Math.random() * w.uses.length)) + 1) % w.uses.length) : 0; w.s = w.uses[k].s; w.o = w.uses[k].o; });
  P = { mode: 'lab', unit: u, items, round: 1, idx: 0, order: { 1: shuffle(items), 2: shuffle(items), 3: shuffle(items) }, res: Object.fromEntries(items.map(i => [i.id, [null, null, null]])), busy: false, typed: '' };
  route('play'); roundIntro();
}
const posTag = (p, n) => `<span class="pos">${esc(p)}.${n ? ' ' + n : ''}<small>${esc(POS_FULL[p] || '')}</small></span>`;
function labHub() {
  const L = labState();
  return `<div class="panel secretlab"><p class="eyebrow">Top secret · Eddie only</p><h2>Eddie's Brainpower Lab</h2>
    <p>Your class vocabulary, in three rounds: hear it, spell it, use it. Master every word to finish a mission, Agent Eddie!</p>
    ${LAB_PARTS.map(p => {
      const ws = p.units.flatMap(labUnit), done = ws.filter(w => L.ok[w.id]).length;
      return `<div class="labpart"><h3>${p.name} <small>Units ${p.units[0]}–${p.units[p.units.length - 1]}</small></h3>
        <p class="small labsum">${ws.length ? `${done} of ${ws.length} words mastered` : 'Words coming soon'}</p>
        <div class="labunits">${p.units.map(u => {
          const uw = labUnit(u), ud = uw.filter(w => L.ok[w.id]).length, um = uw.filter(w => L.miss[w.id]).length;
          return `<button class="labunit" data-lab="${u}" ${uw.length ? '' : 'disabled'}><b>Unit ${u}</b><span>${uw.length ? `${ud} / ${uw.length}` : 'soon'}</span>${um ? `<em>${um} to fix</em>` : ''}</button>`;
        }).join('')}</div>
        ${ws.length ? `<details class="labstudy"><summary>Study the words</summary>${p.units.filter(u => labUnit(u).length).map(u => `<h4>Unit ${u}</h4><ul>${labUnit(u).map(w => `<li><button class="btn speak tiny" data-say="${esc(w.w)}" aria-label="Hear ${esc(w.w)}">${icon('speaker', 'spk')}</button><div><b>${esc(w.w)}</b>${w.alt.length > 1 ? `<span class="muted small"> (also ${esc(w.alt.slice(1).join(', '))})</span>` : ''}${L.ok[w.id] ? ` <span class="labok">${icon('check')}</span>` : ''}${w.senses.map(s => `<p class="labdef">${posTag(s.pos)} ${esc(s.def)}</p><p class="labex">${exHtml(s.ex, true)}</p>`).join('')}</div></li>`).join('')}</ul>`).join('')}</details>` : ''}
      </div>`;
    }).join('')}
  </div>`;
}
function labClick(e) {
  const u = e.target.closest('[data-lab]'); if (u) { startLab(+u.dataset.lab); return true; }
  const s = e.target.closest('[data-say]'); if (s) { say(s.dataset.say); return true; }
  return false;
}
