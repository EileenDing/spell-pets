// ================= 中文挑战 (grade 1–2 characters) =================
// the four textbooks (data + recorded audio are stored by book)
const ZH_BOOKS = [
  { id: '1a', short: '一上', book: '一年级上册' }, { id: '1b', short: '一下', book: '一年级下册' },
  { id: '2a', short: '二上', book: '二年级上册' }, { id: '2b', short: '二下', book: '二年级下册' }];
const ZA_PER = 10;               // characters per recorded audio bundle
const ZH_BY = {};
ZH_BOOKS.forEach(b => {
  b.chars = ZH_RAW[b.id].trim().split('\n').map((line, bi) => {
    const [c, py, words, d, s] = line.split('|');
    return ZH_BY[c] = { id: c, w: c, py, words: words.split(','), d: [...d], s, book: b.id, bi };
  });
});
// 10 stages of 160 characters in textbook order; inside a stage, 5 levels of 32 from easy/common to hard/rare
const ZH_PER = 8, ZH_LV = 32, ZH_LV_SESS = ZH_LV / ZH_PER;
const ZH_NUM = '一二三四五六七八九十';
const ZH_REWARD = [2, 4, 7, 9];   // finishing these stages hatches a new pet
const ZH_PARTS = ZH_STAGES.map((str, k) => {
  const chars = [...str].map(c => ZH_BY[c]);
  const books = ZH_BOOKS.filter(b => chars.some(w => w.book === b.id)).map(b => b.short);
  return { id: 'g' + (k + 1), k, title: '第' + (k < 10 ? ZH_NUM[k] : k + 1) + '关', book: books.join('–'), chars,
    levels: [0, 1, 2, 3, 4].map(l => chars.slice(l * ZH_LV, (l + 1) * ZH_LV)), sessions: chars.length / ZH_PER, reward: ZH_REWARD.includes(k) };
});
const TONES = { a: 'āáǎà', e: 'ēéěè', i: 'īíǐì', o: 'ōóǒò', u: 'ūúǔù', v: 'ǖǘǚǜ' };
function pyToNum(py) {
  let base = '', tone = 5;
  for (const ch of py.normalize('NFC')) {
    let hit = false;
    for (const [v, ms] of Object.entries(TONES)) { const k = ms.indexOf(ch); if (k >= 0) { base += v; tone = k + 1; hit = true; break; } }
    if (!hit) base += ch === 'ü' ? 'v' : ch;
  }
  return base + tone;
}
function numToPy(base, tone) {
  let s = base;
  if (tone >= 1 && tone <= 4 && s) {
    let i = s.indexOf('a'); if (i < 0) i = s.indexOf('e'); if (i < 0 && s.includes('ou')) i = s.indexOf('o');
    if (i < 0) for (let k = s.length - 1; k >= 0; k--) if ('aeiouv'.includes(s[k])) { i = k; break; }
    if (i >= 0) s = s.slice(0, i) + TONES[s[i]][tone - 1] + s.slice(i + 1);
  }
  return s.replace(/v/g, 'ü');
}
let ZHVOICE = null;
// Rank Chinese voices: neural / natural / enhanced voices sound much smoother than the basic ones.
function zhVoiceScore(v) {
  let sc = 0; const n = v.name;
  if (/zh[-_]CN/i.test(v.lang)) sc += 50; else if (/HK|TW|yue/i.test(v.lang + n)) sc -= 30;
  if (/Natural|Neural|神经/i.test(n)) sc += 40;
  if (/Online/i.test(n)) sc += 15;
  if (/Premium|高级/i.test(n)) sc += 35; else if (/Enhanced|增强/i.test(n)) sc += 25;
  if (/Xiaoxiao|Xiaoyi|Yunxi|Xiaohan|Xiaomo|Yunyang/i.test(n)) sc += 20;
  if (/Google/i.test(n)) sc += 18;
  if (/Tingting|婷婷|Lilian|Yu-shu|Meijia/i.test(n)) sc += 10;
  if (/Compact|eSpeak/i.test(n)) sc -= 40;
  if (v.localService === false) sc += 3;
  return sc;
}
const zhVoices = () => ('speechSynthesis' in window ? speechSynthesis.getVoices() : []).filter(v => /^zh|cmn/i.test(v.lang) && !/HK|yue/i.test(v.lang)).sort((a, b) => zhVoiceScore(b) - zhVoiceScore(a));
function pickZhVoice() {
  const vs = zhVoices(); if (!vs.length) { ZHVOICE = null; return; }
  let want = null; try { want = S.zhVoice; } catch (e) {}
  ZHVOICE = (want && vs.find(v => v.name === want)) || vs[0];
  const sel = document.getElementById('zhVoiceSel'); if (sel) sel.outerHTML = zhVoicePicker();
}
if ('speechSynthesis' in window) { pickZhVoice(); const prev = speechSynthesis.onvoiceschanged; speechSynthesis.onvoiceschanged = () => { prev && prev(); pickZhVoice(); }; }
// One utterance per call (separate utterances make the speech choppy).
function sayZh(text, slow) {
  if (!('speechSynthesis' in window)) { toast('这个浏览器不能朗读。'); return; }
  if (!ZHVOICE) pickZhVoice();
  try {
    speechSynthesis.cancel();
    const t = (Array.isArray(text) ? text.filter(x => x && x.trim()).join('，') : text || '').trim(); if (!t) return;
    const u = new SpeechSynthesisUtterance(t); u.lang = ZHVOICE ? ZHVOICE.lang : 'zh-CN'; if (ZHVOICE) u.voice = ZHVOICE;
    u.rate = slow ? 0.6 : 0.9; u.pitch = 1;
    setTimeout(() => speechSynthesis.speak(u), 60);
  } catch (e) {}
}
// ---- Built-in recorded voice (natural Mandarin, generated ahead of time) ----
// Each lesson's clips live in zhaudio/<part>-<nn>.mp3: the clips of its 10 characters back to back.
// ZH_AUD[c] = byte length of each clip: call, word1..n, sentence-with-blank, full sentence, character alone.
const ZA = { bufs: {}, loading: {}, el: null, url: null, ok: true };
const zaUseBuiltin = () => { let v = ''; try { v = S.zhVoice || ''; } catch (e) {} return !v && typeof ZH_AUD !== 'undefined' && ZA.ok; };
function zaKey(c) { const w = ZH_BY[c], b = ZH_BOOKS.find(q => q.id === w.book), n = Math.floor(w.bi / ZA_PER); return { key: b.id + '-' + String(n).padStart(2, '0'), list: b.chars.slice(n * ZA_PER, n * ZA_PER + ZA_PER) }; }
function zaLoad(key) {
  if (ZA.bufs[key]) return Promise.resolve(ZA.bufs[key]);
  if (!ZA.loading[key]) ZA.loading[key] = fetch('zhaudio/' + key + '.mp3').then(r => { if (!r.ok) throw new Error('http ' + r.status); return r.arrayBuffer(); })
    .then(b => (ZA.bufs[key] = b)).catch(e => { ZA.loading[key] = null; throw e; });
  return ZA.loading[key];
}
function zaPreload(chars) { if (!zaUseBuiltin()) return; [...new Set(chars.filter(c => ZH_BY[c] && ZH_AUD[c]).map(c => zaKey(c).key))].forEach(k => zaLoad(k).catch(() => {})); }
function zaEl() {
  if (!ZA.el) { ZA.el = new Audio(); ZA.el.preload = 'auto'; try { ZA.el.preservesPitch = true; ZA.el.webkitPreservesPitch = true; ZA.el.mozPreservesPitch = true; } catch (e) {} }
  return ZA.el;
}
// iPad / iPhone only let a page play sound after a tap: play a silent blip on the first tap so later clips are allowed.
document.addEventListener('pointerdown', function unlockZa() {
  const a = zaEl(); a.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA='; const pr = a.play(); if (pr && pr.catch) pr.catch(() => {});
  document.removeEventListener('pointerdown', unlockZa);
});
function zaIndex(c, kind) { const n = ZH_BY[c].words.length; return kind === 'call' ? 0 : kind === 'blank' ? 1 + n : kind === 'full' ? 2 + n : kind === 'self' ? 3 + n : 1 + (+kind); }
async function zaPlay(c, kind, slow) {
  const lens = ZH_AUD[c]; const ix = zaIndex(c, kind); if (!lens || lens[ix] == null) throw new Error('no clip');
  const { key, list } = zaKey(c); const buf = await zaLoad(key);
  let off = 0; for (const w of list) { if (w.id === c) break; off += ZH_AUD[w.id].reduce((a, b) => a + b, 0); }
  for (let k = 0; k < ix; k++) off += lens[k];
  const a = zaEl(); try { a.pause(); } catch (e) {}
  if (ZA.url) URL.revokeObjectURL(ZA.url);
  ZA.url = URL.createObjectURL(new Blob([buf.slice(off, off + lens[ix])], { type: 'audio/mpeg' }));
  a.src = ZA.url; a.playbackRate = slow ? 0.72 : 1;
  await a.play();
}
// Speak one thing about character c. kind: 'call' | 'blank' | 'full' | 'self' | word index.
// Uses the built-in recordings; falls back to the device voice if they can't load.
function zhSay(c, kind, slow) {
  const w = ZH_BY[c]; if (!w) return;
  const text = kind === 'call' ? zhCall(w) : kind === 'blank' ? zhSkip(w.s.split(w.id)) : kind === 'full' ? w.s : kind === 'self' ? w.id : w.words[+kind];
  if (!zaUseBuiltin()) return sayZh(text, slow);
  try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) {}
  zaPlay(c, kind, slow).catch(err => { if (err && err.name === 'NotAllowedError') return; sayZh(text, slow); });
}
function zhStopVoice() { try { ZA.el && ZA.el.pause(); } catch (e) {} try { 'speechSynthesis' in window && speechSynthesis.cancel(); } catch (e) {} }
// Read the sentence but skip the missing character: a short pause stands in for the blank.
function zhSkip(parts) { return parts.map(p => p.replace(/^[，。！？、]+/, '')).filter(p => p.trim()); }
function zhVoicePicker() {
  const vs = zhVoices();
  const cur = (() => { try { return S.zhVoice || ''; } catch (e) { return ''; } })();
  return `<label class="zhvoice zh" id="zhVoiceSel">朗读声音 <select id="zhVoicePick"><option value="" ${cur ? '' : 'selected'}>标准普通话（推荐）</option>${vs.map(v => `<option value="${esc(v.name)}" ${cur && v.name === cur ? 'selected' : ''}>设备：${esc(v.name.replace(/Microsoft |Google /, '').replace(/ - .*$/, ''))}</option>`).join('')}</select> <button class="btn small zh" type="button" id="zhVoiceTest">试听</button></label>`;
}
const zhCall = w => `${w.id}，${w.words[0]}的${w.id}`;
function zhState() {
  const z = (S.zh = S.zh || { done: {}, mistakes: {}, rewarded: [] });
  if (!z.v2) zhMigrate(z);
  return z;
}
// old saves had 4 stages of 10-character lessons: keep what was learned and the pets already earned
function zhMigrate(z) {
  const learned = new Set();
  Object.keys(z.done).forEach(key => { const m = key.match(/^(1a|1b|2a|2b)-(\d+)$/); if (!m) return; const b = ZH_BOOKS.find(q => q.id === m[1]); b.chars.slice(+m[2] * 10, +m[2] * 10 + 10).forEach(w => learned.add(w.id)); });
  const done = {};
  ZH_PARTS.forEach(p => { for (let i = 0; i < p.sessions; i++) if (p.chars.slice(i * ZH_PER, i * ZH_PER + ZH_PER).every(w => learned.has(w.id))) done[p.id + '-' + i] = 1; });
  const oldRewards = (z.rewarded || []).filter(id => /^(1a|1b|2a|2b)$/.test(id)).length;
  z.done = done; z.rewarded = ZH_PARTS.filter(p => p.reward).slice(0, oldRewards).map(p => p.id); z.v2 = 1;
  if (learned.size) z.hadOld = learned.size;
}
const zhPartDone = p => { const z = zhState(); for (let i = 0; i < p.sessions; i++) if (!z.done[p.id + '-' + i]) return false; return true; };
const zhPartPlayed = p => { const z = zhState(); for (let i = 0; i < p.sessions; i++) if (z.done[p.id + '-' + i] === 1) return true; return false; };
const zhPartOpen = k => k === 0 || isTester() || zhPartDone(ZH_PARTS[k - 1]) || (zhState().place && zhState().place.k >= k);
const zhDoneCount = p => { const z = zhState(); let n = 0; for (let i = 0; i < p.sessions; i++) if (z.done[p.id + '-' + i]) n++; return n; };
const zhNextIdx = p => { const z = zhState(); for (let i = 0; i < p.sessions; i++) if (!z.done[p.id + '-' + i]) return i; return -1; };
function zhPendingReward() { const z = zhState(); return ZH_PARTS.find(p => p.reward && zhPartDone(p) && zhPartPlayed(p) && !z.rewarded.includes(p.id)); }
let zhPartSel = 0;

