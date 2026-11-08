import glob
NEW={
'lack':'Plants will wilt if they _ water.',
'create':'Artists love to _ new things.',
'expect':'Do you _ snow tomorrow?',
'bound':'Watch the kangaroos _ across the field!',
'produce':'Farms will _ more food next year.',
'adapt':'Animals must _ to cold winters.',
'require':'Does every bike _ a bell?',
'develop':'Tadpoles will slowly _ into frogs.',
'vary':'Prices can _ from store to store.',
'thrive':'Cactus plants can _ in hot, dry places.',
'advance':'Win this game to _ to the next level.',
'preserve':'We use albums to _ old photos.',
'harvest':'Farmers will _ the pumpkins next week.',
'propose':'Can I _ a picnic for Saturday?',
'occur':'Earthquakes can _ without warning.',
'indicate':'Dark clouds often _ that rain is coming.',
'suggest':'May I _ that you wear a warm hat?',
'subscribe':'Would you like to _ to a kids\' science magazine?',
'assure':'Let me _ you that the dog is friendly.',
'attract':'Bright flowers help to _ bees.',
'regulate':'A thermostat helps to _ the heat.',
'prosper':'Farms will _ if there is enough rain.',
'migrate':'Every fall, monarch butterflies start to _ to Mexico.',
'flourish':'Tomatoes will _ in a sunny garden.',
'erode':'Over time, waves will _ the cliffs.',
'resemble':'Do you _ your mother or your father?',
'nurture':'Good parents _ their children every day, and so do grandparents? ',
'retain':'Sponges can _ a lot of water.',
'nominate':'I want to _ Lily for class president.',
'advise':'I would _ you to wear boots.',
'dedicate':'I want to _ this song to my mom.',
'prohibit':'The rules _ running in the halls, so please walk.',
'observe':'Scientists like to _ animals in nature.',
'appreciate':'I really _ your help right now.',
'generate':'Windmills can _ electricity.',
'forage':'Bears need to _ for berries in the summer.',
'loom':'Dark clouds began to _ over the lake.',
'cultivate':'Farmers will _ the land in spring.',
'cringe':'I always _ when I hear nails on a chalkboard, and my sister does too.',
'anticipate':'We _ a big crowd at tomorrow\'s game.',
'collide':'Watch out, or the two bumper cars will _!',
'salute':'The soldiers will _ the flag.',
'hoard':'Squirrels like to _ nuts for winter.',
'volunteer':'I want to _ at the animal shelter.',
'derive':'Many English words _ from Latin, and some come from French.',
'aspire':'I _ to be a scientist one day.',
'presume':'I _ you are hungry after that long hike.',
'occupy':'Games can _ my brother for hours.',
'alternate':'Let\'s _ who sits in the front seat.',
'reconstruct':'Scientists will _ the dinosaur\'s skeleton.',
'congratulate':'We want to _ you on your win!',
'quadruple':'If you _ four, you will get sixteen.',
'communicate':'Dolphins can _ with clicks.',
'recoil':'Snails _ when you touch them, so be gentle.',
'correspond':'Each letter should _ to a sound.',
'inhabit':'Penguins _ the cold south today, just as they did long ago? ',
'deteriorate':'Old books will _ if they get wet.',
'emphasize':'Teachers often _ how important reading is.',
}
NEW['nurture']='Parents should _ their children.'
NEW['cringe']='Nails on a chalkboard make me _.'
NEW['derive']='Many English words can _ from Latin.'
NEW['inhabit']='Many penguins still _ the cold south today.'
NEW['aspire']='I hope to _ to great things one day.'
NEW['recoil']='Snails will _ if you touch them.'
NEW['anticipate']='We can _ a big crowd at tomorrow\'s game.'
NEW['appreciate']='I would _ your help.'
NEW['presume']='Can I _ that you are hungry after that hike?'
NEW['inhabit']='Penguins will _ the cold south for years to come.'
n=0
for f in sorted(glob.glob('b*.txt')):
    L=open(f).read().split('\n'); out=[]
    for l in L:
        p=l.split('|')
        if len(p)==7 and p[0].split('/')[0] in NEW:
            p[2]=NEW[p[0].split('/')[0]].strip(); n+=1
            assert p[2].count('_')==1, p
        out.append('|'.join(p))
    open(f,'w').write('\n'.join(out))
print('rewrote',n,'of',len(NEW))
