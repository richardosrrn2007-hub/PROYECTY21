# Busca el caso del reel en divisas (contado, sin cambios de contrato):
# impulso alcista HH/HL → compra tardía en el máximo con stop bajo un mínimo pequeño → el retroceso saca ese stop
# → toca una base previa que coincide con el 70,5–79 % → sube y supera el máximo (TP) sin perder el mínimo estructural.
import json, glob, datetime as dt
def load(f):
    d = json.load(open(f))
    if isinstance(d, dict):
        d = d['chart']['result'][0]; q = d['indicators']['quote'][0]
        rows = [(t, o, h, l, c) for t, o, h, l, c in zip(d['timestamp'], q['open'], q['high'], q['low'], q['close']) if None not in (o, h, l, c)]
    else: rows = [tuple(r) for r in d]
    B = {}
    for t, o, h, l, c in rows:
        k = t // 14400 * 14400
        if k not in B: B[k] = [k, o, h, l, c]
        else: e = B[k]; e[2] = max(e[2], h); e[3] = min(e[3], l); e[4] = c
    return [B[k] for k in sorted(B)]
res = []
for f in sorted(glob.glob('fx_*.json')):
    name = f[3:-5]
    try: H = load(f)
    except Exception as e: print(name, 'sin datos', e); continue
    json.dump(H, open(f'h4_{name}.json', 'w'))
    n = len(H)
    piv = lambda i, w, hi: (H[i][2] == max(x[2] for x in H[max(0, i - w):i + w + 1])) if hi else (H[i][3] == min(x[3] for x in H[max(0, i - w):i + w + 1]))
    for iL in range(40, n - 60):
        if not piv(iL, 6, False): continue
        for iH in range(iL + 15, min(n - 40, iL + 70)):
            if not piv(iH, 8, True): continue
            L, Hh = H[iL][3], H[iH][2]; R = Hh - L
            if R / L < 0.016 or min(x[3] for x in H[iL:iH]) < L: continue
            b0, b1 = Hh - 0.79 * R, Hh - 0.705 * R
            # base dentro de la franja (≥4 cuerpos)
            base = [k for k in range(iL + 1, iH) if min(H[k][1], H[k][4]) >= b0 - 0.04 * R and max(H[k][1], H[k][4]) <= b1 + 0.06 * R]
            if len(base) < 3: continue
            # mínimo pequeño justo antes del máximo (stop tardío)
            mins = [k for k in range(iH - 8, iH) if piv(k, 2, False)]
            if not mins: continue
            iM = mins[-1]; slL = H[iM][3]
            if (Hh - slL) / R > 0.35: continue
            it = next((j for j in range(iH + 1, min(n, iH + 45)) if H[j][3] <= b1), None)
            if it is None or H[it][3] < Hh - 0.9 * R: continue
            if max(x[2] for x in H[iH + 1:it]) > Hh: continue
            tp = next((j for j in range(it, min(n, it + 60)) if H[j][2] >= Hh or H[j][3] < L), None)
            if tp is None or H[tp][3] < L: continue
            # sin huecos raros (aperturas lejos del cierre anterior)
            if any(abs(H[k][1] - H[k - 1][4]) / H[k - 1][4] > 0.004 for k in range(iL - 30, tp + 5)): continue
            res.append((name, iL, iH, iM, it, tp, len(base), round(R / L * 100, 2), dt.datetime.fromtimestamp(H[iL][0], dt.UTC).strftime('%Y-%m-%d'), tp - iH))
print(len(res))
for r in res: print(r)