function renderZhHub() {
  const z = zhState(), t = today();
  if (!z.place) return `<div class="panel zh zhhub"><h2 class="zh">先测一测你认识多少字</h2>
      <p class="zhlead">一共 <b>1600</b> 个字，分成十关，每关 160 个字，又分成 5 级，从容易、常用的字到难一点的字。</p>
      <p>测试只听读音、选字：每一级抽 4 个字。哪一级错了 2 个或更多，就从那一级开始学。</p>
      ${z.hadOld ? `<p class="muted">你以前学过的 ${z.hadOld} 个字都保留着。</p>` : ''}
      <button class="btn big go zh" id="zhPlaceGo">开始测试</button>
      <p class="center small"><button class="linkbtn zh" id="zhPlaceSkip">跳过测试，从第一关开始</button></p></div>`;
  if (!zhPartOpen(zhPartSel)) zhPartSel = 0;
  const due = Object.keys(z.mistakes).filter(c => ZH_BY[c] && z.mistakes[c] < t), later = Object.keys(z.mistakes).filter(c => ZH_BY[c] && z.mistakes[c] >= t);
  const p = ZH_PARTS[zhPartSel], nxt = zhNextIdx(p);
  return `<div class="panel zh zhhub">
      <p class="zhlead">一共 <b>1600</b> 个字，分成十关，每关 5 级。通过第三、五、八、十关，就能得到一只新宠物！</p>
      <div class="zhparts">${ZH_PARTS.map((q, k) => { const open = zhPartOpen(k), done = zhPartDone(q), n = zhDoneCount(q);
        return `<button class="zhpart ${k === zhPartSel ? 'sel' : ''} ${done ? 'done' : open ? 'open' : 'locked'}" data-zhpart="${k}" ${open ? '' : 'disabled'}>
          <b>${q.title}${q.reward ? ' <span class="egg-dot" title="通关得宠物">★</span>' : ''}</b><span class="small">${q.book}</span>
          <div class="bar small"><i style="width:${Math.round(n / q.sessions * 100)}%"></i></div>
          <span class="small">${done ? '已通关' : open ? n + ' / ' + q.sessions : '未解锁'}</span></button>`; }).join('')}</div>
    </div>
    <div class="panel zh">
      <h2 class="zh">${p.title} <span class="muted small">${p.book}</span></h2>
      ${due.length ? `<p>今天有 <b>${due.length}</b> 个错字要复习，会加到下一课里，复习时每轮答对得 $1。</p>` : ''}
      ${later.length ? `<p class="muted">${later.length} 个错字明天再复习。</p>` : ''}
      <div class="zhlevels">${p.levels.map((lv, l) => `<div class="zhlv"><span class="zhlvname">第${ZH_NUM[l]}级</span><span class="zhlvchars">${lv.slice(0, 6).map(w => w.id).join('')}…</span>
        <div class="zhsess">${Array.from({ length: ZH_LV_SESS }, (_, j) => { const i = l * ZH_LV_SESS + j, d = z.done[p.id + '-' + i], avail = d || i === nxt;
          return `<button class="zhs ${d === 's' ? 'skip' : d ? 'done' : ''} ${i === nxt ? 'next' : ''}" data-zhsess="${i}" ${avail ? '' : 'disabled'} title="第${i + 1}课">${i + 1}</button>`; }).join('')}</div></div>`).join('')}</div>
      ${nxt >= 0 ? `<button class="btn big go" data-zhsess="${nxt}"><span class="zh">开始第 ${nxt + 1} 课</span></button>` : `<p>这一关已经全部完成啦！可以点上面的数字再练一遍。</p>`}
      <p class="muted small zh">每课 8 个字，三轮：听音识字 → 写拼音 → 句子里选字。每个字每轮答对得 $0.5。浅色的课是测试时已经会了的，可以点开复习。</p>
      ${zhVoicePicker()}
      <p class="center small"><button class="linkbtn zh" id="zhRetest">重新测试</button></p>
    </div>`;
}
function zhVoiceDemo() { if (zaUseBuiltin()) { zaPreload(['天']); zhSay('天', 'full'); } else sayZh('小朋友，你好！我们一起来认字吧。'); }
function zhHubClick(e) {
  if (e.target.closest('#zhVoiceTest')) { zhVoiceDemo(); return; }
  if (e.target.closest('#zhVoicePick')) return;
  if (e.target.closest('#zhPlaceGo')) { startZhPlacement(); return; }
  if (e.target.closest('#zhRetest')) { startZhPlacement(); return; }
  if (e.target.closest('#zhPlaceSkip')) { const z = zhState(); z.place = { k: 0, lv: 0, at: today(), skipped: true }; save(); renderChal(); return; }
  const pb = e.target.closest('[data-zhpart]'); if (pb) { zhPartSel = +pb.dataset.zhpart; renderChal(); return; }
  const sb = e.target.closest('[data-zhsess]'); if (sb) startZhSession(zhPartSel, +sb.dataset.zhsess);
}
function startZhSession(k, idx) {
  if (!S.pets.length) { maybeFirstPet(); return; }
  const p = ZH_PARTS[k], z = zhState(), t = today();
  const items = p.chars.slice(idx * ZH_PER, idx * ZH_PER + ZH_PER).map(w => ({ id: w.id, review: false }));
  const have = new Set(items.map(i => i.id));
  shuffle(Object.keys(z.mistakes).filter(c => ZH_BY[c] && z.mistakes[c] < t && !have.has(c))).slice(0, 5).forEach(c => items.push({ id: c, review: true }));
  P = { mode: 'zh', zhPart: k, zhIdx: idx, items, round: 1, idx: 0, order: { 1: shuffle(items), 2: shuffle(items), 3: shuffle(items) }, res: Object.fromEntries(items.map(i => [i.id, [null, null, null]])), busy: false, typed: '', tone: 0 };
  zaPreload(items.map(i => i.id));
  route('play'); roundIntro();
}
const ZH_ROUND = {
  1: { name: '第一轮 · 听音识字', short: '听音识字', how: '听一听，然后打中写着这个字的气球。小心长得很像的字！' },
  2: { name: '第二轮 · 写拼音', short: '写拼音', how: '看字，写出它的拼音，别忘了声调。' },
  3: { name: '第三轮 · 句子里选字', short: '句子里选字', how: '读句子，选出空格里的字。' }
};
function zhWordsHtml(w, show) {
  // show: false = blank out the character, 'plain' = show it quietly, true = answer revealed (highlight + read-aloud buttons)
  return w.words.map((x, i) => {
    const inner = [...x].map(ch => ch === w.id ? (show === false ? '<i class="zhblank"></i>' : show === true ? `<b>${ch}</b>` : esc(ch)) : esc(ch)).join('');
    return show === true ? `<button class="zhword say" data-say="${i}" aria-label="读 ${esc(x)}">${inner}${icon('speaker', 'spk')}</button>` : `<span class="zhword">${inner}</span>`;
  }).join('');
}
// The answer box sits right under the question: feedback line + the common words for this character.
function zhAnsBox(w, hint, plain) {
  return `<div class="panel zh zhans" id="zhAns"><div class="fb" id="fb" aria-live="polite"><span class="muted zh">${hint}</span></div>
    <div id="zhWordsWrap" hidden><p class="eyebrow">常用词组 · 点一点听读音</p><div class="zhwords" id="zhWords"></div></div></div>`;
}
function zhReveal() {
  const w = P && P.mode === 'zh' && ZH_BY[cur().id]; if (!w) return;
  const el = $('#zhWords'); if (!el) return;
  el.innerHTML = `<button class="zhword say zhself" data-say="self" aria-label="读 ${esc(w.id)}"><b>${esc(w.id)}</b><span class="zhpy">${esc(w.py)}</span>${icon('speaker', 'spk')}</button>` + zhWordsHtml(w, true);
  $('#zhAns').classList.add('open'); $('#zhWordsWrap').hidden = false;
  if (!el.dataset.wired) { el.dataset.wired = 1; el.addEventListener('click', e => { const b = e.target.closest('[data-say]'); const ww = P && P.mode === 'zh' && ZH_BY[cur().id]; if (b && ww) zhSay(ww.id, b.dataset.say); }); }
}
// After every answer: show the result and wait for 下一个, so there is time to read and listen to the words.
function zhDone(ok, msg) {
  $('#fb').innerHTML = `<span class="${ok ? 'good' : 'badtxt'} zh">${icon(ok ? 'check' : 'cross')} ${msg}</span> <button class="btn go zh" id="nextBtn">下一个</button>`;
  $('#nextBtn').addEventListener('click', next); $('#nextBtn').focus({ preventScroll: true });
}
function zhHearBtns() { return `<div class="ask"><button class="btn speak" id="hear">${icon('speaker', 'spk')} <span class="zh">听一听</span></button><button class="btn speak slow" id="hearSlow"><span class="zh">慢一点</span></button></div>`; }
function zhWireHear(w) { $('#hear').addEventListener('click', () => zhSay(w.id, 'call')); $('#hearSlow').addEventListener('click', () => zhSay(w.id, 'call', true)); }

