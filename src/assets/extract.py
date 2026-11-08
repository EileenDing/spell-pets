from PIL import Image; import numpy as np
from scipy import ndimage
im=Image.open('sheet.png').convert('RGB'); A=np.array(im).astype(int)
BOX={ # name: (x,y,w,h) from segmentation
'pet-dragon':(85,52,198,195),'pet-dinosaur':(292,41,165,206),'pet-dog':(456,59,177,187),'pet-cat':(661,51,166,196),
'pet-turtle':(848,72,154,174),'pet-rabbit':(1032,26,147,222),'pet-pig':(1221,70,163,176),
'pet-rat':(143,273,164,176),'pet-monkey':(348,251,196,197),'pet-trex':(576,257,206,192),'pet-snake':(809,279,178,165),
'pet-parrot':(1016,261,172,187),'pet-owl':(1205,269,184,177),
'home-cabin':(23,506,329,225),'home-house':(367,480,389,251),'home-treehouse':(763,451,342,282),'home-castle':(1121,451,394,283),
'food-apple':(73,768,104,93),'food-carrot':(211,766,110,96),'food-strawberry':(378,762,94,102),'food-banana':(510,759,127,100),
'food-cabbage':(675,757,137,109),'food-kibble':(844,766,188,96),'food-bone':(1064,765,137,94),'food-water':(1259,762,167,94),
'wear-strawhat':(25,905,158,92),'wear-cap':(189,907,129,92),'wear-bow':(332,912,101,74),'wear-glasses':(443,921,147,64),
'wear-scarf':(608,894,131,118),'wear-backpack':(750,887,137,115),'wear-overalls':(902,883,129,130),'wear-raincoat':(1048,874,165,139),
}
P=6
out={}
for name,(x,y,w,h) in BOX.items():
    x0,y0=max(0,x-P),max(0,y-P); x1,y1=min(1536,x+w+P),min(1024,y+h+P)
    c=A[y0:y1,x0:x1]; bg=np.array([254,253,243])
    near=np.abs(c-bg).sum(2)<36
    lab,n=ndimage.label(near)
    border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    bgmask=np.isin(lab,list(border))
    # also drop other sprites' fragments: keep only the largest non-bg component (plus things within it)
    fg=~bgmask
    flab,fn=ndimage.label(ndimage.binary_dilation(fg,iterations=3))
    sizes=ndimage.sum(fg,flab,range(1,fn+1))
    keep=np.zeros_like(fg)
    big=sizes.max()
    for k,s in enumerate(sizes):
        if s>big*(0.15 if name=='food-apple' else 0.04): keep|=(flab==k+1)
    fg&=keep
    # soften: pixels adjacent to bg that are light get partial alpha
    alpha=(fg*255).astype(np.uint8)
    rgba=np.dstack([c.astype(np.uint8),alpha])
    img=Image.fromarray(rgba,'RGBA'); img=img.crop(img.getbbox())
    img.save(f'cut/{name}.png'); out[name]=img.size
print(out)
