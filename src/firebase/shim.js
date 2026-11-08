// Firebase adapter for the stand-alone Spell Pets website.
// The game was written against the Claude artifact runtime (window.claude.use('db' | 'user')).
// This file provides the same small API on top of Firebase Auth (Google sign-in) and Firestore,
// so the game code runs unchanged. Every path the game uses lives under families/<FAMILY>/.
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs, onSnapshot, query, limit, serverTimestamp } from 'firebase/firestore';

const CFG = window.FIREBASE_CONFIG;
const OWNER_UID = window.SPELLPETS_OWNER;
const FAMILY = window.SPELLPETS_FAMILY || OWNER_UID;

const app = initializeApp(CFG);
const auth = getAuth(app);
const fs = getFirestore(app);
setPersistence(auth, browserLocalPersistence).catch(() => {});

const seg = path => ['families', FAMILY, ...String(path).split('/').filter(Boolean)];
const wrapDoc = s => ({ id: s.id, exists: s.exists(), data: () => (s.exists() ? s.data() : undefined), metadata: s.metadata });
const wrapQuery = qs => ({ docs: qs.docs.map(wrapDoc), size: qs.size, empty: qs.empty, docChanges: () => qs.docChanges().map(c => ({ type: c.type, doc: wrapDoc(c.doc), oldIndex: c.oldIndex, newIndex: c.newIndex })) });
function docRef(path) {
  const r = doc(fs, ...seg(path));
  return {
    id: r.id,
    get: async () => wrapDoc(await getDoc(r)),
    set: async data => { await setDoc(r, data); },
    delete: async () => { await deleteDoc(r); },
    onSnapshot: (next, err) => onSnapshot(r, s => next(wrapDoc(s)), e => err && err(e)),
    collection: sub => collRef(path + '/' + sub)
  };
}
function collRef(path) {
  const r = collection(fs, ...seg(path));
  return {
    get: async () => wrapQuery(await getDocs(r)),
    onSnapshot: (next, err) => onSnapshot(r, qs => next(wrapQuery(qs)), e => err && err(e)),
    doc: id => docRef(path + '/' + id)
  };
}
const dbApi = Object.freeze({ doc: docRef, collection: collRef });

let currentUser = null;
const userApi = Object.freeze({
  isOwner: async () => !!currentUser && currentUser.uid === OWNER_UID,
  canEdit: async () => !!currentUser && currentUser.uid === OWNER_UID,
  can: async () => true,
  id: async () => (currentUser ? currentUser.uid : null),
  me: async () => ({ id: currentUser ? currentUser.uid : null, name: currentUser ? currentUser.displayName || '' : '', email: null })
});

// ---- sign-in screen ----
const css = `#fbgate{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:16px;background:linear-gradient(#7cc6ff,#d8efff);font-family:"Pixelify Sans","Trebuchet MS",Verdana,sans-serif;color:#2a1d33}
#fbgate .box{background:#fff6e3;border:4px solid #2a1d33;border-radius:12px;padding:24px 22px;max-width:420px;width:100%;text-align:center;display:grid;gap:14px;box-shadow:0 6px 0 rgba(42,29,51,.35)}
#fbgate h1{font-family:"Press Start 2P",monospace;font-size:22px;margin:0;color:#fff;text-shadow:3px 3px 0 #2a1d33,-1px -1px 0 #2a1d33,1px -1px 0 #2a1d33,-1px 1px 0 #2a1d33}#fbgate h1 span{color:#ffcc33}
#fbgate p{margin:0;font-size:17px;line-height:1.45}#fbgate .small{font-size:14px;color:#6a5878;word-break:break-all}
#fbgate button{font:inherit;font-size:19px;font-weight:700;padding:12px 16px;border:3px solid #2a1d33;border-radius:10px;cursor:pointer;background:#fff;color:#2a1d33;display:inline-flex;gap:10px;align-items:center;justify-content:center}
#fbgate button.g{background:#3fbf5f;color:#fff;text-shadow:2px 2px 0 #2a8a43}#fbgate .err{color:#a8252a;font-weight:700}`;
let gate = null;
function showGate(html) {
  if (!gate) { const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st); gate = document.createElement('div'); gate.id = 'fbgate'; document.body.appendChild(gate); }
  gate.innerHTML = `<div class="box"><h1>Spell<span>Pets</span></h1>${html}</div>`; gate.hidden = false;
}
function hideGate() { if (gate) gate.hidden = true; }
function signInScreen(msg) {
  showGate(`<p>Sign in to play. Everyone's progress is saved to the family account, so it is there on any computer or tablet.</p>
    <button class="g" id="fbGoogle">Sign in with Google</button>${msg ? `<p class="err">${msg}</p>` : ''}`);
  document.getElementById('fbGoogle').onclick = async () => {
    const provider = new GoogleAuthProvider(); provider.setCustomParameters({ prompt: 'select_account' });
    try { await signInWithPopup(auth, provider); }
    catch (e) {
      if (e && (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment')) { try { await signInWithRedirect(auth, provider); return; } catch (e2) { e = e2; } }
      if (e && e.code === 'auth/popup-closed-by-user') return;
      signInScreen(e && e.code === 'auth/unauthorized-domain' ? 'This website address is not on the Firebase list of allowed domains yet.' : 'Sign-in did not work. Please try again.');
    }
  };
}
function notMemberScreen(u) {
  showGate(`<p>This Google account is not part of the family yet.</p><p class="small">Ask the parent to add this account. Account ID: <b>${u.uid}</b></p>
    <button id="fbOut">Use a different account</button>`);
  document.getElementById('fbOut').onclick = () => doSignOut();
}
function clearLocal() { try { Object.keys(localStorage).filter(k => k.startsWith('spellpets')).forEach(k => localStorage.removeItem(k)); } catch (e) {} }
async function doSignOut() { clearLocal(); try { await signOut(auth); } catch (e) {} location.reload(); }
window.SPELLPETS_SIGNOUT = doSignOut;
window.SPELLPETS_ACCOUNT = () => (currentUser ? { name: currentUser.displayName || '', email: currentUser.email || '', uid: currentUser.uid } : null);

let resolveReady; const ready = new Promise(r => { resolveReady = r; });
getRedirectResult(auth).catch(() => {});
onAuthStateChanged(auth, async u => {
  if (!u) { currentUser = null; signInScreen(); return; }
  currentUser = u;
  // a different account than last time on this device: start from a clean local copy
  try { const last = localStorage.getItem('spellpets-account'); if (last && last !== u.uid) clearLocal(); localStorage.setItem('spellpets-account', u.uid); } catch (e) {}
  showGate('<p>Loading your family’s players…</p>');
  try { await getDocs(query(collection(fs, ...seg('profiles')), limit(1))); }
  catch (e) { if (e && e.code === 'permission-denied') { notMemberScreen(u); return; } }
  // the family document itself (easy to find in the Firebase console; later it also lists the kids' own accounts)
  if (u.uid === OWNER_UID) setDoc(doc(fs, 'families', FAMILY), { parent: u.uid, parentName: u.displayName || '', lastSignIn: serverTimestamp() }, { merge: true }).catch(() => {});
  hideGate(); resolveReady();
});

window.claude = Object.freeze({ use: async name => { if (name === 'db') { await ready; return dbApi; } if (name === 'user') { await ready; return userApi; } return null; } });
