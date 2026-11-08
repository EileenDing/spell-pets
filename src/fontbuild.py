import re, base64, io, sys
from fontTools.ttLib import TTFont
from fontTools import subset
import os
# needs the npm package lxgw-wenkai-webfont@1.7.0 unpacked here (npm pack lxgw-wenkai-webfont@1.7.0 && tar xzf *.tgz)
FD=os.environ.get('WENKAI_DIR', os.path.join(os.path.dirname(os.path.abspath(__file__)), '.font', 'package'))+'/'
html=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'spell-pets.html'),encoding='utf8').read()
text=html+''.join(chr(int(h,16)) for h in re.findall(r'\\u([0-9a-fA-F]{4})',html))
need=sorted(set(ord(ch) for ch in text if ('　'<=ch<='〿') or ('一'<=ch<='鿿') or ('＀'<=ch<='￯') or ch in '“”‘’…·—'))
need=sorted(set(need)|set(range(0x20,0x7f))|set(ord(c) for c in 'āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüÜ'))
css=open(FD+'lxgwwenkai-regular.css',encoding='utf8').read()
faces=[]
for blk in re.findall(r'@font-face\s*{(.*?)}',css,re.S):
    m=re.search(r'url\(["\']?\./?(files/[^"\')]+)',blk); r=re.search(r'unicode-range:\s*([^;}]+)',blk)
    if not m or not r: continue
    ranges=[]
    for part in r.group(1).split(','):
        part=part.strip().replace('U+','').replace('u+','')
        if '-' in part: a,b=part.split('-'); ranges.append((int(a,16),int(b,16)))
        else: ranges.append((int(part,16),int(part,16)))
    faces.append((m.group(1),ranges))
byfile={}
missing=[]
for cp in need:
    f=next((f for f,rs in faces if any(a<=cp<=b for a,b in rs)),None)
    if f: byfile.setdefault(f,[]).append(cp)
    else: missing.append(chr(cp))
out=[]; total=0
for f,cps in byfile.items():
    font=TTFont(FD+f)
    opts=subset.Options(); opts.flavor='woff2'; opts.layout_features=['*']; opts.name_IDs=[]; opts.notdef_outline=False
    sub=subset.Subsetter(opts); sub.populate(unicodes=cps); sub.subset(font)
    have=sorted(set(font.getBestCmap().keys()))
    buf=io.BytesIO(); font.flavor='woff2'; font.save(buf); data=buf.getvalue(); total+=len(data)
    ur=','.join('U+%X'%c for c in have)
    out.append('@font-face{font-family:"WenKai";font-style:normal;font-weight:400;font-display:swap;src:url(data:font/woff2;base64,%s) format("woff2");unicode-range:%s}'%(base64.b64encode(data).decode(),ur))
print('chars',len(need),'files',len(byfile),'bytes',total,'missing',''.join(missing))
open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'wenkai.css'),'w').write('\n'.join(out))
