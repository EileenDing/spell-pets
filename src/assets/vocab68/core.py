# Daily Quest keeps the core words; everything else goes to the English Challenge.
# Core = every word in the grade 1-5 base list (WORDS_RAW) + any other word with word frequency (zipf, Ontario words hand-adjusted) >= 4.0
import json,re
S='/tmp/claude-0/-home-claude/73b1055a-597b-553d-8d3b-a747a428061d/scratchpad/'
d=open('data.js').read(); raw=d[d.index('WORDS_RAW'):d.index('MEANINGS_RAW')]
base={l.split('|')[0].split('/')[0].split('`')[-1].lower() for l in raw.split('\n') if '|' in l}
w2=open('words2.js').read()
L=[l for l in w2.split('\n') if l.startswith('const LEVEL_GROUPS')][0]
G=json.loads(L[L.index('{'):L.rindex('}')+1])
eff={n[0]:n[5] for n in json.load(open(S+'new68.json'))}
chal=[]
for k in 'ABCDEF':
    for x in G[k].split(','):
        w,z=x.split(':'); z=int(z)/10
        if not (k in 'AB' or w in base or eff.get(w,z)>=4.0): chal.append(w)
print('challenge',len(chal))
w2=re.sub(r"\n// Challenge words.*\nconst CHAL_IDS = .*\n",'\n',w2)
w2=w2.rstrip('\n')+"\n// Challenge words: not in the Daily Quest, played in the English Challenge (in this order, easy to hard)\nconst CHAL_IDS = new Set('"+' '.join(chal)+"'.split(' '));\n"
open('words2.js','w').write(w2)
