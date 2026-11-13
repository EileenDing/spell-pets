// word | 3 look-alike choices | sentence with _ | correct form first, then 3 wrong forms
const WORDS_RAW = {
1: `all|al,ail,awl|We ate _ of the cookies.|all,alls,every,whole
am|an,im,amm|I _ seven years old.|am,is,are,be
and|end,an,adn|I like cats _ dogs.|and,end,an,but
at|it,ate,att|Look _ the big moon!|at,it,ate,an
ball|bal,bell,boll|Kick that _ to me!|ball,balls,ball's,balled
be|bee,bi,bea|Please _ quiet in the library.|be,is,are,been|I want to _ a vet.
big|bag,beg,bigg|An elephant is _ than a mouse.|bigger,big,biggest,biger
box|bocks,fox,boks|There are three _ under my bed.|boxes,box,boxs,boxies
boy|bay,bou,boi|Two _ are playing soccer.|boys,boy,boies,boy's
but|bat,bot,bute|She is small _ very strong.|but,so,or,because
came|come,cam,caym|My friend _ to my house yesterday.|came,come,comed,comes
can|con,cane,cann|_ you help me, please?|Can,Cans,Canned,Caning
car|cer,char,carr|Dad washed both _ on Saturday.|cars,car,cares,car's
cow|caw,cou,coe|The _ are eating grass in the field.|cows,cow,cowes,cow's
dad|bad,did,dadd|My _ makes the best pancakes.|dad,dads,dad's,daddes
day|dey,dai,bay|Today is a sunny _.|day,days,daily,day's
did|dad,dib,didd|_ you finish your homework last night?|Did,Do,Does,Done
do|doo,dow,du|Right now I _ not want to go outside.|do,does,did,done
fat|fit,fate,fatt|My cat is _ than your cat.|fatter,fat,fattest,fater
for|four,fur,fore|This present is _ you.|for,four,from,fur|Thank you _ the gift.
fun|fan,fin,fon|We had so much _ at the park.|fun,funny,funs,funning
get|got,git,gett|Can you _ the ball for me?|get,got,gets,getting
go|goo,goe,ga|Let's _ to the park!|go,goes,went,going
got|get,gott,gut|I _ a new bike for my birthday.|got,get,gets,getted
had|has,hat,hadd|Yesterday I _ a cold.|had,have,has,haved
he|hi,hee,ha|Tom said _ is hungry.|he,him,his,her
hen|hem,hin,hon|The _ laid three eggs.|hen,hens,hen's,henned
here|hear,heer,her|Come over _ and sit with me.|here,hear,there's,her|My house is right _.
him|hem,hum,hime|I gave _ a sticker.|him,he,his,himself|I gave _ a high five.
his|is,hiss,hiz|That is _ red hat.|his,he,him,he's
hot|hat,hut,hott|The soup is very _.|hot,hotter,hottest,hots
if|of,it,iff|You can play _ you finish your homework.|if,of,off,is
in|on,an,inn|The cookies are _ the jar.|in,into,an,is|The cat is _ the box.
into|in to,onto,intoo|Pour the milk _ the glass.|into,onto,intoo,in to
is|si,iz,his|My sister _ eight years old.|is,are,am,be
it|at,ti,itt|Where is my pencil? I can't find _.|it,its,it's,them
its|it's,itz,its'|The dog wagged _ tail.|its,it's,it,its'|The bird flapped _ wings.
let|lit,lot,lett|Please _ me play too!|let,lets,letting,letted
man|men,mane,mann|A _ is walking his dog.|man,men,man's,mans
may|my,mae,mey|_ I go outside to play?|May,Maybe,Mays,Mayed
me|my,mee,mi|Can you help _?|me,my,I,mine
mom|mam,mon,mome|My _ is a nurse.|mom,moms,mom's,mommed
my|me,mi,mai|This is _ new backpack.|my,me,mine,I
no|know,noh,nou|_, thank you. I'm full.|No,Know,Now,Not|Say yes or _.
not|nut,note,nott|I am _ tired at all.|not,no,none,knot|I am _ sleepy.
of|off,ov,uf|I drank a glass _ milk.|of,off,ov,if
oh|oo,ho,ogh|_ no, I dropped my ice cream!|Oh,Owe,Of,On|_, what a surprise!
old|olb,oald,odl|My grandpa is _ than my dad.|older,old,oldest,oldder
on|no,an,onn|Put your hat _ your head.|on,in,at,of
one|won,wun,on|I have _ brother and two sisters.|one,won,once,ones|I have _ nose.
out|owt,our,oot|Let's go _ and play.|out,outs,outing,outed
pan|pen,pin,pann|Mom fried eggs in a _.|pan,pans,pan's,panned
pet|pat,pit,pett|We have two _: a cat and a dog.|pets,pet,pet's,petts
pig|peg,big,pigg|The three little _ built houses.|pigs,pig,piges,pig's
ran|run,rain,rann|The dog _ after the ball yesterday.|ran,run,runned,runs
rat|rot,rate,ratt|A _ ran under the porch.|rat,rats,rat's,ratted
red|read,rad,redd|Strawberries are _.|red,reds,redder,reddest|A fire truck is _.
sat|set,sit,satt|We _ on the bench yesterday.|sat,sit,sitted,sits
see|sea,sie,cee|I can _ a rainbow!|see,saw,seen,sees|I _ with my eyes.
she|shi,sea,shee|My aunt said _ would visit soon.|she,her,hers,he's
six|sixs,siks,sicks|An insect has _ legs.|six,sixth,sixty,sixes
so|sew,sow,soe|I was tired, _ I went to bed.|so,or,if,than|I am _ happy!
ten|tin,tan,tenn|I have _ fingers.|ten,tenth,tens,teen
the|teh,thee,tha|She is _ fastest runner in our class.|the,a,an,them
this|thes,tis,thiss|_ is my favourite book.|This,These,Those,Thems
to|two,too,tu|I am going _ the store.|to,two,too,toe|We walk _ school.
top|tip,tap,topp|The cat is at the _ of the stairs.|top,tops,topped,topping
toy|tow,toi,tay|My little brother has lots of _.|toys,toy,toyes,toies
two|to,too,tow|A bike has _ wheels.|two,to,too,twice|I have _ hands.
up|op,upp,ap|The balloon floated _ into the sky.|up,ups,upped,upper
us|is,as,uss|Grandma made cookies for _.|us,we,our,ours
was|wus,saw,woz|Yesterday it _ very windy.|was,is,were,be
we|wee,whe,wi|Tomorrow _ are going camping.|we,us,our,ours|_ are friends.
will|well,wil,whill|Tomorrow it _ snow.|will,wills,willed,willing
yes|yse,yess,yas|_, I would love some cake!|Yes,Yet,Yell,Yeses
you|yu,yoo,yuo|Thank _ for the gift.|you,your,yours,you're
cat|cot,cut,kat|Two _ are sleeping on my bed.|cats,cat,cates,cat's
dog|dig,dug,dogg|My _ barks at the mail truck every morning.|dog,dogs,doges,dogging
sun|son,sum,sunn|The _ is shining brightly today.|sun,suns,sunny,sunning|The _ is shining.
hat|hot,hit,hatt|She has three _ in her closet.|hats,hat,hates,hatts
run|ran,rum,runn|Yesterday we _ all the way to the park.|ran,run,runned,running
sit|set,sat,sitt|Please _ down on the rug.|sit,sat,sits,sitting
bed|bad,bid,bedd|I go to _ at eight o'clock.|bed,beds,bedding,bedded
chip|chop,cheap,chipp|Mom put two potato _ on my plate.|chips,chip,chipes,chipping
stop|step,stap,stopp|The bus _ at the corner, and the kids got on.|stopped,stop,stoped,stops
frog|frag,from,frogg|Three green _ sat on a log.|frogs,frog,froges,frogges
nest|next,nets,neste|The bird built a _ in the tree.|nest,nests,nesting,nested
play|pray,plai,plae|Right now, the children are _ tag outside.|playing,play,played,plays
like|lick,lik,lake|Do you _ strawberry ice cream?|like,likes,liked,liking
ride|rid,raid,ridd|I _ my bike to school yesterday.|rode,ride,rided,riding
home|hom,hole,hoam|We walked _ after the game.|home,homes,homing,homed
look|lock,luk,lok|_ at that funny monkey!|Look,Looks,Looked,Looking
good|god,gud,goob|This is the _ cake I have ever eaten.|best,good,gooder,goodest
come|comb,cume,kom|Please _ here and look at this.|come,came,comes,coming
book|bok,buk,boook|I read two _ last week.|books,book,bookes,booking
swim|swin,swem,swimm|Ducks love _ in the pond.|swimming,swiming,swim,swam`,
2: `about|abowt,abut,aboot|This book is _ dinosaurs.|about,above,abut,around
add|ad,aad,odd|Can you _ 5 and 3?|add,adds,added,adding|Please _ these numbers together.
ago|agoe,ego,agow|We moved here two years _.|ago,again,agos,ages
an|and,in,ann|I ate _ apple.|an,a,and,on
any|eny,anny,ane|Do you have _ pets?|any,a,an,one
apple|appel,aple,apul|I picked three red _.|apples,apple,appls,apple's
are|our,ar,arr|My friends _ at the park.|are,is,am,be
as|az,iz,us|She is as tall _ her brother.|as,than,like,so
ask|aks,ash,aske|Can I _ you a question?|ask,asked,asks,asking
ate|eight,eat,ait|We _ pizza for dinner last night.|ate,eat,eaten,eated|Yesterday I _ an apple.
away|awey,a way,awai|The bird flew _.|away,a way,aways,way
baby|babey,babie,bebe|The _ are sleeping in their cribs.|babies,baby,babys,baby's
back|bak,bake,bac|Please come _ soon!|back,backs,backed,backing
bad|bed,bat,badd|This is the _ storm we've had all year.|worst,bad,badder,baddest
bag|beg,big,bagg|I packed my lunch in a paper _.|bag,bags,bagged,bagging
base|bace,bayse,bas|He ran to first _.|base,bases,based,basic
bat|bet,but,batt|One _ hung upside down in the cave.|bat,bats,bat's,batting
bee|be,bea,bie|A _ buzzed around the flowers.|bee,bees,be,bee's|A _ makes honey.
been|bin,ben,bean|I have _ to Toronto twice.|been,be,being,was|Have you _ to the zoo?
before|befor,bfore,befour|Wash your hands _ you eat.|before,befores,between,beside
being|bing,beeing,beign|Thank you for _ so kind.|being,be,been,is
best|bets,bast,bist|She is my _ friend.|best,good,better,goodest
bike|bik,bake,byke|I ride my _ to school.|bike,bikes,biked,biking
bill|bell,bil,ball|The duck has a yellow _.|bill,bills,billed,billing
bird|brid,bord,berd|Look at all the _ on the wire!|birds,bird,bird's,birdes
blue|blew,bloo,blu|The sky is _ today.|blue,blew,bluer,blues|The ocean is _.
both|boath,bath,bothe|_ of my shoes are wet.|Both,Either,Every,Each
brother|bruther,brothr,brather|My _ is two years older than me.|brother,brothers,brother's,brotherly
bus|buss,bas,boss|Three yellow _ stopped at the school.|buses,bus,buss,bus's
by|buy,bye,bi|The book was written _ my aunt.|by,buy,bye,be|Come and sit _ me.
cake|cak,kake,coke|Mom baked a chocolate _.|cake,cakes,caked,caking
call|cal,coll,kall|I will _ you tomorrow.|call,calls,called,calling
candy|candey,kandy,candie|We got lots of _ on Halloween.|candy,candys,candied,candy's
change|chang,chaynge,chanje|The leaves _ colour every fall.|change,changes,changed,changing
child|chiled,chiild,chield|Every _ in the class got a sticker.|child,children,childs,child's
city|citty,sity,citey|Toronto is a big _.|city,cities,citys,city's
club|clob,clubb,klub|I joined the chess _.|club,clubs,clubbed,clubbing
coat|cote,coot,coaat|Wear your warm _ today.|coat,coats,coated,coating
cold|coled,colde,could|It is _ today than yesterday.|colder,cold,coldest,more cold
coming|comming,comeing,comin|Are you _ to my party?|coming,come,came,comes
corn|corne,coarn,cron|We ate _ on the cob.|corn,corns,corny,corned
cry|cri,kry,crie|The baby _ all night last night.|cried,cry,cryed,cries
cup|cap,cop,cupp|I drank two _ of water.|cups,cup,cupes,cup's
cut|cat,cot,cutt|Yesterday I _ my finger on paper.|cut,cutted,cuts,cutting
daddy|dady,daddie,daddey|_ reads me a story every night.|Daddy,Daddies,Daddys,Daddy's
dear|deer,deir,dere|My _ friend lives far away.|dear,deer,dearly,dears|_ Grandma, thank you for the gift.
deep|dep,deap,dip|The lake is very _.|deep,deeply,depth,deepen
deer|dear,dier,deere|We saw three _ in the forest.|deer,dear,deers,deer's|A _ has antlers.
doing|doeing,dooing,doin|What are you _ after school?|doing,do,did,done
doll|dol,dull,dole|My sister has five _.|dolls,doll,dolles,doll's
door|dore,dor,doar|Please close the _.|door,doors,door's,doored
down|doun,dawn,donw|The cat jumped _ from the table.|down,downs,downed,downy
dress|dres,drass,dess|She wore a pretty blue _.|dress,dresses,dressed,dressing
drive|driv,drieve,dirve|My mom _ me to school yesterday.|drove,drive,drived,drives
drop|drap,drob,dropp|Be careful not to _ the eggs.|drop,drops,dropped,dropping
dry|drie,dri,draw|My hair is still wet. It is not _ yet.|dry,dried,dries,dryer
duck|dock,duk,dukc|Five little _ went swimming.|ducks,duck,duckes,duck's
each|eech,eatch,itch|_ student has a desk.|Each,Both,Many,All
eating|eatting,eeting,eatin|The horses are _ hay.|eating,eat,ate,eaten
egg|eg,eggg,edge|I had two _ for breakfast.|eggs,egg,egges,egg's
end|and,ende,ind|We clapped at the _ of the show.|end,ends,ended,endless
fall|fal,foll,faal|Be careful, or you will _.|fall,falls,fell,fallen
far|fur,for,farr|My grandma lives _ away.|far,fur,for,fair
farm|form,firm,farme|Cows and pigs live on a _.|farm,farms,farmer,farming
fast|fist,fats,fasst|A cheetah is _ than a horse.|faster,fast,fastest,fastly
father|fathr,fother,farther|My _ cooks dinner on Fridays.|father,fathers,father's,fatherly
feed|fead,fede,feet|Please _ the fish before school.|feed,feeds,fed,feeding
feel|feal,fele,fil|Right now I _ happy.|feel,feels,felt,feeling
feet|feat,fet,fit|I have two _.|feet,foot,foots,feets|I stand on my two _.
fell|fall,fel,feel|Yesterday I _ off my bike.|fell,fall,falled,fallen
find|fined,fine,fiend|Can you help me _ my shoe?|find,found,finds,finding|Help me _ my keys.
fine|fin,fien,find|I'm _, thank you.|fine,finer,finely,finest
fire|fier,fir,fyre|The firefighters put out a big _.|fire,fires,fired,firing
first|frist,ferst,furst|I was the _ person in line.|first,one,once,firstly
five|fiv,fife,fyve|A hand has _ fingers.|five,fifth,fifty,fives
fix|fics,fixe,fiks|Dad _ my bike yesterday.|fixed,fix,fixs,fixes
flag|flage,falg,flog|The Canadian _ is red and white.|flag,flags,flagged,flagging
floor|flor,flore,floore|Don't leave your socks on the _.|floor,floored,flooring,floory
fly|fli,flie,flu|Birds can _.|fly,flies,flew,flying
food|fod,foode,feud|This _ tastes great.|food,foods,foody,feed
foot|fot,fut,foote|I hurt my left _.|foot,feet,foots,footed
four|for,fore,fowr|A dog has _ legs.|four,for,fore,fourth|Two plus two is _.
fox|fax,focks,foks|The red _ ran into the woods.|fox,foxes,foxs,fox's
from|form,frum,fron|This letter is _ my grandpa.|from,form,fro,frum
full|ful,fool,fill|My tummy is _ after that big dinner.|full,fill,fully,fullness
game|gam,gaim,gane|We played a board _.|game,games,gamed,gaming
gas|gass,gaz,guess|The car needs more _.|gas,gassy,gassed,gash
gave|gav,give,gaive|Grandma _ me a hug yesterday.|gave,give,gived,gives
girl|gril,gurl,gerl|Three _ are skipping rope.|girls,girl,girles,girl's
give|giv,gave,gieve|Please _ me the scissors.|give,gave,gives,given
glad|gald,gladd,glade|I am _ you came!|glad,gladly,gladder,gladness
goat|got,gote,goet|A _ ate my hat!|goat,goats,goat's,goated
goes|gose,goze,go's|She _ to dance class every Tuesday.|goes,go,going,gone
going|goeing,goin,gowing|We are _ to the beach.|going,go,goes,went
gold|gould,golde,goald|The king has a crown made of _.|gold,golden,golds,goldy
gone|gon,goen,gun|Where have the cookies _?|gone,went,go,goes
grade|grad,graid,grayde|I am in _ five.|grade,grades,graded,grading
grass|gras,glass,grase|The _ is green and soft.|grass,grasses,grassy,grassed
grow|groe,grou,gro|Plants need sun and water to _.|grow,grows,grew,grown
hard|herd,hart,hardd|This puzzle is _ than the last one.|harder,hard,hardest,hardly
has|haz,his,hass|She _ a pet rabbit.|has,have,having,haves
hear|here,heer,hare|Can you _ the birds singing?|hear,here,heard,hears|I _ with my ears.
hill|hil,hall,heel|We rolled down a big _.|hill,hills,hilly,hilled
hit|hat,hitt,heat|He _ the ball over the fence yesterday.|hit,hitted,hits,hitting
hold|hould,holde,old|Please _ my hand.|hold,holds,held,holding
hole|whole,hol,holl|The dog dug a _ in the yard.|hole,whole,holes,holy|The mouse lives in a _.
hop|hope,hopp,hap|The bunny is _ across the grass.|hopping,hoping,hop,hopped
hope|hop,hoap,hoppe|I _ you feel better soon.|hope,hopes,hoped,hoping
horse|hors,horce,hoarse|A _ galloped across the field.|horse,horses,horse's,horsey
house|hous,howse,hause|We live in a yellow _.|house,houses,housed,housing
how|hou,who,haw|_ old are you?|How,Who,What,Why
ice|ise,eyes,ics|The _ on the pond is thick.|ice,ices,icy,iced
inch|insh,inche,itch|The bug was only one _ long.|inch,inches,inchs,inched
inside|insid,in side,inseid|It's raining, so let's play _.|inside,in side,insides,insider
job|jop,jobb,jab|My mom's _ is teaching.|job,jobs,jobbed,jobless
just|jest,jus,juste|I _ finished my homework.|just,justly,justice,juster
keep|kep,keap,kip|Can I _ this shell?|keep,kept,keeps,keeping
king|kin,keng,kink|A _ wore a golden crown.|king,kings,kingly,king's
lake|lack,leak,laik|We swam in a cold _.|lake,lakes,lake's,laked
land|lend,lnd,lan|The plane will _ soon.|land,lands,landed,landing
last|lost,lest,lasst|We ate the _ cookie.|last,lastly,lasts,lasted
late|let,lait,lat|Hurry, or we will be _!|late,lately,lateness,latest
lay|lai,ley,laye|Please _ the baby in her crib.|lay,lays,laid,laying
left|lift,lefft,lfet|Turn _ at the stop sign.|left,lefts,leave,leaving
leg|lag,leeg,legg|A spider has eight _.|legs,leg,legges,leg's
line|lin,lien,lyne|Draw a _ under your name.|line,lines,lined,lining
live|liv,leave,lieve|Where do you _?|live,lives,lived,living
lives|livs,leaves,lifes|A cat has nine _.|lives,lifes,life,lives'
long|lung,lonng,log|A giraffe has a very _ neck.|long,length,longing,longly
looking|lookin,luking,lokking|I am _ for my keys.|looking,look,looked,looks
lost|lots,lsot,last|I _ my mitten at school yesterday.|lost,lose,losed,loses
lot|lat,lott,lit|I have a _ of homework.|lot,lots,lotta,lotted
love|lov,luv,live|Do you _ pizza?|love,loves,loving,lovely
mad|mud,made,madd|He was _ when his tower fell.|mad,madly,madness,madden
made|maid,mad,maed|I _ a card for my mom yesterday.|made,make,maked,makes|I _ a sandcastle at the beach.
many|meny,manny,mony|How _ apples do you want?|many,much,more,most
meat|meet,mete,meate|Lions eat _.|meat,meet,meats,meaty|Chicken is a kind of _.
men|man,mean,menn|Two _ carried the heavy sofa.|men,man,mans,mens
met|meet,mat,mett|I _ my new teacher yesterday.|met,meet,meeted,meets
mile|mial,mil,myle|We walked a _.|mile,miles,mileage,milled
mine|mien,mind,myne|That pencil is _.|mine,my,me,mines
miss|mis,mess,mise|Don't _ the bus!|miss,misses,missed,missing
moon|mone,moone,mon|The _ is full tonight.|moon,moons,mooned,moony
more|mor,moor,mower|Can I have _ juice, please?|more,most,many,mores
most|moust,mosst,mast|She has the _ stickers in our class.|most,more,many,much
mother|muther,mothr,mather|My _ is the best cook.|mother,mothers,mother's,motherly
move|moov,muve,mov|We will _ to a new house next year.|move,moves,moved,moving
much|mutch,mush,muhc|How _ does this toy cost?|much,many,more,most
must|mist,musst,mast|You _ wear a helmet when you ride.|must,musts,musted,mustard
myself|myslef,meself,my self|I made this sandwich all by _.|myself,me,my self,mine
nail|nale,nial,nayl|Dad hit a _ with his hammer.|nail,nails,nailed,nailing
name|nam,naim,nmae|What is your _?|name,names,named,naming
need|ned,nead,kneed|Do plants _ water?|need,needs,needed,needing
new|knew,nu,noo|I got _ shoes for school.|new,knew,news,now|My shoes are brand _.
next|nest,nxt,necks|Who is _ in line?|next,nexts,nearly,nexted
nice|nise,nic,nies|She said thank you very _.|nicely,nice,nicer,nicest
nine|nin,nien,nyne|Four plus five is _.|nine,ninth,ninety,nines
north|noth,nroth,norht|Canada is _ of the United States.|north,northern,norths,northly
now|no,nou,know|Clean your room right _.|now,no,know,knew
nut|not,nutt,net|A squirrel is burying _ in the yard.|nuts,nut,nutes,nut's
off|of,offf,uf|Please turn _ the lights.|off,of,offs,offed
only|onley,olny,onli|I have _ one dollar left.|only,one,once,lonely
open|opne,opan,oppen|Please _ the window.|open,opens,opened,opening
or|our,ore,orr|Do you want milk _ juice?|or,our,ore,nor|Is it hot _ cold?
other|uther,othr,ather|I lost my _ sock.|other,others,another,otherwise
our|are,hour,owr|This is _ classroom.|our,are,hour,ours|We love _ dog.
outside|outsid,out side,owtside|Let's play _ in the snow.|outside,out side,outsides,outsider
over|ovr,ofer,ober|The cow jumped _ the moon.|over,overs,ever,oven
page|paje,pag,paige|Turn to the next _.|page,pages,paged,paging
park|perk,pork,parc|We had a picnic at a big _.|park,parks,parked,parking
part|port,pert,prat|This is my favourite _ of the movie.|part,parts,parted,partly
pay|pai,pey,paye|Dad _ for our lunch yesterday.|paid,pay,payed,pays
pick|pik,pic,pec|Please _ up your toys.|pick,picks,picked,picking
plant|plent,plnat,plante|We _ seeds in the garden last spring.|planted,plant,plants,planting
playing|playin,plaing,playying|The kids are _ hide-and-seek.|playing,play,played,plays
pony|poney,ponny,pone|I rode a _ at the fair.|pony,ponies,ponys,pony's
post|pots,poast,poste|He tied the horse to a _.|post,posts,posted,poster
pull|pul,pool,pll|_ the door to open it.|Pull,Pulls,Pulled,Pulling
put|putt,pot,pat|Yesterday I _ my book on the shelf.|put,putted,puts,putting
rabbit|rabit,rabbitt,rabet|Two _ hopped across the yard.|rabbits,rabbit,rabbites,rabbit's
read|red,reed,raed|I like to _ comic books.|read,reads,reading,reed|I _ a book every night.
rest|rust,rist,wrest|After the race, we sat down to _.|rest,rests,rested,restful
riding|rideing,ridding,ridin|She is _ her bike to the park.|riding,ride,rode,ridden
road|rode,rowed,rood|Look both ways before you cross the _.|road,rode,rowed,roads|Cars drive on the _.
rock|rok,rack,roack|I found a shiny _ by the lake.|rock,rocks,rocked,rocky
room|rum,rume,roomm|My _ is messy.|room,rooms,roomy,roomed
same|sam,saim,some|We have the _ shoes!|same,sames,sameness,samely
sang|sing,sank,sangg|We _ "Happy Birthday" to Grandpa.|sang,sing,sung,singed
saw|was,sow,sawe|Last night I _ a shooting star.|saw,see,seen,seed
say|sey,sai,sya|What did you _?|say,said,says,saying
school|scool,skool,shcool|I walk to _ every day.|school,schools,schooled,schooling
sea|see,sae,sia|Fish swim in the _.|sea,see,sees,seed|A ship sails on the _.
seat|seet,set,saet|Please take a _.|seat,seats,seated,seating
seem|seam,seme,sem|Does she _ happy?|seem,seems,seemed,seeming|You _ happy today.
seen|scene,seene,sean|Have you _ my glasses?|seen,saw,see,seed|I have _ that movie before.
send|sned,sent,sand|Please _ me a postcard.|send,sent,sends,sending
set|sit,sat,sett|Can you help me _ the table?|set,sets,setting,setted
seven|sevin,sevn,seben|There are _ days in a week.|seven,seventh,seventy,sevens
sheep|ship,sheap,shep|The farmer has twenty _.|sheep,sheeps,ship,sheep's
shoe|shoo,sho,show|I can't find my left _.|shoe,shoes,shoo,shoed|A boot is a kind of _.
show|shoe,sho,shoow|Can you _ me your drawing?|show,shows,showed,shown
sick|sik,sock,seck|I stayed home because I was _.|sick,sickness,sicken,sickest
side|sid,sied,sight|Walk on the _ of the road.|side,sight,sided,siding
sing|sign,seng,sinng|Listen! The birds are _.|singing,sing,sang,sung
sky|ski,skye,skai|The _ is full of stars.|sky,skies,skys,sky's
small|smal,smoll,smell|A mouse is _ than a cat.|smaller,small,smallest,smaler
some|sum,som,same|Can I have _ grapes?|some,sum,someone,somes|I want _ more juice.
soon|son,sun,sonn|We will eat lunch _.|soon,soonest,soons,sun
spell|spel,spill,speel|Can you _ your name?|spell,spelled,spells,spelling
start|stort,strat,stat|The movie will _ at seven.|start,starts,started,starting
stay|stai,stey,sty|Can I _ up late tonight?|stay,stays,stayed,staying
still|stil,steel,stilll|Are you _ hungry?|still,stilled,stills,stillness
store|stor,stoer,stare|We bought milk at a _.|store,stores,stored,storing
take|tak,tack,teik|Please _ off your boots.|take,takes,took,taken
talk|tock,tak,tolk|We _ on the phone last night.|talked,talk,talks,talking
tall|tal,toll,tale|Giraffes are very _.|tall,taller,tallest,tallness
teach|teech,tech,taech|Can you _ me to swim?|teach,taught,teaches,teached
tell|tel,tall,teel|Please _ me a story.|tell,told,tells,telled
than|then,thun,tahn|My dog is bigger _ your cat.|than,then,that,them
thank|thenk,thak,tank|I want to _ you for the gift.|thank,thanks,thanked,thankful
that|taht,thet,tat|Can I have _ red crayon?|that,those,these,them
them|then,thme,thim|I invited my friends, and all of _ came.|them,they,their,theirs
then|than,thin,thne|First wash your hands, _ eat.|then,than,them,they
three|tree,thre,threee|A triangle has _ sides.|three,third,thirty,threes
time|tim,tiem,thyme|What _ is it?|time,times,timed,timing
today|tooday,to day,todey|_ is my birthday!|Today,Todays,To day,Today's
told|toled,tolde,tolled|Mom _ me a funny story last night.|told,tell,telled,tells
too|to,two,tooo|I want to come _!|too,to,two,toe|This soup is _ hot.
took|tuk,tok,tooke|We _ a lot of photos on our trip.|took,take,taked,taken
train|trane,trian,tran|The _ is coming down the track.|train,trains,trained,training
truck|truk,trick,turck|A big fire _ raced down the street.|truck,trucks,trucked,trucking
try|tri,trie,tray|I will _ my best.|try,tried,tries,trying
use|yous,yuse,uze|Can I _ your eraser?|use,uses,used,using
very|vary,verry,veri|The puppy is _ cute.|very,vary,many,much
walk|wok,wak,wolk|Let's _ the dog.|walk,walks,walked,walking
warm|worm,wram,warme|My blanket keeps me _.|warm,warmth,warmly,warms
wash|wosh,wach,wsh|_ your hands before dinner.|Wash,Washes,Washed,Washing
way|weigh,wey,wai|Which _ is the library?|way,weigh,ways,whey|This is the _ to school.
week|weak,wek,weeke|There are seven days in a _.|week,weak,weeks,weekly|We go to school five days a _.
well|wel,will,wall|She sings very _.|well,good,better,best
wet|whet,wit,wett|My socks got _ in the rain.|wet,wets,wetness,wetly
while|wile,whil,whyle|I read a book _ I waited.|while,which,whale,will
white|wite,whit,whight|Snow is _.|white,whitely,whitest,whites
who|how,hoo,whoo|_ ate my cookie?|Who,Whose,Whom,How
why|whi,wy,wye|_ is the sky blue?|Why,Who,Whose,Whom
wind|wend,wynd,wint|A strong _ blew my hat away.|wind,winds,windy,winded
wish|wich,wsih,wash|I _ I could fly!|wish,wishes,wished,wishing
with|whith,wiht,wit|I went to the park _ my dad.|with,which,whit,wish
woke|wok,woak,wake|I _ up early this morning.|woke,wake,waked,wakes
wood|would,wod,woud|The table is made of _.|wood,would,woods,wooden|We put _ on the campfire.
work|werk,wrok,walk|My dad goes to _ by bus.|work,works,worked,working
yellow|yelow,yello,yallow|A banana is a _ fruit.|yellow,yellows,yellowed,yellowing
yet|yit,yett,yes|Are we there _?|yet,yes,yell,yeti
your|you're,yore,yuor|Is this _ jacket?|your,you're,you,yours|Brush _ teeth.
zoo|zu,zoe,sue|We saw lions at the _.|zoo,zoos,zoom,zoo's
fish|fush,fesh,fich|Look! The bear is _ in the river.|fishing,fish,fished,fishes
ship|sheep,chip,shipp|A big _ sailed across the sea.|ship,ships,shipped,shipping
jump|jamp,jumb,jumpe|The frog _ into the pond yesterday.|jumped,jump,jumps,jumping
hand|hend,band,hande|Wash both of your _ before dinner.|hands,hand,handed,handing
black|blak,block,blackk|My cat is _ with white paws.|black,blacks,blacker,blackest
make|mack,maek,mike|Last night Dad _ pancakes for dinner.|made,make,maked,makes
said|sed,siad,sayed|Yesterday my teacher _ we will have a test.|said,say,says,sayed
have|hav,half,haf|They _ two goldfish at home.|have,has,haves,having
went|want,wint,whent|We _ to the zoo last Sunday.|went,go,goed,going
want|went,wont,whant|Does he _ a new ball for his birthday?|want,wants,wanted,wanting
what|wat,whut,that|_ time is it?|What,When,Whose,Where
when|wen,then,whin|_ does the movie start? It starts at six.|When,What,Who,Whom
they|thay,then,thei|My friends said _ would come to the party.|they,them,their,there
little|littel,litle,lettle|She has a _ brother who is two years old.|little,littles,littler,littlest
green|grean,gren,grin|My favourite colour is _.|green,greens,greener,greenest
tree|tre,three,trea|There are many tall _ in the forest.|trees,tree,treeses,tree's
milk|melk,mlik,milck|Please pour some _ into my glass.|milk,milks,milking,milked
help|halp,hepl,hellp|Thank you for _ me with my homework.|helping,help,helped,helps
sleep|slep,sleap,slip|Last night I _ for ten hours.|slept,sleep,sleeped,sleeps
eat|eet,it,eatt|I have already _ my lunch.|eaten,ate,eat,eated
there|thare,ther,theer|Put the box over _, next to the door.|there,their,they're,theirs|I live over _.
were|where,wear,wer|We _ at the beach all day yesterday.|were,was,are,where
after|afer,ater,aftr|We had ice cream _ dinner.|after,afterwards,later,behind
light|lite,lihgt,ligth|This bag is _ than that heavy one.|lighter,light,lightest,lightly
night|nite,nigth,nihgt|The owl hunts at _.|night,nights,nightly,knight|The stars come out at _.
know|kno,knwo,knoe|Do you _ the answer?|know,knew,known,knows|I _ how to swim.
boat|bote,boot,baot|Two _ are tied to the dock.|boats,boat,boates,boat's
rain|rane,rian,raine|It is _ hard, so bring an umbrella.|raining,rain,rained,rains|The _ made big puddles.
snow|sno,snoe,snaw|It _ all night, and now the yard is white.|snowed,snow,snows,snowing
thing|thin,think,theeng|I found many cool _ at the beach.|things,thing,thinges,thing's
think|thing,tink,thinck|I _ it will rain later.|think,thinks,thought,thinking
bring|brang,brign,breng|Yesterday she _ cookies to class.|brought,bring,brang,bringed
kitchen|kichen,kitchin,chicken|Mom is cooking in the _.|kitchen,kitchens,chicken,kitten
happy|hapy,happey,hoppy|She smiled _ when she opened the gift.|happily,happy,happier,happiness
funny|funy,funnie,phunny|That was the _ joke I have ever heard!|funniest,funny,funnier,funnyest
clean|clen,cleen,clan|Please _ your room before dinner.|clean,cleans,cleaned,cleaning
shout|showt,shoot,shuot|Please don't _ in the library.|shout,shouts,shouted,shouting
brown|broun,brwon,brawn|The bear has thick _ fur.|brown,browns,browner,browned
could|cood,culd,cold|When I was four, I _ not tie my shoes.|could,can,cans,coulded
story|stroy,storey,stori|Grandpa told us three scary _.|stories,story,storys,storyes
buy|bui,buye,biy|Yesterday Mom _ me new boots.|bought,buy,buyed,brought|I want to _ a new toy.`,
3: `able|abel,abl,eible|Are you _ to touch your toes?|able,ably,ability,enable
above|abuve,abov,a bove|The kite flew high _ the trees.|above,below,abroad,aboves
afraid|afrade,afriad,afaid|My little brother is _ of the dark.|afraid,fear,scare,scary
afternoon|afternon,afterdoon,aftrnoon|We have gym class in the _.|afternoon,afternoon's,after noon,aftermoon
age|aje,ag,aige|What is your _?|age,ages,aged,aging
air|ear,are,aire|Open the window to let in fresh _.|air,airs,aired,airy|Birds fly through the _.
airplane|airplain,airpane,arplane|Our _ landed on time.|airplane,airplanes,airplaned,airplain
almost|allmost,amost,almots|It's _ time for bed.|almost,most,mostly,all most
alone|alon,a lone,aloan|My cat does not like to be _.|alone,along,a lone,lone
along|alonge,a long,alng|We walked _ the beach.|along,a long,alone,belong
already|allready,alredy,all ready|I have _ eaten lunch.|already,all ready,ready,alright
also|allso,alsoe,aslo|I like soccer, and I _ like hockey.|also,either,neither,else
always|allways,alway,alwayz|The sun _ rises in the east.|always,all ways,away,alway
animal|animel,aminal,anamal|My favourite _ is the koala.|animal,animals,animate,animation
another|anuther,an other,anothr|Can I have _ cookie?|another,other,others,an other
anything|anythin,enything,any thing|I can't see _ in the dark.|anything,nothing,any thing,anythings
around|arond,arround,aroun|We walked _ the lake.|around,a round,arounds,aground
art|arte,are,ert|We painted pictures in _ class.|art,artist,artistic,arty
aunt|ant,ante,aunte|My _ is my mom's sister.|aunt,ant,aunts,uncle|My _ is my dad's sister.
balloon|baloon,ballon,ballun|A red _ floated away.|balloon,balloons,ballooned,ballon
bark|bork,barck,park|Why do dogs _?|bark,barks,barked,barking
barn|born,bran,barne|The cows sleep in a big red _.|barn,barns,barned,barny
basket|baskit,bascet,baskett|She carried a _ of apples.|basket,baskets,basket's,basketed
beach|beech,beatch,bech|We built a sandcastle at the _.|beach,beech,beaches,beached|We swim at the _ in summer.
bear|bare,bair,beer|A brown _ caught a fish.|bear,bare,bears,beard|A grizzly _ lives in the forest.
began|begun,begin,begann|The show _ at six o'clock last night.|began,begin,begun,beginned
begin|bigin,beggin,begen|The race will _ soon.|begin,began,begun,begins
behind|behine,behined,bihind|The cat is hiding _ the couch.|behind,behinds,behinde,hind
below|bellow,belo,bilow|The temperature dropped _ zero.|below,bellow,blow,belows
belt|bealt,bolt,blet|He wore a brown leather _.|belt,belts,belted,belting
better|beter,bettr,bitter|My drawing is _ than yours.|better,good,best,gooder
birthday|birthdy,brithday,berthday|Happy _ to you!|birthday,birthdays,birth day,birthdate
body|bodie,boddy,bady|Your heart pumps blood around your _.|body,bodies,bodys,bodily
bones|bons,bonez,boans|Your _ help you stand up straight.|bones,bone,boney,bone's
born|borne,boran,barn|I was _ in July.|born,borne,bear,borned
bought|boght,bougth,brought|Mom _ me a new hat yesterday.|bought,buyed,buy,brought
bread|bred,braed,breed|I made a sandwich with whole wheat _.|bread,breads,bred,bready|We bake _ in the oven.
bright|brite,brigt,bight|The sun is very _ today.|bright,brightly,brighten,brightness
broke|brok,brake,brocke|I _ my pencil in half.|broke,break,broken,breaked
brought|brougt,brot,bought|She _ snacks to the picnic yesterday.|brought,bringed,brang,brung
cabin|cabbin,caban,cabine|We stayed in a _ by the lake.|cabin,cabins,cabinet,cabined
cage|caje,kage,cag|The bird sings in its _.|cage,cages,caged,cagey
camp|kamp,cmap,cramp|We will _ in the woods this weekend.|camp,camps,camped,camping
can't|cant,can not,cann't|I _ find my other boot.|can't,cant,can,can'ts
care|cair,caer,car|Please take _ of my plant.|care,cares,careful,caring
cattle|catle,cattel,cattlle|The farmer has fifty _.|cattle,cattles,cattle's,cattled
cave|kave,caev,cove|Bears sleep in a _ in winter.|cave,caves,caved,caving
class|clas,glass,clase|There are twenty-five kids in my _.|class,classes,classy,class's
close|cloze,clothes,clos|Please _ the door.|close,closes,closed,closing|Please _ your eyes.
cloth|cloht,clothh,claoth|Wipe the table with a wet _.|cloth,clothes,clothe,clothing
coal|cole,cowl,coall|The old train burned _.|coal,cool,cold,goal
colour/color|culor,coler,collor|What _ is your new bike?|colour,colours,coloured,colourful
corner|conner,corener,cornor|The store is on the _ of Main Street.|corner,corners,cornered,cornering
cotton|coton,cottin,cotten|My T-shirt is made of _.|cotton,cottons,cottony,cottoned
cover|cuver,cuvver,covr|_ your mouth when you cough.|Cover,Covers,Covered,Covering
dark|drak,derk,darck|It gets _ early in the winter.|dark,darkly,darkness,darken
didn't|didnt,did'nt,dident|I _ hear the bell.|didn't,didnt,did'nt,doesn't
dinner|diner,dinnr,dinnerr|We eat _ at six o'clock.|dinner,diner,dinners,dine
dishes|dishs,dishez,dishis|I helped wash the _ after supper.|dishes,dish,dishs,dish's
does|dose,dos,duz|_ your dog like bones?|Does,Do,Doing,Done
done|dun,don,doen|Are you _ with your homework?|done,did,do,doing
don't|dont,do'nt,doesn't|I _ like spicy food.|don't,dont,doesn't,do'nt
dragon|dragen,dragn,dargon|The knight fought a fire-breathing _.|dragon,dragons,dragon's,dragoon
draw|drow,drawe,darw|Can you _ a horse?|draw,drew,drawn,draws
drink|drenk,drinck,dirnk|You should _ water every day.|drink,drank,drunk,drinks
earth|erth,eath,earht|The _ goes around the sun.|Earth,Earths,Earthly,Earthen
east|eest,eats,eist|The sun rises in the _.|east,eastern,easts,easter
eight|ate,eigth,eght|A spider has _ legs.|eight,ate,eighth,eighty|Four plus four is _.
even|evan,evin,eben|Four is an _ number.|even,evenly,evens,evening
ever|evr,every,evar|Have you _ seen a whale?|ever,every,even,evers
every|evry,very,everey|I brush my teeth _ morning.|every,very,ever,everyone
everyone|everone,every one,evryone|_ in my class likes recess.|Everyone,Everybodies,Everything,Everywhere
everything|everthing,every thing,evrything|I packed _ for the trip.|everything,everyone,everywhere,everythings
eyes|eys,ayes,eyez|Close your _ and make a wish.|eyes,eye,eye's,ice
face|fase,fays,faec|Wash your _ with soap.|face,faces,faced,facing
feeling|feelin,feling,fealing|I am _ much better today.|feeling,feel,felt,feels
felt|fealt,flet,fell|I _ sad when my fish died.|felt,feel,feeled,feels
few|fue,phew,fwe|Only a _ kids came to the party.|few,fewer,fewest,little
fight|fite,figth,fiht|My brother and I sometimes _ over toys.|fight,fights,fought,fighting
fishing|fishin,fiching,fisheng|Grandpa took me _ at the lake.|fishing,fish,fished,fishes
flower|flour,flowr,flouwer|She picked a yellow _.|flower,flour,flowers,flowery|A rose is a pretty _.
flying|fliing,flyin,flieing|Look! The geese are _ south.|flying,fly,flew,flown
follow|folow,fallow,follo|Please _ the leader.|follow,follows,followed,following
forest|forrest,forist,forset|Many animals live in this _.|forest,forests,forested,forester
forgot|forgott,forgat,frogot|I _ my lunch at home today.|forgot,forget,forgotted,forgets
form|from,fourm,frm|Please fill out this _.|form,forms,formed,forming
found|fownd,fond,foud|I _ a dollar on the sidewalk yesterday.|found,find,finded,founded
fourth|forth,fouth,foruth|Our class is on the _ floor.|fourth,forth,four,fourteen|I came _ in the race.
free|fre,frea,three|The museum is _ on Sundays.|free,freely,freedom,freed
Friday|Fryday,Firday,Fridey|We have pizza day every _.|Friday,Fridays,Friday's,Fryday
front|frunt,fornt,fron|Please sit in the _ row.|front,fronts,frontier,frontal
getting|geting,gettin,gtting|It is _ cold outside.|getting,get,got,gets
given|givin,gevin,givne|I have _ my old toys to my cousin.|given,gave,give,gived
grandmother|grandmuther,granmother,grandmothr|My _ knits me a scarf every winter.|grandmother,grandmothers,grandmother's,grandmotherly
great|grate,gret,graet|We had a _ time at the party!|great,grate,greatly,greatness|That was a _ idea!
grew|grow,grue,greew|The sunflower _ taller than me.|grew,grow,growed,grown
ground|grownd,groud,gruond|The leaves fell to the _.|ground,grounds,grounded,grind
hair|hare,heir,hiar|She brushes her long _ every morning.|hair,hare,hairs,hairy|I need to brush my _.
having|haveing,havin,heving|We are _ fun at the zoo.|having,have,has,had
head|hed,haed,heed|Put your hat on your _.|head,heads,headed,heading
he's|hes,his,hez|My brother says _ too tired to play.|he's,his,hes,him's
heat|heet,hat,heath|The _ from the fire kept us warm.|heat,heats,heated,heater
hello|helo,hallo,hellow|Say _ to your new neighbour.|hello,hollow,halo,yellow
high|hi,hight,hihg|The bird built its nest _ in the tree.|high,height,higher,highly|The kite flew very _.
himself|himselfe,hisself,him self|Tom made breakfast all by _.|himself,hisself,him,he
hundred|hunderd,hundrid,hundret|There are one _ cents in a dollar.|hundred,hundreds,hundredth,hundredths
hurry|hury,hurrie,hurray|_ up, or we will miss the bus!|Hurry,Hurried,Hurries,Hurrying
hurt|hert,hirt,hurd|I _ my knee when I fell yesterday.|hurt,hurted,hurts,hurting
I'd|Id,I'de,Eyed|_ like a glass of milk, please.|I'd,Id,I,I'll|_ like to go home.
I'll|Ill,Il,Isle|_ call you after dinner.|I'll,Ill,Isle,Aisle|_ see you tomorrow.
I'm|Im,I'am,Ime|_ eight years old.|I'm,Im,I'am,I's
inches|inchs,inchis,inchez|The baby is twenty _ long.|inches,inch,inchs,inch's
isn't|isnt,is'nt,isn'nt|My dog _ allowed on the couch.|isn't,isnt,aren't,don't
it's|its,it'is,its'|_ raining outside.|It's,Its,Its',It|_ a sunny day.
I've|Ive,I'v,I'hve|_ never been on a plane.|I've,Ive,I'm,I'll
kept|kep,kepet,keept|She _ the secret for a whole week.|kept,keeped,keep,keeps
kids|kidz,kidds,kiids|The _ played tag at recess.|kids,kid,kid's,kidding
kind|kined,kynd,kiend|It is _ to share with others.|kind,kindly,kindness,kinds
kitten|kiten,kittin,kitton|Our cat had four _.|kittens,kitten,kittenes,kitten's
knife|nife,knif,knive|Use a _ to cut the bread.|knife,knives,knifes,knife's
lady|ladie,laidy,lade|The _ at the store gave me a sticker.|lady,ladies,ladys,lady's
large|larg,lage,larje|An elephant is a very _ animal.|large,larger,largest,largely
largest|largist,larjest,largst|The whale is the _ animal in the ocean.|largest,large,larger,most large
later|latter,laiter,latr|I will clean my room _.|later,late,latest,lately
learn|lern,learen,leran|I want to _ how to skate.|learn,learns,learned,learning
leave|leve,leaf,leav|Please don't _ your coat on the floor.|leave,leaves,left,leaving
let's|lets,let'us,lets'|_ go to the park!|Let's,Lets,Let,Lets'
letter|leter,lettr,latter|I wrote a _ to my grandma.|letter,letters,lettered,litter
life|lief,lif,liffe|A butterfly has a short _.|life,lives,lifes,live
list|lisst,lsit,lest|Mom made a shopping _.|list,lists,listed,listing
living|liveing,livin,leaving|Fish are _ things.|living,lived,lives,leaving
lovely|lovly,luvely,loveley|What a _ day for a picnic!|lovely,love,loving,loved
loving|loveing,luving,lovin|My grandparents are kind and _.|loving,love,loved,loves
lunch|lunsh,lounch,lanch|I packed a sandwich for _.|lunch,lunches,lunched,lunching
making|makeing,makin,mking|We are _ cookies for the bake sale.|making,make,made,makes
maybe|mabey,maybee,maybea|_ we can go swimming tomorrow.|Maybe,May be,Mabey,Maybes
mean|meen,mien,main|It is _ to call people names.|mean,meant,meaning,means
merry|marry,mary,merrie|_ Christmas, everyone!|Merry,Marry,Mary,Merrily|We wish you a _ Christmas.
might|mite,mihgt,migt|It _ rain later, so bring an umbrella.|might,mite,mighty,mights|I _ go to the park later.
mind|mined,mine,minde|Do you _ if I sit here?|mind,minds,minded,mindful
month|munth,mounth,monht|My birthday is next _.|month,months,monthly,moth
morning|mourning,mornin,morening|I eat breakfast every _.|morning,mourning,mornings,morn|Good _, class!
mouth|mouf,mowth,moth|Open your _ and say "ahh."|mouth,mouths,mouthful,moth
music|musik,musick,muzic|I like to listen to _.|music,musical,musician,musics
near|neer,nere,naer|The school is _ my house.|near,nearly,nears,neared
nearly|neerly,nearley,neary|I _ missed the bus this morning!|nearly,near,nears,nearer
never|nevr,nevar,neber|I have _ seen snow in July.|never,ever,every,neither
news|nuse,newz,noose|Did you hear the good _?|news,new,newly,newer
noise|nois,noize,noyse|What is that loud _?|noise,noises,noisy,noisily
nothing|nuthing,nothin,no thing|There is _ in the box. It's empty!|nothing,anything,something,everything
number|numbr,nuber,numbur|What is your favourite _?|number,numbers,numbered,numb
o'clock|oclock,o clock,a'clock|School starts at nine _.|o'clock,oclock,clock,o'clocks
often|offen,ofen,oftin|How _ do you brush your teeth?|often,oft,soften,offer
oil|oyl,oill,ol|Mom cooks eggs in olive _.|oil,oils,oiled,oily
once|wunce,onse,ones|I have been to the zoo _.|once,one,ones,won
orange|orenge,ornage,oragne|I peeled an _ for snack.|orange,oranges,orangey,arrange
order|ordr,oder,odrer|Put the numbers in _ from smallest to biggest.|order,orders,ordered,orderly
own|on,owne,oun|I have my _ room.|own,owns,owned,owner
pair|pear,pare,paer|I need a new _ of socks.|pair,pear,pare,pairs|I bought a _ of mittens.
paper|papper,papr,peper|Write your name on this piece of _.|paper,papers,papery,papered
party|partie,parti,partty|I am having a birthday _ on Saturday.|party,parties,partied,partying
pass|pas,pase,paas|Please _ the salt.|pass,passes,passed,past
past|passed,paste,pst|We walked _ the library on our way home.|past,passed,paste,pass|In the _, people rode horses.
penny|peny,pennie,pennee|I found a shiny _.|penny,pennies,pennys,penny's
person|persen,purson,parson|She is the nicest _ I know.|person,people,persons,personal
picture|pitcher,pichure,pictur|I drew a _ of my cat.|picture,pictures,pitcher,pictured
place|plase,plais,palce|This is my favourite _ to read.|place,places,placed,placing
plan|plane,plann,pln|We need a _ for the science fair.|plan,plans,planned,planning
plane|plain,plan,palne|The _ flew over the clouds.|plane,plain,planes,planed|We flew on a _ to Vancouver.
please|pleese,plese,pleas|_ pass the ketchup.|Please,Pleased,Pleasing,Pleasant
point|piont,poynt,pont|Don't _ at people.|point,points,pointed,pointy
poor|pour,pore,poore|The _ puppy was cold and wet.|poor,pour,pore,poorly|The _ kitten was lost.
race|rase,raice,rice|Let's _ to the fence!|race,races,raced,racing
reach|reech,raech,rech|I can't _ the top shelf.|reach,reaches,reached,reaching
reading|readin,reeding,redding|She is _ a book about sharks.|reading,read,reads,reader
ready|redy,readdy,reddy|Are you _ to go?|ready,readily,readiness,already
real|reel,rael,rele|Is that a _ diamond?|real,reel,really,reality|Dragons are not _.
rich|riche,ritch,reach|The _ king had lots of gold.|rich,riches,richly,richness
river|rivver,rivr,riber|We paddled a canoe down a long _.|river,rivers,river's,riverbed
rocket|rocet,rockit,roket|A _ blasted off into space.|rocket,rockets,rocketed,rocketry
rode|road,rowed,rood|I _ my bike to the park yesterday.|rode,ride,rided,ridden|Yesterday she _ a horse.
rule|rool,rul,ruel|Raise your hand. That is a class _.|rule,rules,ruled,ruler
running|runing,runnin,runeing|The dog is _ around the yard.|running,run,ran,runs
salt|solt,sallt,slat|Please pass the _ and pepper.|salt,salts,salty,salted
says|sez,sayz,saiys|She always _ please and thank you, so she is very polite.|says,say,saying,sayed
sending|sendding,sendin,senting|I am _ a card to my cousin.|sending,send,sent,sends
sent|cent,scent,snet|Yesterday I _ a letter to Grandpa.|sent,send,sended,sends|I _ my friend a text.
seventh|sevnth,seventth,sevens|Saturday is the _ day of the week.|seventh,seven,seventy,sevens
sew|so,sow,sue|Grandma will _ a button on my shirt.|sew,sews,sewed,sewing|I can _ with a needle and thread.
shall|shal,shell,shalle|_ we dance?|Shall,Shell,Shalt,Shalls
short|shrot,shart,shorte|My sister is _ than me.|shorter,short,shortest,shortly
shot|shoat,shott,shut|Yesterday he _ the ball into the net.|shot,shoot,shooted,shoots
should|shuld,shoud,shood|You _ wear a coat today. It's cold!|should,shall,shoulds,shoulded
sight|site,sigt,sihgt|The ocean was a beautiful _.|sight,site,cite,sights|The castle was an amazing _.
sister|sistr,sistar,sitser|My little _ loves dolls.|sister,sisters,sister's,sisterly
sitting|siting,sittin,setting|The cat is _ on my homework!|sitting,sit,sat,sits
sixth|sixt,sicth,sixh|My brother is in _ grade.|sixth,six,sixty,sixes
sled|sledd,slade,slid|We rode the _ down the snowy hill.|sled,sleds,sledding,slid
smoke|smok,smoak,snoke|_ came out of the chimney.|Smoke,Smokes,Smoked,Smoking
soap|sope,soup,soape|Wash your hands with _ and water.|soap,soaps,soapy,soaped
someone|somone,some one,sumone|_ left a gift on our doorstep.|Someone,Some one,Anyone,Everyones
something|somthing,some thing,sumthing|I have _ to tell you.|something,anything,somethings,some thing
sometime|sometim,some time,sumtime|Let's play together _ next week.|sometime,sometimes,some times,somewhere
song|sonng,soung,sung|What is your favourite _?|song,songs,songbird,sing
sorry|sory,sorrie,sorrey|I am _ I broke your crayon.|sorry,sorrow,sorrier,sorriest
sound|sownd,sond,soud|That _ was really loud!|sound,sounds,sounded,soundly
south|sowth,souht,sauth|Birds fly _ for the winter.|south,southern,souths,southerly
space|spase,spcae,spice|Astronauts travel into _.|space,spaces,spaced,spacious
spelling|speling,spellin,spelleng|We have a _ test on Friday.|spelling,spell,spelled,speller
spent|spended,spnet,spint|I _ all my allowance on candy.|spent,spend,spended,spends
sport|spot,sprot,sporte|Hockey is my favourite _.|sport,sports,sporty,spot
spring|sprng,sprign,string|Flowers bloom in the _.|spring,springs,sprung,sprang
stairs|stares,stars,stiars|Walk carefully down the _.|stairs,stares,stair's,stars|Climb up the _ to bed.
stand|stend,stnad,stant|Please _ in a straight line.|stand,stands,stood,standing
state|stait,stat,steat|Texas is a big _ in the United States.|state,states,stated,stately
step|stap,stepp,stip|Watch your _ on the ice!|step,steps,stepped,stepping
stick|stik,stck,steak|The dog fetched a _.|stick,sticks,sticky,sticker
stood|stud,stode,stoud|We _ in line for an hour yesterday.|stood,stand,standed,stands
stopped|stoped,stopt,stoppd|The rain _ after lunch.|stopped,stoped,stop,stops
stove|stov,stofe,stoeve|Don't touch the hot _!|stove,stoves,stoved,stover
street|streat,stret,steet|We live on a quiet _.|street,streets,streetlight,stray
strong|stong,strang,storng|An ant is very _ for its size.|strong,strength,strongly,strongest
study|studdy,stuady,sudy|I need to _ for my math test.|study,studies,studied,studying
such|sutch,sush,shuch|It was _ a fun day!|such,so,much,very
sugar|suger,shugar,sugur|Don't put too much _ in your tea.|sugar,sugars,sugary,sugared
summer|sumer,sommer,summr|We go to the cottage every _.|summer,summers,summery,summered
Sunday|Sundy,Sonday,Sundae|We visit Grandma on _.|Sunday,Sundae,Sundey,Sundays'|_ is the day after Saturday.
supper|super,suppr,suppor|We had soup for _.|supper,super,suppers,sup
table|tabel,tabl,tayble|Put the plates on a big _.|table,tables,tabled,tablet
taken|takin,takeen,tooken|Someone has _ my seat!|taken,took,take,tooken
taking|takeing,takin,tacking|We are _ the train to Montreal.|taking,take,took,taken
talking|talkin,tawking,tolking|Please stop _ during the movie.|talking,talk,talked,talks
teacher|teecher,techer,teachr|My _ reads us a story after lunch.|teacher,teachers,teach,teaching
team|teem,taem,tame|Our _ won the game!|team,teem,teamed,teaming|I play on a soccer _.
tenth|tinth,tenht,tent|October is the _ month of the year.|tenth,ten,tens,tenths
that's|thats,that'z,thats'|_ my backpack, not yours.|That's,Thats,That,Thats'
these|theese,thes,theze|_ cookies are delicious!|These,This,That,Them
thinking|thinkin,thinkking,thingking|What are you _ about?|thinking,think,thought,thinks
third|thrid,therd,thurd|I came in _ place.|third,three,thirty,thirdly
those|thoes,thos,thoze|Look at _ big clouds over there!|those,that,this,them
throw|thro,throe,throwe|Can you _ the ball to me?|throw,throws,threw,thrown
tonight|tonite,tonigth,to night|We will see the stars _.|tonight,tonite,to night,tonights
trade|traid,trad,tread|Do you want to _ stickers with me?|trade,trades,traded,trading
trick|trik,trek,tirck|My dog can do a cool _.|trick,tricks,tricky,tricked
trip|tripp,trap,tirp|We went on a _ to the mountains.|trip,trips,tripped,tripping
trying|tryin,triing,trieing|I am _ to tie my shoes.|trying,try,tried,tries
turn|tern,trun,turne|It's your _ to roll the dice.|turn,turns,turned,turning
twelve|twelv,twelf,tewlve|There are _ months in a year.|twelve,twelfth,twelves,twenty
twenty|twinty,twenny,tweny|Ten plus ten is _.|twenty,twelve,twentieth,twenties
uncle|unkle,uncel,uncl|My _ is my mom's brother.|uncle,uncles,uncle's,aunt
under|undr,undre,unda|The cat is hiding _ the bed.|under,unders,undo,thunder
upon|apon,up on,uppon|Once _ a time, there was a princess.|upon,up on,open,apon
wagon|wagen,waggon,wagn|I pulled my little brother in the red _.|wagon,wagons,wagoned,waggon
wait|weight,wate,whait|Please _ for me at the door.|wait,weight,waits,waited|_ for the green light.
walking|walkin,wolking,wakling|We are _ to the library.|walking,walk,walked,walks
wasn't|wasnt,was'nt,wans't|I _ at school yesterday because I was sick.|wasn't,wasnt,weren't,isn't
water|watter,watr,woter|Plants need _ to grow.|water,waters,watered,watery
we're|were,wer,where|_ going to the movies tonight!|We're,Were,Where,Wear|_ best friends.
west|wset,wesst,vest|The sun sets in the _.|west,western,wests,wester
wheat|weat,wheate,whaet|Bread is made from _.|wheat,wheats,wheaten,sweet
where|wear,were,whare|_ is my other shoe?|Where,Wear,Were,Whose|_ do you live?
which|witch,wich,whitch|_ colour do you like best?|Which,Witch,Who,Whom|_ one do you want?
wife|wif,wive,wiffe|The farmer and his _ grew corn.|wife,wives,wifes,wife's
wild|wilde,wiled,whild|Wolves are _ animals.|wild,wildly,wildness,wilds
win|wen,winn,wine|I hope our team will _ the game.|win,wins,won,winning
window|windo,winduw,windoe|Look out that _!|window,windows,windowed,windy
winter|wintr,wenter,winder|It snows a lot in _.|winter,winters,wintry,wintered
without|withowt,with out,whithout|I can't sleep _ my teddy bear.|without,with out,with,within
woman|women,womon,wuman|A _ helped me find my mom.|woman,women,womans,woman's
won|one,wun,wan|Our team _ the game last night!|won,win,winned,wins|We _ first prize.
won't|wont,will'nt,wan't|I _ forget your birthday.|won't,wont,willn't,want
wool|wol,whool,wull|My sweater is made of _.|wool,wools,woolly,woollen
word|wrod,werd,wird|Can you spell this _?|word,words,wordy,worded
working|workin,werking,wroking|My mom is _ at the hospital today.|working,work,worked,works
wrong|rong,wrang,worng|I got one answer _ on the test.|wrong,wrongly,wrongs,wronged
yard|yerd,yrad,yarde|We played in our back _.|yard,yards,yarded,yarn
year|yeer,yaer,yer|My little brother is one _ old.|year,years,yearly,year's
yesterday|yesturday,yesterdy,yestarday|_ I went to the dentist.|Yesterday,Tomorrow,Yesterdays,Next week
you're|your,yore,youre|_ my best friend!|You're,Your,Youre,You|_ really good at drawing.
because|becuase,becaus,becose|I wore a coat _ it was cold.|because,before,until,unless
friend|freind,frend,fiend|My best _ lives next door.|friend,friends,friendly,friend's
people|peeple,poeple,pepole|Many _ came to watch the parade.|people,person,peoples,people's
again|agian,agen,agin|Can you read the story _?|again,against,gain,agains
right|rigth,rihgt,riht|Turn _ at the big red house.|right,write,rite,rights|You got the answer _!
write|wirte,writ,rwite|She has _ three letters to her grandma.|written,wrote,write,writed|_ your name at the top.
knew|knwe,kneu,gnew|I _ the answer, but I forgot to say it.|knew,know,known,knowed|I _ the answer.
teeth|teath,tooth,teeh|Brush your _ before bed.|teeth,tooth,tooths,teeths
mouse|mose,mouce,moose|I saw three little _ in the barn.|mice,mouse,mouses,mices
children|childern,childs,chilren|The _ are playing in the park.|children,child,childs,childrens
catch|cach,ketch,cetch|He _ the ball with one hand yesterday.|caught,catch,catched,catches
watch|wach,wotch,witch|We are _ a movie right now.|watching,watch,watched,watches
dream|dreem,drem,drean|Last night I _ that I could fly.|dreamed,dream,dreams,dreaming
paint|pant,paynt,piant|The walls were _ blue last summer.|painted,paint,painting,paints
round|rownd,rond,ruond|The Earth is _ like a ball.|round,rounds,rounding,roundly
would|woud,wuld,whould|_ you like some juice?|Would,Wood,Woulds,Wooden|I _ like a cookie, please.
family|famly,familly,famely|There are five people in my _.|family,families,familys,family's
carry|cary,carrie,karry|He _ the heavy box upstairs yesterday.|carried,carry,carryed,carries
world|wrold,werld,wolrd|It is the tallest building in the _.|world,worlds,world's,worldly
question|qestion,questoin,quesion|May I ask you a _?|question,questions,questioned,questioning
thought|thougt,tought,thot|I _ about you yesterday.|thought,think,thinked,thoughts
early|erly,earley,urly|We woke up _ than usual today.|earlier,early,earliest,earlyer
busy|bizzy,buzy,bisy|Saturday is the _ day of the week at the store.|busiest,busy,busier,busyest
half|haf,halve,hafl|I ate _ of the sandwich.|half,halves,halfs,halve
sign|sighn,sinn,sige|Please _ your name at the bottom.|sign,signs,signed,signing
listen|lisen,lissen,listin|The students are _ to the teacher.|listening,listen,listened,listning
island|iland,ilend,eyeland|They sailed to a small _ in the lake.|island,islands,island's,islander
heard|hurd,heared,haerd|Have you _ the news?|heard,hear,hears,heared|I _ a funny noise.
their|thier,theyr,thire|The kids put on _ coats.|their,there,they're,theirs|The kids love _ teacher.
weight|wieght,weigth,wayt|The doctor checked my _.|weight,wait,weigh,weighed|The _ of the box is five kilograms.
climb|clime,clim,climbe|The monkey is _ the tallest tree.|climbing,climb,climbed,climing
money|mony,monney,muney|I saved all my _ in a piggy bank.|money,moneys,money's,monied
become|becum,becom,bicome|The caterpillar has _ a butterfly.|become,became,becomed,becoming
machine|mashine,machien,masheen|The washing _ is broken.|machine,machines,machinery,machined
hour|houre,howr,ouer|The movie is two _ long.|hours,hour,hour's,ours|One _ has sixty minutes.
guess|gess,guss,guest|Can you _ what is in the box?|guess,guesses,guessed,guessing
believe|beleive,belive,beleve|I can't _ how fast you ran!|believe,believed,belief,believes
desert|dessert,dezert,deserte|The camel walked across the hot _.|desert,dessert,deserted,deserting
weather|weathar,wheather,weater|The _ is sunny and warm today.|weather,whether,wether,weathers|The _ is rainy today.`,
4: `across|accross,acros,acrost|We swam _ the lake.|across,acrossed,a cross,cross
against|aginst,agianst,agenst|Our team played _ the Tigers.|against,again,agains,gainst
awhile|awile,awhille,awhyle|Let's rest _ before we keep hiking.|awhile,awhiles,while,awhiled
between|betwen,beetween,bewteen|Sit _ Sam and Mia.|between,betweens,among,either
board|bored,bord,boared|The teacher wrote on the _.|board,bored,boards,boarding|We played a _ game.
bottom|bottem,botom,bottum|The treasure is at the _ of the sea.|bottom,bottoms,bottomless,button
breakfast|brekfast,breakfest,brakfast|I eat cereal for _.|breakfast,breakfasts,break fast,breakfasted
broken|brokin,brokn,brocken|My toy car is _.|broken,break,breaked,breaks
build|bild,biuld,buld|Let's _ a snowman!|build,built,builds,building
building|bilding,buiding,buildin|The tallest _ in Toronto is the CN Tower.|building,build,built,builder
captain|captin,captian,capten|The _ of the ship was very brave.|captain,captains,captained,caption
carried|caried,carryed,carrid|He _ the groceries inside yesterday.|carried,carry,carryed,carries
charge|charje,cherge,chrage|Please _ the tablet before bed.|charge,charges,charged,charging
chicken|chiken,chickin,chikken|We had roast _ for dinner.|chicken,chickened,chick,kitchen
circus|circis,cercus,sircus|We saw clowns at the _.|circus,circuses,circle,circuit
cities|citys,citties,cites|Toronto and Montreal are big _.|cities,city,citys,city's
clothes|cloths,cloze,clothse|Put your dirty _ in the hamper.|clothes,cloths,clothe,clothing's|I put on my _ in the morning.
company|compony,compeny,cumpany|My dad works for a big _.|company,companies,companion,accompany
couldn't|couldnt,could'nt,coudn't|I _ sleep because of the thunder.|couldn't,couldnt,could'nt,coudn't
discover|discuver,dicover,diskover|I hope to _ a dinosaur bone someday.|discover,discovers,discovered,discovery
doctor|docter,doctr,dokter|A _ listened to my heart.|doctor,doctors,doctored,doctoral
doesn't|doesnt,does'nt,dosen't|My cat _ like baths.|doesn't,don't,doesnt,dosen't
dollar|doller,dolar,dollor|This pencil costs one _.|dollar,dollars,dollar's,doll
during|durring,durin,dureing|Please be quiet _ the movie.|during,while,dureing,duration
eighth|eigth,eight,eighh|August is the _ month of the year.|eighth,eight,eighty,eights
else|els,ells,elce|Do you want anything _?|else,elses,also,ells
enjoy|injoy,enjoi,enjoye|I hope you _ the show!|enjoy,enjoys,enjoying,enjoyment
everybody|everbody,every body,evrybody|_ in my family likes pizza.|Everybody,Every body,Everybodies,Anybody's
example|exampel,exsample,egzample|Can you give me an _?|example,examples,exampled,sample
excuse|excuze,exkuse,scuse|_ me, may I get past?|Excuse,Excuses,Excused,Excusing
field|feild,feld,fild|The cows are in that _.|field,fields,fielded,fielder
fifth|fith,fifht,fiveth|I am in _ grade.|fifth,five,fifty,fives
finish|finsh,finnish,finich|Did you _ your homework?|finish,finished,finishes,finishing
following|folowing,followwing,followin|The ducklings are _ their mother.|following,follow,followed,follows
group|groop,grup,gruop|We worked in a small _.|group,groups,grouped,grouping
happened|happend,hapened,happenned|What _ at school today?|happened,happen,happens,happend
harden|hardin,hardden,harten|The clay will _ when it dries.|harden,hardens,hardened,hardness
haven't|havent,have'nt,haven'nt|I _ finished my book yet.|haven't,havent,hasn't,didn't
heavy|heavey,hevy,heavvy|This backpack is too _.|heavy,heavier,heavily,heaviness
held|helld,heald,hed|She _ the baby kitten gently.|held,hold,holded,holds
hospital|hospitle,hopsital,hospitel|My aunt works at the _.|hospital,hospitals,hospitality,hospitable
idea|idear,idee,ideah|That's a great _!|idea,ideas,ideal,idealy
instead|insted,in stead,instaed|Let's play inside _.|instead,in stead,instant,steady
known|knowen,nown,knonw|I have _ her since kindergarten.|known,knew,know,knowed
middle|midle,middel,midddle|Sit in the _ of the rug.|middle,middles,mid,meddle
mountain|mountin,mountian,montain|We hiked up a tall _.|mountain,mountains,mountainous,mount
ninth|nineth,nienth,ninthe|September is the _ month of the year.|ninth,nineth,nine,ninety
office|offise,ofice,offis|My mom works in an _.|office,offices,officer,official
parent|parant,perent,parint|Each _ signed the permission form.|parent,parents,parental,parenting
peanut|peenut,penut,peanutt|I love _ butter sandwiches.|peanut,peanuts,pea nut,peanutty
pencil|pensil,pencel,pencle|Can I borrow a _?|pencil,pencils,penciled,pencil's
picnic|picnik,picknick,pikneck|We had a _ in the park.|picnic,picnics,picnicked,picnicking
police|polise,pollice,poleece|The _ officer helped the lost child.|police,polices,policed,policy
prize|prise,priz,pryze|She won first _ at the science fair.|prize,prizes,prized,price
quite|quiet,quit,qiute|The movie was _ long.|quite,quiet,quit,quick
radio|raydio,radeo,radiow|We listened to music on the _.|radio,radios,radioed,ratio
raise|rase,raize,rays|_ your hand if you know the answer.|Raise,Rise,Raze,Rays
really|realy,relly,reely|That roller coaster was _ fast!|really,real,realize,reality
reason|reeson,raison,reasen|What is the _ you are late?|reason,reasons,reasoned,reasonable
return|retern,returen,ritern|Please _ your library books by Friday.|return,returns,returned,returning
Saturday|Saterday,Satarday,Saturdy|We go swimming every _.|Saturday,Saturdays,Saturday's,Saterday
scare|scair,skare,scar|Don't _ the birds away!|scare,scared,scary,scares
since|sence,sinse,sinc|I have lived here _ I was a baby.|since,for,sense,science|I have been here _ lunch.
slowly|slowley,sloly,slowely|The turtle _ crawled across the road.|slowly,slow,slower,slowest
stories|storys,storeys,storries|Grandpa tells the best _.|stories,story,storys,story's
student|studnet,studint,studant|Every _ needs a pencil.|student,students,studied,studious
sudden|suddin,suden,suddon|There was a _ crash of thunder.|sudden,suddenly,suddenness,suddens
suit|suite,soot,siut|Dad wore a black _ to the wedding.|suit,suite,suits,suited|He wore a _ and tie.
swimming|swiming,swimmin,swimmimg|We go _ at the pool every Saturday.|swimming,swiming,swim,swam
threw|through,thru,threww|He _ the ball to his friend.|threw,through,throwed,thrown|She _ the ball to me.
tired|tierd,tird,tyred|I am so _ after the long hike.|tired,tiring,tire,tiredly
together|togather,togeather,to gether|Let's work _ on this puzzle.|together,to gether,gather,altogether
toward|towerd,tward,toword|The puppy ran _ me.|toward,towered,tower,towed
tried|tryed,tride,tryd|Yesterday I _ my best on the test.|tried,tryed,try,tries
truly|truely,truley,trully|I am _ sorry.|truly,true,truely,truth
turtle|turtel,tirtle,turtl|The _ hid inside its shell.|turtle,turtles,turtle's,turtled
wear|where,ware,waer|What will you _ to the party?|wear,where,ware,were|I _ a hat in winter.
we'll|well,wel,weel|_ see you tomorrow!|We'll,Well,Wheel,Weal
whole|hole,hol,whoal|I ate the _ pizza by myself!|whole,hole,holy,wholly|I read the _ book in one day.
whose|who's,hooz,whos|_ jacket is this?|Whose,Who's,Who,Whom|_ turn is it?
women|woman,wimmen,womin|Three _ were waiting at the bus stop.|women,woman,womans,womens
wouldn't|wouldnt,would'nt,wouln't|My dog _ stop barking last night.|wouldn't,wouldnt,won't,would'nt
writing|writting,wrting,riting|She is _ a story about a dragon.|writing,write,wrote,written
written|writen,writtin,riten|I have _ three pages so far.|written,wrote,write,writed
wrote|rote,wroat,writed|I _ a poem for my mom yesterday.|wrote,write,written,writed|She _ me a letter.
yell|yel,yall,yelll|Please don't _ in the house.|yell,yells,yelled,yelling
young|yung,yong,youn|My cousin is too _ to ride the big roller coaster.|young,younger,youngest,youth
whistle|whisle,wistle,whistel|The coach blew her _.|whistle,whistles,whistled,whistling
castle|castel,casle,cassle|The king lives in a stone _.|castle,castles,castled,cassle
knock|nock,knok,knoc|Please _ before you come in.|knock,knocks,knocked,knocking
wrist|rist,wirst,wrisst|She wears a watch on her _.|wrist,wrists,wristed,wrest
thumb|thum,thumm,thumbe|He gave me two _ up.|thumbs,thumb,thumbes,thum
honest|onest,honist,honnest|Always be _ and tell the truth.|honest,honesty,honestly,dishonest
autumn|autum,awtumn,autemn|Leaves turn red and orange in _.|autumn,autumns,autumnal,autum
nature|nachure,natur,naiture|We went on a _ walk.|nature,natural,naturally,natures
creature|creacher,creture,creeture|A bat is a night _.|creature,creatures,create,creation
adventure|adventur,advencher,adventshure|Our camping trip was a big _.|adventure,adventures,adventurous,adventurer
treasure|tresure,treashure,treasur|The pirates buried their _.|treasure,treasures,treasured,treasury
measure|mesure,meazure,measur|Use a ruler to _ the line.|measure,measures,measured,measurement
station|stashun,staition,stasion|We waited at the train _.|station,stations,stationed,stationary
vacation|vacashun,vaction,vacasion|We went to the beach on _.|vacation,vacations,vacate,vacationed
action|akshun,acshun,actoin|The movie was full of _.|action,act,actions,active
invite|invight,envite,invit|I want to _ the whole class to my party.|invite,invitation,invited,invites
invitation|invatation,invitashun,invitaion|I got an _ to her birthday party.|invitation,invite,invited,inviting
mistake|mistak,misteak,mestake|Everyone makes a _ sometimes.|mistake,mistakes,mistaken,mistook
unlock|unlok,unluck,anlock|Use the key to _ the door.|unlock,unlocks,unlocked,unlocking
replay|replai,rplay,reeplay|Can we _ that video?|replay,replays,replayed,replaying
quiet|quite,quiat,qwiet|Please be _ in the library.|quiet,quite,quietly,quit
quickly|quikly,quickley,qwickly|The rabbit _ ran away.|quickly,quick,quicker,quickness
energy|enerjy,enegry,enargy|Plants get _ from the sun.|energy,energetic,energize,energies
gentle|gentel,jentle,gentl|Be _ with the baby bunny.|gentle,gently,gentleness,genteel
giant|giunt,jiant,gaint|A _ lived at the top of the beanstalk.|giant,giants,gigantic,giant's
huge|hudge,huje,hug|An elephant is a _ animal.|huge,hugely,hug,hugest
recess|reccess,resess,recces|We play tag at _.|recess,recesses,recession,reset
cereal|serial,cereel,ceral|I eat _ with milk.|cereal,serial,cereals,ceremony|I had a bowl of _ for breakfast.
brake|break,braek,brak|Press the _ to stop the bike.|brake,break,braked,brakes|Use the _ to slow down.
break|brake,brek,braek|Be careful not to _ the glass.|break,brake,broke,broken|Don't _ the window.
flour|flower,flowr,flor|We need _ to bake a cake.|flour,flower,flours,floury|Bread is made with _.
knight|night,knite,nite|The _ rode a white horse.|knight,night,knights,knighted|The _ wore shiny armour.
tail|tale,tial,tayl|The dog wagged its _.|tail,tale,tails,tailed|A monkey has a long _.
tale|tail,tayle,tael|The book is a fairy _.|tale,tail,tales,tall|Grandpa told a scary _.
meet|meat,mete,meeet|I can't wait to _ your new puppy.|meet,meat,met,meets|Nice to _ you!
peace|piece,pease,peece|The world needs _.|peace,piece,peaceful,peas|We want _ and quiet.
plain|plane,plian,plaine|I like _ pizza with just cheese.|plain,plane,plainly,plains|She wore a _ white shirt.
scene|seen,sene,scean|The last _ of the movie was sad.|scene,seen,scenes,scenery|Act out the _ from the play.
cent|sent,scent,sint|This candy costs one _.|cent,sent,scent,cents|A penny is one _.
weak|week,weeck,waek|I felt _ after being sick.|weak,week,weakly,weakness|A baby bird is very _.
heal|heel,he'll,heale|The cut on my knee will _ soon.|heal,heel,heals,healed|Your scraped knee will _.
heel|heal,heale,heell|I got a blister on my _.|heel,heal,heels,healed|My _ is the back of my foot.
pretty|prety,pritty,purty|Her dress is _ than mine.|prettier,pretty,prettiest,prettyer
answer|anser,answar,ansewr|She _ all ten questions correctly yesterday.|answered,answer,answers,answerd
enough|enuff,enogh,enouf|She is old _ to ride the bus alone.|enough,too,very,so
built|bilt,biult,bulit|Beavers have _ a dam across the river.|built,build,builded,building
sure|shure,suer,shore|Are you _ you locked the door?|sure,surely,sureness,shore
second|secund,seconde,secand|She came in _ place in the race.|second,seconds,secondly,two
caught|cought,cawt,caugth|The cat _ a mouse last night.|caught,catched,catch,catches
laugh|laff,lagh,lauf|Everyone _ when the clown fell down.|laughed,laugh,laughs,laughing
country|contry,countrie,cuntry|Canada is a very large _.|country,countries,countrys,county
though|tho,thogh,thoe|_ it was raining, we still played outside.|Though,Through,Thought,Tough
minute|minit,minuet,minnute|Please wait a _; I'm almost ready.|minute,minutes,minuted,minutely
until|untill,untel,intil|We played outside _ it got dark.|until,unless,during,despite
visit|vist,visset,vizit|We are going to _ Grandma next weekend.|visit,visits,visited,visiting
ocean|ocian,oshun,ocen|Whales live in the _.|ocean,oceans,oceanic,ocean's
necessary|neccessary,necesary,nessesary|Is it _ to bring a lunch?|necessary,necessity,necessarily,need
separate|seperate,separete,sepparate|Please _ the red blocks from the blue ones.|separate,separated,separation,separately
tomorrow|tommorow,tomorow,tommorrow|_ we will go to the museum.|Tomorrow,Yesterday,Today's,Tomorrow's
calendar|calender,calandar,calander|I marked my birthday on the _.|calendar,calendars,calender,colander
February|Febuary,Febrary,Feburary|Valentine's Day is in _.|February,Febuary,Fall,Friday
Wednesday|Wensday,Wedensday,Wendsday|We have art class on _.|Wednesdays,Wednesday's,Wensdays,Wednesdaies
library|libary,liberry,librery|The school _ is open until four o'clock.|library,libraries,librarian,librarys
government|goverment,govenment,guvernment|The _ builds roads and schools.|government,govern,governor's,governing
knowledge|knowlege,nowledge,knowladge|Reading books increases your _.|knowledge,know,knowledgeable,known
guard|gaurd,gard,guarde|The dog is _ the house while we sleep.|guarding,guard,guarded,guards
scissors|sissors,scisors,scissers|Can I borrow your _?|scissors,scissor,scissor's,sizzors
exercise|exersize,excercise,exercize|Running is great _ for your heart.|exercise,exercises,exercising,exercised
straight|staight,straigth,strate|Draw a _ line with your ruler.|straight,strait,straighten,straightly
weird|wierd,weerd,wired|That was the _ dream I've ever had.|weirdest,weird,weirder,weirdly
height|hight,heigth,hieght|What is the _ of that mountain?|height,high,heights,higher
foreign|foriegn,forein,foreighn|She can speak two _ languages.|foreign,foreigner,foreigners,foreignly
muscle|muscel,mussle,musle|Your heart is a _ that pumps blood.|muscle,muscles,mussel,muscular
rhythm|rythm,rhythym,ritham|We clapped to the _ of the drum.|rhythm,rhythms,rhythmic,rhythmically
citizen|citizan,sitizen,citisen|She became a Canadian _ last year.|citizen,citizens,citizenship,city
disappear|dissapear,disapear,dissappear|The magician made the rabbit _.|disappear,disappeared,disappears,disappearing
unhappy|unhapy,inhappy,unhappey|He felt _ when his team lost.|unhappy,unhappily,unhappiness,happy
careful|carefull,carful,cairful|Please be _ with the glass vase.|careful,carefully,care,carefulness
carefully|carefuly,carefullly,carfully|Hold the baby bird _.|carefully,careful,care,careless
beginning|begining,beggining,beginnig|The _ of the movie was boring.|beginning,begin,began,begun
trouble|truble,trubble,troubel|We got into _ for being too loud.|trouble,troubles,troubled,troubling
character|charactor,caracter,charecter|The main _ in the book is a brave girl.|character,characters,characterize,charity
perhaps|perhapes,prehaps,pehaps|_ we can go swimming later.|Perhaps,Maybe's,Probable,Possibility
remember|rember,remeber,remembr|Do you _ where you put your keys?|remember,remembered,remembers,remembering
explain|explane,explian,expain|Can you _ how you solved it?|explain,explained,explanation,explains
thorough|thurough,thorogh,through|She did a _ job cleaning her room.|thorough,through,thoroughly,though
accident|acident,accidant,axident|He broke the window by _.|accident,accidental,accidentally,accidents
disappoint|dissapoint,disapoint,disappiont|The ending of the movie was _.|disappointing,disappoint,disappointed,disappointment
temperature|temprature,temperture,tempature|The _ dropped below zero last night.|temperature,temperatures,temper,tempered
pleasant|plesant,pleasent,pleazant|We had a very _ afternoon at the park.|pleasant,please,pleasure,pleasantly
echo|eccho,ecko,echoe|We heard two _ in the empty cave.|echoes,echos,echo,echoing
potato|potatoe,potatto,potayto|I peeled five _ for the soup.|potatoes,potatos,potato,potato's
surface|surfice,serface,surfase|The leaf floated on the _ of the water.|surface,surfaces,surfaced,surf
except|accept,exept,eccept|Everyone came _ Tom, who was sick.|except,accept,excepted,expect
village|villiage,vilage,villege|They live in a small fishing _.|village,villages,villager,villa`,
5: `America|Amerika,Americca,Amercia|Canada is in North _.|America,American,Americas,Americana
among|amung,amoung,amonng|The cat hid _ the tall grass.|among,between,amung,a mong
arrive|arive,arrrive,arrivve|What time will the train _?|arrive,arrives,arrived,arrival
attention|atention,attension,attenshun|Please pay _ to the teacher.|attention,attentive,attend,attentions
countries|countrys,contries,countrise|Canada and Mexico are both _.|countries,country,countrys,country's
course|coarse,cource,corse|Of _ you can come to my party!|course,coarse,courses,cores|The race _ was very long.
cousin|cusin,cousen,cuzzin|My _ is coming to visit from Calgary.|cousin,cousins,cousin's,cousinly
decide|dicide,desside,decied|I can't _ which flavour to pick.|decide,decided,decision,decides
evening|evning,eveneing,evenin|We had a lovely _ by the fire.|evening,evenings,even,evenly
future|futur,fewture,futchur|In the _, I want to be a scientist.|future,futures,futuristic,feature
happiest|happyest,hapiest,happiist|That was the _ day of my life!|happiest,happy,happier,happyest
happiness|happyness,hapiness,happines|Her smile was full of _.|happiness,happy,happily,happyness
interest|intrest,interist,innterest|I have a big _ in space.|interest,interesting,interested,interests
planet|planit,plannet,plant|Mars is the red _.|planet,planets,planetary,plant
present|presant,pressent,presnt|I got a _ for my birthday.|present,presents,presented,presence
president|presedent,presidant,presidnet|The class voted for a new _.|president,presidents,preside,presidential
problem|problim,probelm,prolbem|Can you solve this math _?|problem,problems,problematic,probe
sentence|sentance,sentense,sentnce|Start each _ with a capital letter.|sentence,sentences,sentenced,sense
several|severel,sevral,severl|I read _ books over the summer.|several,severals,severally,sever
special|speshal,specail,spechal|Today is a _ day.|special,specially,specialty,specials
suddenly|suddenley,sudenly,suddnly|_, the lights went out!|Suddenly,Sudden,Suddens,Suddenness
suppose|supose,suppoze,suposse|I _ you're right.|suppose,supposed,supposing,supposes
surely|surley,shurely,surly|You will _ win the race!|surely,sure,surety,surly
they're|their,there,theyre|_ going to the beach tomorrow.|They're,Their,There,Theyre|_ my best friends.
usually|usualy,usally,ussually|I _ walk to school.|usually,usual,usualy,use
information|infermation,informashun,infomation|The website has lots of _ about sharks.|information,inform,informative,informed
education|edjucation,educashun,educasion|A good _ is important.|education,educate,educational,educated
population|populashun,popolation,populaton|The _ of Toronto is very large.|population,populate,popular,populated
celebration|celebrashun,celabration,celebraton|We had a big _ for Canada Day.|celebration,celebrate,celebrated,celebrity
decision|desision,decison,decishun|It was a hard _ to make.|decision,decide,decided,decisive
television|televison,telivision,televishun|We watched the game on _.|television,televise,televised,televising
division|divison,devision,divishun|We are learning long _ in math.|division,divide,divided,divisible
confusion|confusoin,confuzion,confushun|There was some _ about the time.|confusion,confuse,confused,confusing
famous|famus,famos,faymous|She wants to be a _ singer.|famous,fame,famously,fames
nervous|nervus,nervos,nervouse|I feel _ before a test.|nervous,nerve,nervously,nerves
dangerous|dangerus,dangrous,dangerouse|Playing with fire is _.|dangerous,danger,dangerously,endanger
enormous|enormus,enormouse,enormas|The blue whale is _.|enormous,enormously,enormity,enormousness
curious|curius,cureous,curous|Cats are very _ animals.|curious,curiosity,curiously,cure
various|varius,veryous,varous|The store sells _ kinds of fruit.|various,vary,variety,variously
possible|possable,posible,possibal|Is it _ to fly to the moon?|possible,possibly,possibility,possibles
terrible|terrable,terible,terribel|We had _ weather on our trip.|terrible,terribly,terror,terrify
comfortable|comfterble,comfortible,confortable|This chair is very _.|comfortable,comfort,comfortably,comforted
valuable|valueable,valuble,valubale|The ring is very _.|valuable,value,valuably,values
visible|visable,vizible,visibal|The stars are _ tonight.|visible,vision,visibly,visit
incredible|incredable,incredibel,encredible|The view from the top was _!|incredible,incredibly,credible,credit
unusual|unusuall,unusal,un usual|It is _ to see snow in May.|unusual,unusually,usual,unused
impossible|imposible,impossable,inpossible|It is _ to lick your elbow.|impossible,impossibly,possible,impossibility
disagree|disagre,dissagree,disegree|I _ with you.|disagree,disagrees,disagreement,disagreeable
misunderstand|missunderstand,misunderstan,misundrstand|Please don't _ me.|misunderstand,misunderstood,misunderstanding,misunderstands
preview|preveiw,prevue,previw|We watched a _ of the new movie.|preview,previews,previewed,review
reappear|reapear,reapper,reeappear|The sun will _ after the storm.|reappear,reappears,reappeared,reappearance
independent|independant,indipendent,independint|My older sister is very _.|independent,independence,independently,depend
difference|diffrence,differance,diferance|Can you spot the _ between the pictures?|difference,different,differ,differently
science|sience,scince,sciense|_ is my favourite subject.|Science,Scientist,Scientific,Sciences
scientist|sientist,scienist,scientest|A _ looked through the microscope.|scientist,science,scientific,scientists
language|langauge,languge,langwidge|French is a beautiful _.|language,languages,linguist,languid
vegetable|vegtable,vegetible,vejetable|Carrot is my favourite _.|vegetable,vegetables,vegetarian,vegetation
chocolate|choclate,chocolat,chocalate|This _ bar is my favourite.|chocolate,chocolates,chocolaty,chocolate's
calm|clam,cawm,calme|Take a deep breath and stay _.|calm,calmly,calmness,calms
wrestle|wresle,restle,wrestel|The puppies love to _ in the grass.|wrestle,wrestled,wrestling,wrestler
doubt|dout,dought,dowt|I _ it will snow in June.|doubt,doubts,doubted,doubtful
column|colum,colunm,collum|Add the numbers in each _.|column,columns,columnist,calm
autograph|autograf,awtograph,autogragh|The hockey player signed an _ for me.|autograph,autographs,autographed,autography
photograph|fotograph,photograf,photogragh|We took a _ of the sunset.|photograph,photographer,photography,photographs
alphabet|alfabet,alphebet,alphabit|There are 26 letters in the _.|alphabet,alphabetical,alphabetize,alpha
ceiling|cieling,seeling,celing|There is a spider on the _!|ceiling,ceilings,sealing,seal
receipt|receit,reciept,resete|Keep this _ in case you need to return it.|receipt,receive,received,receipts
friendship|frendship,freindship,friendshp|Our _ is very important to me.|friendship,friend,friendly,friendships
careless|carless,carelss,cairless|It was _ to leave the door open.|careless,carelessly,carelessness,care
hopeful|hopefull,hopful,hopeffull|We are _ that it won't rain.|hopeful,hopefully,hope,hopeless
kindness|kindnes,kindniss,kinedness|Thank you for your _.|kindness,kind,kindly,kinder
darkness|darknes,darkniss,darkeness|The owl hunts in the _.|darkness,dark,darkly,darken
thermometer|thermomter,thermometre,thermomiter|The _ shows it is very cold.|thermometer,thermometers,thermal,thermos
equal|equel,eqaul,equall|Two plus two is _ to four.|equal,equally,equality,equals
fraction|fracshun,fractoin,fracsion|One half is a _.|fraction,fractions,fractional,fracture
multiply|multipy,multeply,mulitply|Can you _ six by seven?|multiply,multiplied,multiplication,multiplies
estimate|estamate,estimat,esstimate|Can you _ how many jelly beans are in the jar?|estimate,estimated,estimation,estimates
continent|contenent,continant,contnent|Africa is a huge _.|continent,continents,continental,content
province|provence,provins,provnce|Ontario is a _ in Canada.|province,provinces,provincial,provide
capital|capitol,capitle,capitel|Ottawa is the _ of Canada.|capital,capitol,capitals,capitalize|Paris is the _ of France.
culture|culcher,cultur,coulture|We learned about the _ of Japan.|culture,cultural,culturally,cult
museum|musuem,museam,muzeum|We saw dinosaur bones at the _.|museum,museums,muse,amusement
symbol|simbol,symble,cymbal|The maple leaf is a _ of Canada.|symbol,cymbal,symbols,symbolic|A heart is a _ of love.
orchestra|orchestera,orkestra,orchastra|An _ played beautiful music.|orchestra,orchestras,orchestral,orchestrate
rhyme|ryme,rhime,rime|"Cat" and "hat" _.|rhyme,rhymes,rhymed,rhyming
poem|pome,poam,poeme|I wrote a _ about the ocean.|poem,poems,poet,poetry
paragraph|paragraf,parragraph,paragragh|Write one _ about your weekend.|paragraph,paragraphs,paragraphed,graph
dictionary|dictionery,dicshunary,dictonary|Look up the word in the _.|dictionary,dictionaries,diction,dictate
vocabulary|vocabulery,vocabalary,vocabulairy|Reading helps build your _.|vocabulary,vocabularies,vocal,vocabular
exactly|exackly,exacly,egzactly|That is _ what I wanted!|exactly,exact,exactness,exacted
actually|acually,actualy,akshually|I _ like broccoli!|actually,actual,act,actuality
certain|certin,sertain,cirtain|Are you _ the store is open?|certain,certainly,certainty,curtain
discussion|discusion,discushun,diskussion|We had a class _ about recycling.|discussion,discuss,discussed,discussing
permission|permision,permishun,purmission|You need _ to leave the classroom.|permission,permit,permitted,permissive
success|sucess,succes,suckcess|The bake sale was a big _.|success,successful,succeed,successfully
audience|audiance,awdience,audeince|The whole _ clapped at the end of the play.|audience,audiences,audio,audition
announce|anounce,announse,announc|The principal will _ the winners.|announce,announced,announcement,announces
complete|compleet,complet,cumplete|Please _ the worksheet.|complete,completed,completely,completion
describe|discribe,descibe,describ|Can you _ your favourite animal?|describe,description,described,describes
explore|explor,exsplore,xplore|Let's _ the forest trail.|explore,explorer,exploration,explored
imagine|imagin,emagine,immagine|_ you could fly like a bird!|Imagine,Imagination,Imaginary,Imagined
imagination|imaginasion,imagenation,imaginashun|She has a wonderful _.|imagination,imagine,imaginary,imagined
different|diffrent,differant,difrent|My shoes are _ from yours.|different,difference,differently,differ
favourite/favorite|favorit,favrite,favourit|Pizza is my _ food.|favourite,favour,favourites,favourably
beautiful|beutiful,beautifull,butiful|The sunset was _ last night.|beautiful,beauty,beautifully,beautify
probably|probly,probabaly,prabably|It will _ rain tomorrow.|probably,probable,probability,probablely
important|importent,impotant,inportant|It is _ to drink water every day.|important,importance,importantly,import
through|thru,throgh,thruogh|The dog ran _ the tunnel.|through,threw,though,thorough|We drove _ a tunnel.
surprise|suprise,surprize,serprise|We were _ by the loud noise.|surprised,surprise,surprising,surprises
finally|finaly,finnaly,finely|After a long wait, the bus _ arrived.|finally,final,finals,finalize
piece|peice,peese,pice|Can I have another _ of cake?|piece,peace,pieces,peaces|I ate a _ of pizza.
receive|recieve,receve,resieve|Did you _ my letter?|receive,received,receives,receipt
although|altho,allthough,althogh|_ he was tired, he finished his homework.|Although,Already,Altogether,Always
achieve|acheive,acheve,achive|She worked hard to _ her goal.|achieve,achievement,achieved,achieving
environment|enviroment,environmint,enviornment|We should protect the _.|environment,environmental,environments,environ
especially|especialy,expecially,espeshally|I love fruit, _ mangoes.|especially,special,especial,specially
immediately|imediately,immediatly,immedietly|Call 911 _ if there is a fire.|immediately,immediate,immediacy,immediated
opportunity|oppurtunity,oportunity,opportunaty|This trip is a great _ to learn.|opportunity,opportunities,opportune,opportunist
recommend|reccomend,recomend,reccommend|Can you _ a good book?|recommend,recommendation,recommended,recommends
definitely|definately,definitly,defenitely|I will _ come to your party.|definitely,definite,define,definition
occasion|occassion,ocasion,occation|Her birthday is a special _.|occasion,occasions,occasional,occasionally
occurred|occured,ocurred,occurd|The accident _ last Tuesday.|occurred,occur,occurs,occuring
embarrass|embarass,embarras,imbarrass|I felt _ when I tripped on stage.|embarrassed,embarrassing,embarrass,embarrassment
conscience|consience,concience,conshence|His _ told him to tell the truth.|conscience,conscious,consciously,science
conscious|concious,consious,conshus|The patient is awake and _.|conscious,conscience,consciousness,consciously
dessert|desert,dessirt,desserte|We had apple pie for _.|dessert,desert,dessert's,deserted
principal|princapal,principel,pricipal|The _ visited our classroom today.|principal,principle,principals,principled|The school _ gave a speech.
affect|afect,affekt,afact|Lack of sleep can _ your mood.|affect,effect,affects,affection
effect|efect,effeckt,efekt|The medicine had a quick _.|effect,affect,effective,effectively
whether|whehter,wheter,whither|I don't know _ to laugh or cry.|whether,weather,either,whither|I don't know _ it will rain.
accept|except,acept,axcept|Please _ this small gift.|accept,except,accepted,acceptance
advice|advise,adivce,advics|My dad gave me some good _.|advice,advise,advices,advised
vacuum|vacume,vaccum,vacuume|Please _ the living room before the guests arrive.|vacuum,vacuums,vacuumed,vacuuming
restaurant|resturant,restaraunt,restarant|We ate dinner at a Chinese _.|restaurant,restaurants,restaurateur,rest
silhouette|silouette,silhouete,sillhouette|We saw the _ of a cat in the window.|silhouette,silhouettes,silhouetted,shadowy
ancient|anceint,anshent,ancent|The pyramids were built in _ Egypt.|ancient,anciently,ancients,antique
delicious|delisious,delicous,delishus|This soup tastes _!|delicious,deliciously,deliciousness,delicacy
mysterious|misterious,mysteryous,mystirious|The old house looked dark and _.|mysterious,mystery,mysteriously,mysteries
courage|currage,corage,courrage|It takes _ to stand up to a bully.|courage,courageous,courageously,encourage
courageous|couragous,courageus,corageous|The _ firefighter saved the puppy.|courageous,courage,courageously,encourage
guarantee|garantee,guarentee,gaurantee|I can't _ that it won't rain.|guarantee,guaranteed,guarantees,guaranteeing
responsible|responsable,resposible,responsibel|Who is _ for feeding the fish?|responsible,responsibility,responsibly,response
experience|experiance,expereince,expirience|Camping was a fun _ for the whole family.|experience,experienced,experiences,experiment
jealous|jelous,jealus,jellous|He was _ of his brother's new bike.|jealous,jealousy,jealously,jelly
sincerely|sincerly,sinserely,sincerelly|I _ hope you feel better soon.|sincerely,sincere,sincerity,since
tongue|tounge,tung,tonge|The giraffe has a long purple _.|tongue,tongues,tongued,tong
neighbour/neighbor|neigbour,nieghbour,naybour|Our _ has a friendly golden retriever.|neighbour,neighbours,neighbourhood,neighbouring
lightning|litning,lightnig,lighning|We saw _ flash across the sky.|lightning,lightening,lighting,lightly
schedule|shedule,schedual,skedule|Our _ for today is very busy.|schedule,scheduled,schedules,scheduling
awkward|akward,awkwerd,awkword|I felt _ at the new school at first.|awkward,awkwardly,awkwardness,award
bicycle|bicicle,bycicle,bicylce|I rode my _ to the park.|bicycle,bicycles,bicycled,cycle
biscuit|biscit,biskit,bisquit|Grandma baked a warm _.|biscuit,biscuits,biscuity,bisque
breathe|breath,breeth,breth|Take a deep breath and _ slowly.|breathe,breath,breathing,breathed
breath|breathe,breth,brethe|Take a deep _ before you dive.|breath,breathe,breaths,breathing
bruise|bruse,brooze,bruize|I got a _ on my leg when I fell.|bruise,bruises,bruised,bruising
business|buisness,bisness,busness|My aunt owns a bakery _.|business,businesses,busy,busily
cafeteria|cafateria,cafiteria,cafeterea|We eat lunch in the school _.|cafeteria,cafeterias,caffeine,cafe's
category|catagory,categry,cattegory|Which _ does a whale belong to?|category,categories,categorize,catalog
chorus|corus,chorous,korus|Everyone sang the _ together.|chorus,choruses,choir,chord
committee|comittee,commitee,committe|Our class chose a _ to plan the party.|committee,committees,commit,committed
condition|condishun,condision,conditoin|The old bike is in good _.|condition,conditions,conditional,conditioned
curiosity|curiousity,curiosty,curiosaty|_ made the cat open the box.|Curiosity,Curious,Curiously,Curiosities
delightful|delightfull,delitful,delightfle|We had a _ picnic by the lake.|delightful,delight,delighted,delightfully
disguise|disgise,disguize,disgize|He wore a funny _ on Halloween.|disguise,disguised,disguises,disgust
eagle|eagel,egle,eegle|An _ soared high above the cliffs.|eagle,eagles,eaglet,eager
emergency|emergancy,emergincy,emergensy|Call 911 in an _.|emergency,emergencies,emerge,emergent
exhausted|exausted,exhaustid,egzausted|After the marathon, she felt _.|exhausted,exhausting,exhaust,exhaustion
fascinate|facinate,fasinate,fasscinate|Does space _ you?|fascinate,fascinated,fascinating,fascination
fierce|feirce,fiers,fearce|The lion gave a _ roar.|fierce,fiercely,fierceness,force
glimpse|glimse,glimps,glympse|I caught a _ of the deer before it ran.|glimpse,glimpsed,glimpses,glimpsing
grammar|grammer,gramar,grammur|Good _ makes your writing clear.|grammar,grammatical,grammars,grammarian
hamburger|hamberger,hamburgur,hambuger|I ordered a _ with cheese.|hamburger,hamburgers,hamburgered,hamburg
hygiene|hygene,hygeine,hijene|Brushing your teeth is part of good _.|hygiene,hygienic,hygienist,hygienes
icicle|icycle,isicle,icickle|A long _ hung from the roof.|icicle,icicles,ice,icy
jewellery/jewelry|jewlery,jewelery,jewellry|Mom keeps her _ in a little box.|jewellery,jewel,jeweller,jewelled
journey|journy,jurney,journee|The _ to Grandma's took six hours.|journey,journeys,journeyed,journal
kilometre/kilometer|kilometr,killometre,kilomitre|We walked one _ to school.|kilometre,kilometres,metre,kilo
laboratory|labratory,laboratery,labortory|The scientist works in a _.|laboratory,laboratories,labour,elaborate
marvellous/marvelous|marvellus,marvelos,marvlous|We had a _ time at the fair.|marvellous,marvel,marvelled,marvellously
microscope|microscop,mycroscope,microskope|We looked at a leaf under the _.|microscope,microscopes,microscopic,micro
nuisance|nusance,nuisence,newsance|The buzzing fly was a real _.|nuisance,nuisances,noise,nuisanced
pyramid|pyrmid,piramid,pyramyd|The ancient _ was built from stone.|pyramid,pyramids,pyramidal,pyre
quarrel|quarel,quarrell,qwarrel|The twins had a _ over the last cookie.|quarrel,quarrels,quarrelled,quarrelsome
recognize/recognise|recanize,recognice,reconize|I didn't _ you with your new haircut!|recognize,recognized,recognition,recognizes
skeleton|skeleten,skelaton,skelliton|The museum has a dinosaur _.|skeleton,skeletons,skeletal,skull
squirrel|squirel,squirle,skwirrel|A _ buried an acorn in the yard.|squirrel,squirrels,squirrelled,squeal
thousand|thousend,thousnd,thowsand|There were a _ people at the concert.|thousand,thousands,thousandth,thou
volcano|volcanoe,volcanno,volkano|The _ erupted with hot lava.|volcano,volcanoes,volcanic,vulcan`
};

