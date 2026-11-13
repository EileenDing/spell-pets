#!/bin/bash
# Builds the game as one HTML file: src/spell-pets.html (the version published on Claude).
set -e
cd "$(dirname "$0")"
{ cat shell.html; echo '<script>'; cat data.js words2.js zh/zhdata.js zh/zhlevels.js zh/zhaudio_index.js lab/labdata.js art.js sprdata.js sprdata2.js sprdata3.js sprdata4.js sprdata5.js sprdata6.js sprdata7.js sets2.js catalog2.js catalog3.js sprites.js town.js zh.js home2.js app.js lab/lab.js testtools.js; echo '</script>'; } > spell-pets.html
python3 - <<'PY'
s = open('spell-pets.html', encoding='utf8').read(); f = open('wenkai.css', encoding='utf8').read()
assert '/*WENKAI_FONT_FACES*/' in s
s = s.replace('/*WENKAI_FONT_FACES*/', f, 1).replace('/*NUMFONT*/', open('numfont.css', encoding='utf8').read(), 1)
open('spell-pets.html', 'w', encoding='utf8').write(s)
PY
echo "built src/spell-pets.html"
