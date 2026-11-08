# Build words2.js: the 1,453 new grade 5-6 words + the five difficulty groups (ids in order, with frequency)
import json, glob
S='/tmp/claude-0/-home-claude/73b1055a-597b-553d-8d3b-a747a428061d/scratchpad/'
G=json.load(open(S+'groups.json')); groups=G['groups']; zipf=G['zipf']
lines=[]; alias={}
for f in sorted(glob.glob('/home/claude/words2/b*.txt')):
    for l in open(f,encoding='utf8').read().strip().split('\n'):
        p=l.split('|'); assert len(p)==7, l
        lines.append(l); sp=p[0].split('/')
        for x in sp: alias[x.lower()]=sp[0].lower()
data=open('/home/claude/data.js',encoding='utf8').read()
raw=data[data.index('WORDS_RAW'):data.index('MEANINGS_RAW')]
gameids=set()
for l in raw.split('\n'):
    if '|' in l: gameids.add(l.split('|')[0].split('/')[0].split('`')[-1].lower())
out={}; seen=set()
for k in 'ABCDE':
    arr=[]
    for w in groups[k]:
        wid=w.lower(); wid=alias.get(wid,wid)
        assert wid in gameids or wid in alias.values(), w
        assert wid not in seen, w
        seen.add(wid); arr.append(f"{wid}:{round(zipf[w]*10)}")
    out[k]=','.join(arr)
print({k:len(v.split(',')) for k,v in out.items()}, 'total', len(seen), 'game', len(gameids))
js='// Grade 5-6 words added from other curricula (word|misspellings|sentence|forms|cue|meaning|example)\nconst WORDS2_RAW = `'+'\n'.join(lines).replace('`',"'")+'`;\n'
js+='// Five difficulty groups, easy to hard. Each entry is id:frequency(zipf x10).\nconst LEVEL_GROUPS = '+json.dumps(out)+';\n'
open('/home/claude/words2.js','w',encoding='utf8').write(js)
missing=gameids-seen
print('game words not in any group:', sorted(missing)[:20], len(missing))
