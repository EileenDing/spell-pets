"""Build zhdata.js from the four hand-written lists.

Each output line: char|pinyin|words|distractors|sentence

Distractors must look like the target but must NOT also fit the sentence:
  * never the same syllable as the target (round 1 is a listening round)
  * never from the same meaning group (numbers, pronouns, directions, opposites, seasons, ...)
  * never form a real word with the neighbours in the sentence (jieba dictionary check)
Manual overrides in field 4 are tried first, then IDS look-alikes.
Field 5 (optional) lists characters that must never be used as distractors for this entry.
"""
import json, re, sys
from pypinyin import pinyin, Style
DL = '/tmp/claude-0/-home-claude/73b1055a-597b-553d-8d3b-a747a428061d/scratchpad/dl/'
base = json.load(open(DL + 'zhbase.json'))
B = {r['c']: r for r in base}
POOL = [r['c'] for r in base]

# ---------- IDS similarity ----------
IDS = {}
for l in open(DL + 'cjkvi-ids/ids.txt', encoding='utf8'):
    p = l.rstrip('\n').split('\t')
    if len(p) >= 3 and len(p[1]) == 1:
        IDS[p[1]] = re.sub(r'\[[^\]]*\]', '', p[2])
STROKES = {}
for l in open(DL + 'cjkvi-ids/ucs-strokes.txt', encoding='utf8'):
    p = l.rstrip('\n').split('\t')
    if len(p) >= 3 and len(p[1]) == 1:
        try: STROKES[p[1]] = int(p[2].split(',')[0])
        except ValueError: pass
STRUCT = set('⿰⿱⿲⿳⿴⿵⿶⿷⿸⿹⿺⿻')
ALIAS = {'亻': '人', '扌': '手', '氵': '水', '忄': '心', '讠': '言', '钅': '金', '饣': '食', '纟': '糸', '犭': '犬', '礻': '示', '衤': '衣', '艹': '艸', '⺮': '竹', '灬': '火', '刂': '刀', '阝': '阜'}
def comps(c, depth=0):
    s = IDS.get(c, c)
    out = set()
    for ch in s:
        if ch in STRUCT or ch == c: continue
        out.add(ch)
        if depth < 3 and ch in IDS and IDS[ch] != ch: out |= comps(ch, depth + 1)
    return out or {c}
COMP = {c: comps(c) for c in POOL}
def sim(a, b):
    A, Bc = COMP[a], COMP[b]
    j = len(A & Bc) / max(1, len(A | Bc))
    top = 0.15 if IDS.get(a, ' ')[0] == IDS.get(b, ' ')[0] and IDS.get(a, ' ')[0] in STRUCT else 0
    sd = abs(STROKES.get(a, 8) - STROKES.get(b, 8))
    return j + top - 0.04 * sd

# ---------- meaning groups ----------
GROUPS = '''一二三四五六七八九十百千万两几零半双
你我他她它您咱们自己
上下左右前后里外中东西南北内边
大小多少高低长短粗细胖瘦轻重深浅宽窄远近矮尖圆方
春夏秋冬
早晚昨今明朝
年月日天时分秒午夜晨周
红黄蓝绿白黑紫青灰金
爸妈爷奶哥姐弟妹叔姑姨舅爹娘婆公孙子女儿
男女公母
来去进出开关买卖起落回往到过
走跑跳飞游爬坐站立躺跪蹲
哭笑喜怒乐悲哀愁
冷热凉暖温
新旧快慢真假对错是否有无好坏美丑难易早迟先后
雨雪风云雷电霜露雾冰
牛羊马猪狗猫鸡鸭鱼鸟虫兔鹅蛙龟鼠狼虎熊猴象
口耳目手足头眼鼻嘴牙舌脸脚腿身心
吃喝看见听闻说讲叫喊问答唱读写画
拿提拉推抬抱捉打拍扔拾
山水火石田土木林森禾草花树叶竹
米面饭菜肉蛋汤茶
桌椅床门窗灯
个只条本张块棵朵片支把件双头匹座间
的地得
在再
吧呀吗呢啊啦哇哦嘛呗
咦唉哎哈哦啊呀哇嗯
鹰鹤雁鸽鸭鹅鸡雀鸦鹊鹂莺燕鹃鸟
做作坐
很真太最更都也还又就才
着了过
'''.split()
GROUP_OF = {}
for gi, g in enumerate(GROUPS):
    for ch in g: GROUP_OF.setdefault(ch, set()).add(gi)