const MEANINGS_RAW = `all|every one of a group; the whole amount|We ate {all} of the popcorn.
am|a form of "be" used with "I"|I {am} ready for school.
and|a joining word that adds one thing to another|I have a cat {and} a dog.
at|shows where or when something is|We met {at} the park.
ball|a round toy you throw, kick or bounce|He kicked the {ball} into the net.
be|to exist or to have a certain quality|Try to {be} kind to everyone.
big|large in size|A whale is a {big} animal.
box|a container with flat sides, often made of cardboard|My new shoes came in a {box}.
boy|a male child|The {boy} rode his scooter.
but|a joining word that shows something different or opposite|I like apples, {but} I don't like pears.
came|moved toward someone or arrived (past)|My cousin {came} over for dinner.
can|to be able to do something|I {can} ride a bike.
car|a vehicle with four wheels that people drive|Dad parked the {car} in the garage.
cow|a large farm animal that gives milk|The {cow} said "moo."
dad|a name for your father|My {dad} plays catch with me.
day|the time from morning to night; 24 hours|Today is a sunny {day}.
did|carried out an action (past)|I {did} my chores this morning.
do|to carry out an action or a job|What will you {do} after school?
fat|having a lot of extra weight; thick|The {fat} raccoon waddled away.
for|meant to be given to someone; or because of|This card is {for} you.
fun|enjoyment; something you like doing|Sledding is so much {fun}!
get|to receive, bring or become|Can you {get} me a spoon?
go|to move from one place to another|Let's {go} to the library.
got|received or became (past)|I {got} a sticker for reading.
had|owned or held (past)|We {had} pancakes for breakfast.
he|a word for a boy or man already talked about|Sam said {he} was hungry.
hen|a female chicken|The {hen} sat on her eggs.
here|in or to this place|Please come {here}.
him|a word for a boy or man, used after an action|I gave {him} my pencil.
his|belonging to a boy or man|That is {his} backpack.
hot|very warm; having a high temperature|Don't touch the {hot} pan!
if|on the condition that|You can have dessert {if} you eat your peas.
in|inside something|The keys are {in} my pocket.
into|moving to the inside of something|The cat jumped {into} the box.
is|a form of "be" used with he, she or it|The sky {is} blue.
it|a word for a thing already talked about|I found a shell and kept {it}.
its|belonging to a thing or animal|The bird fed {its} babies.
let|to allow someone to do something|Mom will {let} us stay up late.
man|a grown-up male person|The {man} waved at us.
may|is allowed to; or might happen|You {may} go outside now.
me|a word you use for yourself|Can you help {me}?
mom|a name for your mother|My {mom} reads to me every night.
my|belonging to me|This is {my} favourite shirt.
no|a word that means not yes|{No}, I don't want any more.
not|a word that makes something negative|I am {not} sleepy yet.
of|belonging to or made from|I drank a cup {of} milk.
oh|a sound you make when you are surprised|{Oh}, look at that rainbow!
old|having lived or existed a long time|My grandpa's car is very {old}.
on|touching the upper surface of something|The book is {on} the table.
one|the number 1|I have {one} brother.
out|away from the inside|The dog ran {out} the door.
pan|a flat pot used for cooking|Dad fried eggs in a {pan}.
pet|an animal kept at home as a friend|My {pet} hamster is named Nibbles.
pig|a pink farm animal with a curly tail|The {pig} rolled in the mud.
ran|moved quickly on foot (past)|We {ran} all the way home.
rat|an animal like a big mouse with a long tail|A {rat} ran across the alley.
red|the colour of strawberries and fire trucks|She wore a {red} raincoat.
sat|rested on a seat (past)|We {sat} on the grass for lunch.
see|to notice with your eyes|I can {see} the moon tonight.
she|a word for a girl or woman already talked about|Mia said {she} likes horses.
six|the number 6|An ant has {six} legs.
so|very; or for that reason|The puppy is {so} cute!
ten|the number 10|I can count to {ten}.
the|a word used before a noun to point to a certain thing|{The} dog is sleeping.
this|the thing close to you|{This} pencil is mine.
to|toward a place or person|We walked {to} the store.
top|the highest part of something|We climbed to the {top} of the hill.
toy|something children play with|My favourite {toy} is a robot.
two|the number 2|I have {two} hands.
up|toward a higher place|The kite went {up} into the sky.
us|a word for me and other people|Grandma took {us} to the zoo.
was|a past form of "be" for I, he, she or it|It {was} cold yesterday.
we|a word for me and other people together|{We} are best friends.
will|is going to happen in the future|It {will} rain tomorrow.
yes|a word that means you agree|{Yes}, I would like some juice.
you|the person someone is talking to|Thank {you} for helping.
cat|a small furry pet that says "meow"|The {cat} curled up on my lap.
dog|a furry pet that barks and wags its tail|Our {dog} loves to fetch sticks.
sun|the bright star that gives Earth light and heat|The {sun} is shining today.
hat|something you wear on your head|I wore a warm {hat} in the snow.
run|to move fast on your feet|I can {run} faster than my brother.
sit|to rest on a chair or the floor|Please {sit} down on the rug.
bed|a piece of furniture you sleep on|I made my {bed} this morning.
chip|a thin, crunchy slice of potato; or a small broken piece|I ate one potato {chip}.
stop|to end moving or doing something|The car will {stop} at the red light.
frog|a small green animal that hops and croaks|The {frog} jumped onto a lily pad.
nest|a home that birds build for their eggs|The robin built a {nest} in our tree.
play|to have fun with a game or toy|Let's {play} hide-and-seek.
like|to enjoy something|I {like} chocolate ice cream.
ride|to sit on and move with a bike, horse or car|I {ride} my bike to the park.
home|the place where you live|We went {home} after the game.
look|to turn your eyes toward something|{Look} at that big truck!
good|nice, right or well done|You did a {good} job!
come|to move toward someone or a place|Please {come} to my party.
book|pages with words or pictures, joined together to read|I read a {book} about sharks.
swim|to move through water using your arms and legs|Fish {swim} in the ocean.
about|on the topic of; or close to a number|This movie is {about} a lost puppy.
add|to put numbers or things together|If you {add} 2 and 3, you get 5.
ago|in the past; before now|The dinosaurs lived long {ago}.
an|a word used before nouns that start with a vowel sound|I ate {an} orange.
any|some, even a small amount|Do you have {any} crayons?
apple|a round red or green fruit that grows on trees|I packed an {apple} for snack.
are|a form of "be" used with you, we and they|We {are} going to the beach.
as|in the same way; or equally|She is as tall {as} her dad.
ask|to say a question to someone|You can {ask} the teacher for help.
ate|had food (past)|We {ate} spaghetti for dinner.
away|to another place; not here|The bird flew {away}.
baby|a very young child|The {baby} is sleeping in the crib.
back|the rear part; or to return|Please put the book {back} on the shelf.
bad|not good|The milk smells {bad}.
bag|a soft container for carrying things|I put my lunch in a {bag}.
base|the bottom part; or a safe spot in a game|He slid into second {base}.
bat|a flying animal that sleeps upside down; or a stick for hitting a ball|A {bat} flew out of the cave.
bee|a buzzing insect that makes honey|A {bee} landed on the flower.
been|a form of "be" used after have|I have {been} to Ottawa.
before|earlier than|Brush your teeth {before} bed.
being|existing or acting a certain way|Thanks for {being} so patient.
best|better than all the others|She is my {best} friend.
bike|a two-wheeled vehicle you pedal|I ride my {bike} to school.
bill|a bird's beak; or a paper showing what you owe|The duck dipped its {bill} in the pond.
bird|an animal with feathers and wings|A {bird} sang outside my window.
blue|the colour of a clear sky|My backpack is {blue}.
both|the two of them together|{Both} of my sisters play piano.
brother|a boy who has the same parents as you|My {brother} is older than me.
bus|a large vehicle that carries many people|We take the {bus} to school.
by|near or beside; or done because of someone's work|Sit {by} the window.
cake|a sweet baked dessert|We had chocolate {cake} at the party.
call|to phone someone; or to shout a name|I will {call} Grandma tonight.
candy|a sweet treat made with sugar|I got {candy} on Halloween.
change|to make or become different|The leaves {change} colour in fall.
child|a young boy or girl|Every {child} got a balloon.
city|a large town where many people live|Toronto is a busy {city}.
club|a group of people who meet for a shared interest|I joined the art {club}.
coat|a warm piece of clothing you wear outside|Zip up your {coat}.
cold|having a low temperature; not warm|The ice is very {cold}.
coming|moving toward; arriving|Grandpa is {coming} to visit.
corn|a vegetable with yellow kernels on a cob|We ate {corn} at the barbecue.
cry|to have tears fall from your eyes|The baby started to {cry}.
cup|a small container for drinking|I filled my {cup} with water.
cut|to divide with something sharp|Please {cut} the cake into pieces.
daddy|a name small children use for their father|{Daddy} tucked me into bed.
dear|loved; or a polite way to start a letter|She is a {dear} friend.
deep|going far down|The pool is {deep} at this end.
deer|a forest animal; males have antlers|A {deer} ran across the field.
doing|carrying out an action|What are you {doing}?
doll|a toy that looks like a person|My sister brushed her {doll}'s hair.
door|something you open to go in or out of a room|Please shut the {door}.
down|toward a lower place|We slid {down} the hill.
dress|a piece of clothing with a top and skirt joined|She wore a yellow {dress}.
drive|to control a car or truck|My aunt will {drive} us to the mall.
drop|to let something fall|Don't {drop} your ice cream!
dry|not wet|My towel is finally {dry}.
duck|a water bird with a flat beak that quacks|A {duck} swam across the pond.
each|every single one|{Each} kid got a cupcake.
eating|having food right now|The squirrel is {eating} a nut.
egg|a round thing laid by birds; we often cook and eat it|I had a boiled {egg} for breakfast.
end|the last part|We cheered at the {end} of the race.
fall|to drop down; or the season before winter|Be careful not to {fall}.
far|a long way away|The moon is very {far} from Earth.
farm|land where food is grown and animals are raised|We picked pumpkins at the {farm}.
fast|quick; moving with speed|A cheetah is very {fast}.
father|a male parent|My {father} taught me to swim.
feed|to give food to|I {feed} the cat every morning.
feel|to sense with your body or heart|I {feel} happy today.
feet|the parts at the ends of your legs (more than one)|My {feet} are cold.
fell|dropped down (past)|The cup {fell} off the table.
find|to discover something you were looking for|Can you {find} my glasses?
fine|okay; or very thin|I feel {fine} now.
fire|heat and flames from something burning|We roasted marshmallows over the {fire}.
first|coming before all others|I was {first} in line.
five|the number 5|A starfish has {five} arms.
fix|to repair|Dad will {fix} the broken chair.
flag|a piece of cloth with a design that stands for a country|The {flag} waved in the wind.
floor|the surface you walk on inside a room|Don't leave toys on the {floor}.
fly|to move through the air|Birds {fly} south for the winter.
food|what people and animals eat|Pizza is my favourite {food}.
foot|the part at the end of your leg|I hurt my {foot} playing soccer.
four|the number 4|A table has {four} legs.
fox|a wild animal with a bushy tail, like a small dog|A red {fox} hid in the bushes.
from|starting at a place or person|I got a letter {from} my cousin.
full|holding as much as possible|My glass is {full} of juice.
game|an activity you play with rules|Let's play a card {game}.
gas|fuel for cars; or an air-like substance|The car is out of {gas}.
gave|handed something to someone (past)|She {gave} me a hug.
girl|a female child|The {girl} won the spelling bee.
give|to hand something to someone|Please {give} me the ball.
glad|happy and pleased|I'm {glad} you could come.
goat|a farm animal with horns and a little beard|The {goat} ate the grass.
goes|moves to a place (he, she or it)|He {goes} to bed at eight.
going|moving to a place|We are {going} to the park.
gold|a shiny yellow metal worth a lot|The pirate found {gold} coins.
gone|left; not here anymore|The snow is {gone}.
grade|a level or year in school; or a mark on work|I am in {grade} five.
grass|green plants that cover lawns and fields|The {grass} is wet with dew.
grow|to get bigger|Puppies {grow} up fast.
hard|not soft; or not easy|This test is {hard}.
has|owns or holds (he, she or it)|She {has} a pet turtle.
hear|to notice sounds with your ears|I can {hear} thunder.
hill|a raised area of land, smaller than a mountain|We sledded down the {hill}.
hit|to strike something|She {hit} the ball with the bat.
hold|to keep something in your hands|Can you {hold} my bag?
hole|an opening or empty space in something|There's a {hole} in my sock.
hop|to jump on one foot or with both feet together|Bunnies {hop} across the lawn.
hope|to wish something will happen|I {hope} it snows tomorrow.
horse|a big animal people can ride|She rode a brown {horse}.
house|a building where people live|Our {house} has a red door.
how|in what way|{How} do you make a paper plane?
ice|frozen water|We skated on the {ice}.
inch|a small unit for measuring length|The worm was one {inch} long.
inside|in the inner part; indoors|Let's play {inside} today.
job|work that someone does|My mom's {job} is fixing teeth.
just|only; or a moment ago|I {just} got home.
keep|to have and not give away|You can {keep} this drawing.
king|a man who rules a country|The {king} sat on his throne.
lake|a large area of water surrounded by land|We canoed across the {lake}.
land|the ground; or to come down from the air|The plane will {land} soon.
last|coming at the end|This is the {last} cookie.
late|after the right time|Hurry, we're {late}!
lay|to put something down gently|{Lay} the blanket on the grass.
left|the side opposite of right; or went away (past)|Turn {left} at the corner.
leg|the part of the body you stand and walk on|I scraped my {leg}.
line|a long thin mark; or people waiting one behind another|Draw a straight {line}.
live|to have your home somewhere; or to be alive|I {live} in Canada.
lives|more than one life; or makes a home (he, she or it)|My aunt {lives} in Calgary.
long|having a great length|A snake has a {long} body.
looking|using your eyes to see or search|I'm {looking} for my shoe.
lost|not able to be found; or missing the way|I {lost} my mitten.
lot|a large amount|I have a {lot} of stickers.
love|to care about someone very much|I {love} my family.
mad|angry|He was {mad} when his toy broke.
made|built or created (past)|I {made} a card for Mom.
many|a large number of|There are {many} stars in the sky.
meat|food that comes from animals|The chef cooked the {meat}.
men|more than one man|Two {men} carried the piano.
met|saw someone for the first time (past)|I {met} my new neighbour.
mile|a unit for measuring long distances|We walked one {mile}.
mine|belonging to me|That blue cup is {mine}.
miss|to fail to catch or hit; or to feel sad someone is gone|I {miss} my old school.
moon|the round object that shines in the night sky|The {moon} is full tonight.
more|a bigger amount|Can I have {more} soup?
most|the biggest amount|She read the {most} books in class.
mother|a female parent|My {mother} makes the best soup.
move|to go or put in a different place|Please {move} your chair.
much|a large amount|How {much} does it cost?
must|have to|You {must} wear a seatbelt.
myself|me and nobody else|I made lunch by {myself}.
nail|a thin metal pin you hammer; or the hard part on your fingertip|Dad hammered a {nail} into the wall.
name|the word people call someone or something|My dog's {name} is Max.
need|to have to have something|Plants {need} sunlight.
new|just made or bought; not old|I got {new} shoes.
next|coming right after|Who is {next} in line?
nice|kind or pleasant|That was a {nice} thing to say.
nine|the number 9|A cat has {nine} lives in stories.
north|the direction toward the top of a map|Canada is {north} of the U.S.
now|at this moment|Let's go {now}.
nut|a hard-shelled seed you can eat|The squirrel cracked a {nut}.
off|away from; or not on|Turn {off} the TV.
only|just one; nothing more|I have {only} one sister.
open|not closed|The store is {open}.
or|a word that gives a choice|Do you want juice {or} milk?
other|the second of two; or different|Where is my {other} sock?
our|belonging to us|This is {our} classroom.
outside|out of a building; outdoors|We played {outside} all day.
over|above; or finished|The plane flew {over} our house.
page|one side of a sheet of paper in a book|Turn to the next {page}.
park|an outdoor place with grass and play areas|We had a picnic in the {park}.
part|a piece of something bigger|The best {part} was the ending.
pay|to give money for something|I'll {pay} for the snacks.
pick|to choose; or to pull off a fruit or flower|{Pick} a card, any card.
plant|a living thing that grows in soil; or to put seeds in the ground|We will {plant} tulips.
playing|having fun with a game|The kids are {playing} tag.
pony|a small horse|I rode a {pony} at the fair.
post|a pole set in the ground; or to mail|The bird sat on a fence {post}.
pull|to move something toward you|{Pull} the rope as hard as you can.
put|to place something somewhere|{Put} your boots by the door.
rabbit|a small furry animal with long ears|The {rabbit} nibbled a carrot.
read|to look at words and understand them|I like to {read} at bedtime.
rest|to relax or sleep; or what is left|Let's {rest} for a minute.
riding|sitting on and moving with a bike or horse|She is {riding} a scooter.
road|a wide path for cars|Look both ways before you cross the {road}.
rock|a hard piece of stone|I found a smooth {rock} by the lake.
room|a space in a building with walls|My {room} has a big window.
same|exactly alike|We have the {same} shoes!
sang|made music with your voice (past)|We {sang} songs around the campfire.
saw|noticed with your eyes (past); or a tool for cutting wood|I {saw} a shooting star.
say|to speak words|What did you {say}?
school|a place where children go to learn|I walk to {school}.
sea|a large body of salty water|Ships sail on the {sea}.
seat|something to sit on|Please take a {seat}.
seem|to look like or appear to be|You {seem} tired.
seen|noticed with your eyes (after have)|I have {seen} that movie.
send|to make something go to someone|I'll {send} you a postcard.
set|to put in place; or a group of things that go together|Help me {set} the table.
seven|the number 7|There are {seven} days in a week.
sheep|a woolly farm animal|The {sheep} said "baa."
shoe|something you wear on your foot|I lost my left {shoe}.
show|to let someone see|{Show} me your drawing.
sick|not feeling well; ill|I stayed home because I was {sick}.
side|the left or right part of something|Stay on this {side} of the street.
sing|to make music with your voice|Let's {sing} a song.
sky|the space above the Earth where clouds are|The {sky} is full of stars.
small|little; not big|A mouse is {small}.
some|a few or a little|I want {some} grapes.
soon|in a short time|Dinner will be ready {soon}.
spell|to say or write the letters of a word in order|Can you {spell} "cat"?
start|to begin|The movie will {start} at seven.
stay|to remain in one place|Please {stay} here.
still|not moving; or even now|Are you {still} hungry?
store|a shop where you buy things|We bought bread at the {store}.
take|to get and carry away|{Take} an umbrella with you.
talk|to speak with someone|Let's {talk} about our day.
tall|high; far from bottom to top|Giraffes are very {tall}.
teach|to help someone learn|Can you {teach} me to knit?
tell|to say something to someone|{Tell} me a joke.
than|a word used to compare two things|An elephant is bigger {than} a horse.
thank|to say you are grateful|I want to {thank} you for the gift.
that|the thing over there|Can I have {that} red crayon?
them|a word for other people or things|I gave {them} my old toys.
then|after that; or at that time|First eat, {then} play.
three|the number 3|A triangle has {three} sides.
time|what clocks measure; hours and minutes|What {time} is it?
today|this day|{Today} is Monday.
told|said something to someone (past)|She {told} me a secret.
too|also; or more than enough|I want to come {too}!
took|got and carried away (past)|I {took} my lunch to school.
train|a long line of railway cars pulled by an engine|We rode the {train} to Montreal.
truck|a big vehicle for carrying heavy things|The garbage {truck} came early.
try|to make an effort|I will {try} my best.
use|to do something with a tool or thing|Can I {use} your glue stick?
very|extremely; a lot|The puppy is {very} cute.
walk|to move on your feet at a normal speed|Let's {walk} the dog.
warm|a little hot; not cold|My blanket is {warm}.
wash|to clean with water|{Wash} your hands before dinner.
way|a path or direction; or how to do something|This is the {way} to the park.
week|seven days in a row|We have gym twice a {week}.
well|in a good way; or a deep hole for water|She sings very {well}.
wet|covered with water; not dry|My socks are {wet}.
while|during the time that|I read {while} I waited.
white|the colour of snow|Snow is {white}.
who|which person|{Who} took my pencil?
why|for what reason|{Why} is the sky blue?
wind|moving air|The {wind} blew my hat away.
wish|to want something to happen|I {wish} I could fly.
with|together; alongside|I went to the park {with} my dad.
woke|stopped sleeping (past)|I {woke} up early.
wood|the hard material that trees are made of|The table is made of {wood}.
work|a job or something that takes effort|Mom goes to {work} by bus.
yellow|the colour of bananas and the sun|I have a {yellow} raincoat.
yet|until now|Are we there {yet}?
your|belonging to you|Is this {your} jacket?
zoo|a park where wild animals live for people to see|We saw zebras at the {zoo}.
fish|an animal with fins that lives in water|A {fish} swam past the boat.
ship|a large boat|The {ship} sailed across the ocean.
jump|to push off the ground into the air|Can you {jump} over the puddle?
hand|the part at the end of your arm with fingers|Raise your {hand} to answer.
black|the darkest colour, like the night sky|The cat has {black} fur.
make|to build or create|Let's {make} a fort.
said|spoke words (past)|She {said} hello.
have|to own or hold|I {have} two sisters.
went|moved to a place (past)|We {went} to the beach.
want|to wish for something|I {want} a puppy.
what|which thing|{What} is your name?
when|at what time|{When} does the party start?
they|a word for other people or things|My friends said {they} would come.
little|small|The {little} kitten mewed.
green|the colour of grass and leaves|Frogs are often {green}.
tree|a tall plant with a trunk, branches and leaves|We climbed the old {tree}.
milk|a white drink that comes from cows|I drink {milk} with my cookies.
help|to make something easier for someone|Can you {help} me carry this?
sleep|to rest with your eyes closed|I {sleep} for ten hours.
eat|to put food in your mouth and swallow|Let's {eat} lunch.
there|in or at that place|Put the box over {there}.
were|a past form of "be" for you, we and they|We {were} at the park.
after|later than|We had ice cream {after} dinner.
light|brightness that lets us see; or not heavy|Turn on the {light}.
night|the dark time between evening and morning|Owls hunt at {night}.
know|to have the facts in your mind|I {know} the answer.
boat|a small vehicle that floats on water|We rowed the {boat} across the lake.
rain|water that falls from clouds|The {rain} made big puddles.
snow|frozen white flakes that fall from clouds|We built a fort out of {snow}.
thing|an object; something|What is that {thing}?
think|to use your mind|I {think} it will be sunny.
bring|to carry something with you|{Bring} your swimsuit tomorrow.
kitchen|the room where food is cooked|Mom is baking in the {kitchen}.
happy|feeling glad or full of joy|The puppy looks {happy}.
funny|making you laugh|That was a {funny} joke.
clean|not dirty|My room is {clean} now.
shout|to call out loudly|Don't {shout} in the library.
brown|the colour of chocolate and tree trunks|The bear has {brown} fur.
could|was able to|I {could} hear music next door.
story|a telling of events, real or made up|Grandpa told us a {story}.
buy|to get something by paying money|I want to {buy} a new kite.
able|having the skill or power to do something|She is {able} to swim across the pool.
above|higher than; over|The plane flew {above} the clouds.
afraid|feeling scared|My sister is {afraid} of spiders.
afternoon|the time between noon and evening|We play outside in the {afternoon}.
age|how old someone or something is|What is your {age}?
air|the invisible gas all around us that we breathe|Open the window for fresh {air}.
airplane|a flying vehicle with wings and engines|The {airplane} took off into the clouds.
almost|nearly; not quite|I'm {almost} done my homework.
alone|by yourself; with nobody else|The cat likes to sleep {alone}.
along|moving beside something long|We walked {along} the river.
already|before now or before you expected|I {already} finished my snack.
also|too; as well|I like hockey, and I {also} like soccer.
always|every time; forever|I {always} brush my teeth before bed.
animal|a living creature that can move, like a dog or a fish|The koala is a cute {animal}.
another|one more; a different one|May I have {another} cookie?
anything|any thing at all|Do you need {anything} from the store?
around|in a circle; or on every side|We ran {around} the track.
art|drawing, painting and other creative work|We made clay pots in {art} class.
aunt|the sister of your mom or dad|My {aunt} lives in Vancouver.
balloon|a rubber bag filled with air or gas|The {balloon} floated up to the ceiling.
bark|the sound a dog makes; or the outside of a tree trunk|Our dog will {bark} at the door.
barn|a farm building for animals or hay|The horses sleep in the {barn}.
basket|a container woven from thin strips|We put the apples in a {basket}.
beach|sandy land beside the water|We built a sandcastle on the {beach}.
bear|a large furry wild animal|A {bear} looked for berries.
began|started (past)|The rain {began} at noon.
begin|to start|The show will {begin} soon.
behind|at the back of|The dog hid {behind} the couch.
below|lower than; under|The fish swam {below} the boat.
belt|a strap worn around your waist|He wore a brown {belt}.
better|more good|My drawing is {better} than yesterday's.
birthday|the day of the year someone was born|My {birthday} is in March.
body|all the parts of a person or animal|Exercise keeps your {body} strong.
bones|the hard parts inside your body that hold it up|Milk helps build strong {bones}.
born|came into life|My baby cousin was {born} today.
bought|got by paying money (past)|Dad {bought} a new lamp.
bread|a food made from flour and baked in an oven|I made toast with the {bread}.
bright|giving lots of light; shining|The sun is {bright} today.
broke|cracked into pieces (past)|I {broke} my crayon in half.
brought|carried with you (past)|She {brought} cookies to school.
cabin|a small wooden house|We stayed in a {cabin} in the woods.
cage|a box with bars that keeps an animal in|The hamster runs in its {cage}.
camp|to stay outdoors in a tent; or a place for that|We will {camp} by the lake.
can't|cannot; is not able to|I {can't} find my shoe.
care|to look after; or to feel something matters|Please take {care} of my plant.
cattle|cows and bulls on a farm|The {cattle} grazed in the field.
cave|a big hole in a hill or under the ground|The bear slept in a {cave}.
class|a group of students taught together|There are 25 kids in my {class}.
close|to shut; or near|Please {close} the window.
cloth|material made by weaving, used to make shirts and dresses|She wiped the table with a {cloth}.
coal|a black rock that is burned for heat|Old trains burned {coal}.
colour|what we see as red, blue, green and so on|My favourite {colour} is purple.
corner|the point where two sides or streets meet|The store is on the {corner}.
cotton|a soft cloth that comes from a plant|My T-shirt is made of {cotton}.
cover|to put something over something else|{Cover} the pot with a lid.
dark|without light|It gets {dark} early in winter.
didn't|did not|I {didn't} hear the bell.
dinner|the main meal of the evening|We eat {dinner} at six.
dishes|plates, bowls and cups|I helped wash the {dishes}.
does|carries out an action (he, she or it)|She {does} her homework after school.
done|finished|Are you {done} with the scissors?
don't|do not|I {don't} like spicy food.
dragon|a make-believe animal like a giant lizard that breathes fire|The {dragon} guarded the treasure.
draw|to make a picture with a pencil or pen|Can you {draw} a horse?
drink|to swallow a liquid|{Drink} water when you are thirsty.
earth|the planet we live on; or soil|The {Earth} goes around the sun.
east|the direction where the sun rises|The sun rises in the {east}.
eight|the number 8|An octopus has {eight} arms.
even|a number that can be split into two equal groups; or flat|Ten is an {even} number.
ever|at any time|Have you {ever} seen a whale?
every|each one in a group|I walk my dog {every} day.
everyone|every person|{Everyone} clapped at the end.
everything|all things|I packed {everything} for the trip.
eyes|the body parts you see with|Close your {eyes} and count to ten.
face|the front of your head|She has paint on her {face}.
feeling|sensing something with your body or heart|I'm {feeling} much better.
felt|sensed with your body or heart (past)|I {felt} proud of my work.
few|not many; a small number|Only a {few} leaves are left on the tree.
fight|to argue or struggle against someone|Don't {fight} over the toy.
fishing|trying to catch animals with fins from a river, lake or sea|Grandpa took me {fishing}.
flower|the colourful part of a plant|She picked a {flower} for her mom.
flying|moving through the air|Geese are {flying} south.
follow|to go after someone|{Follow} me to the playground.
forest|a large area covered with trees|Deer live in the {forest}.
forgot|did not remember (past)|I {forgot} my lunch at home.
form|a paper you fill in; or a shape|Please sign this {form}.
found|discovered something (past)|I {found} a dollar on the sidewalk.
fourth|number four in order|I came {fourth} in the race.
free|not costing money; or able to do what you want|The concert is {free}.
Friday|the day after Thursday|We have pizza day on {Friday}.
front|the part that faces forward|Sit at the {front} of the bus.
getting|receiving or becoming|It's {getting} cold outside.
given|handed to someone (after have)|I have {given} away my old toys.
grandmother|the mother of your mom or dad|My {grandmother} knits scarves.
great|very good; or very big|We had a {great} time.
grew|got bigger (past)|My sunflower {grew} taller than me.
ground|the surface of the Earth|The apple fell to the {ground}.
hair|the thin strands that grow on your head|She has long curly {hair}.
having|owning or holding; or experiencing|We are {having} fun.
head|the top part of your body|Put your hat on your {head}.
he's|he is; or he has|My brother says {he's} hungry.
heat|warmth|The {heat} from the stove warmed the room.
hello|a word you say to greet someone|Say {hello} to your teacher.
high|far above the ground|The kite flew {high} in the sky.
himself|that boy or man and nobody else|He tied his shoes by {himself}.
hundred|the number 100|There are one {hundred} cents in a dollar.
hurry|to move or act quickly|{Hurry}, the bus is coming!
hurt|in pain; or to cause pain|I {hurt} my knee.
I'd|I would; or I had|{I'd} like some water, please.
I'll|I will|{I'll} call you later.
I'm|I am|{I'm} nine years old.
inches|small units for measuring length; twelve make a foot|The puppy grew three {inches}.
isn't|is not|My dog {isn't} allowed on the couch.
it's|it is; or it has|{It's} a beautiful day.
I've|I have|{I've} never been to Paris.
kept|held on to (past)|She {kept} the secret.
kids|children|The {kids} played tag at recess.
kind|nice and caring; or a type|It's {kind} to share your toys.
kitten|a baby cat|The {kitten} played with yarn.
knife|a tool with a sharp edge for cutting|Use a {knife} to spread the butter.
lady|a polite word for a woman|The {lady} at the library helped me.
large|big|An elephant is a {large} animal.
largest|the biggest of all|The blue whale is the {largest} animal.
later|after now; at a future time|I'll clean my room {later}.
learn|to get new knowledge or skills|I want to {learn} how to skate.
leave|to go away from|We {leave} for school at eight.
let's|let us|{Let's} build a snowman!
letter|a written message you mail; or a symbol like A or B|I wrote a {letter} to my pen pal.
life|the time from being born until dying; being alive|A butterfly has a short {life}.
list|words or names written one under another|Mom made a grocery {list}.
living|alive; or making your home|Plants are {living} things.
lovely|beautiful or very nice|What a {lovely} garden!
loving|showing that you care a lot|My grandma is kind and {loving}.
lunch|the meal you eat in the middle of the day|I had a sandwich for {lunch}.
making|building or creating|We are {making} cookies.
maybe|perhaps; possibly|{Maybe} we'll go swimming tomorrow.
mean|unkind; not nice to others|It's {mean} to laugh at others.
merry|happy and cheerful|We wish you a {merry} Christmas.
might|could possibly|It {might} rain later.
mind|the part of you that thinks and feels|Keep your {mind} on your work.
month|one of the twelve parts of a year|My birthday is next {month}.
morning|the early part of the day|I eat cereal every {morning}.
mouth|the part of your face you eat and talk with|Open your {mouth} wide.
music|sounds arranged to make songs|I listen to {music} while I draw.
near|close by; not far|The school is {near} my house.
nearly|almost|I {nearly} missed the bus.
never|not at any time|I have {never} seen snow in July.
news|information about things that just happened|Did you hear the {news}?
noise|a sound, often loud|What was that {noise}?
nothing|not anything|There is {nothing} in the box.
number|a word or symbol for how many, like 7|Pick a {number} from one to ten.
o'clock|used to say an exact hour|School starts at nine {o'clock}.
often|many times|I {often} read before bed.
oil|a thick, greasy liquid used in cooking or engines|Dad cooked the eggs in {oil}.
once|one time|I have been to the CN Tower {once}.
orange|a round citrus fruit; or the colour of it|I peeled an {orange}.
order|the way things are arranged; or to ask for something|Put the cards in {order}.
own|belonging to yourself|I have my {own} room.
pair|two things that go together|I need a new {pair} of socks.
paper|thin material you write or draw on|Write your name on the {paper}.
party|a gathering of people to celebrate|I'm having a birthday {party}.
pass|to go by; or to hand something to someone|Please {pass} the salt.
past|the time before now; or going by|We walked {past} the bakery.
penny|an old Canadian coin worth one cent|I found a {penny} under the couch.
person|a human being|She is a kind {person}.
picture|a drawing, painting or photo|I drew a {picture} of my dog.
place|a spot or location|This is a great {place} for a picnic.
plan|an idea of what you will do|We made a {plan} for the weekend.
plane|an airplane|The {plane} landed in Vancouver.
please|a polite word when you ask for something|{Please} pass the ketchup.
point|the sharp end of something; or to show with your finger|{Point} to the map.
poor|having very little money; or needing pity|The {poor} kitten was soaking wet.
race|a contest to see who is fastest|We ran a {race} at recess.
reach|to stretch out your arm to touch something|I can't {reach} the top shelf.
reading|looking at and understanding words|She is {reading} a mystery book.
ready|prepared|Are you {ready} to go?
real|true; not pretend|Is that a {real} diamond?
rich|having a lot of money|The {rich} king lived in a castle.
river|a large stream of water that flows to a lake or sea|We fished in the {river}.
rocket|a vehicle that blasts into space|The {rocket} zoomed into the sky.
rode|sat on and moved with a bike or horse (past)|I {rode} my bike to the park.
rule|something you must follow|No running is a pool {rule}.
running|moving fast on your feet|The dog is {running} in the yard.
salt|white grains that add flavour to food; sea water is full of it|Add a pinch of {salt}.
says|speaks words (he, she or it)|The sign {says} "Stop."
sending|making something go to someone|I'm {sending} a card to Grandma.
sent|made something go to someone (past)|I {sent} a letter yesterday.
seventh|number seven in order|Saturday is the {seventh} day of the week.
sew|to join cloth with a needle and thread|Grandma will {sew} my button back on.
shall|will (used in polite questions)|{Shall} we dance?
short|not long or not tall|My little brother is {short}.
shot|a kick or throw at a goal; or fired (past)|He took a {shot} at the net.
should|ought to; the right thing to do|You {should} wear a helmet.
sight|the ability to see; or something you see|The rainbow was a beautiful {sight}.
sister|a girl who has the same parents as you|My {sister} loves to dance.
sitting|resting on a seat|The cat is {sitting} on my book.
sixth|number six in order|My brother is in {sixth} grade.
sled|a vehicle that slides on snow|We rode the {sled} down the hill.
smoke|the grey cloud that comes from fire|{Smoke} rose from the chimney.
soap|something you use with water to clean|Wash your hands with {soap}.
someone|some person|{Someone} left the door open.
something|a thing that is not named|I have {something} to tell you.
sometime|at a time that is not decided|Let's play {sometime} next week.
song|music with words that you sing|What's your favourite {song}?
sorry|feeling sad about something you did|I'm {sorry} I broke your pencil.
sound|something you hear|I heard a strange {sound}.
south|the direction toward the bottom of a map|Birds fly {south} for winter.
space|the area beyond Earth's air; or an empty area|Astronauts travel into {space}.
spelling|putting letters in the right order to make words|We have a {spelling} test today.
spent|used money or time (past)|I {spent} my allowance on a book.
sport|a game played for exercise, like hockey|Swimming is my favourite {sport}.
spring|the season after winter|Flowers bloom in the {spring}.
stairs|steps that go up or down|Walk carefully down the {stairs}.
stand|to be on your feet|{Stand} in a straight line.
state|one part of a country such as the U.S., with its own government|Texas is a big {state}.
step|moving one foot in front of the other|Watch your {step} on the ice.
stick|a thin piece of wood; or to attach|The dog fetched a {stick}.
stood|was on your feet (past)|We {stood} in line for an hour.
stopped|ended moving or doing something (past)|The rain {stopped} at lunch.
stove|a machine in the kitchen for cooking|Don't touch the hot {stove}.
street|a road in a town or city|We live on a quiet {street}.
strong|having lots of power|Ants are very {strong}.
study|to spend time learning something|I need to {study} for my test.
such|so much; to a great degree|It was {such} a fun day!
sugar|a sweet powder used in baking|Add a spoonful of {sugar}.
summer|the warmest season of the year|We swim a lot in {summer}.
Sunday|the day after Saturday|We visit Grandma on {Sunday}.
supper|an evening meal|We had soup for {supper}.
table|furniture with a flat top and legs|Set the plates on the {table}.
taken|got and carried away (after have)|Someone has {taken} my seat.
taking|getting and carrying|I'm {taking} my dog for a walk.
talking|speaking|Please stop {talking} during the movie.
teacher|a person who helps students learn|My {teacher} reads to us after lunch.
team|a group that works or plays together|Our {team} won the game.
tenth|number ten in order|October is the {tenth} month.
that's|that is|{That's} my backpack.
these|the things close to you|{These} cookies are delicious.
thinking|using your mind|What are you {thinking} about?
third|number three in order|I came in {third} place.
those|the things over there|Look at {those} clouds.
throw|to send something through the air with your hand|{Throw} the ball to me.
tonight|this evening or night|We'll watch a movie {tonight}.
trade|to give something and get something back|Want to {trade} stickers?
trick|a clever act; or something done to fool someone|My dog can do a {trick}.
trip|a journey to a place|We went on a {trip} to the mountains.
trying|making an effort|I'm {trying} to tie my shoes.
turn|to move around; or a chance to play|It's your {turn} to roll the dice.
twelve|the number 12|There are {twelve} months in a year.
twenty|the number 20|Ten plus ten is {twenty}.
uncle|the brother of your mom or dad|My {uncle} plays the guitar.
under|below something|The cat hid {under} the bed.
upon|on|Once {upon} a time, there was a dragon.
wagon|a cart with four wheels that you pull|I pulled my brother in the {wagon}.
wait|to stay until something happens|{Wait} for the green light.
walking|moving on your feet at a normal speed|We are {walking} to the library.
wasn't|was not|I {wasn't} at school yesterday.
water|the clear liquid in rivers, rain and taps|Plants need {water} to grow.
we're|we are|{We're} going to the movies.
west|the direction where the sun sets|The sun sets in the {west}.
wheat|a grain used to make flour and bread|The farmer harvested the {wheat}.
where|in what place|{Where} is my other shoe?
which|what one of a group|{Which} colour do you like best?
wife|a woman who is married|The farmer and his {wife} grew corn.
wild|living in nature, not tame|Wolves are {wild} animals.
win|to come first in a game or race|I hope we {win} the game.
window|an opening in a wall with glass|Look out the {window}.
winter|the coldest season of the year|It snows a lot in {winter}.
without|not having|I can't sleep {without} my teddy bear.
woman|a grown-up female person|A {woman} helped me find my mom.
won|came first in a game or race (past)|Our team {won} the game.
won't|will not|I {won't} forget your birthday.
wool|soft thick hair from sheep, made into yarn|My mittens are made of {wool}.
word|a group of letters that means something|Can you spell this {word}?
working|doing a job or task|Mom is {working} today.
wrong|not right; not correct|I got one answer {wrong}.
yard|the land around a house|We played in the back {yard}.
year|twelve months; 365 days|My brother is one {year} old.
yesterday|the day before today|{Yesterday} I went to the dentist.
you're|you are|{You're} my best friend.
because|for the reason that|I wore a coat {because} it was cold.
friend|someone you like and enjoy spending time with|My {friend} lives next door.
people|men, women and children|Many {people} came to the parade.
again|one more time|Can you read it {again}?
right|correct; or the side opposite of left|You got the answer {right}!
write|to put letters or words on paper|{Write} your name at the top.
knew|had the facts in your mind (past)|I {knew} the answer.
teeth|the hard white parts in your mouth for biting|Brush your {teeth} twice a day.
mouse|a small animal with a long tail; or a computer tool|A {mouse} ran under the fridge.
children|more than one child|The {children} played in the park.
catch|to grab something that is moving|{Catch} the ball!
watch|to look at for a while; or a small clock on your wrist|Let's {watch} a movie.
dream|pictures and stories in your mind while you sleep|I had a {dream} about flying.
paint|a coloured liquid you brush onto things|We used blue {paint} for the sky.
round|shaped like a circle or ball|A pizza is {round}.
would|a word used for wishes, polite requests or what might happen|{Would} you like some tea?
family|parents, children and relatives|There are five people in my {family}.
carry|to hold and take somewhere|Can you {carry} this bag?
world|the Earth and all the people on it|The Pacific is the biggest ocean in the {world}.
question|something you ask to get an answer|May I ask a {question}?
thought|used your mind (past); or an idea|I {thought} about you today.
early|before the usual time|We woke up {early}.
busy|having lots to do|Mom is {busy} at work.
half|one of two equal parts|I ate {half} of the sandwich.
sign|a board with words or pictures; or to write your name|The {sign} says "Stop."
listen|to pay attention to sounds|{Listen} to the birds singing.
island|land with water all around it|We took a ferry to the {island}.
heard|noticed a sound (past)|I {heard} a funny noise.
their|belonging to them|The kids put on {their} coats.
weight|how heavy something is|The doctor checked my {weight}.
climb|to go up using your hands and feet|Let's {climb} the tree.
money|coins and bills used to buy things|I saved my {money} in a piggy bank.
become|to start to be|A tadpole will {become} a frog.
machine|a tool with moving parts that does work|The washing {machine} is loud.
hour|sixty minutes|The movie is one {hour} long.
guess|to give an answer when you are not sure|{Guess} what's in the box!
believe|to think something is true|I {believe} you.
desert|a dry, sandy place with little rain|Camels live in the {desert}.
weather|what it is like outside: sunny, rainy, windy and so on|The {weather} is warm today.
across|from one side to the other|We swam {across} the lake.
against|on the opposite side in a game; or leaning on|Our team played {against} the Tigers.
awhile|for a short time|Let's rest {awhile}.
between|in the space in the middle of two things|Sit {between} Sam and Mia.
board|a flat piece of wood; or the surface a teacher writes on|The teacher wrote on the {board}.
bottom|the lowest part|The treasure sank to the {bottom} of the sea.
breakfast|the first meal of the day|I eat cereal for {breakfast}.
broken|in pieces or not working|My toy car is {broken}.
build|to make something by putting parts together|Let's {build} a snowman.
building|a structure with walls and a roof, like a house or school|The CN Tower is a tall {building}.
captain|the leader of a team or a ship|The {captain} steered the ship.
carried|held and took somewhere (past)|He {carried} the groceries inside.
charge|to fill with electric power; or the cost|Please {charge} the tablet.
chicken|a farm bird that lays eggs|The {chicken} pecked at the corn.
circus|a travelling show with clowns, acrobats and animals|We saw jugglers at the {circus}.
cities|more than one large town|Toronto and Montreal are big {cities}.
clothes|things you wear, like shirts and pants|Put your dirty {clothes} in the hamper.
company|a business; or people who are with you|My dad works for a big {company}.
couldn't|could not|I {couldn't} sleep because of the thunder.
discover|to find something for the first time|Scientists {discover} new animals every year.
doctor|a person who helps sick people get better|The {doctor} listened to my heart.
doesn't|does not|My cat {doesn't} like baths.
dollar|money worth one hundred cents|This pencil costs one {dollar}.
during|all through a period of time|Be quiet {during} the movie.
eighth|number eight in order|August is the {eighth} month.
else|other; different|Do you want anything {else}?
enjoy|to like doing something|I {enjoy} playing the piano.
everybody|every person|{Everybody} in my family likes pizza.
example|something that shows what others are like|Can you give me an {example}?
excuse|to forgive; or a reason you give|{Excuse} me, may I get past?
field|an open area of land, often with grass|The cows are in the {field}.
fifth|number five in order|I am in {fifth} grade.
finish|to come to the end of something|Did you {finish} your homework?
following|coming after; or going behind|The ducklings are {following} their mom.
group|several people or things together|We worked in a small {group}.
happened|took place (past)|What {happened} at school today?
harden|to become hard|The clay will {harden} when it dries.
haven't|have not|I {haven't} finished my book yet.
heavy|weighing a lot; hard to lift|This backpack is {heavy}.
held|kept in your hands (past)|She {held} the kitten gently.
hospital|a building where sick or hurt people are cared for|My aunt works at the {hospital}.
idea|a thought or plan|That's a great {idea}!
instead|in place of something else|Let's play inside {instead}.
known|having facts in your mind (after have)|I have {known} her since kindergarten.
middle|the centre; halfway between|Sit in the {middle} of the rug.
mountain|a very high hill|We hiked up the {mountain}.
ninth|number nine in order|September is the {ninth} month.
office|a room or building where people work at desks|Mom works in an {office}.
parent|a mother or a father|Each {parent} signed the form.
peanut|a small nut that grows underground|I love {peanut} butter.
pencil|a tool for writing, made of wood and graphite|Can I borrow a {pencil}?
picnic|a meal eaten outdoors|We had a {picnic} in the park.
police|people whose job is to keep everyone safe and follow the law|The {police} officer helped the lost child.
prize|something you win|She won first {prize}.
quite|very; or completely|The movie was {quite} long.
radio|a machine that plays music and talk you can hear|We listened to the {radio} in the car.
raise|to lift up|{Raise} your hand to answer.
really|truly; very|That ride was {really} fast!
reason|why something happens|What is the {reason} you are late?
return|to come back; or to give back|{Return} your library books by Friday.
Saturday|the day after Friday|We go swimming on {Saturday}.
scare|to make someone afraid|Don't {scare} the birds away.
since|from that time until now; or because|I've lived here {since} I was a baby.
slowly|not quickly|The turtle crawled {slowly}.
stories|more than one telling of events|Grandpa tells the best {stories}.
student|a person who is learning at a school|Every {student} needs a pencil.
sudden|happening quickly with no warning|There was a {sudden} crash of thunder.
suit|a matching jacket and pants|Dad wore a {suit} to the wedding.
swimming|moving through water using your arms and legs|We go {swimming} every Saturday.
threw|sent through the air with your hand (past)|He {threw} the ball to his friend.
tired|needing rest or sleep|I'm {tired} after the long hike.
together|with each other|Let's work {together}.
toward|in the direction of|The puppy ran {toward} me.
tried|made an effort (past)|I {tried} my best.
truly|really; honestly|I am {truly} sorry.
turtle|a reptile with a hard shell on its back|The {turtle} hid in its shell.
wear|to have clothes on your body|I {wear} a hat in winter.
we'll|we will|{We'll} see you tomorrow.
whole|all of something; complete|I ate the {whole} pizza!
whose|belonging to which person|{Whose} jacket is this?
women|more than one grown-up female person|Three {women} waited at the bus stop.
wouldn't|would not|My dog {wouldn't} stop barking.
writing|putting words on paper|She is {writing} a story.
written|put into words on paper (after have)|I have {written} three pages.
wrote|put words on paper (past)|I {wrote} a poem for my mom.
yell|to shout loudly|Please don't {yell} in the house.
young|not old; in the early part of life|My cousin is too {young} for school.
whistle|a high sound made by blowing; or a small tool that makes it|The coach blew her {whistle}.
castle|a large stone building with towers, where kings and queens lived|The princess lived in a {castle}.
knock|to hit a door to ask to come in|Please {knock} before you come in.
wrist|the joint between your hand and your arm|She wears a watch on her {wrist}.
thumb|the short thick finger on the side of your hand|He gave me a {thumb} up.
honest|always telling the truth|Always be {honest}.
autumn|the season after summer; fall|Leaves turn orange in {autumn}.
nature|plants, animals and the outdoors not made by people|We went on a {nature} walk.
creature|any living animal|A bat is a night {creature}.
adventure|an exciting and unusual experience|Camping was a big {adventure}.
treasure|gold, jewels or other valuable things|The pirates buried their {treasure}.
measure|to find out the size or amount of something|Use a ruler to {measure} the line.
station|a place where trains or buses stop|We waited at the train {station}.
vacation|time off from school or work to rest or travel|We went to the beach on {vacation}.
action|something that is done; exciting events|The movie was full of {action}.
invite|to ask someone to come to an event|I want to {invite} my class to my party.
invitation|a card or message asking someone to come|I got an {invitation} to her party.
mistake|something done wrong|Everyone makes a {mistake} sometimes.
unlock|to open something with a key or code|Use the key to {unlock} the door.
replay|to play again|Can we {replay} that video?
quiet|making little or no noise|Please be {quiet} in the library.
quickly|fast; at high speed|The rabbit ran away {quickly}.
energy|the power to do work or move|Plants get {energy} from the sun.
gentle|soft and careful; not rough|Be {gentle} with the baby bunny.
giant|a huge person in stories; or very big|The {giant} lived in a castle in the clouds.
huge|very, very big|An elephant is {huge}.
recess|a break from class to play outside|We play tag at {recess}.
cereal|a breakfast food made from grains, eaten with milk|I eat {cereal} every morning.
brake|the part that slows down or stops a bike or car|Press the {brake} to stop.
break|to crack or smash into pieces; or a short rest|Don't {break} the window.
flour|a powder made from grain, used for baking|We need {flour} to bake bread.
knight|a soldier in armour long ago who served a king|The {knight} rode a white horse.
tail|the part at the back end of an animal|The dog wagged its {tail}.
tale|a story|Grandpa told a scary {tale}.
meet|to see and get to know someone|Nice to {meet} you!
peace|a time with no fighting; calm|The world needs {peace}.
plain|simple, with nothing extra|I like {plain} pizza with just cheese.
scene|a part of a play or movie; or a view|The last {scene} was sad.
cent|a small coin unit; one hundred make a dollar|This candy costs one {cent}.
weak|not strong|I felt {weak} after being sick.
heal|to get better after being hurt|The cut will {heal} soon.
heel|the back part of your foot|I got a blister on my {heel}.
pretty|nice to look at|What a {pretty} flower!
answer|what you say or write back to a question|What is the {answer} to number 5?
enough|as much as you need|Do we have {enough} chairs?
built|made by putting parts together (past)|Beavers {built} a dam.
sure|certain; with no doubt|Are you {sure} you locked the door?
second|number two in order; or a very short time|She came in {second} place.
caught|grabbed something that was moving (past)|The cat {caught} a mouse.
laugh|to make the sounds that show something is funny|That joke made me {laugh}.
country|a nation with its own land and government|Canada is a big {country}.
though|even if; however|{Though} it was raining, we played outside.
minute|sixty seconds|Wait a {minute}, please.
until|up to the time that|We played {until} it got dark.
visit|to go and see someone or a place|We'll {visit} Grandma next week.
ocean|a huge body of salt water|Whales live in the {ocean}.
necessary|needed; must be done|Is it {necessary} to bring a lunch?
separate|to divide or keep apart|{Separate} the red blocks from the blue ones.
tomorrow|the day after today|{Tomorrow} we'll go to the museum.
calendar|a chart showing the days, weeks and months of a year|I marked my birthday on the {calendar}.
February|the second month of the year|Valentine's Day is in {February}.
Wednesday|the day after Tuesday|Art class is on {Wednesday}.
library|a place where you can borrow books|I borrowed three books from the {library}.
government|the group of people who run a country, province or city|The {government} builds roads and schools.
knowledge|what you know and understand|Reading books builds your {knowledge}.
guard|to watch over and protect|The dog will {guard} the house.
scissors|a cutting tool with two blades|Can I borrow your {scissors}?
exercise|moving your body to stay healthy|Running is good {exercise}.
straight|not bent or curved|Draw a {straight} line.
weird|strange; unusual|That was a {weird} dream.
height|how tall something is|What is the {height} of that tree?
foreign|from another country|She speaks two {foreign} languages.
muscle|the body part that tightens to help you move|Your heart is a {muscle}.
rhythm|a regular pattern of beats in music|We clapped to the {rhythm} of the drum.
citizen|a person who belongs to a country|She became a Canadian {citizen}.
disappear|to go out of sight|The magician made the coin {disappear}.
unhappy|sad; not glad|He felt {unhappy} when his team lost.
careful|paying close attention to avoid mistakes or danger|Be {careful} with the glass vase.
carefully|in a way that avoids mistakes or danger|Hold the baby bird {carefully}.
beginning|the start|The {beginning} of the book was exciting.
trouble|problems or difficulty|We got into {trouble} for being loud.
character|a person or animal in a story|The main {character} is a brave girl.
perhaps|maybe|{Perhaps} we can go swimming later.
remember|to keep in your mind; not forget|Do you {remember} my name?
explain|to make something clear and easy to understand|Can you {explain} how you got the answer?
thorough|careful and complete, missing nothing|She did a {thorough} job cleaning.
accident|something bad that happens by surprise|He broke the vase by {accident}.
disappoint|to make someone sad because something wasn't as good as hoped|I don't want to {disappoint} my coach.
temperature|how hot or cold something is|The {temperature} dropped below zero.
pleasant|nice and enjoyable|We had a {pleasant} afternoon.
echo|a sound that bounces back so you hear it again|We heard an {echo} in the cave.
potato|a vegetable that grows underground, used for fries|I ate a baked {potato}.
surface|the top or outside layer|The leaf floated on the {surface} of the water.
except|not including|Everyone came {except} Tom.
village|a small town in the country|They live in a small fishing {village}.
America|the two big continents where Canada, the U.S., Mexico and Brazil are|Canada is in North {America}.
among|in the middle of a group|The cat hid {among} the flowers.
arrive|to reach a place|The train will {arrive} at noon.
attention|watching and listening carefully|Please pay {attention} to the teacher.
countries|more than one nation|Canada and Mexico are {countries}.
course|a path or route; or a class you take|The race {course} was long.
cousin|the child of your aunt or uncle|My {cousin} lives in Calgary.
decide|to make up your mind|I can't {decide} which flavour to pick.
evening|the time between afternoon and night|We take a walk every {evening}.
future|the time that will come later|In the {future}, I want to be a pilot.
happiest|the most joyful|That was the {happiest} day of my life!
happiness|a feeling of joy|Her smile was full of {happiness}.
interest|wanting to know or learn more about something|I have a big {interest} in space.
planet|a huge round body that travels around a star|Mars is the red {planet}.
present|a gift; or the time right now|I got a {present} for my birthday.
president|the leader of a country, club or company|The class voted for a new {president}.
problem|something difficult that needs to be solved|Can you solve this math {problem}?
sentence|a group of words that tells a complete thought|Start each {sentence} with a capital letter.
several|more than two but not many|I read {several} books this summer.
special|different from others in a good way|Today is a {special} day.
suddenly|quickly and without warning|{Suddenly}, the lights went out!
suppose|to think something is probably true|I {suppose} you're right.
surely|certainly; without a doubt|You will {surely} win!
they're|they are|{They're} going to the beach.
usually|most of the time|I {usually} walk to school.
information|facts about something|The website has {information} about sharks.
education|learning and teaching, especially at school|A good {education} is important.
population|the number of people living in a place|The {population} of Toronto is large.
celebration|a party or special event for something happy|We had a big {celebration} for Canada Day.
decision|a choice you make|It was a hard {decision}.
television|a screen that shows shows and movies; a TV|We watched the game on {television}.
division|splitting a number into equal groups|We are learning long {division}.
confusion|not understanding what is going on|There was some {confusion} about the time.
famous|known by many people|She wants to be a {famous} singer.
nervous|worried and a little scared|I feel {nervous} before a test.
dangerous|likely to cause harm|Playing with fire is {dangerous}.
enormous|extremely large|The blue whale is {enormous}.
curious|wanting to know or learn about something|Cats are {curious} animals.
various|of different kinds|The store sells {various} fruits.
possible|able to happen or be done|Is it {possible} to fly to the moon?
terrible|very bad|We had {terrible} weather on our trip.
comfortable|feeling relaxed, with no pain|This chair is very {comfortable}.
valuable|worth a lot of money; or very useful|The ring is {valuable}.
visible|able to be seen|The stars are {visible} tonight.
incredible|amazing; hard to believe|The view from the top was {incredible}.
unusual|not common; different from normal|It is {unusual} to see snow in May.
impossible|not able to happen or be done|It's {impossible} to lick your elbow.
disagree|to have a different opinion|I {disagree} with you.
misunderstand|to get the wrong idea about something|Please don't {misunderstand} me.
preview|a short look at something before it comes out|We watched a {preview} of the movie.
reappear|to show up again|The sun will {reappear} after the storm.
independent|able to do things on your own|My sister is very {independent}.
difference|the way two things are not the same|Can you spot the {difference}?
science|the study of the natural world through experiments|{Science} is my favourite subject.
scientist|a person who studies the natural world|The {scientist} looked through a microscope.
language|the words people use to speak and write|French is a beautiful {language}.
vegetable|a plant or part of a plant you eat, like a carrot|Broccoli is a green {vegetable}.
chocolate|a sweet brown food made from cocoa beans|I love hot {chocolate}.
calm|quiet and relaxed|Take a deep breath and stay {calm}.
wrestle|to fight by holding and pushing, as a sport or for fun|The puppies love to {wrestle}.
doubt|to not be sure about something|I {doubt} it will snow in June.
column|a line of things going up and down; or a tall pillar|Add the numbers in each {column}.
autograph|a famous person's signature|The player signed his {autograph}.
photograph|a picture taken with a camera|We took a {photograph} of the sunset.
alphabet|all the letters of a language in order|There are 26 letters in the {alphabet}.
ceiling|the top inside surface of a room|There's a spider on the {ceiling}!
receipt|a paper that shows what you paid for|Keep the {receipt} in case you return it.
friendship|the bond between people who like each other|Our {friendship} means a lot to me.
careless|not paying attention, so mistakes happen|It was {careless} to leave the door open.
hopeful|feeling that something good will happen|We are {hopeful} it won't rain.
kindness|being nice and caring to others|Thank you for your {kindness}.
darkness|a place or time with no light|Owls hunt in the {darkness}.
thermometer|a tool that measures temperature|The {thermometer} says it's cold.
equal|the same in amount or size|Two plus two is {equal} to four.
fraction|a part of a whole, like one half|One half is a {fraction}.
multiply|to add a number to itself many times, like 3 × 4|Can you {multiply} six by seven?
estimate|to make a careful guess about an amount|{Estimate} how many beans are in the jar.
continent|one of the seven huge areas of land on Earth|Africa is a huge {continent}.
province|one of the main parts that Canada is divided into|Ontario is a {province}.
capital|the city where a government meets; or a big letter|Ottawa is the {capital} of Canada.
culture|the ways of life, food, art and beliefs of a group of people|We learned about Japanese {culture}.
museum|a building where interesting old or special things are shown|We saw dinosaur bones at the {museum}.
symbol|a picture or sign that stands for something|The maple leaf is a {symbol} of Canada.
orchestra|a large group of musicians playing together|The {orchestra} played a beautiful song.
rhyme|to end with the same sound|"Cat" and "hat" {rhyme}.
poem|writing with rhythm, often with lines that end in the same sound|I wrote a {poem} about the ocean.
paragraph|a group of sentences about one idea|Write one {paragraph} about your weekend.
dictionary|a book that lists words and what they mean|Look up the word in the {dictionary}.
vocabulary|all the words a person knows|Reading builds your {vocabulary}.
exactly|with no mistakes; completely|That's {exactly} what I wanted!
actually|really; in fact|I {actually} like broccoli.
certain|sure; with no doubt|Are you {certain} the store is open?
discussion|a talk where people share ideas|We had a class {discussion} about recycling.
permission|being allowed to do something|You need {permission} to leave the room.
success|getting the result you wanted|The bake sale was a big {success}.
audience|the people who watch or listen to a show|The {audience} clapped loudly.
announce|to tell something to many people|The principal will {announce} the winners.
complete|to finish; or having all its parts|Please {complete} the worksheet.
describe|to tell what something is like|Can you {describe} your pet?
explore|to travel around a place to find out about it|Let's {explore} the forest trail.
imagine|to make a picture in your mind|{Imagine} you could fly!
imagination|the ability to make up pictures and ideas in your mind|She has a wonderful {imagination}.
different|not the same|My shoes are {different} from yours.
favourite|liked the most|Pizza is my {favourite} food.
beautiful|very pretty|The sunset was {beautiful}.
probably|most likely|It will {probably} rain tomorrow.
important|mattering a lot|It's {important} to drink water.
through|in one side and out the other|The dog ran {through} the tunnel.
surprise|something you did not expect|We planned a {surprise} party.
finally|at last, after waiting|The bus {finally} came.
piece|a part of something|Can I have a {piece} of cake?
receive|to get something that is given or sent|Did you {receive} my letter?
although|even though|{Although} he was tired, he finished his work.
achieve|to reach a goal by working hard|She worked hard to {achieve} her goal.
environment|the air, water, land and living things around us|We should protect the {environment}.
especially|more than usual; most of all|I love fruit, {especially} mangoes.
immediately|right now, without waiting|Come here {immediately}!
opportunity|a good chance to do something|This trip is a great {opportunity} to learn.
recommend|to say something is good and worth trying|Can you {recommend} a good book?
definitely|for sure; with no doubt|I will {definitely} come to your party.
occasion|a special event or time|A wedding is a happy {occasion}.
occurred|happened (past)|The accident {occurred} last Tuesday.
embarrass|to make someone feel shy or silly in front of others|Please don't {embarrass} me in front of my friends.
conscience|the feeling inside that tells you right from wrong|His {conscience} told him to tell the truth.
conscious|awake and aware|The patient is {conscious} now.
dessert|a sweet food eaten after a meal|We had apple pie for {dessert}.
principal|the head of a school|The {principal} visited our class.
affect|to change or have an influence on something|Lack of sleep can {affect} your mood.
effect|a result or change caused by something|The medicine had a quick {effect}.
whether|if (used when there are choices)|I don't know {whether} to laugh or cry.
accept|to take something that is offered; or to agree|Please {accept} this gift.
advice|a helpful idea about what someone should do|My dad gave me good {advice}.
vacuum|a machine that sucks up dirt|Please {vacuum} the living room.
restaurant|a place where you buy and eat meals|We ate at a Chinese {restaurant}.
silhouette|a dark shape seen against a light background|We saw the {silhouette} of a cat in the window.
ancient|very, very old; from long ago|The pyramids are {ancient}.
delicious|tasting very good|This soup is {delicious}.
mysterious|strange and hard to explain|The old house looked {mysterious}.
courage|being brave when something is scary|It takes {courage} to stand up to a bully.
courageous|brave|The {courageous} firefighter saved the puppy.
guarantee|to promise that something will happen|I can't {guarantee} it won't rain.
responsible|in charge of something and trusted to do it|Who is {responsible} for feeding the fish?
experience|something that happens to you; or skill from doing something|Camping was a fun {experience}.
jealous|upset because someone has something you want|He was {jealous} of his brother's new bike.
sincerely|truly and honestly|I {sincerely} hope you feel better.
tongue|the soft part in your mouth that helps you taste and talk|The giraffe has a long purple {tongue}.
neighbour|a person who lives next door or nearby|Our {neighbour} has a friendly dog.
lightning|a flash of light in the sky during a storm|We saw {lightning} flash across the sky.
schedule|a plan of what will happen and when|Our {schedule} today is busy.
awkward|clumsy; or uncomfortable and embarrassing|I felt {awkward} at the new school.
bicycle|a bike; a two-wheeled vehicle you pedal|I rode my {bicycle} to the park.
biscuit|a small baked bread or cookie|Grandma baked a warm {biscuit}.
breathe|to take air in and let it out|{Breathe} in slowly through your nose.
breath|the air you take in and let out|Take a deep {breath}.
bruise|a dark mark on your skin from a bump|I got a {bruise} on my leg.
business|a company; or the work of buying and selling|My aunt owns a bakery {business}.
cafeteria|a room where you pick up food and eat, like at school|We eat lunch in the {cafeteria}.
category|a group of things that are alike|Which {category} does a whale belong to?
chorus|the part of a song that repeats; or a group of singers|Everyone sang the {chorus}.
committee|a small group chosen to plan or decide something|The party {committee} chose the decorations.
condition|the state something is in|The old bike is in good {condition}.
curiosity|wanting to know or learn about things|{Curiosity} made the cat open the box.
delightful|very pleasant and enjoyable|We had a {delightful} picnic.
disguise|clothes or makeup that hide who you are|He wore a funny {disguise}.
eagle|a large bird with sharp eyes and a hooked beak|An {eagle} soared above the cliffs.
emergency|a dangerous situation that needs help right away|Call 911 in an {emergency}.
exhausted|extremely tired|After the race, she was {exhausted}.
fascinate|to make someone very interested|Volcanoes {fascinate} me.
fierce|wild and scary; very strong|The lion gave a {fierce} roar.
glimpse|a very quick look|I caught a {glimpse} of the deer.
grammar|the rules for putting words together in a language|Good {grammar} makes writing clear.
hamburger|a sandwich with a cooked meat patty in a bun|I ordered a {hamburger} with cheese.
hygiene|keeping yourself clean to stay healthy|Brushing your teeth is good {hygiene}.
icicle|a hanging spike of ice|A long {icicle} hung from the roof.
jewellery|rings, necklaces and bracelets worn for decoration|Mom keeps her {jewellery} in a box.
journey|a long trip from one place to another|The {journey} took six hours.
kilometre|a distance of 1,000 metres|We walked one {kilometre} to school.
laboratory|a room where scientists do experiments|The scientist works in a {laboratory}.
marvellous|wonderful; amazing|We had a {marvellous} time at the fair.
microscope|a tool that makes tiny things look much bigger|We looked at a leaf under the {microscope}.
nuisance|something or someone that is annoying|The buzzing fly was a {nuisance}.
pyramid|a shape with a square base and triangle sides that meet at a point|The ancient {pyramid} was built from stone.
quarrel|an angry argument|The twins had a {quarrel} over the last cookie.
recognize|to know someone or something because you've seen it before|I didn't {recognize} you with your new haircut!
skeleton|all the bones of a body joined together|The museum has a dinosaur {skeleton}.
squirrel|a small animal with a bushy tail that climbs trees|A {squirrel} buried an acorn.
thousand|the number 1,000|There were a {thousand} people at the concert.
volcano|a mountain that can erupt with hot lava|The {volcano} erupted.`;
const BASEPAL = {o:'#2a1d33', e:'#1a1222', w:'#ffffff', p:'#ff8fab', n:'#3a2a2a', r:'#e84855', y:'#f5ecd0', g:'#6cc070',
  c:'#4cc9f0', m:'#f72585', k:'#ffcc33', j:'#ff9f1c', s:'#dfe7ff', u:'#7b4fd6', v:'#4a2e8a', x:'#1d1724', z:'#e5383b', t:'#2ec4b6', i:'#57cc99', f:'#ff7eb6'};

