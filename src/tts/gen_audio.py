"""Pre-generate natural Chinese speech for the Chinese challenge (sherpa-onnx Matcha, Baker voice).
Per character, clips in this order: call, each word, sentence-with-blank-skipped, full sentence, character alone.
Clips cached in CACHE/<codepoint>.json (list of mp3 bytes as latin1) so the run can resume.
"""
import sys, os, json, re, unicodedata
import numpy as np, sherpa_onnx, lameenc
T = '/tmp/claude-0/-home-claude/73b1055a-597b-553d-8d3b-a747a428061d/scratchpad/tts/'
CACHE = T + 'cache/'; os.makedirs(CACHE, exist_ok=True)
src = open('/home/claude/zh/zhdata.js', encoding='utf8').read()
rows = []
for part in ['1a', '1b', '2a', '2b']:
    blk = re.search(r"'%s': `(.*?)`" % part, src, re.S).group(1).strip().split('\n')
    for l in blk:
        c, py, words, d, s = l.split('|'); rows.append((part, c, py, words.split(','), s))
TONES = {'ā':'a1','á':'a2','ǎ':'a3','à':'a4','ē':'e1','é':'e2','ě':'e3','è':'e4','ī':'i1','í':'i2','ǐ':'i3','ì':'i4','ō':'o1','ó':'o2','ǒ':'o3','ò':'o4','ū':'u1','ú':'u2','ǔ':'u3','ù':'u4','ǖ':'v1','ǘ':'v2','ǚ':'v3','ǜ':'v4','ü':'v0'}
def num(py):
    py = py.strip().split()[0].lower(); tone = ''; out = ''
    for ch in py:
        if ch in TONES: b, t = TONES[ch][0], TONES[ch][1]; out += b; tone = '' if t == '0' else t
        else: out += ch
    return out + tone
# private-use characters pin the exact reading of the target when it is said on its own
priv = {}
D0 = T + 'mz/'
lex = open(T + 'mz/lexicon.txt', encoding='utf8').read()
toks = set(l.split()[0] for l in open(T + 'mz/tokens.txt', encoding='utf8') if l.strip())
# stand-ins: rare real Han characters that never appear in our text or inside any multi-character entry
lines = lex.rstrip('\n').split('\n')
used = set(src)
inmulti = set()
for l in lines:
    w = l.split(' ', 1)[0]
    if len(w) > 1: inmulti.update(w)
for l in open(D0 + 'dict/jieba.dict.utf8', encoding='utf8'):
    w = l.split(' ', 1)[0]
    if len(w) > 1: inmulti.update(w)
spare = [l.split(' ', 1)[0] for l in lines if len(l.split(' ', 1)[0]) == 1 and '\u4e00' <= l[0] <= '\u9fff' and l[0] not in used and l[0] not in inmulti]
spare = sorted(set(spare))
print('spare stand-ins', len(spare), file=sys.stderr)
extra = []
for i, (part, c, py, words, s) in enumerate(rows):
    p = num(py)
    if p not in toks: print('no token', c, py, p, file=sys.stderr); continue
    priv[c] = spare[i]; extra.append(f'{priv[c]} {p}')
taken = set(priv.values())
LEX2 = T + 'mz/lexicon2.txt'
open(LEX2, 'w', encoding='utf8').write('\n'.join(l for l in lines if l.split(' ', 1)[0] not in taken) + '\n' + '\n'.join(extra) + '\n')
D = T + 'mz/'
cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(matcha=sherpa_onnx.OfflineTtsMatchaModelConfig(
    acoustic_model=D + 'model-steps-3.onnx', vocoder=T + 'vocos-22khz-univ.onnx', lexicon=LEX2, tokens=D + 'tokens.txt', dict_dir=D + 'dict'),
    num_threads=2), rule_fsts=D + 'phone.fst,' + D + 'date.fst,' + D + 'number.fst', max_num_sentences=1)
tts = sherpa_onnx.OfflineTts(cfg)
SR = None
def synth(text, speed=0.9):
    global SR
    a = tts.generate(text, sid=0, speed=speed); SR = a.sample_rate
    x = np.array(a.samples, dtype=np.float32)
    # trim near-silence at both ends, keep a little air
    idx = np.where(np.abs(x) > 0.01)[0]
    if len(idx): x = x[max(0, idx[0] - 600): idx[-1] + 1500]
    return x
def mp3(x):
    e = lameenc.Encoder(); e.set_bit_rate(24); e.set_in_sample_rate(SR); e.set_channels(1); e.set_quality(2)
    pcm = (np.clip(x, -1, 1) * 32767 * 0.95).astype('<i2').tobytes()
    return e.encode(pcm) + e.flush()
PUNCT = '，。！？、；：,.!?'
only = sys.argv[1:] 
for n, (part, c, py, words, s) in enumerate(rows):
    if only and c not in only: continue
    f = CACHE + '%05x.json' % ord(c)
    if os.path.exists(f) and not only: continue
    P = priv.get(c, c)
    call = f'{P}，{words[0]}的{P}。'
    clips = [synth(call)]
    for w in words:
        clips.append(synth(w if len(w) > 1 else P))
    parts = [p.strip(PUNCT + ' ') for p in s.split(c)]
    segs = []
    for k, p in enumerate(parts):
        if p: segs.append(synth(p + ('。' if k == len(parts) - 1 else '，')))
        if k < len(parts) - 1: segs.append(np.zeros(int(SR * 0.45), dtype=np.float32))
    clips.append(np.concatenate(segs) if segs else np.zeros(100, dtype=np.float32))
    clips.append(synth(s))                      # whole sentence, read after answering
    clips.append(synth(P + '。'))               # the character on its own
    json.dump([mp3(x).decode('latin1') for x in clips], open(f, 'w'))
    if n % 25 == 0: print(n, c, flush=True)
print('done')
