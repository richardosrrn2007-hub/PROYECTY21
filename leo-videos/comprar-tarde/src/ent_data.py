# Datos reales EURUSD 4h (Yahoo, contado) para el reel "Comprar tarde". Salida: ent-data.js (formato REAL de poi3 + ENT).
import json, sys, datetime as dt
H = json.load(open('h4_EURUSD.json'))
iL, iH, iM, iT, iTP = 1675, 1741, 1737, 1757, 1767
a, b = iL - 38, iTP + 22
W = [list(r) for r in H[a:b]]
for k in range(1, len(W)):              # regla de velas: cada vela abre en el cierre anterior
    o = W[k - 1][4]; W[k][1] = o; W[k][2] = max(W[k][2], o); W[k][3] = min(W[k][3], o)
rel = lambda i: i - a
L = W[rel(iL)][3]; iTop = max(range(rel(iL), rel(iH) + 1), key=lambda k: W[k][2]); Hh = W[iTop][2]; R = Hh - L
f = {lv: round(Hh - lv * R, 5) for lv in (0, 0.5, 0.618, 0.705, 0.79, 1)}
b0, b1 = f[0.79], f[0.705]
base = [k for k in range(rel(iL) + 1, rel(iH)) if min(W[k][1], W[k][4]) >= b0 - 0.04 * R and max(W[k][1], W[k][4]) <= b1 + 0.06 * R]
zlo = min(min(W[k][1], W[k][4]) for k in base); zhi = max(max(W[k][1], W[k][4]) for k in base)
# zigzag (HH/HL) entre el mínimo y el máximo
def piv(i, w, hi): s = W[max(0, i - w):i + w + 1]; return W[i][2] == max(x[2] for x in s) if hi else W[i][3] == min(x[3] for x in s)
pts = [(rel(iL), 'L')]
for k in range(rel(iL) + 1, rel(iH)):
    if piv(k, 8, True): pts.append((k, 'H'))
    elif piv(k, 8, False): pts.append((k, 'L'))
zz = []  # alternar y quedarse con extremos
for k, t in pts:
    if zz and zz[-1][1] == t:
        if (t == 'H' and W[k][2] > W[zz[-1][0]][2]) or (t == 'L' and W[k][3] < W[zz[-1][0]][3]): zz[-1] = (k, t)
    else: zz.append((k, t))
lab = []
lastH = lastL = None
for k, t in zz:
    p = W[k][2] if t == 'H' else W[k][3]
    if t == 'H': lab.append([k, p, 'HH' if lastH is not None and p > lastH else 'H']); lastH = p
    else: lab.append([k, p, 'HL' if lastL is not None and p > lastL else 'L']); lastL = p
entryLate = W[rel(iH)][4]; slLate = round(W[rel(iM)][3] - 0.0003, 5)
slHit = next(k for k in range(rel(iH) + 1, len(W)) if W[k][3] <= slLate)
touch = next(k for k in range(rel(iH) + 1, len(W)) if W[k][3] <= zhi)
print("zona", zlo, zhi, "fibo", b0, b1, "mín. del toque", min(W[k][3] for k in range(rel(iH) + 1, len(W))))
entry = round(min(zhi, b1), 5); sl = round(L - 0.0008, 5); tp = round(Hh, 5)
fill = next(k for k in range(rel(iH) + 1, len(W)) if W[k][3] <= entry)
tpHit = next(k for k in range(fill, len(W)) if W[k][2] >= tp)
assert all(W[k][3] > sl for k in range(fill, tpHit + 1)), 'el stop correcto salta'
assert slHit < touch, 'el stop tardío no salta antes de llegar a la zona'
# escenario alternativo (ilustrativo): sigue subiendo sin volver a la zona
import random
rnd = random.Random(7); g = []; px = W[rel(iH)][4]
for k in range(16):
    o = px; c = o + 0.0011 + rnd.gauss(0, 0.0013); h = max(o, c) + abs(rnd.gauss(0, 0.0006)); l = min(o, c) - abs(rnd.gauss(0, 0.0006))
    g.append([0, round(o, 5), round(h, 5), round(l, 5), round(c, 5)]); px = c
assert min(x[3] for x in g) > zhi + 0.004
ts = [r[0] for r in W]
def agg(rows, key):
    d = {}
    for t0, o, h, l, c in rows:
        kk = key(t0)
        if kk not in d: d[kk] = [t0, o, h, l, c]
        else: e = d[kk]; e[2] = max(e[2], h); e[3] = min(e[3], l); e[4] = c
    return [d[kk] for kk in sorted(d)]
full = H[a - 400:b]
REAL = {"H4": [[r[0]] + [round(v, 5) for v in r[1:]] for r in W], "D1": agg(full, lambda t: t // 86400), "W1": agg(full, lambda t: (t // 86400 - 4) // 7),
        "off": 10, "zones": {"C": [zlo, zhi], "A": [0, 0], "B": [0, 0]}, "idx": {"acc0": base[0], "acc1": base[-1], "bStart": 0, "aCross": 0, "touch": [touch, touch]}}
ENT = {"L": rel(iL), "H": rel(iH), "top": iTop, "minor": rel(iM), "touch": touch, "fill": fill, "tpHit": tpHit, "slHit": slHit, "base": [base[0], base[-1]],
       "zone": [zlo, zhi], "fib": f, "entryLate": entryLate, "slLate": slLate, "entry": entry, "sl": sl, "tp": tp, "zz": lab, "ghost": g,
       "sym": "EURUSD", "name": "Euro / Dólar estadounidense"}
open(sys.argv[1], 'w').write("const REAL = " + json.dumps(REAL) + ";\nconst ENT = " + json.dumps(ENT) + ";\n")
print(len(W), 'velas', dt.datetime.fromtimestamp(W[0][0], dt.UTC).date(), '→', dt.datetime.fromtimestamp(W[-1][0], dt.UTC).date())
print({k: ENT[k] for k in ENT if k not in ('ghost',)})
