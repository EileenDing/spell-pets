"""Pack cached clips into one mp3 per lesson (zhaudio/<part>-<nn>.mp3) and write zh/zhaudio_index.js."""
import json, os, re
T = '/tmp/claude-0/-home-claude/73b1055a-597b-553d-8d3b-a747a428061d/scratchpad/tts/cache/'
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'zhaudio') + '/'; os.makedirs(OUT, exist_ok=True)
HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, '..', 'zh', 'zhdata.js'), encoding='utf8').read()
idx = {}; total = 0; n = 0
for part in ['1a', '1b', '2a', '2b']:
    chars = [l.split('|')[0] for l in re.search(r"'%s': `(.*?)`" % part, src, re.S).group(1).strip().split('\n')]
    for k in range(0, len(chars), 10):
        sess = chars[k:k + 10]
        files = [T + '%05x.json' % ord(c) for c in sess]
        if not all(os.path.exists(f) for f in files): continue
        blob = b''
        for c, f in zip(sess, files):
            clips = [x.encode('latin1') for x in json.load(open(f))]
            idx[c] = [len(x) for x in clips]; blob += b''.join(clips)
        open(OUT + '%s-%02d.mp3' % (part, k // 10), 'wb').write(blob); total += len(blob); n += 1
open(os.path.join(HERE, '..', 'zh', 'zhaudio_index.js'), 'w', encoding='utf8').write('const ZH_AUD = ' + json.dumps(idx, ensure_ascii=False, separators=(',', ':')) + ';\n')
print('lessons', n, 'chars', len(idx), 'MB', round(total / 1e6, 1))
