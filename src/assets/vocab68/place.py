import json,glob,statistics as st
from wordfreq import zipf_frequency as zf
S='/tmp/claude-0/-home-claude/73b1055a-597b-553d-8d3b-a747a428061d/scratchpad/'
t=open('words2.js').read().split('\n'); li=[i for i,l in enumerate(t) if l.startswith('const LEVEL_GROUPS')][0]
L=t[li]; G=json.loads(L[L.index('{'):L.rindex('}')+1])
EASY=set('''recycle unicycle tricycle unicorn iceberg hydrant landform breakable laughable wingspan glider wrinkle knuckle insect comet compost teamwork soften mammal vowel comma reptile prefix suffix antonym synonym homophone kilogram centimetre centipede settler wetland pastime biweekly speedometer simile binoculars erupt triangle thief niece earthquake greenhouse meteor crater asteroid magnet fossil sketch outline texture mixture spacecraft headline caption parachute polygon prism fungi tempo melody decoration enjoyable respectful predictable likeable movable adventurous humorous descriptive bilingual biannual canal railway valley groundwater runoff fishery hydration nonfiction punctuation constellation pastel triathlon propeller percussion flashback narrator diagram climax mural collage illustrator illustrate rehearsal carnivore herbivore omnivore hydrate dehydrate'''.split())
HARD={'sergeant':-0.7,'accommodation':-0.6,'mortgage':-0.6,'subtle':-0.5,'possession':-0.4,'separation':-0.3,'maintenance':-0.5,'acquire':-0.3,'occurrence':-0.4,'liaison':-0.4,'niece':0,'misspell':-0.2,'conscientious':-0.3,'rhetoric':-0.3,'criteria':-0.2,'phenomenon':-0.3}
new=[]
for f in sorted(glob.glob('assets/vocab68/g[678]?.txt')):
    g=int(f.split('/')[-1][1])
    for l in open(f).read().strip().split('\n'):
        w=l.split('|')[0]; z=zf(w.lower(),'en')
        adj=(1.0 if w.lower() in EASY else 0)+HARD.get(w.lower(),0)
        sc=z+adj-0.25*(g-6)-0.03*max(0,len(w)-9)
        new.append((w.lower(),g,z,sc,l,z+adj))
import collections
c=collections.Counter(('D' if s>=3.9 else 'E' if s>=3.2 else 'F',g) for w,g,z,s,l,e in new)
print(sorted(c.items()))
json.dump(new,open(S+'new68.json','w'))