// round 2: pinyin
const ZKB = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
function zhSpell() {
  stopArena();
  const w = ZH_BY[cur().id]; P.typed = ''; P.tone = 0;
  $('#stage').innerHTML = `<div class="panel zh zhspell"><div class="tian"><span>${esc(w.id)}</span></div>
      <div><p class="muted small">这个字怎么拼？</p><div class="pytyped" id="pyTyped"></div></div></div>
    ${zhAnsBox(w, '打字母，再点声调。电脑键盘也可以用：数字 1–4 是声调，v 是 ü。', true)}
    <div class="kb" id="kb">${ZKB.map((row, i) => `<div class="kbrow">${[...row].map(ch => `<button class="key" data-k="${ch}">${ch === 'v' ? 'v' : ch}</button>`).join('')}${i === 2 ? '<button class="key" data-k="ü">ü</button>' : ''}</div>`).join('')}
      <div class="kbrow tones">${[['1', 'ˉ'], ['2', 'ˊ'], ['3', 'ˇ'], ['4', 'ˋ'], ['5', '轻']].map(([n, l]) => `<button class="key tone" data-t="${n}" aria-label="第${n}声">${l}</button>`).join('')}<button class="key wide" data-k="back">删</button><button class="key wide go" data-k="enter">确定</button></div></div>`;
  $('#kb').addEventListener('click', e => { const b = e.target.closest('.key'); if (!b) return; if (b.dataset.t) zhTone(+b.dataset.t); else zhKey(b.dataset.k); });
  renderPy();
}
function renderPy(state) {
  const el = $('#pyTyped'); if (!el) return;
  const txt = numToPy(P.typed, P.tone);
  el.innerHTML = `<span class="${state || ''}">${esc(txt) || '&nbsp;'}</span>${state ? '' : '<i class="caretpy"></i>'}${P.tone ? '' : (P.typed ? '<small class="muted">声调？</small>' : '')}`;
  document.querySelectorAll('.key.tone').forEach(k => k.classList.toggle('on', +k.dataset.t === P.tone));
}
function zhKey(k) {
  if (!P || P.mode !== 'zh' || P.round !== 2 || P.busy) return;
  if (k === 'back') { if (P.tone) P.tone = 0; else P.typed = P.typed.slice(0, -1); }
  else if (k === 'enter') return zhCheckPy();
  else if (/^[a-z]$/.test(k) && P.typed.length < 7) { P.typed += k; SFX.tap(); }
  else if (k === 'ü' && P.typed.length < 7) { P.typed += 'v'; SFX.tap(); }
  renderPy();
}
function zhTone(n) { if (!P || P.busy) return; P.tone = n; SFX.tap(); renderPy(); }
function zhCheckPy() {
  if (!P.typed) { toast('先拼一拼吧。'); return; }
  if (!P.tone) { toast('别忘了点声调。'); return; }
  P.busy = true;
  const w = ZH_BY[cur().id], want = pyToNum(w.py), got = P.typed + P.tone;
  const ok = got === want || (want.endsWith('5') && got === want.slice(0, -1) + '5');
  mark(ok); renderPy(ok ? 'ok' : 'no');
  zhSay(w.id, 'call');
  zhDone(ok, ok ? `拼对了！<b class="pyans">${esc(w.py)}</b>` : `正确的拼音是 <b class="pyans">${esc(w.py)}</b>`);
}
// round 3: sentence
function zhSentence() {
  stopArena();
  const w = ZH_BY[cur().id], opts = shuffle([w.id, ...w.d]);
  const parts = w.s.split(w.id);
  $('#stage').innerHTML = `<div class="ask"><button class="btn speak" id="hearS">${icon('speaker', 'spk')} <span class="zh">读给我听</span></button></div>
    <div class="panel sentence zh"><p class="sent zhsent">${parts.map(esc).join('<span class="blank zhb">？</span>')}</p></div>
    ${zhAnsBox(w, '哪个字放进去最合适？选好以后按「确定」。')}
    <div class="opts zhopts">${opts.map((o, i) => `<button class="btn opt zh" data-o="${esc(o)}"><b>${i + 1}</b>${esc(o)}</button>`).join('')}</div>
    ${confirmRow('<span class="zh">确定</span>')}`;
  $('#hearS').addEventListener('click', () => zhSay(w.id, 'blank'));
  wireConfirm();
  document.querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => setPick(b, () => {
    if (P.busy) return; P.busy = true;
    const ok = b.dataset.o === w.id; mark(ok);
    document.querySelectorAll('.zhb').forEach(x => { x.textContent = w.id; x.classList.add('filled'); });
    document.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (x.dataset.o === w.id) x.classList.add('right'); else if (x === b) x.classList.add('wrong'); });
    zhSay(w.id, 'full');
    zhDone(ok, ok ? '选对了！' : `应该是「${esc(w.id)}」。`);
  })));
}
function finishZh() {
  stopArena();
  const z = zhState(), t = today(); let earned = 0, right = 0;
  const pet0 = S.pets[S.active];
  const rows = P.items.map(it => {
    const r = P.res[it.id], all = r.every(v => v === true), w = ZH_BY[it.id];
    const per = it.review ? 1 : 0.5, pay = r.filter(v => v === true).length * per; earned += pay; if (all) right++;
    if (all) delete z.mistakes[it.id]; else z.mistakes[it.id] = t;
    return { w, r, pay, review: it.review };
  });
  const p = ZH_PARTS[P.zhPart]; z.done[p.id + '-' + P.zhIdx] = 1;
  const prevDay = S.lastDay, firstToday = prevDay !== t;
  if (firstToday) { S.streak = prevDay && daysBetween(prevDay, t) === 1 ? S.streak + 1 : 1; S.lastDay = t; S.days = [...S.days.filter(d => d !== t), t].slice(-60); }
  S.best = Math.max(S.best || 0, S.streak);
  S.coins = Math.round((S.coins + earned) * 10) / 10; S.earned = Math.round((S.earned + earned) * 10) / 10;
  if (pet0) { S.partner[pet0.kind] = (S.partner[pet0.kind] || 0) + 1; if (S.partner[pet0.kind] >= LTD_AFTER && !S.owned['ltd-' + pet0.kind]) { S.owned['ltd-' + pet0.kind] = 1; LTD_QUEUE.push(pet0.kind); } }
  save(); renderHud(); SFX.coin(); if (firstToday) setTimeout(SFX.fanfare, 250);
  $('#roundLabel').textContent = '成绩'; $('#pips').innerHTML = ''; $('#quitBar').hidden = true;
  const partNow = zhPartDone(p);
  $('#stage').innerHTML = `<div class="panel results zh">
    <div class="res-head"><img class="pxi petimg big" src="${petURL(pet0)}" alt=""><div>
      <p class="eyebrow">${p.title} · 第 ${P.zhIdx + 1} 课完成</p><h2 class="rt zh">学会了 ${right} / ${P.items.length} 个字</h2>
      <p class="earn">${coinAmt(earned)}</p>
      ${firstToday ? `<p class="streakwin">${icon('flame', 'flame')} ${S.streak}-day streak!</p>` : ''}
      ${partNow ? `<p class="good">${p.title}通关啦！</p>` : ''}</div></div>
    <ul class="reslist">${rows.map(x => `<li><span class="rw"><span class="zhc">${esc(x.w.id)}</span> <small class="pysmall">${esc(x.w.py)}</small> <small class="muted">${esc(x.w.words[0])}</small>${x.review ? '<em>复习</em>' : ''}</span><span class="marks">${x.r.map(v => icon(v ? 'check' : 'cross')).join('')}</span><span class="pay ${x.pay ? '' : 'zero'}">${x.pay ? '+$' + money(x.pay) : '$0'}</span></li>`).join('')}</ul>
    ${rows.some(x => !x.r.every(v => v === true)) ? `<p class="muted">没有三轮全对的字会记下来，明天再练，复习时每轮答对得 $1。</p>` : ''}
    <div class="row"><button class="btn go big zh" id="zhAgain">继续下一课</button><button class="btn zh" id="zhBack">返回中文挑战</button></div></div>`;
  const k = P.zhPart; P = null;
  const goNext = () => { const kk = zhPartDone(ZH_PARTS[k]) && k < ZH_PARTS.length - 1 ? k + 1 : k; const nx = zhNextIdx(ZH_PARTS[kk]); if (nx >= 0 && zhPartOpen(kk)) { zhPartSel = kk; startZhSession(kk, nx); } else { chalId = 'zh'; route('chal'); } };
  $('#zhAgain').addEventListener('click', () => claimRewards(goNext));
  $('#zhBack').addEventListener('click', () => claimRewards(() => { chalId = 'zh'; route('chal'); }));
  setTimeout(() => { if (zhPendingReward() || LTD_QUEUE.length) claimRewards(() => { chalId = 'zh'; route('chal'); }); }, 900);
}
function zhKeydown(e) {
  if (P.round === 1 && /^[1-4]$/.test(e.key) && targets.length) { const t = targets.find(x => x.i === +e.key - 1); if (t) setPick(t.el, () => shoot(t)); return; }
  if (P.round === 2 && $('#pyTyped')) {
    if (e.key === 'Backspace') { e.preventDefault(); zhKey('back'); }
    else if (e.key === 'Enter') { e.preventDefault(); zhKey('enter'); }
    else if (/^[1-5]$/.test(e.key)) zhTone(+e.key);
    else if (/^[a-zA-Z]$/.test(e.key)) zhKey(e.key.toLowerCase());
    return;
  }
  if (P.round === 3 && /^[1-4]$/.test(e.key)) { const o = document.querySelectorAll('.opt')[+e.key - 1]; if (o && !o.disabled) o.click(); }
}

