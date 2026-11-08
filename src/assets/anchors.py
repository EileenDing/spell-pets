from PIL import Image, ImageDraw; import numpy as np, json
from scipy import ndimage
pets=['dragon','dinosaur','dog','cat','turtle','rabbit','pig','rat','monkey','trex','snake','parrot','owl']
res={}
for n in pets:
    im=Image.open(f'cut/pet-{n}.png'); a=np.array(im).astype(int)
    al=a[...,3]>128; lum=a[...,:3].mean(2)
    dark=al&(lum<70)
    lab,k=ndimage.label(dark)
    sizes=ndimage.sum(dark,lab,range(1,k+1)); objs=ndimage.find_objects(lab)
    big=np.argmax(sizes)
    cands=[]
    for i,(s,o) in enumerate(zip(sizes,objs)):
        if i==big or s<25: continue
        h=o[0].stop-o[0].start; w=o[1].stop-o[1].start
        if 0.5<h/w<2.2 and s>0.55*h*w: cands.append(((o[1].start+o[1].stop)/2,(o[0].start+o[0].stop)/2,s,w,h))
    # pick the pair of blobs with similar size and y
    best=None
    for i in range(len(cands)):
        for j in range(i+1,len(cands)):
            A,B=cands[i],cands[j]
            dy=abs(A[1]-B[1]); ds=abs(A[2]-B[2])/max(A[2],B[2]); dx=abs(A[0]-B[0])
            if dy<6 and ds<0.45 and 15<dx<90:
                sc=dy+ds*20-min(A[2],B[2])/20
                if best is None or sc<best[0]: best=(sc,A,B)
    res[n]={'w':im.width,'h':im.height}
    if best:
        A,B=sorted([best[1],best[2]])
        res[n].update(ex=round((A[0]+B[0])/2,1),ey=round((A[1]+B[1])/2,1),es=round(B[0]-A[0],1),er=round((A[3]+B[3])/4,1))
    print(n,res[n],len(cands))
json.dump(res,open('anchors.json','w'))
