# Versión corta (~65 s): voz real de Leo, frases que se repiten fuera, pausas más cortas, +12 % de ritmo y 1,15 s de gancho al inicio.
import json, wave
import numpy as np
W = json.load(open("audio3/words_raw.json"))
FIX = {75: "¿compraría", 39: "Mira", 116: "retrocedió,", 216: "interés.", 150: "correctos.", 12: "habías", 16: "así", 24: "¿cómo", 27: "posible?", 32: "gráfico", 51: "más", 55: "está", 64: "escape,", 92: "tres", 99: "compraste", 100: "", 286: "¿quieres", 291: "zonas?"}   # lo que Whisper oyó mal o sobra en pantalla
SEG = [(0, 20), (39, 71), (75, 93), "COUNT", (94, 103), (105, 116), (119, 150), (206, 216), (227, 247), (257, 285), (286, 304)]
COUNT, MAXGAP, KEEP = 3.0 * 1.12, 0.3, 0.17
sr = 48000
src = wave.open("audio3/leo_clean.wav"); x = np.frombuffer(src.readframes(src.getnframes()), dtype=np.int16).astype(np.float32) / 32768
pieces, words, t = [], [], 1.15 * 1.12
count = None
for sg in SEG:
    if sg == "COUNT":
        t += 0.25; count = (round(t, 3), round(t + COUNT, 3)); t += COUNT + 0.35; continue
    a, b = sg
    r0, r1 = max(0.0, W[a][0] - 0.08), W[b][1] + 0.12
    # silencios reales dentro del tramo (energía en ventanas de 10 ms) → se acortan a KEEP
    hop = sr // 100; fr = x[int(r0 * sr):int(r1 * sr)]
    db = np.array([20 * np.log10(np.sqrt(np.mean(fr[k:k + hop] ** 2)) + 1e-7) for k in range(0, len(fr) - hop, hop)])
    thr = -33.0
    sil, k0 = [], None
    for k, v in enumerate(list(db < thr) + [False]):
        if v and k0 is None: k0 = k
        if not v and k0 is not None:
            if (k - k0) / 100 > MAXGAP: sil.append((r0 + k0 / 100, r0 + k / 100))
            k0 = None
    iv, c = [], r0
    for s0, s1 in sil:
        iv.append((c, s0 + KEEP / 2)); c = s1 - KEEP / 2
    iv.append((c, r1))
    def mp(tsrc):
        acc = t
        for p0, p1 in iv:
            if tsrc <= p1: return acc + max(0, tsrc - p0)
            acc += p1 - p0
        return acc
    for k in range(a, b + 1):
        w0, w1, wd = W[k]; txt = FIX.get(k, wd)
        if txt: words.append([round(mp(w0), 3), round(mp(w1), 3), txt])
    for p0, p1 in iv:
        pieces.append((p0, p1, t)); t += p1 - p0
    t += 0.3
TOTAL_VOICE = t
json.dump({"pieces": pieces, "count": count, "words": W}, open("audio3/pieces.json", "w"))
out = np.zeros(int((t + 8) * sr), dtype=np.float32)
for p0, p1, at in pieces:
    seg = x[int(p0 * sr):int(p1 * sr)].copy(); f = int(0.012 * sr)
    if len(seg) < 3 * f: print("tramo vacío", p0, p1); continue
    seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    o = int(at * sr); out[o:o + len(seg)] += seg
OUTRO = round(TOTAL_VOICE - 0.6, 3); TOTAL = round(OUTRO + 4.0, 3)
out = out[:int((TOTAL + 0.5) * sr)]
w = wave.open("audio3/voice_track.wav", "w"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
w.writeframes((np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
import subprocess
SP = 1.12  # ritmo de reel: misma voz, un 12 % más rápida (sin cambiar el tono)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "audio3/voice_track.wav", "-af", f"atempo={SP}", "audio3/voice_fast.wav"], check=True)
subprocess.run(["mv", "audio3/voice_fast.wav", "audio3/voice_track.wav"], check=True)
vv = wave.open("audio3/voice_track.wav"); out = np.frombuffer(vv.readframes(vv.getnframes()), dtype=np.int16).astype(np.float32) / 32768
words = [[round(a / SP, 3), round(b / SP, 3), w] for a, b, w in words]
count = (round(count[0] / SP, 3), round(count[1] / SP, 3)); OUTRO = round(OUTRO / SP, 3); TOTAL = round(OUTRO + 4.0, 3)
hop = sr // 60; n = len(out) // hop
rms = np.array([np.sqrt(np.mean(out[i * hop:(i + 1) * hop] ** 2)) for i in range(n)])
env = np.clip((20 * np.log10(rms + 1e-6) + 48) / 26, 0, 1)
TL = {"words": words, "count": count, "outro": OUTRO, "total": TOTAL, "env": [round(float(v), 2) for v in env]}
open("../v2/web/timeline-ref3.js", "w").write("const TL = " + json.dumps(TL, ensure_ascii=False) + ";\n")
print("voz", round(TOTAL_VOICE, 2), "total", TOTAL, "cuenta", count, "palabras", len(words))
print(" ".join(f"{a:.1f}:{w}" for a, b, w in words))
