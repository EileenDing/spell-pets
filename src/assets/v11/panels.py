from PIL import Image; import numpy as np
P1R=[(156,376),(441,672),(736,952),(1016,1227),(1292,1521)]; P1C=[(11,503),(520,1015)]
P2R=[(146,393),(459,693),(759,1008)]; P2C=[(17,757),(779,1519)]
NAMES1=['mermaid','unicorn','ming','wuxia','cinderella','snowwhite','donut','hunter','jungle','army']
NAMES2=['gentleman','lady','pharaoh','peterpan','dino','octocos']
def panels():
    out=[]
    for f,R,C,N in [('wardrobe1',P1R,P1C,NAMES1),('wardrobe2',P2R,P2C,NAMES2)]:
        im=Image.open(f+'.png').convert('RGB'); a=np.array(im).astype(int); k=0
        for (y0,y1) in R:
            for (x0,x1) in C:
                sub=a[y0:y1,x0:x1]; bg=np.median(sub[:5].reshape(-1,3),0)
                nb=np.sqrt(((sub-bg)**2).sum(2))>25
                # divider: a column in the middle 35-75% with a long vertical run and empty neighbours
                best=None
                for x in range(int(sub.shape[1]*.35),int(sub.shape[1]*.78)):
                    col=nb[:,x]; run=0; mx=0
                    for v in col: run=run+1 if v else 0; mx=max(mx,run)
                    side=nb[:,max(0,x-4)].mean()+nb[:,min(sub.shape[1]-1,x+4)].mean()
                    sc=mx/sub.shape[0]-side
                    if best is None or sc>best[0]: best=(sc,x)
                out.append(dict(name=N[k],file=f,box=(x0,y0,x1,y1),div=x0+best[1],score=round(best[0],2))); k+=1
    return out
if __name__=='__main__':
    for p in panels(): print(p)
