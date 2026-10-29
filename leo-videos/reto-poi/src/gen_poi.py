# Serie H4 con comportamiento real de GBPJPY (retornos y mechas remuestreados de datos reales)
# construida para que el ejemplo cumpla los criterios del reto, y verificada al final.
# Uso: python3 -I gen_poi.py h4_real.json out.js
import json, sys, random, math

real = json.load(open(sys.argv[1]))
rets, wick_up, wick_dn = [], [], []
for i in range(1, len(real)):
    _, o, h, l, c = real[i]
    pc = real[i - 1][4]
    rets.append(math.log(c / pc))
    body_hi, body_lo = max(pc, c), min(pc, c)
    wick_up.append(max(0, h - body_hi) / pc); wick_dn.append(max(0, body_lo - l) / pc)
sd = (sum(r * r for r in rets) / len(rets)) ** 0.5

ZC, ZA, ZB = (213.20, 214.05), (215.35, 215.75), (216.85, 217.45)

def build(seed):
    rnd = random.Random(seed)
    out = []; px = 214.9
    def seg(n, target, scale=1.0, band=None):
        nonlocal px
        for k in range(n):
            o = px
            r = rnd.choice(rets) * scale
            if band:
                mid = (band[0] + band[1]) / 2
                c = o * math.exp(r * 0.6) + (mid - o) * 0.4
                c = min(band[1] - 0.04, max(band[0] + 0.04, c))
            else:
                c = o * math.exp(r) + (target - o) / (n - k)
            wu = rnd.choice(wick_up) * o * scale; wd = rnd.choice(wick_dn) * o * scale
            if band: wu = min(wu, band[1] - max(o, c) + 0.02); wd = min(wd, min(o, c) - band[0] + 0.02)
            out.append([o, max(o, c) + max(0, wu), min(o, c) - max(0, wd), c]); px = c
    # prehistoria para semanal y diario
    for tgt in (212.0, 215.6, 213.6, 216.2, 211.4, 214.8, 213.4, 215.3, 213.9):
        seg(80, tgt, 1.0)
    pre = len(out)
    seg(18, 213.65, 0.9); h1 = len(out); seg(6, 0, 0.6, (213.25, 214.0))      # cae a C, interacción 1
    seg(14, 215.0, 0.9); seg(12, 213.7, 0.9); h2 = len(out); seg(6, 0, 0.6, (213.25, 214.0))  # reacción y vuelta, interacción 2
    seg(12, 214.95, 0.9); seg(10, 214.3, 0.8); seg(5, 213.7, 0.8)
    acc0 = len(out); seg(16, 0, 0.55, (213.22, 214.02))                          # acumulación actual en C
    imp0 = len(out); seg(3, 215.1, 0.5); seg(2, 216.3, 0.4); seg(4, 216.85, 0.6)  # impulso: cruza A en 1–2 velas
    b0 = len(out); seg(12, 0, 0.5, (216.9, 217.4)); seg(5, 216.7, 0.6)           # acumulación reciente B
    return out, dict(pre=pre, h1=h1, h2=h2, acc0=acc0, imp0=imp0, b0=b0)

def inside(c, z): return not (c[1] < z[0] or c[2] > z[1])
def check(out, ix):
    v0 = ix["pre"] - 10
    hist = out[v0:ix["acc0"]]
    # C: ≥2 interacciones previas con reacción al alza de ≥ 0.9
    reac = 0
    for a in (ix["h1"], ix["h2"]):
        if any(inside(c, ZC) for c in out[a:a + 6]) and max(c[1] for c in out[a + 6:a + 20]) >= ZC[1] + 0.9: reac += 1
    if reac < 2: return "C sin reacciones"
    # A: solo 1–2 velas tocan A en todo lo visible
    na = sum(1 for c in out[v0:] if inside(c, ZA))
    if na > 2: return f"A con {na} velas"
    # B: nada anterior entra en B
    if any(inside(c, ZB) for c in out[v0:ix["b0"]]): return "B con historia"
    if max(c[1] for c in out[v0:ix["b0"]]) >= ZB[0]: return "B no es territorio nuevo"
    return None

for seed in range(1, 5000):
    out, ix = build(seed)
    err = check(out, ix)
    if not err: break
print("semilla", seed, "ok" if not err else err)
# tiempos: velas de 4h de lunes a viernes, terminando el 9 jul 2026
import datetime as dt
t = dt.datetime(2026, 7, 9, 4, tzinfo=dt.timezone.utc); ts = []
while len(ts) < len(out):
    if t.weekday() < 5: ts.append(int(t.timestamp()))
    t -= dt.timedelta(hours=4)
ts.reverse()
H4 = [[ts[i]] + out[i] for i in range(len(out))]
def agg(rows, key):
    d = {}
    for t0, o, h, l, c in rows:
        k = key(t0)
        if k not in d: d[k] = [t0, o, h, l, c]
        else: e = d[k]; e[2] = max(e[2], h); e[3] = min(e[3], l); e[4] = c
    return [d[k] for k in sorted(d)]
D1 = agg(H4, lambda t0: t0 // 86400)
W1 = agg(H4, lambda t0: (t0 // 86400 - 4) // 7)  # semanas de lunes
off = ix["pre"] - 10
data = {"H4": H4[off - 60:], "D1": D1[-80:], "W1": W1[-40:], "off": 60,
        "zones": {"C": ZC, "A": ZA, "B": ZB},
        "idx": {"acc0": ix["acc0"] - (off - 60), "acc1": ix["imp0"] - 1 - (off - 60), "bStart": ix["b0"] - (off - 60),
                "aCross": ix["imp0"] + 3 - (off - 60), "touch": [ix["h1"] + 2 - (off - 60), ix["h2"] + 2 - (off - 60)]}}
open(sys.argv[2], "w").write("const REAL = " + json.dumps(data) + ";\n")
print({k: len(v) for k, v in data.items() if isinstance(v, list)}, data["idx"])
