import glob
F={'support':{2:'Strong beams will _ the roof.'},
'recycle':{2:'We need to _ cans and bottles every week.'},
'transport':{2:'Big trucks can _ food to the grocery stores.'},
'construct':{2:'Engineers will _ a bridge strong enough for trucks.'},
'constitute':{2:'It takes ten players to _ a full team.'},
'constrain':{2:'Rules help _ how fast the cars can go.'},
'enable':{2:'My new glasses will _ me to see the board clearly.'},
'evolve':{2:'Over millions of years, animals can slowly _.'},
'fluctuate':{2:'Prices tend to _ from week to week.'},
'formulate':{2:'Scientists must _ a hypothesis before testing.'},
'desirable':{3:'desirable,desire,desiring,undesirable'},
'recognizable':{3:'recognizable,recognize,recognition,recognizably'},
'suspension':{3:'suspension,suspend,suspense,suspends'},
'monitor':{2:'Nurses will _ the patients through the night.'},
'overlap':{2:'The two circles should _ in the middle of the diagram.'},
'exhilarate':{2:'Roller coasters are built to _ thrill-seekers.'},
'inoculate':{2:'Nurses will _ children against measles.'},
'supersede':{2:'The new rules will _ the old ones.'},
}
used=set()
for f in glob.glob('g[678]?.txt'):
    out=[]
    for line in open(f).read().strip().split('\n'):
        p=line.split('|')
        if p[0] in F:
            for k,v in F[p[0]].items(): p[k]=v
            used.add(p[0])
        out.append('|'.join(p))
    open(f,'w').write('\n'.join(out)+'\n')
print(set(F)-used)
