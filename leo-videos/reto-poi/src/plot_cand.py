import json, sys
from PIL import Image, ImageDraw
H=json.load(open(sys.argv[1])); out=sys.argv[2]
cands=[(3897,10,213.203,214.168,[3815,3832],3937,8),(3532,10,210.345,211.689,[3463,3474],3557,8)]
imgs=[]
for a,L,zlo,zhi,tch,b,LB in cands:
    i0,i1=a-105,b+LB+8
    seg=H[i0:i1]; pmax=max(x[2] for x in seg); pmin=min(x[3] for x in seg)
    W,Hh=1100,620; im=Image.new('RGB',(W,Hh),'white'); d=ImageDraw.Draw(im)
    X=lambda i:20+(i-i0)/(i1-i0)*(W-40); Y=lambda p:20+(1-(p-pmin)/(pmax-pmin))*(Hh-40)
    d.rectangle([X(a),Y(zhi),W-20,Y(zlo)],fill=(191,208,255))
    d.rectangle([X(b),Y(max(x[2] for x in H[b:b+LB])),W-20,Y(min(x[3] for x in H[b:b+LB]))],fill=(210,220,255))
    prev=None
    for i in range(i0,i1):
        t,o,h,l,c=H[i]
        if prev is not None: o=prev
        prev=c
        x=X(i+0.5); col=(20,22,28) if c<o else (110,115,125)
        d.line([x,Y(h),x,Y(l)],fill=col,width=1)
        d.rectangle([x-2.5,Y(max(o,c)),x+2.5,Y(min(o,c))+1],fill=(255,255,255) if c>=o else col,outline=col)
    for tt in tch: d.ellipse([X(tt)-8,Y(H[tt][3])-8,X(tt)+8,Y(H[tt][3])+8],outline=(41,98,255),width=3)
    imgs.append(im)
big=Image.new('RGB',(1100,1260),'#333'); big.paste(imgs[0],(0,0)); big.paste(imgs[1],(0,640)); big.save(out)
