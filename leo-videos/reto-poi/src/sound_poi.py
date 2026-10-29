# Diseño de sonido del Reto LFX 01: efectos sintetizados + música de fondo + voz.
# Salida: audio/mix.wav (estéreo 48 kHz)
import json, wave, re
import numpy as np
from scipy.signal import butter, lfilter

SR = 48000
rng = np.random.default_rng(7)
s = open("../v2/web/timeline-poi.js").read()
TL = json.loads(s[s.index("{"): s.rindex("}") + 1])
WD, TOTAL = TL["words"], TL["total"]
N = int((TOTAL + 0.5) * SR)
MN = N

def t_(d): return np.arange(int(d * SR)) / SR
def env_exp(d, k): return np.exp(-t_(d) * k)
def bp(x, lo, hi, order=2):
    b, a = butter(order, [lo / (SR / 2), hi / (SR / 2)], btype="band"); return lfilter(b, a, x)
def lp(x, f, order=2):
    b, a = butter(order, f / (SR / 2)); return lfilter(b, a, x)
def hp(x, f, order=2):
    b, a = butter(order, f / (SR / 2), btype="high"); return lfilter(b, a, x)

# ---------- Efectos ----------
def whoosh(d=0.55, up=True):
    n = rng.standard_normal(int(d * SR))
    tt = t_(d); out = np.zeros_like(n)
    seg = 256
    for i in range(0, len(n), seg):
        k = i / len(n); f = 300 + (2600 if up else 1200) * (k if up else 1 - k)
        out[i:i + seg] = bp(n[i:i + seg], f * 0.6, min(f * 1.6, 20000))
    return out * np.sin(np.pi * tt / d) ** 2 * 0.5
def pop(f0=420, f1=980, d=0.11):
    tt = t_(d); f = np.linspace(f0, f1, len(tt))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 38) * 0.55
def tick(f=3200, d=0.05, amp=0.5):
    tt = t_(d); n = hp(rng.standard_normal(len(tt)), 2500) * np.exp(-tt * 160)
    return (np.sin(2 * np.pi * f * tt) * np.exp(-tt * 90) * 0.6 + n * 0.5) * amp
def bell(freqs=(1318.5, 1975.5), gap=0.09, d=1.4):
    out = np.zeros(int((d + gap * len(freqs)) * SR))
    for i, f in enumerate(freqs):
        tt = t_(d); x = sum(np.sin(2 * np.pi * f * h * tt) * a * np.exp(-tt * (3 + h * 2)) for h, a in [(1, 1), (2, 0.35), (3, 0.15), (4.2, 0.08)])
        o = int(i * gap * SR); out[o:o + len(x)] += x * 0.35
    return out
def slam(d=0.6):
    tt = t_(d); f = 120 * np.exp(-tt * 9) + 42
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 6)
    n = lp(rng.standard_normal(len(tt)), 1800) * np.exp(-tt * 25)
    return (body * 0.9 + n * 0.45) * 0.8
def sparkle(d=0.9):
    out = np.zeros(int(d * SR))
    for i in range(14):
        o = int(rng.uniform(0, d - 0.15) * SR); f = rng.uniform(2800, 6500); tt = t_(0.15)
        x = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 40) * rng.uniform(0.08, 0.2)
        out[o:o + len(x)] += x
    return out
def thud(d=0.18):
    tt = t_(d); return np.sin(2 * np.pi * (140 * np.exp(-tt * 12) + 60) * tt) * np.exp(-tt * 22) * 0.45
def rise(d=0.9):
    tt = t_(d); f = 300 * (2 ** (tt / d * 1.5))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / d) * 0.18
def coin():
    return bell((2637, 3520), gap=0.06, d=0.35) * 0.6
def click():
    return tick(1800, 0.04, 0.6)

fx = np.zeros(N)
def put(x, t, gain=1.0):
    o = int(t * SR)
    if o < 0 or o >= N: return
    e = min(N, o + len(x)); fx[o:e] += x[: e - o] * gain

def wt(words, rx, nth=0):
    c = 0
    for w in words:
        if re.search(rx, w[2]):
            if c == nth: return w[0]
            c += 1
    return words[0][0]

# ---------- Eventos del Reto POI ----------
def norm(w): return re.sub(r"[¿?¡!.,]", "", w.lower())
def wt(rx, nth=0):
    c = 0
    for w in WD:
        if re.search(rx, norm(w[2])):
            if c == nth: return w[0]
            c += 1
    raise SystemExit("falta " + rx)
