# Cut the 18 new foods and 3 potions out of the user's sheets (Nov 2026)
from PIL import Image; import numpy as np; from scipy import ndimage
FOOD=['corn','watermelon','blueberries','sweetpotato','broccoli','grapes',
      'onigiri','buns','soup','salmon','pancakes','croissant',
      'donut','pudding','popsicle','berrybowl','juice','cocoa']
POT=['potion-green','potion-blue','potion-purple']
def cut(path,names,rows,cols,maxdim,common=False):
    im=Image.open(path).convert('RGB'); A=np.array(im).astype(int); H,W=A.shape[:2]
    bg=np.median(np.concatenate([A[0],A[-1],A[:,0],A[:,-1]]),axis=0)
    near=np.abs(A-bg).sum(2)<40
    lab,n=ndimage.label(near); border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    fg=~np.isin(lab,list(border))
    flab,fn=ndimage.label(ndimage.binary_dilation(fg,iterations=4))
    objs=ndimage.find_objects(flab); sizes=ndimage.sum(fg,flab,range(1,fn+1))
    cand=[(s,i) for i,s in enumerate(sizes) if s>3000]
    out={}
    for s,i in cand:
        sl=objs[i]; cy=(sl[0].start+sl[0].stop)/2; cx=(sl[1].start+sl[1].stop)/2
        r=int(cy/H*rows); c=int(cx/W*cols); name=names[r*cols+c] if rows*cols==len(names) else names[c]
        if name in out and out[name][0]>=s: continue
        m=(flab[sl]==i+1)&fg[sl]
        m=ndimage.binary_fill_holes(m)|m
        rgba=np.dstack([A[sl].astype(np.uint8),(m*255).astype(np.uint8)])
        img=Image.fromarray(rgba,'RGBA'); img=img.crop(img.getbbox())
        f=maxdim/(common or max(img.size)); img=img.resize((round(img.size[0]*f),round(img.size[1]*f)),Image.LANCZOS)
        out[name]=(s,img)
    for k,(s,img) in out.items(): img.save(f'cut_{k}.png')
    print(sorted((k,v[1].size) for k,v in out.items()), set(names)-set(out))
cut('food_sheet.png',FOOD,3,6,110)
cut('potion_sheet.png',POT,1,3,110,common=660)