const PETS = {
 dragon:{name:'Dragon', pal:{b:'#e84855',d:'#9e2a3a',l:'#ffc857'}, a:{hx:8,hy:3,eL:4,eR:10,ey:5,nx:8,ny:9}, rows:[
 "..y..........y..",
 "..yo........oy..",
 "...yooooooooy...",
 "..obbbbbbbbbbo..",
 ".obbbbbbbbbbbbo.",
 ".obbewbbbbewbbo.",
 ".obbeebbbbeebbo.",
 ".obbbbbbbbbbbbo.",
 "..obbbnbbnbbbo..",
 "o..oobbbbbboo..o",
 "od.obbllllbbo.do",
 "oddobbllllbboddo",
 ".odobbllllbbodo.",
 "..oobbbbbbbbooy.",
 "...obbobbobbo.y.",
 "....oo.oo.oo...."]},
 dinosaur:{name:'Dinosaur', pal:{b:'#7cc46a',d:'#3d8a4f',l:'#d8efa6'}, a:{hx:11,hy:0,eL:9,eR:null,ey:2,nx:9,ny:6}, rows:[
 "........oooooo..",
 ".......obbbbbbo.",
 ".......obewbbbbo",
 ".......obeebbbbo",
 ".......obbbbbbbo",
 ".......obbboooo.",
 "..o...obbbbbo...",
 ".odo.obbbbbbbo..",
 ".odoobbbllbbbobo",
 "..odbbbbllbbbbo.",
 "..odbbbllllbbo..",
 "...odbbllllbbo..",
 "oooddbbbbbbo....",
 "..ooo.obbo.obbo.",
 "......obbo.obbo.",
 ".....oooo.oooo.."]},
 dog:{name:'Dog', pal:{b:'#e0b07a',d:'#8a5a3b',l:'#fff1dc'}, a:{hx:8,hy:2,eL:5,eR:9,ey:6,nx:8,ny:11}, rows:[
 "................",
 "................",
 "....oooooooo....",
 "...obbbbbbbbo...",
 ".oodbbbbbbbbdoo.",
 "odddbbbbbbbbdddo",
 "odddbewbbewbdddo",
 "oddobeebbeeboddo",
 ".ooobbllllbbooo.",
 "...obllnnllbo...",
 "....oblrrlbo....",
 "...oobbbbbboo...",
 "..obbbllllbbbo..",
 "..obbbllllbbbodo",
 "..obbobbbbobbo..",
 "...oo.oooo.oo..."]},
 cat:{name:'Cat', pal:{b:'#f4a259',d:'#c9733a',l:'#fde7c8'}, a:{hx:8,hy:4,eL:4,eR:10,ey:6,nx:8,ny:10}, rows:[
 "................",
 "...o........o...",
 "..obo......obo..",
 "..obpo....opbo..",
 "..obbboooobbbo..",
 ".obbbbbbbbbbbbo.",
 ".obbewbbbbewbbo.",
 ".obbeebbbbeebbo.",
 ".opbbbbppbbbbpo.",
 "..obbbbbbbbbbo..",
 "...oobbbbbboo...",
 "...obllllllbo...",
 "..obbllllllbbo..",
 "..obbllllllbbo.d",
 "..obbobbbbobboo.",
 "...oo.oooo.oo..."]},
 turtle:{name:'Turtle', pal:{b:'#9ccf5f',d:'#3f8f4f',l:'#e8c872'}, a:{hx:13,hy:9,eL:13,eR:null,ey:11,nx:12,ny:14}, rows:[
 "................",
 "................",
 "................",
 "................",
 "................",
 "................",
 "............ooo.",
 "....oooooo.obbbo",
 "...odgddgdoobewo",
 "..odddgddddobeeo",
 ".odgddddgddobbbo",
 ".odddgddddgdobro",
 "olllllllllllooo.",
 ".obbooooobbo....",
 ".obbo....obbo...",
 "..oo......oo...."]},
 rabbit:{name:'Rabbit', pal:{b:'#ece6f2',d:'#b9b0c9',l:'#ffd6e0'}, a:{hx:8,hy:5,eL:4,eR:10,ey:7,nx:8,ny:11}, rows:[
 "...oo......oo...",
 "..obpo....opbo..",
 "..obpo....opbo..",
 "..obpo....opbo..",
 "..obpo....opbo..",
 "..obbboooobbbo..",
 ".obbbbbbbbbbbbo.",
 ".obbewbbbbewbbo.",
 ".obbeebbbbeebbo.",
 ".opbbbbppbbbbpo.",
 "..obbbbwwbbbbo..",
 "...oobbbbbboo...",
 "..obbllllllbbo..",
 "..obbllllllbbowo",
 "..obbobbbbobbo..",
 "...oo.oooo.oo..."]},
 pig:{name:'Pig', pal:{b:'#ffb3c6',d:'#f27a9b',l:'#ffd9e3',p:'#ff7a9c'}, a:{hx:8,hy:4,eL:4,eR:10,ey:6,nx:8,ny:12}, rows:[
 "................",
 "................",
 "..oo........oo..",
 ".odbo......obdo.",
 ".odbboooooobbdo.",
 ".obbbbbbbbbbbbo.",
 ".obbewbbbbewbbo.",
 ".obbeebbbbeebbo.",
 ".obbbddddddbbbo.",
 ".opbbdnddndbbpo.",
 ".obbbddddddbbbo.",
 "..obbbbbbbbbbo..",
 "...oobbbbbboo...",
 "..obbbbbbbbbbodo",
 "..obbobbbbobbo..",
 "...oo.oooo.oo..."]},
 rat:{name:'Rat', pal:{b:'#a8a3b5',d:'#6e6880',l:'#e6e1ef'}, a:{hx:8,hy:4,eL:4,eR:10,ey:6,nx:8,ny:11}, rows:[
 "................",
 ".ooo........ooo.",
 "obppo......oppbo",
 "obppo......oppbo",
 ".oobboooooobboo.",
 "..obbbbbbbbbbo..",
 "..obewbbbbewbo..",
 "..obeebbbbeebo..",
 "...obbbbbbbbo...",
 "....obbbbbbo....",
 ".....obnnbo.....",
 "....oobbbboo....",
 "...obllllllbo...",
 "...obllllllbo...",
 "...obbobbobbo.pp",
 "....oo.oo.oopp.."]},
 monkey:{name:'Monkey', pal:{b:'#9c6b4a',d:'#6b4430',l:'#f2cfa5'}, a:{hx:8,hy:2,eL:5,eR:9,ey:7,nx:8,ny:11}, rows:[
 "................",
 "................",
 ".....oooooo.....",
 "....obbbbbbo....",
 "...obbbbbbbbo...",
 ".oobbllbbllbboo.",
 "oplobllllllbolpo",
 "oplolewllewlolpo",
 ".oooleelleelooo.",
 "...olllnnlllo...",
 "...ollrrrrllo...",
 "....oolllloo.dd.",
 "...obbllllbbo..d",
 "..obbbllllbbbodd",
 "..obbobbbbobbo..",
 "...oo.oooo.oo..."]}
};
PETS.trex={name:'T-Rex'}; PETS.snake={name:'Snake'}; PETS.parrot={name:'Parrot'}; PETS.owl={name:'Owl'}; PETS.rat.name='Hamster';
PETS.frog={name:'Frog'}; PETS.octopus={name:'Octopus'}; PETS.capybara={name:'Capybara'};
const PET_ORDER = ['dragon','dinosaur','dog','cat','turtle','rabbit','pig','rat','monkey','trex','snake','parrot','owl','frog','octopus','capybara'];
// colour skins drawn for one kind of pet (the first look in each row is the normal pet)
const ART_SKINS = { frog: { mint: 'Mint', gold: 'Gold', pond: 'Pond', plum: 'Plum' }, octopus: { peach: 'Peach', lagoon: 'Lagoon', berry: 'Berry', ink: 'Ink' }, capybara: { honey: 'Honey', cocoa: 'Cocoa', cream: 'Cream', mist: 'Mist' } };