C0, C1 = TL["count"]; OUT = TL["outro"]
# gancho
put(whoosh(0.5, False), 0.0, 0.8); put(slam(0.5), 0.15, 0.8); put(pop(), 0.1, 0.6); put(whoosh(0.4), 1.1, 0.5)
put(pop(380, 900), 1.05, 0.5)  # título
put(whoosh(0.7), wt("^mira$") - 0.1, 0.5)   # zoom a la pantalla
put(whoosh(0.6), wt("^tienes$") - 0.05, 0.6); put(pop(250, 600, 0.16), wt("^tienes$") + 0.5, 0.6)  # círculo
# reloj
put(pop(300, 700, 0.14), C0 - 0.3, 0.6)
for k in range(5):
    put(tick(3300, 0.05, 0.9 if k < 3 else 1.1), C0 + k, 1.0); put(tick(2300, 0.05, 0.7 if k < 3 else 0.9), C0 + k + 0.5, 1.0)
    if k >= 3: put(tick(2800, 0.04, 0.55), C0 + k + 0.25, 1.0); put(tick(2800, 0.04, 0.55), C0 + k + 0.75, 1.0)
put(rise(2.0), C0 + 3, 0.5)
# revelado (suave)
put(bell(), C1, 0.8); put(sparkle(1.0), C1 + 0.05, 0.6); put(whoosh(0.5), C1 - 0.1, 0.5)
put(whoosh(0.6), wt("^primero$") - 0.45, 0.55)
for rx in ["^semanal$", "^diario$", "^cuatro$"]: put(click(), wt(rx) - 0.1, 0.8); put(pop(500, 1000, 0.09), wt(rx), 0.4)
put(whoosh(0.7), wt("^buscamos$"), 0.45)
for rx in ["^interacción$", "^compras$", "^ventas$", "^disputas$", "^reacciones$"]: put(pop(420, 900), wt(rx) + 0.02, 0.55)
put(whoosh(0.8), wt("^marcamos$"), 0.45); put(whoosh(1.0, False), wt("^revisamos$", 1), 0.5)
put(rise(0.9), wt("^candidata$") - 0.2, 0.7); put(whoosh(0.8), wt("^eso$") - 0.1, 0.45); put(pop(), wt("^eso$") + 0.1, 0.5)
put(whoosh(0.6), wt("^acertaste$") - 0.3, 0.6); put(coin(), wt("^like$"), 0.7); put(pop(), wt("^like$"), 0.4)
for w in WD:  # toque muy suave en palabras clave azules
    if norm(w[2]) in ("punto", "zona", "velas", "pasado", "observar", "comunidad"): put(pop(600, 1200, 0.07), w[0] - 0.03, 0.25)
put(whoosh(0.7), OUT + 0.0, 0.8); put(slam(0.5), OUT + 0.15, 0.4); put(bell((784, 1175), 0.12, 1.8), OUT + 0.4, 0.45); put(sparkle(0.9), OUT + 1.0, 0.6)

# ---- v3: sonido de cada animación ----
for rx in ["^tiempo$", "^velas$", "^pasado$", "^disputas$", "^reacciones$", "^candidata$", "^observar$", "^automática$"]:
    put(whoosh(0.35), wt(rx) - 0.2, 0.55); put(pop(300, 800, 0.12), wt(rx), 0.55)
tt0 = wt("^tiempo$")
for i in range(6): put(tick(3000 if i % 2 else 2200, 0.04, 0.6), tt0 + 0.1 + i * 0.16, 0.8)
for i in range(7): put(pop(500 + i * 90, 900 + i * 90, 0.06), wt("^velas$") + i * 0.07, 0.35)
put(slam(0.6), wt("^disputas$") + 0.22, 1.0); put(sparkle(0.6), wt("^disputas$") + 0.25, 0.7)
put(whoosh(0.9, False), wt("^pasado$"), 0.6)
for i in range(8): put(tick(4000, 0.03, 0.4), wt("^pasado$") + i * 0.09, 0.6)
put(rise(0.5), wt("^reacciones$"), 0.7); put(thud(), wt("^reacciones$") + 0.28, 0.8)
put(whoosh(0.3), wt("^candidata$") + 0.02, 0.6); put(thud(), wt("^candidata$") + 0.32, 1.0); put(coin(), wt("^candidata$") + 0.34, 0.6)
put(click(), wt("^automática$") + 0.3, 1.0); put(slam(0.4), wt("^automática$") + 0.47, 0.7)
for rx in ["^tiempo$", "^interacción$", "^reacciones$"]: put(bell((1568, 2093), 0.05, 0.5), wt(rx) + 0.05, 0.35)
for rx in ["^marcamos$", "^eso$"]: put(whoosh(0.5), wt(rx) - 0.2, 0.5); put(pop(250, 600, 0.14), wt(rx) + 0.1, 0.5)
for rx in ["^primero$", "^buscamos$", "^marcamos$", "^eso$"]: put(pop(400, 1000, 0.1), wt(rx) - 0.25, 0.45)
put(sparkle(1.2), wt("^like$") + 0.05, 0.7)