// ================= 中文水平测试：只听读音选字。每关 5 级 × 4 字；某一级错 2 个或更多，就从那一级开始学 =================
function zhPlaceItems(k) {
  const p = ZH_PARTS[k];
  return p.levels.flatMap((lv, l) => shuffle(lv.filter(w => w.d && w.d.length >= 3)).slice(0, 4).map(w => ({ id: w.id, lv: l })));
}
function startZhPlacement() {
  if (!S.pets.length) { maybeFirstPet(); return; }
  P = { mode: 'zhplace', k: 0, list: zhPlaceItems(0), idx: 0, round: 0, res: {}, busy: false, passed: [] };
  P.list.forEach(it => { P.res[it.id] = [null, null, null]; });
  route('play'); zhPlacePartIntro();
}
function zhPlaceTop() {
  $('#roundLabel').textContent = `中文水平测试 · ${ZH_PARTS[P.k].title}`; $('#roundLabel').classList.add('zh');
  $('#pips').innerHTML = P.list.map((it, i) => { const r = P.res[it.id][0]; return `<i class="${r === true ? 'ok' : r === false ? 'no' : ''} ${i === P.idx ? 'now' : ''}"></i>`; }).join('');
  $('#quitBar').hidden = true; setQuitLabel();
}
function zhPlacePartIntro() {
  stopArena(); zhPlaceTop();
  const p = ZH_PARTS[P.k];
  $('#stage').innerHTML = `<div class="panel intro zh"><p class="eyebrow">中文水平测试</p><h2 class="rt zh">${p.title}（${p.book}）</h2>
    <p class="zhhow">听读音，选出正确的字。一共 5 级，每级 4 个字。</p><button class="btn big go" id="goRound"><span class="zh">开始！</span></button></div>`;
  $('#goRound').addEventListener('click', zhPlaceQ); $('#goRound').focus();
}
function zhPlaceQ() {
  P.busy = false; PICK = null; zhPlaceTop();
  const it = P.list[P.idx], w = ZH_BY[it.id], opts = shuffle([w.id, ...w.d.slice(0, 3)]);
  $('#stage').innerHTML = `${zhHearBtns()}
    <p class="muted center zh">第${ZH_NUM[it.lv]}级 · 听到的是哪个字？</p>
    <div class="zhopts zhplaceopts">${opts.map(c => `<button class="btn zhc" data-c="${c}">${c}</button>`).join('')}</div>
    ${confirmRow('<span class="zh">确定</span>')}
    <div class="fb" id="fb" aria-live="polite"></div>`;
  zhWireHear(w); wireConfirm();
  document.querySelectorAll('.zhplaceopts .zhc').forEach(b => b.addEventListener('click', () => setPick(b, () => zhPlacePick(b))));
  setTimeout(() => zhSay(w.id, 'call'), 250);
}
function zhPlacePick(btn) {
  if (P.busy) return; P.busy = true;
  const it = P.list[P.idx], ok = btn.dataset.c === it.id;
  P.res[it.id][0] = ok; ok ? SFX.good() : SFX.bad(); zhPlaceTop();
  document.querySelectorAll('.zhplaceopts .zhc').forEach(b => { b.disabled = true; if (b.dataset.c === it.id) b.classList.add('right'); else if (b === btn) b.classList.add('wrong'); });
  const me = P; setTimeout(() => { if (P === me) zhPlaceNext(); }, ok ? 700 : 1300);
}
function zhPlaceNext() {
  const it = P.list[P.idx]; P.idx++;
  const lastOfLevel = P.idx >= P.list.length || P.list[P.idx].lv !== it.lv;
  if (lastOfLevel) {
    const wrong = P.list.filter(x => x.lv === it.lv && P.res[x.id][0] !== true).length;
    if (wrong >= 2) return zhPlaceFinish(P.k, it.lv);
    if (P.idx >= P.list.length) {               // whole stage passed
      if (P.k >= ZH_PARTS.length - 1) return zhPlaceFinish(ZH_PARTS.length, 0);
      return zhPlaceStagePassed();
    }
  }
  zhPlaceQ();
}
function zhPlaceStagePassed() {
  stopArena(); zhPlaceTop();
  const p = ZH_PARTS[P.k], nx = ZH_PARTS[P.k + 1];
  $('#stage').innerHTML = `<div class="panel intro zh"><h2 class="rt zh">${p.title}全部通过！</h2>
    <p class="zhhow">太棒了！要不要接着测${nx.title}？</p>
    <div class="row"><button class="btn big go zh" id="zhPlaceMore">继续测${nx.title}</button><button class="btn zh" id="zhPlaceStop">就从${nx.title}开始学</button></div></div>`;
  $('#zhPlaceMore').addEventListener('click', () => { P.k++; P.list = zhPlaceItems(P.k); P.idx = 0; P.list.forEach(x => { P.res[x.id] = [null, null, null]; }); zhPlacePartIntro(); });
  $('#zhPlaceStop').addEventListener('click', () => zhPlaceFinish(P.k + 1, 0));
}
function zhPlaceFinish(k, lv) {
  const z = zhState();
  z.place = { k: Math.min(k, ZH_PARTS.length - 1), lv: k >= ZH_PARTS.length ? 5 : lv, at: today() };
  // lessons before the starting point count as known (marked 's'); lessons already played stay as they are
  const stopK = Math.min(k, ZH_PARTS.length), stopI = k >= ZH_PARTS.length ? 0 : lv * ZH_LV_SESS;
  ZH_PARTS.forEach((p, pk) => { for (let i = 0; i < p.sessions; i++) { const key = p.id + '-' + i; if ((pk < stopK || (pk === stopK && i < stopI)) && !z.done[key]) z.done[key] = 's'; } });
  save(); P = null;
  zhPartSel = z.place.k;
  const p = ZH_PARTS[z.place.k];
  const msg = k >= ZH_PARTS.length ? '1600 个字全部通过，太厉害了！可以随时点开任何一课复习。' : `从<b>${p.title}第${ZH_NUM[lv]}级</b>开始学。`;
  chalId = 'zh'; route('chal');
  openModal(`<h2 class="mtitle zh">测试完成！</h2><p class="msub zh">${msg}</p><button class="btn big go zh" id="zhPlaceOk">好的</button>`, true);
  $('#zhPlaceOk').addEventListener('click', () => { closeModal(true); renderChal(); });
}
