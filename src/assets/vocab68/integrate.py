import json
from wordfreq import zipf_frequency as zf
S='/tmp/claude-0/-home-claude/73b1055a-597b-553d-8d3b-a747a428061d/scratchpad/'
src=open(S+'words2.bak.js').read()
t=src.split('\n'); li=[i for i,l in enumerate(t) if l.startswith('const LEVEL_GROUPS')][0]
L=t[li]; G=json.loads(L[L.index('{'):L.rindex('}')+1])
new=json.load(open(S+'new68.json'))
def grp(s): return 'D' if s>=3.9 else 'E' if s>=3.2 else 'F'
prox=lambda w,z:len(w)-0.5*z
out=dict(G); stats={}
for k in 'DEF':
    old=[x.split(':') for x in G.get(k,'').split(',')] if k in G else []
    mine=[n for n in new if grp(n[3])==k]
    stats[k]=(len(old),len(mine))
    if not old:
        mine.sort(key=lambda n:prox(n[0],n[5])+1.0*(n[1]-6))
        out[k]=','.join(f"{n[0]}:{round(n[2]*10)}" for n in mine); continue
    p=[prox(w,int(z)/10) for w,z in old]; W=20
    sm=[sum(p[max(0,i-W):i+W+1])/len(p[max(0,i-W):i+W+1]) for i in range(len(p))]
    for i in range(1,len(sm)): sm[i]=max(sm[i],sm[i-1])   # monotone envelope
    slots={}
    for n in mine:
        pn=prox(n[0],n[5])+1.0*(n[1]-6)
        idx=next((i for i,v in enumerate(sm) if v>=pn),len(sm))
        slots.setdefault(idx,[]).append((pn,n))
    arr=[]
    for i in range(len(old)+1):
        for pn,n in sorted(slots.get(i,[]),key=lambda x:x[0]): arr.append(f"{n[0]}:{round(n[2]*10)}")
        if i<len(old): arr.append(':'.join(old[i]))
    out[k]=','.join(arr)
print(stats,{k:len(v.split(',')) for k,v in out.items()})
# append raw lines
lines=[n[4] for n in new]
end=src.index('`;',src.index('const WORDS2_RAW'))
src2=src[:end]+'\n'+'\n'.join(lines).replace('`',"'")+src[end:]
t=src2.split('\n'); li=[i for i,l in enumerate(t) if l.startswith('const LEVEL_GROUPS')][0]
t[li]='const LEVEL_GROUPS = '+json.dumps(out)+';'
for i in range(li-1,li-3,-1):
    if t[i].startswith('// Five difficulty'): t[i]='// Six difficulty groups, easy to hard (F = Ontario grade 6-8 challenge words). Each entry is id:frequency(zipf x10).'
open('words2.js','w').write('\n'.join(t))
# where did new words land: position percent within group
pos={}
for k in 'DEF':
    a=[x.split(':')[0] for x in out[k].split(',')]
    for i,w in enumerate(a): pos[w]=(k,round(100*i/len(a)))
json.dump(pos,open(S+'pos68.json','w'))