const HATS = {
 party:{name:'Party Hat', rows:[
 "...kk...",
 "...oo...",
 "..ocmo..",
 "..omco..",
 ".ocmcmo.",
 ".oooooo."]},
 cap:{name:'Baseball Cap', rows:[
 "..oooo....",
 ".ozzzzo...",
 "ozzwzzzo..",
 "oooooooooo"]},
 crown:{name:'Crown', rows:[
 ".k.kk.k.",
 ".kkkkkk.",
 ".kzkkck.",
 ".kkkkkk.",
 ".oooooo."]},
 wizard:{name:'Wizard Hat', rows:[
 "....uo..",
 "...uuo..",
 "..ukuu..",
 "..uuuu..",
 ".uuuuuu.",
 "vvvvvvvv"]}
};

const SKINS = {
 gold:{name:'Golden', pal:{b:'#ffd23f',d:'#c99a1c',l:'#fff3b0'}},
 midnight:{name:'Midnight', pal:{b:'#4b48a8',d:'#2a2870',l:'#9d9be0'}},
 candy:{name:'Candy', pal:{b:'#ff9ecd',d:'#e05fa0',l:'#ffe0f0'}},
 ice:{name:'Ice', pal:{b:'#bde8ff',d:'#6fb7e0',l:'#f0fbff'}},
 lava:{name:'Lava', pal:{b:'#ff6b35',d:'#b23a1a',l:'#ffd23f'}},
 mint:{name:'Mint', pal:{b:'#7be0b0',d:'#3aa877',l:'#e0fff0'}}
};