def same_group(a, b): return bool(GROUP_OF.get(a, set()) & GROUP_OF.get(b, set()))

# ---------- hand-checked bans (distractor would also fit the sentence) ----------
BAN = {'坐': '全', '日': '曰', '采': '觅', '黑': '墨', '把': '抓', '鸦': '鸡', '吴': '关', '王': '主', '浇': '洒',
       '提': '担', '眉': '眼', '蹦': '跳', '甩': '用', '盆': '盘', '舰': '船', '松': '杉枫', '泉': '白', '杉': '松', '曹': '曾',
       '玲': '珍珠', '粘': '贴', '搭': '拾', '踩': '踏踢', '刘': '文', '虾': '蛇', '蚕': '虫', '填': '堆', '棘': '刺',
       '觅': '见', '献': '摘', '跨': '跳', '坪': '坡', '试': '找', '蹲': '蹦'}
NEVER = set('尿屎屁粪')  # not nice as distractors for kids

# ---------- dictionary ----------
DICT = {}
for l in open(DL + 'jieba_dict.txt', encoding='utf8'):
    w, f, _ = l.split(); DICT[w] = int(f)
MINF = 60
def makes_word(s, c, d):
    """True if putting d where c is in sentence s creates a real word around that spot."""
    s2 = s.replace(c, d)
    for i, ch in enumerate(s2):
        if ch != d or s[i] != c: continue
        for L in (2, 3, 4):
            for st in range(i - L + 1, i + 1):
                if st < 0 or st + L > len(s2): continue
                w = s2[st:st + L]
                if DICT.get(w, 0) >= MINF: return w
    return None
def syl(c): return pinyin(c, style=Style.NORMAL, heteronym=True)[0]

out = {}; problems = []; report = []
for b in ['1a', '1b', '2a', '2b']:
    rows = []
    for l in open(f'{b}.txt', encoding='utf8').read().strip().split('\n'):
        p = l.split('|'); c, w, s = p[0], p[1], p[2]
        ov = p[3] if len(p) > 3 else ''
        ban = set(p[4]) if len(p) > 4 else set()
        if c not in w or w not in s: problems.append(l)
        mysyl = set(syl(c))
        ranked = sorted((x for x in POOL if x != c), key=lambda x: -sim(c, x))
        d = []; rej = []
        for x in list(ov) + ranked:
            if x == c or x in d or x in ban or x in BAN.get(c, '') or x in NEVER or not re.match(r'[一-鿿]', x): continue
            why = None
            if set(syl(x)) & mysyl: why = 'sound'
            elif same_group(c, x): why = 'group'
            else:
                mw = makes_word(s, c, x)
                if mw: why = 'word:' + mw
            if why:
                if x in ov: rej.append(x + '(' + why + ')')
                continue
            d.append(x)
            if len(d) == 3: break
        if rej: report.append(f'{c} override rejected: {" ".join(rej)}')
        words = [w] + [x for x in B[c]['w'] if x != w and len(x) <= 4][:2]
        rows.append('|'.join([c, B[c]['py'], ','.join(words), ''.join(d), s]))
    out[b] = rows
assert not problems, problems
js = 'const ZH_RAW = {\n' + ',\n'.join(f"'{b}': `" + '\n'.join(out[b]) + '`' for b in out) + '\n};\n'
open('zhdata.js', 'w', encoding='utf8').write(js)
open(DL + 'review.txt', 'w', encoding='utf8').write('\n'.join(
    f"{r.split('|')[0]}|{r.split('|')[4].replace(r.split('|')[0], '＿')}|{r.split('|')[3]}" for b in out for r in out[b]))
print('rows', sum(len(v) for v in out.values()))
print('\n'.join(report))
