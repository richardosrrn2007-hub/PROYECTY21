import json, sys, datetime as dt
H=json.load(open(sys.argv[1]))
n=len(H); res=[]; st=[0,0,0,0]
def rng(a,b): return max(x[2] for x in H[a:b]), min(x[3] for x in H[a:b])
for a in range(110, n-50):
    for L in (10,12,14):
        hi,lo=rng(a,a+L); px=H[a][4]
        if (hi-lo)/px>0.0065: continue
        st[0]+=1
        after=H[a+L:a+L+10]
        if max(x[4] for x in after) < hi*1.006: continue
        st[1]+=1
        zlo,zhi=lo,hi
        touches=[]; i=a-100
        while i<a-8:
            c=H[i]
            if c[3]<=zhi and c[3]>=zlo-0.25*(zhi-zlo):
                fut=H[i+1:i+12]
                if max(x[2] for x in fut)>=zhi+0.9*(zhi-zlo) and min(x[3] for x in fut)>=zlo-0.5*(zhi-zlo):
                    touches.append(i); i+=10; continue
            i+=1
        if len(touches)<2: continue
        st[2]+=1
        win_hi=max(x[2] for x in H[a-100:a+L])
        found=None
        for b in range(a+L+3, min(n-8, a+L+50)):
            for LB in (8,10):
                bh,bl=rng(b,b+LB)
                if (bh-bl)/px<0.0055 and bl>win_hi:
                    found=(b,LB,bl,bh); break
            if found: break
        if not found: continue
        st[3]+=1
        res.append((len(touches),a,L,zlo,zhi,touches)+found)
print('etapas',st,len(res))
seen=set()
for r in sorted(res,key=lambda r:(-r[0],-r[1])):
    if r[1]//30 in seen: continue
    seen.add(r[1]//30)
    t=dt.datetime.fromtimestamp(H[r[1]][0],dt.UTC).strftime('%Y-%m-%d %H:%M')
    print(r[0], t, 'acc',r[1],r[2],'C',round(r[3],3),round(r[4],3),'touch',r[5],'B',r[6:])
    if len(seen)>12: break