const FOODS = {
 apple:{name:'Apple', fill:15, rows:["....i...","...oi...",".ozzzzo.","ozwzzzzo","ozzzzzzo","ozzzzzzo",".ozzzzo.","..oooo.."]},
 carrot:{name:'Carrot', fill:15, rows:["...i.i..","....ii..","...ojjo.","...ojjo.","...ojo..","...ojo..","....o..."]},
 fish:{name:'Fish', fill:25, rows:["........",".oooo..o","occccooc","ocxcccco","occccooc",".oooo..o"]},
 bone:{name:'Bone', fill:25, rows:["oo....oo","oyo..oyo",".oyyyyo.",".oyyyyo.","oyo..oyo","oo....oo"]},
 seeds:{name:'Sunflower Seeds', fill:12, rows:["."]},
 strawberry:{name:'Strawberry', fill:15, rows:['.']},
 banana:{name:'Banana', fill:20, rows:['.']},
 cabbage:{name:'Cabbage', fill:20, rows:['.']},
 kibble:{name:'Pet Kibble', fill:35, rows:['.']},
 water:{name:'Fresh Water', fill:10, rows:['.']},
 cake:{name:'Cake', fill:50, rows:["...z....","...o....","oooooooo","offffffo","oyyyyyyo","offffffo","oyyyyyyo","oooooooo"]}
};

