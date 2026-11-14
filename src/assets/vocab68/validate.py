import re,json,glob,sys
from wordfreq import zipf_frequency as zf
src=open('/home/claude/spell-pets/src/data.js').read()+open('/tmp/claude-0/-home-claude/73b1055a-597b-553d-8d3b-a747a428061d/scratchpad/words2.bak.js').read()
# existing ids: first field of every pipe line
existing=set()
for line in src.split('\n'):
    if line.count('|')>=3:
        w=line.split('|')[0].strip().strip('`').split('/')[0].lower()
        w=re.sub(r'^.*`','',w)
        if re.fullmatch(r"[a-z'\- ]+",w): existing.add(w)
seen={}
bad=0
for f in sorted(glob.glob('g[678]?.txt')):
    for n,line in enumerate(open(f).read().strip().split('\n'),1):
        p=line.split('|'); tag=f'{f}:{n}'
        def err(m):
            global bad; bad+=1; print(tag,p[0],'::',m)
        if len(p)!=7: err(f'fields={len(p)}'); continue
        w,d,s,o,cue,mean,ex=p; wl=w.lower()
        if wl in existing: err('EXISTS in bank')
        if wl in seen: err('dup of '+seen[wl])
        seen[wl]=tag
        ds=d.split(',')
        if len(ds)!=3 or len(set(x.lower() for x in ds))!=3: err('misspell count/dup '+d)
        for x in ds:
            if x.lower()==wl: err('misspell==word')
            if zf(x.lower().replace('-',''),'en')>=2.3 and '-' not in x: err(f'misspell is real word: {x} ({zf(x.lower(),"en")})')
        if s.count('_')!=1: err('blank count')
        os_=o.split(',')
        if len(os_)!=4 or len(set(x.lower() for x in os_))!=4: err('forms '+o)
        if os_[0].lower()!=wl: err('first form != word')
        if s.startswith('_') and os_[0][0].islower() and w[0].islower(): err('sentence-start needs Cap')
        if not s.startswith('_') and os_[0]!=w: err('form case')
        if '{'+w+'}' not in ex: err('example missing {word}')
        if ex.startswith('{') and w[0].islower(): err('example starts with {word}')
        if 'many a' in ex.lower() or 'many a' in s.lower(): err('many a')
        if not mean: err('no meaning')
print('total new',len(seen),'problems',bad)
json.dump(list(seen),open('/tmp/claude-0/-home-claude/73b1055a-597b-553d-8d3b-a747a428061d/scratchpad/newids.json','w'))
