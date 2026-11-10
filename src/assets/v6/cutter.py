from PIL import Image; import numpy as np
from scipy import ndimage
def cut(src, box, name, bgfn=None, keep_frac=0.04, pad=4, holes=True):
    A=np.array(src.convert('RGB')).astype(int)
    x,y,w,h=box; x0,y0=max(0,x-pad),max(0,y-pad); x1,y1=min(A.shape[1],x+w+pad),min(A.shape[0],y+h+pad)
    c=A[y0:y1,x0:x1]
    if bgfn is None:
        mx=c.max(2); mn=c.min(2); bgl=(mx-mn<30)&(c.mean(2)>212)
    else: bgl=bgfn(c)
    lab,n=ndimage.label(bgl)
    border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    fg=~np.isin(lab,list(border))
    fg=ndimage.binary_opening(fg,iterations=1)|(fg&ndimage.binary_erosion(fg,iterations=0) if False else fg)
    flab,fn=ndimage.label(fg)
    if fn==0: print('empty',name); return None
    sizes=ndimage.sum(fg,flab,range(1,fn+1)); objs=ndimage.find_objects(flab)
    keep=np.zeros_like(fg); big=sizes.max()
    for k,s in enumerate(sizes):
        sl=objs[k]; hh=sl[0].stop-sl[0].start; ww=sl[1].stop-sl[1].start
        if s>=big*keep_frac and min(hh,ww)>5: keep|=(flab==k+1)
    if holes: keep=ndimage.binary_fill_holes(keep)|keep
    # restore pixels inside the kept region that the bg test removed (light highlights enclosed by outline)
    a=(keep*255).astype(np.uint8)
    # soft 1px edge
    edge=keep&~ndimage.binary_erosion(keep)
    a[edge]=200
    rgba=np.dstack([c.astype(np.uint8),a]); im=Image.fromarray(rgba,'RGBA'); im=im.crop(im.getbbox())
    im.save(f'cut/{name}.png'); return im.size
