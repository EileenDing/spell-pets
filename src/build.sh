#!/bin/bash
# Builds the game as one HTML file: src/spell-pets.html (the version published on Claude).
set -e
cd "$(dirname "$0")"
{ cat shell.html; echo '<script>'; cat data.js words2.js zh/zhdata.js zh/zhlevels.js zh/zhaudio_index.js lab/labdata.js art.js sprdata.js sprdata2.js sprdata3.js sets2.js sprites.js town.js zh.js home2.js app.js lab/lab.js testtools.js; echo '</script>'; } > spell-pets.html
python3 - <<'PY'
s = open('spell-pets.html', encoding='utf8').read(); f = open('wenkai.css', encoding='utf8').read()
assert '/*WENKAI_FONT_FACES*/' in s
open('spell-pets.html', 'w', encoding='utf8').write(s.replace('/*WENKAI_FONT_FACES*/', f, 1))
PY
echo "built src/spell-pets.html"