const SHOP = [
 ...Object.entries(SKINS).map(([k,v])=>({id:'skin-'+k, cat:'skins', key:k, name:v.name+' skin', price:30})),
 ...Object.entries(ART_SKINS).flatMap(([kind,o])=>Object.entries(o).map(([k,n])=>({id:'skin-'+kind+'-'+k, cat:'skins', key:'a-'+k, petKind:kind, name:n+' '+PETS[kind].name, price:40}))),
 {id:'hat-strawhat', cat:'clothes', slot:'hat', key:'strawhat', name:'Straw Hat', price:12},
 {id:'hat-cap', cat:'clothes', slot:'hat', key:'cap', name:'Paw Cap', price:12},
 {id:'hat-party', cat:'clothes', slot:'hat', key:'party', name:'Party Hat', price:10},
 {id:'hat-wizard', cat:'clothes', slot:'hat', key:'wizard', name:'Wizard Hat', price:20},
 {id:'hat-crown', cat:'clothes', slot:'hat', key:'crown', name:'Crown', price:25},
 {id:'eyes-round', cat:'clothes', slot:'eyes', key:'round', name:'Round Glasses', price:8},
 {id:'eyes-shades', cat:'clothes', slot:'eyes', key:'shades', name:'Cool Shades', price:15},
 {id:'neck-bowtie', cat:'clothes', slot:'neck', key:'bowtie', name:'Red Bow', price:8},
 {id:'neck-scarf', cat:'clothes', slot:'neck', key:'scarf', name:'Plaid Scarf', price:10},
 {id:'back-backpack', cat:'clothes', slot:'back', key:'backpack', name:'Backpack', price:14},
 {id:'body-overalls', cat:'clothes', slot:'body', key:'overalls', name:'Overalls', price:18},
 {id:'body-raincoat', cat:'clothes', slot:'body', key:'raincoat', name:'Raincoat', price:20},
 {id:'food-apple', cat:'food', key:'apple', name:'Apple', price:2},
 {id:'food-carrot', cat:'food', key:'carrot', name:'Carrot', price:2},
 {id:'food-strawberry', cat:'food', key:'strawberry', name:'Strawberry', price:2},
 {id:'food-banana', cat:'food', key:'banana', name:'Banana', price:3},
 {id:'food-cabbage', cat:'food', key:'cabbage', name:'Cabbage', price:3},
 {id:'food-kibble', cat:'food', key:'kibble', name:'Pet Kibble', price:5},
 {id:'food-bone', cat:'food', key:'bone', name:'Bone', price:3},
 {id:'food-water', cat:'food', key:'water', name:'Fresh Water', price:1},
 {id:'home-cottage', cat:'shelter', key:'cottage', name:'Log Cabin', price:60},
 {id:'home-house', cat:'shelter', key:'house', name:'Blue Roof House', price:90},
 {id:'home-treehouse', cat:'shelter', key:'treehouse', name:'Treehouse', price:100},
 {id:'home-castle', cat:'shelter', key:'castle', name:'Castle', price:150},
 {id:'home-doghouse', cat:'shelter', key:'doghouse', name:'Doghouse', price:40, legacy:1},
 {id:'home-tent', cat:'shelter', key:'tent', name:'Camping Tent', price:40, legacy:1},
 {id:'home-igloo', cat:'shelter', key:'igloo', name:'Igloo', price:60, legacy:1},
 {id:'deco-ball', cat:'decor', key:'ball', name:'Toy Ball', price:6},
 {id:'deco-plant', cat:'decor', key:'plant', name:'Potted Plant', price:8},
 {id:'deco-poster', cat:'decor', key:'poster', name:'Star Poster', price:8},
 {id:'deco-rug', cat:'decor', key:'rug', name:'Cozy Rug', price:10},
 {id:'deco-lamp', cat:'decor', key:'lamp', name:'Floor Lamp', price:12},
 {id:'deco-lights', cat:'decor', key:'lights', name:'String Lights', price:15},
 {id:'deco-shelf', cat:'decor', key:'shelf', name:'Bookshelf', price:18},
 {id:'deco-tank', cat:'decor', key:'tank', name:'Fish Tank', price:20}
];

