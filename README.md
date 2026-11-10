# Spell Pets

A pixel-art spelling and Chinese-character game for kids.

- **Play:** https://eileending.github.io/spell-pets/
- Sign in with Google. Progress is saved in the family's Firebase database (project `spellpet-c7eb0`), not in this repository, so updating the website never touches anyone's progress.

## What is where

| Path | What it is |
|---|---|
| `index.html` | The website (built file, served by GitHub Pages) |
| `zhaudio/` | Chinese pronunciation clips |
| `firestore.rules` | Database security rules (paste into Firebase console → Firestore → Rules) |
| `src/` | Everything the website is built from |
| `src/data.js`, `src/words2.js` | English words, levels, shop items, pets |
| `src/zh/` | Chinese characters, stages, audio index |
| `src/lab/labdata.js` | Eddie's Brainpower Lab words (Units 1–8) |
| `src/sprdata.js` … `src/sprdata4.js` | Pictures (pets, town map, homes, furniture, interior sets), cut from `src/assets/` |
| `src/sets2.js` | The fourteen room sets, each a finished room (`src/assets/v9/compose_v9.py` + `pack_v9.py`) |
| `src/sprdata5.js` | Grass patches that hide a lot fence once it has a house (`src/assets/v9/nofence.py`) |
| `src/catalog2.js` | Interior Items Catalog: 35 tables, beds, sofas, chairs, lamps, windows (`src/assets/v5/pack_v5.py`) |
| `src/app.js`, `src/zh.js`, `src/home2.js`, `src/town.js`, `src/sprites.js`, `src/testtools.js`, `src/lab/lab.js` | Game code |
| `src/firebase/` | Google sign-in + Firestore adapter, Firebase config, website build |

## Updating

```bash
cd src
./firebase/build_fb.sh     # rebuilds ../index.html (the website)
bash build.sh              # rebuilds src/spell-pets.html (the version published on Claude)
```

Commit and push `index.html`; GitHub Pages republishes in a minute or two.
After adding new Chinese text to the interface, refresh the font subset first: `python3 fontbuild.py` (needs `lxgw-wenkai-webfont@1.7.0` unpacked in `src/.font/package`, see the script).

The helper scripts in `src/words2/`, `src/zh/` and `src/assets/` are the one-off tools that generated the data files; the data files themselves are what the build uses.
