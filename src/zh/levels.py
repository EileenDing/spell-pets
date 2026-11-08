# Split the 1,600 characters into 10 stages of 160 (textbook order), each sorted easy->hard
# (common + few strokes first) and cut into 5 levels of 32. Writes zh/zhlevels.js.
import re, math, statistics as st, collections
D='/tmp/claude-0/-home-claude/73b1055a-597b-553d-8d3b-a747a428061d/scratchpad/dl/'
src=open('/home/claude/zh/zhdata.js',encoding='utf8').read()
chars=[]
for part in ['1a','1b','2a','2b']:
    blk=re.search(r"'%s': `(.*?)`"%part,src,re.S).group(1).strip().split('\n')
    chars+= [l.split('|')[0] for l in blk]
assert len(chars)==1600 and len(set(chars))==1600
strokes={}
for l in open(D+'cjkvi-ids/ucs-strokes.txt',encoding='utf8'):
    p=l.rstrip('\n').split('\t')
    if len(p)>=3 and len(p[1])==1: strokes[p[1]]=int(re.split(r'[,\s]',p[2])[0])
freq=collections.Counter()
for l in open(D+'jieba_dict.txt',encoding='utf8'):
    p=l.split()
    if len(p)>=2 and p[1].isdigit():
        for ch in p[0]: freq[ch]+=int(p[1])
lf={c:math.log10(freq[c]+10) for c in chars}; sk={c:strokes.get(c,10) for c in chars}
def z(d): m,s=st.mean(d.values()),st.pstdev(d.values()); return {k:(v-m)/s for k,v in d.items()}
F=z({c:-lf[c] for c in chars}); K=z(sk)
score={c:0.6*F[c]+0.4*K[c] for c in chars}
stages=[]
for k in range(10):
    g=sorted(chars[k*160:(k+1)*160], key=lambda c:score[c])
    stages.append(''.join(g))
    print(k+1, g[:12], g[-6:], 'strokes', round(st.mean(sk[c] for c in g),1))
open('/home/claude/zh/zhlevels.js','w',encoding='utf8').write(
 '// 10 stages x 160 characters (textbook order); inside each, easy->hard in 5 levels of 32\nconst ZH_STAGES = '+repr(stages).replace("'",'"')+';\n'
 +'const ZH_CFREQ = '+repr({c:round(lf[c],2) for c in chars}).replace("'",'"')+';\n')
