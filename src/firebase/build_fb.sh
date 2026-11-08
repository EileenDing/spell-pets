#!/bin/bash
# Builds the stand-alone website into the repo root: index.html (+ zhaudio/ is already there).
set -e
cd "$(dirname "$0")"
[ -d node_modules/firebase ] || npm install --silent --no-audit --no-fund
./node_modules/.bin/esbuild shim.js --bundle --format=iife --minify --target=es2019 --platform=browser --outfile=shim.bundle.js --log-level=warning
cd ..
bash build.sh
python3 - <<'PY'
src = open('spell-pets.html', encoding='utf8').read()
cfg = open('firebase/config.js', encoding='utf8').read()
shim = open('firebase/shim.bundle.js', encoding='utf8').read()
head = cfg + "\nwindow.FIREBASE_CONFIG = FIREBASE_CONFIG;\nwindow.SPELLPETS_OWNER = 'TNd9cOjOg9YUk9X9gYucJDNusHK2';\n"
i = src.index('<script>')
out = src[:i] + '<script>' + head + '</script>\n<script>' + shim.replace('</script', '<\\/script') + '</script>\n' + src[i:]
out = out.replace('Progress saves automatically on this device and to your Claude account when signed in.', 'Progress saves automatically on this device and to the family account.')
if '<title>' not in out[:3000]: out = out.replace('<head>', '<head><title>Spell Pets</title>', 1)
open('../index.html', 'w', encoding='utf8').write(out)
print('built index.html', len(out) // 1024, 'KB')
PY