# ---------- Música (lo-fi suave, 100 bpm) ----------
bpm = 100; beat = 60 / bpm
mus = np.zeros(N)
def kick():
    tt = t_(0.35); f = 110 * np.exp(-tt * 18) + 45
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)
def hat():
    tt = t_(0.06); return hp(rng.standard_normal(len(tt)), 7000) * np.exp(-tt * 70) * 0.25
def note(f, d, kind="pad"):
    tt = t_(d)
    if kind == "pad":
        x = sum(np.sin(2 * np.pi * f * m * tt + m) / (m ** 1.3) for m in (1, 2, 3, 4)) * 0.18
        a = np.minimum(1, tt / 0.25) * np.minimum(1, (d - tt) / 0.4)
    else:
        x = np.sin(2 * np.pi * f * tt) * 0.5 + np.sin(4 * np.pi * f * tt) * 0.1
        a = np.exp(-tt * 3) * np.minimum(1, (d - tt) / 0.05)
    return x * a
chords = [[220.0, 261.6, 329.6, 392.0], [174.6, 220.0, 261.6, 329.6], [261.6, 329.6, 392.0, 493.9], [196.0, 246.9, 293.7, 392.0]]
bass = [110.0, 87.3, 130.8, 98.0]
bar = beat * 4
nb = int(TOTAL / bar)
for b in range(nb):
    t0 = b * bar; ci = b % 4
    for f in chords[ci]: put_m = note(f, bar); o = int(t0 * SR); e = min(N, o + len(put_m)); mus[o:e] += put_m[: e - o] * 0.5
    for k in range(4):
        o = int((t0 + k * beat) * SR)
        if k in (0, 2):
            x = kick(); e = min(N, o + len(x)); mus[o:e] += x[: e - o] * 0.55
        bnote = note(bass[ci], beat * 0.9, "bass"); e = min(N, o + len(bnote)); mus[o:e] += bnote[: e - o] * 0.5
        for hh in (0, 0.5):
            oh = int((t0 + (k + hh) * beat) * SR); x = hat(); e = min(N, oh + len(x)); mus[oh:e] += x[: e - oh]
mus = lp(mus, 5000)

# ---------- Voz y ducking ----------
vw = wave.open("../poiv/audio/voice_track.wav")
voice = np.frombuffer(vw.readframes(vw.getnframes()), dtype=np.int16).astype(np.float64) / 32768
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
venv = np.abs(voice)
k = int(0.15 * SR); venv = np.convolve(venv, np.ones(k) / k, mode="same")
duck = 1 - 0.6 * np.clip(venv / 0.05, 0, 1)
# la música baja durante el reloj para que se oiga el tic-tac, y se apaga en el cierre
mgain = np.ones(N)
a, b = int((C0 - 0.3) * SR), int(C1 * SR)
mgain[a:b] = 0.35
fade_in = np.minimum(1, np.arange(N) / (1.0 * SR))
o_end = int(TOTAL * SR); fo = np.ones(N); fo[o_end - int(2.5 * SR):o_end] = np.linspace(1, 0, int(2.5 * SR)); fo[o_end:] = 0
music = mus * duck * mgain * fade_in * fo * 0.22

# Mezcla final
mix = voice * 1.0 + fx * 0.55 + music
peak = np.max(np.abs(mix)); mix = mix / max(1.0, peak / 0.95)
st = np.stack([mix, mix], axis=1)
out = wave.open("../poiv/audio/mix.wav", "w"); out.setnchannels(2); out.setsampwidth(2); out.setframerate(SR)
out.writeframes((st * 32767).astype(np.int16).tobytes()); out.close()
print("ok", TOTAL, "peak", round(float(peak), 3))
