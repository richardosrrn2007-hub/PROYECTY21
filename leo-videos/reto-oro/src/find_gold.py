# Busca en el oro (GC=F, 1h → 4h) un caso: impulso alcista con estructura HH/HL, retroceso al 71–79 %,
# base decisional dentro de esa franja, reacción y llegada al máximo anterior (TP) sin tocar el SL.
import json, datetime as dt
d = json.load(open('gold_GC%3DF.json'))['chart']['result'][0]
q = d['indicators']['quote'][0]
rows = [(t, o, h, l, c) for t, o, h, l, c in zip(d['timestamp'], q['open'], q['high'], q['low'], q['close']) if None not in (o, h, l, c)]
H4 = {}
for t, o, h, l, c in rows:
    k = t // 14400 * 14400
    if k not in H4: H4[k] = [k, o, h, l, c]
    else: e = H4[k]; e[2] = max(e[2], h); e[3] = min(e[3], l); e[4] = c
H = [H4[k] for k in sorted(H4)]
json.dump(H, open('gold_h4.json', 'w'))
n = len(H); print('velas 4h', n, dt.datetime.utcfromtimestamp(H[0][0]).date(), dt.datetime.utcfromtimestamp(H[-1][0]).date())
def piv(i, w, hi=True):
    a, b = max(0, i - w), min(n, i + w + 1)
    return H[i][2] == max(x[2] for x in H[a:b]) if hi else H[i][3] == min(x[3] for x in H[a:b])
res = []
for iL in range(60, n - 60):
    if not piv(iL, 6, False): continue
    for iH in range(iL + 8, min(n - 30, iL + 60)):
        if not piv(iH, 6, True): continue
        L, Hh = H[iL][3], H[iH][2]; R = Hh - L
        if R / L < 0.025: continue
        if min(x[3] for x in H[iL:iH + 1]) < L or max(x[2] for x in H[iL:iH + 1]) > Hh: continue
        # estructura previa: un máximo y un mínimo previos más bajos (HH/HL)
        prevH = max(x[2] for x in H[iL - 50:iL]); prevL = min(x[3] for x in H[iL - 50:iL])
        if not (prevH < Hh and prevL < L): continue
        b0, b1 = Hh - 0.79 * R, Hh - 0.71 * R
        # retroceso: primer toque de la franja
        it = None
        for j in range(iH + 1, min(n - 10, iH + 50)):
            if H[j][2] > Hh: break
            if H[j][3] <= b1: it = j; break
        if it is None: continue
        if H[it][3] < Hh - 0.86 * R: continue          # no se pasa mucho de la franja
        # resultado: llega al TP (máximo anterior) antes de perder el mínimo (SL)
        res_ = None
        for j in range(it, min(n, it + 80)):
            if H[j][3] < L: res_ = 'SL'; break
            if H[j][2] >= Hh: res_ = 'TP'; break
        if res_ != 'TP': continue
        # base decisional dentro del impulso, en la franja: ≥3 velas con cuerpo dentro de [b0-0.05R, b1+0.05R]
        base = [k for k in range(iL, iH) if min(H[k][1], H[k][4]) >= b0 - 0.06 * R and max(H[k][1], H[k][4]) <= b1 + 0.06 * R]
        if len(base) < 3: continue
        res.append((iL, iH, it, j, round(R / L * 100, 2), len(base), dt.datetime.utcfromtimestamp(H[iL][0]).strftime('%Y-%m-%d %H'), round(L, 1), round(Hh, 1), round(H[it][3], 1)))
print(len(res))
for r in res[-25:]: print(r)
