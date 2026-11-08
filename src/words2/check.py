import sys, re, json, glob
from wordfreq import zipf_frequency as z
S='/tmp/claude-0/-home-claude/73b1055a-597b-553d-8d3b-a747a428061d/scratchpad/'
order=open(S+'neworder.txt').read().split('\n')
NEEDCUE=set('check loan profit bare cruise fare sheer idol idle vain cite reign aisle hostile grease bury bizarre queue fowl baron barren flare flair principle maize hoard wield ascent populous stationery knit device devise'.split())
OKMIS=set('accomodate millenium'.split())
files=sys.argv[1:] or sorted(glob.glob('/home/claude/words2/b*.txt'))
seen={}; bad=0
for f in files:
    for n,l in enumerate(open(f,encoding='utf8').read().strip().split('\n'),1):
        p=l.split('|'); tag=f'{f.split("/")[-1]}:{n}'
        def err(m):
            global bad; bad+=1; print(tag,p[0],'-',m)
        if len(p)!=7: err(f'{len(p)} fields'); continue
        sp=[x.strip() for x in p[0].split('/')]; hw=sp[0]
        if hw in seen: err('duplicate of '+seen[hw])
        seen[hw]=tag
        for x in sp: seen.setdefault(x,tag)
        if hw not in order and not any(x in order for x in sp): err('not in word list')
        ms=p[1].split(',')
        if len(ms)!=3 or len(set(ms))!=3: err('need 3 distinct misspellings')
        for m in ms:
            if m.lower() in [x.lower() for x in sp]: err('misspelling equals word: '+m)
            elif z(m.lower(),'en')>=2.2 and m.lower() not in OKMIS: err(f'misspelling is a real word: {m} ({z(m.lower(),"en"):.1f})')
        if any(not re.fullmatch(r"[A-Za-z' -]+",m) for m in ms): err('misspelling has odd characters')
        if p[2].count('_')!=1: err('sentence needs one _')
        o=p[3].split(',')
        if len(o)!=4 or len(set(o))!=4: err('need 4 distinct options')
        if any(re.search(r'\d',x) for x in o): err('option has a digit')
        if o[0].lower()!=hw.lower(): err(f'first option {o[0]} != {hw}')
        if p[4] and p[4].count('_')!=1: err('cue needs one _')
        if hw in NEEDCUE and not p[4]: err('homophone needs a cue')
        if re.search(r'\b'+re.escape(hw.lower())+r'\b',p[5].lower()): err('meaning contains the word')
        if '{'+hw+'}' not in p[6]: err('example missing {'+hw+'}')
        if p[6] and p[6][0]=='{': err('example starts with the word (lower-case start)')
print('lines',len(seen),'problems',bad)
missing=[w for w in order if w not in seen]
print('still to write',len(missing))