const MEANINGS = {};
MEANINGS_RAW.trim().split('\n').forEach(line => { const [w, m, e] = line.split('|'); MEANINGS[w.toLowerCase()] = { m, e }; });
function parseWords(){
  const all=[], ids=new Set();
  for(const g of [1,2,3,4,5]){
    WORDS_RAW[g].trim().split('\n').forEach((line,i)=>{
      const [w,d,s,o,cue]=line.split('|');
      const spellings=w.split('/');
      const id=spellings[0].toLowerCase();
      if(ids.has(id)) return; ids.add(id);
      const mn=MEANINGS[id]||{m:'',e:''};
      all.push({id, g, i, w:spellings[0], alt:spellings.map(x=>x.toLowerCase()), d:d.split(','), s, o:o.split(','), cue:cue||'', mean:mn.m, ex:mn.e});
    });
  }
  // grade 5-6 words gathered from other curricula (word|misspellings|sentence|forms|cue|meaning|example)
  if (typeof WORDS2_RAW !== 'undefined') WORDS2_RAW.trim().split('\n').forEach((line, i) => {
    const [w, d, s, o, cue, mean, ex] = line.split('|');
    const spellings = w.split('/'), id = spellings[0].toLowerCase();
    if (ids.has(id)) return; ids.add(id);
    all.push({ id, g: 6, i, w: spellings[0], alt: spellings.map(x => x.toLowerCase()), d: d.split(','), s, o: o.split(','), cue: cue || '', mean: mean || '', ex: ex || '' });
  });
  return all;
}
/*END-DATA*/
