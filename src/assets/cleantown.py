from PIL import Image
im=Image.open('town.png').convert('RGB'); orig=im.copy()
TOP=48; BOT=259
def paste(dst, src):
    (dx0,dx1),(sx0,sx1)=dst,src
    patch=orig.crop((sx0,TOP,sx1,BOT)).resize((dx1-dx0,BOT-TOP),Image.LANCZOS)
    im.paste(patch,(dx0,TOP))
signs={'L1':(143,199,202,245),'L3':(677,199,735,245),'L4':(932,200,990,245)}
paste((116,380),(1161,1415))   # L1 <- L5
paste((656,882),(404,636))     # L3 <- L2
paste((906,1150),(1161,1415))  # L4 <- L5
for k,b in signs.items(): im.paste(orig.crop(b),b[:2])
im.save('town_clean.png')
# open gate patch from L1 (path between swung-open halves)
orig.crop((198,212,292,259)).save('cut/gate-open.png')
im.crop((100,30,1430,270)).save('clean_r1.png')
