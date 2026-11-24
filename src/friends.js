// ================= FRIENDS: players in the family befriend each other, and their pets visit each other's homes (Nov 2026) =================
// Nobody ever writes into someone else's save. Each player keeps, in their own save:
//   S.friends   ids of the players they asked (or said yes) to be friends with
//   S.friendNo  ids whose request they turned down (hidden until that player asks again after being removed)
//   S.visits    their pets' visits to friends' homes: { to, host, pet, kind, at }
// Two players who list each other are friends; one listing the other is a request waiting for a yes.
// Every player's save is already copied to each device (live), so the friend's side is read from there.
let VISIT = null;                                           // { fid, host (their pet index), guest (my pet index), hearts, hop }
const FCACHE = {};
function friendSave(id) {                                   // another player's save, as it is on this device right now
  const prof = PROFILES.find(p => p.id === id); if (!prof) return null;
  const c = FCACHE[id]; if (c && c.at === prof.savedAt) return c.st;
  const st = localSave(id); FCACHE[id] = { at: prof.savedAt, st }; return st;
}
const myFriendList = () => (S.friends = S.friends || []);
const friendPeople = () => PROFILES.filter(p => p.id !== PROFILE.id && !p.test);   // the Test profile never shows up for the kids
const theyWant = id => { const st = friendSave(id); return !!(st && (st.friends || []).includes(PROFILE.id)); };
const isFriend = id => isTester() || (myFriendList().includes(id) && theyWant(id));   // the grown-ups' Test profile can visit anyone
const friendRequests = () => friendPeople().filter(p => theyWant(p.id) && !myFriendList().includes(p.id) && !(S.friendNo || []).includes(p.id));
function newVisitors() {                                    // friends' pets that came by since this player last looked
  const seen = S.visitSeen || 0, out = [];
  friendPeople().forEach(p => { if (!isFriend(p.id)) return; const st = friendSave(p.id); (st && st.visits || []).forEach(v => { if (v.to === PROFILE.id && v.at > seen) out.push({ ...v, who: p.name }); }); });
  return out.sort((a, b) => b.at - a.at);
}
function recentVisitors() {
  const since = Date.now() - 14 * 864e5, out = [];
  friendPeople().forEach(p => { const st = friendSave(p.id); (st && st.visits || []).forEach(v => { if (v.to === PROFILE.id && v.at > since) out.push({ ...v, who: p.name }); }); });
  return out.sort((a, b) => b.at - a.at).slice(0, 10);
}
const friendsBadge = () => !!PROFILE && (friendRequests().length > 0 || newVisitors().length > 0);
function refreshFriendsBadge() { const b = $('#goFriends'); if (b) b.classList.toggle('dot', friendsBadge()); }
const visitDay = at => new Date(at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
const petLabel = (pet) => `${esc(pet.name)} the ${PETS[pet.kind] ? PETS[pet.kind].name : 'Pet'}`;

function renderFriends() {
  const fl = myFriendList(), people = friendPeople(), reqs = friendRequests();
  const mutual = people.filter(p => isFriend(p.id)), waiting = people.filter(p => fl.includes(p.id) && !theyWant(p.id) && !isTester());
  const others = people.filter(p => !fl.includes(p.id) && !reqs.includes(p) && !isTester());
  let h = '';
  if (reqs.length) h += `<div class="panel"><h2>Friend requests</h2>${reqs.map(p => `<div class="frow"><span><b>${esc(p.name)}</b> wants to be friends!</span>
      <span><button class="btn small go" data-fyes="${esc(p.id)}">Yes!</button> <button class="btn small" data-fno="${esc(p.id)}">No thanks</button></span></div>`).join('')}</div>`;
  h += `<div class="panel"><h2>My friends</h2>`;
  if (!mutual.length) h += `<p class="muted">No friends yet. Ask someone below! When they say yes, your pets can visit each other's homes.</p>`;
  mutual.forEach(p => {
    const st = friendSave(p.id), pets = (st && st.pets) || [];
    h += `<div class="fcard"><div class="fhead"><b>${esc(p.name)}</b><span>${st ? `<button class="btn small" data-ftown="${esc(p.id)}">${esc(p.name)}'s Pet Town</button> ` : ''}${isTester() ? '' : `<button class="linkbtn small" data-funf="${esc(p.id)}">Remove friend</button>`}</span></div>
      ${!st ? `<p class="muted small">${esc(p.name)}'s pets aren't on this device yet. Try again in a moment.</p>`
        : !pets.length ? `<p class="muted small">${esc(p.name)} doesn't have a pet yet.</p>`
        : `<div class="fpets">${pets.map((pet, i) => `<button class="fpet" data-fvisit="${esc(p.id)}" data-fpi="${i}"><img class="pxi" src="${petURL(pet)}" alt=""><span>${esc(pet.name)}</span><small>Visit</small></button>`).join('')}</div>`}</div>`;
  });
  if (waiting.length) h += waiting.map(p => `<div class="frow muted"><span>Waiting for <b>${esc(p.name)}</b> to say yes&hellip;</span><button class="linkbtn small" data-fcancel="${esc(p.id)}">Cancel</button></div>`).join('');
  h += `</div>`;
  if (others.length) h += `<div class="panel"><h2>Add a friend</h2>${others.map(p => `<div class="frow"><span><b>${esc(p.name)}</b></span><button class="btn small" data-fadd="${esc(p.id)}">Ask to be friends</button></div>`).join('')}
      <p class="muted small">They'll see your request next time they play.</p></div>`;
  else if (!people.length) h += `<div class="panel"><p class="muted">Friends are other players in your family. Add another player to make a friend.</p></div>`;
  const vis = recentVisitors();
  if (vis.length) h += `<div class="panel"><h2>Visitors</h2>${vis.map(v => `<div class="frow"><span><b>${esc(v.who)}</b>'s ${esc(v.pet)} came to visit ${esc(v.host)}</span><small class="muted">${visitDay(v.at)}</small></div>`).join('')}</div>`;
  $('#friendsBody').innerHTML = h;
  S.visitSeen = Date.now(); save(); refreshFriendsBadge();
}
function friendsClick(e) {
  const b = e.target.closest('button'); if (!b) return; const d = b.dataset, fl = myFriendList();
  if (d.fadd) { if (!fl.includes(d.fadd)) fl.push(d.fadd); S.friendNo = (S.friendNo || []).filter(x => x !== d.fadd); save(); SFX.good(); toast(`Friend request sent!`); return renderFriends(); }
  if (d.fyes) { if (!fl.includes(d.fyes)) fl.push(d.fyes); save(); SFX.coin(); toast(`You and ${(PROFILES.find(p => p.id === d.fyes) || {}).name} are friends now!`); return renderFriends(); }
  if (d.fno) { S.friendNo = [...new Set([...(S.friendNo || []), d.fno])]; save(); SFX.tap(); return renderFriends(); }
  if (d.fcancel || d.funf) { const id = d.fcancel || d.funf; S.friends = fl.filter(x => x !== id); if (d.funf) S.friendNo = [...new Set([...(S.friendNo || []), id])]; save(); SFX.tap(); return renderFriends(); }
  if (d.ftown) { showTownOf(d.ftown); return route('town'); }
  if (d.fvisit) return openVisit(d.fvisit, +d.fpi);
}

// ---- a visit: my pet goes to a friend's pet's home ----
function openVisit(fid, hostIdx, guestIdx) {
  const st = friendSave(fid); if (!st || !st.pets[hostIdx] || !S.pets.length) return;
  VISIT = { fid, host: hostIdx, guest: guestIdx != null ? guestIdx : S.active, hearts: 0, hop: 0 };
  ROAM['visit'] = { x: 330, y: 470, tx: 330, ty: 470, dir: 1, wait: 2.5 }; ROAM['visit-g'] = { x: 600, y: 480, tx: 600, ty: 480, dir: -1, wait: 3 };
  noteVisit(); route('visit');
  setTimeout(() => waveHello(true), 500);
}
function noteVisit() {                                       // kept in my own save, for the friend to see
  const host = friendSave(VISIT.fid).pets[VISIT.host], me = S.pets[VISIT.guest], v = S.visits = S.visits || [];
  const last = v[v.length - 1], now = Date.now();
  if (last && last.to === VISIT.fid && last.host === host.name && last.pet === me.name && now - last.at < 30 * 60e3) last.at = now;
  else v.push({ to: VISIT.fid, host: host.name, pet: me.name, kind: me.kind, at: now });
  if (v.length > 40) v.splice(0, v.length - 40);
  save();
}
function visitPets() { const st = VISIT && friendSave(VISIT.fid); return st && st.pets[VISIT.host] && S.pets[VISIT.guest] ? [st.pets[VISIT.host], S.pets[VISIT.guest], st] : null; }
function waveHello(quiet) { if (!VISIT) return; const t = performance.now(); VISIT.hearts = t + 2600; VISIT.hop = t + 900; hopUntil = 0; VISIT.hostHop = t + 900; if (!quiet) SFX.good(); else SFX.tap(); }
function renderVisit() {
  const vp = visitPets(); if (!vp) return route('friends');
  const [host, guest, st] = vp, owner = (PROFILES.find(p => p.id === VISIT.fid) || {}).name || 'Friend';
  $('#visitTitle').textContent = `${guest.name} is visiting!`;
  let h = `<p class="vline"><b>${esc(guest.name)}</b> came to <b>${esc(owner)}</b>'s house to play with <b>${petLabel(host)}</b>.</p>
    <p class="center"><button class="btn go" id="visitWave">Wave hello</button></p>`;
  if (S.pets.length > 1) h += `<h3>Who goes on the visit?</h3><div class="chips">${S.pets.map((p, i) => chip(p.name, i === VISIT.guest, `data-vguest="${i}"`)).join('')}</div>`;
  if (st.pets.length > 1) h += `<h3>Whose home?</h3><div class="chips">${st.pets.map((p, i) => chip(p.name, i === VISIT.host, `data-vhost="${i}"`)).join('')}</div>`;
  $('#visitPanel').innerHTML = h;
}
function visitClick(e) {
  const b = e.target.closest('button'); if (!b) return;
  if (b.id === 'visitWave') return waveHello();
  if (b.dataset.vguest != null) { VISIT.guest = +b.dataset.vguest; noteVisit(); renderVisit(); return waveHello(true); }
  if (b.dataset.vhost != null) { VISIT.host = +b.dataset.vhost; noteVisit(); renderVisit(); return waveHello(true); }
}
// little hearts floating up over both pets while they say hello
function drawHearts(c, t, until, spots) {
  if (!until || t > until) return; const k = 1 - (until - t) / 2600;
  spots.forEach((s, j) => { for (let i = 0; i < 3; i++) {
    const p = (k + i * 0.28 + j * 0.13) % 1, x = s.x + Math.sin((p + i) * 6) * 18 + (i - 1) * 22, y = s.y - 40 - p * 90, r = 9 + i * 2;
    c.save(); c.globalAlpha = Math.max(0, Math.min(1, 1.4 - p * 1.4)); c.fillStyle = '#ff5d8f'; c.strokeStyle = '#2a1d33'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(x, y + r * 0.9); c.bezierCurveTo(x - r * 1.6, y - r * 0.2, x - r * 0.7, y - r * 1.4, x, y - r * 0.5); c.bezierCurveTo(x + r * 0.7, y - r * 1.4, x + r * 1.6, y - r * 0.2, x, y + r * 0.9);
    c.fill(); c.stroke(); c.restore(); } });
}

(function initFriends() {
  $('#friendsBody').addEventListener('click', friendsClick);
  $('#visitPanel').addEventListener('click', visitClick);
  $('#visitBack').addEventListener('click', () => { VISIT = null; route('home'); });
  $('#goFriends img').src = spriteURL('i-heart', ICONS.heart, BASEPAL);
  $('#goFriends').addEventListener('click', () => route('friends'));
  const cv = $('#sceneVisit'), cx = cv.getContext('2d'); let last = 0;
  (function loop(t) {
    if (cv.offsetParent && t - last > 50) { last = t; const vp = visitPets(); if (vp) drawRoom(cx, t, vp[0], { id: 'visit', guest: vp[1], hearts: VISIT.hearts, guestHop: VISIT.hop, hostHop: VISIT.hostHop }); }
    requestAnimationFrame(loop);
  })(0);
  setInterval(() => { if (currentScreen === 'home') refreshFriendsBadge(); }, 5000);
})();
