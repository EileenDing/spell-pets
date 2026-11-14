import glob
F={ # word: {idx: value}
'magnet':{1:'magnit,magnett,magnette'},
'appliance':{1:'applience,aplliance,appliense'},
'crater':{6:'The moon is covered with craters; we saw one huge {crater} through the telescope.'},
'treaty':{1:'treety,treatie,treatey'},
'explorer':{1:'exploror,explorar,expllorer'},
'voyageur':{1:'voyager,voyajeur,voyagur'},
'multiple':{1:'multipul,multible,multipple'},
'quadrant':{1:'quadrent,quadrint,quadrunt'},
'perimeter':{1:'perimiter,parimeter,perimeeter'},
'dialogue':{1:'dialouge,dialoge,dialogeu'},
'syllable':{2:'The word "cat" has only one _.',3:'syllable,syllables,syllabus,sillies'},
'mural':{1:'murel,murale,murral'},
'carbohydrate':{2:'Rice is a _ that gives you energy.',3:'carbohydrate,carbohydrates,carbon,hydrate'},
'analyze':{1:'analize,annalyze,analyez'},
'consist':{2:'Our team will _ of four players.',3:'consist,consists,consistent,insist',6:'A week does {consist} of seven days.'},
'establish':{2:'They want to _ a new park by the river.',3:'establish,established,establishment,stabilize',6:'The settlers worked to {establish} a town by the lake.'},
'summarize':{1:'sumarize,summerize,summarrize'},
'centimetre':{1:'centimetter,centimettre,sentimetre',2:'Each tick on the ruler marks one _.',3:'centimetre,centimetres,century,metre',6:'An ant is about one {centimetre} long.'},
'likeable':{1:'likeible,likeabel,likeeable'},
'movable':{1:'movible,movabel,moovable'},
'attendance':{6:'The {attendance} at the concert was very high.'},
'seize':{6:'You should {seize} the chance to try something new.'},
'fertilizer':{1:'fertalizer,fertilizor,firtilizer'},
'deforestation':{6:'The {deforestation} of the rainforest is a global problem.'},
'sustainability':{6:'Our goal is {sustainability}: leaving enough for future kids.'},
'homogeneous':{1:'homogenius,homogeneus,homogenious'},
'chromatography':{6:'Paper {chromatography} showed the marker had blue and red ink.'},
'convection':{1:'convecsion,convecton,convektion',6:'Heat moves around a room by {convection} currents.'},
'loyalist':{2:'One _ family moved north to Canada after the American Revolution.'},
'colonization':{1:'colinization,colonizasion,colonazation'},
'weathering':{6:'Over time, {weathering} slowly turns big rocks into sand.'},
'forestry':{6:'Jobs in {forestry} provide wood for paper and houses.'},
'substitution':{1:'substitusion,substatution,subsitution'},
'thesis':{1:'thesus,thesiss,theesis'},
'deny':{1:'denie,deney,deni'},
'duration':{3:'duration,durable,during,endurance'},
'eliminate':{6:'The goalie helped {eliminate} the other team in the first round.'},
'recognizable':{1:'recognizible,reconizable,recognizeable'},
'acceptance':{6:'Showing {acceptance} of others makes a happy school.'},
'membrane':{1:'membrain,membrayne,membrene'},
'chloroplast':{6:'Each leaf cell holds many a {chloroplast}.'.replace('many a {chloroplast}','dozens of tiny green {chloroplast} parts'.replace(' parts','s')) },
'oceanography':{6:'Studying {oceanography} helps us understand ocean currents.'},
'automation':{6:'Factory {automation} changed how cars are built.',1:'automasion,autamation,automatoin'},
'assimilation':{6:'Forced {assimilation} policies caused great harm.'},
'industrialization':{1:'industrilization,industrializasion,industrialazation',6:'During {industrialization}, many people moved into cities.'},
'urbanization':{1:'urbinization,urbanizasion,urbanazation',6:'Fast {urbanization} changed the landscape of Ontario.'},
'labour':{1:'laybour,labbour,labour'.replace('labour','labure')},
'nationalism':{6:'A wave of {nationalism} helped unite the new country.'},
'imperialism':{6:'European {imperialism} shaped the map of Africa.'},
'urban':{6:'City parks give {urban} kids room to play.'},
'globalization':{1:'globlization,globalizasion,globalazation',6:'Thanks to {globalization}, we can buy fruit from other continents.'},
'likewise':{3:'likewise,otherwise,clockwise,likeness',6:'"Nice to meet you." "{likewise}!"'},
'persist':{1:'persisst,perssist,perrsist'},
'prior':{1:'prier,pryer,priorr'},
'telecommunication':{6:'Modern {telecommunication} lets us video-call family overseas.'},
'leopard':{3:'leopard,leopards,leotard,leap'},
}
# chloroplast example fix
F['chloroplast'][6]='Each leaf cell holds dozens of green {chloroplast} bodies.'
F['likewise'][6]='She waved at me, and I did {likewise}.'
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
