# Construye la línea de tiempo del Reto LFX 01 a partir de la toma de voz y sus palabras.
# Salidas: web/timeline.js (datos para la animación) y audio/voice_track.wav (voz montada).
import json, subprocess, wave
import numpy as np

W = json.load(open("words.json"))
SEG = [  # clave, inicio y fin en la toma original
    ("intro", 0.0, 8.55), ("q1q", 8.6, 13.75), ("q1o", 13.85, 23.95), ("q1a", 24.0, 31.2),
    ("q2q", 31.3, 36.2), ("q2o", 36.25, 45.45), ("q2a", 45.5, 53.3),
    ("q3q", 53.35, 56.75), ("q3o", 56.85, 65.8), ("q3a", 65.85, 71.25), ("res", 71.3, 79.28),
]
COUNT = 5.0
seg = {}
t = 0.5
for i, (k, s0, s1) in enumerate(SEG):
    seg[k] = {"src0": s0, "src1": s1, "at": round(t, 3), "end": round(t + s1 - s0, 3)}
    t = seg[k]["end"]
    if k == "intro":
        t += 0.35
    elif k.endswith("q"):
        t += 0.25
    elif k.endswith("o"):
        n = k[1]
        seg[f"count{n}"] = {"at": round(t + 0.5, 3), "end": round(t + 0.5 + COUNT, 3)}
        t = seg[f"count{n}"]["end"] + 0.85  # revelado y respuesta
    elif k.endswith("a"):
        t += 0.6
    elif k == "res":
        t += 0.5

def words_of(k):
    s = seg[k]
    out = []
    for w0, w1, w in W:
        if s["src0"] - 0.01 <= w0 < s["src1"]:
            out.append([round(s["at"] + w0 - s["src0"], 3), round(s["at"] + w1 - s["src0"], 3), w])
    return out

TL = {"seg": seg, "words": {k: words_of(k) for k, *_ in SEG}}
TL["outro"] = {"at": round(t, 3), "end": round(t + 4.0, 3)}
TL["total"] = round(t + 4.0, 3)
for n in "123":
    TL["seg"][f"reveal{n}"] = {"at": TL["seg"][f"count{n}"]["end"]}

# Voz montada en la nueva línea de tiempo
sr = 48000
src = wave.open("audio/voice.wav")
x = np.frombuffer(src.readframes(src.getnframes()), dtype=np.int16).astype(np.float32) / 32768
out = np.zeros(int((TL["total"] + 0.5) * sr), dtype=np.float32)
for k, s0, s1 in SEG:
    a, b = int(s0 * sr), int(s1 * sr)
    piece = x[a:b].copy()
    f = int(0.012 * sr)
    piece[:f] *= np.linspace(0, 1, f); piece[-f:] *= np.linspace(1, 0, f)
    o = int(seg[k]["at"] * sr)
    out[o:o + len(piece)] += piece
w = wave.open("audio/voice_track.wav", "w"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
w.writeframes((np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()

# Envolvente para la boca (60 por segundo)
hop = sr // 60
n = len(out) // hop
rms = np.array([np.sqrt(np.mean(out[i * hop:(i + 1) * hop] ** 2)) for i in range(n)])
env = np.clip((20 * np.log10(rms + 1e-6) + 46) / 26, 0, 1)
TL["env"] = [round(float(v), 2) for v in env]
open("web/timeline.js", "w").write("const TL = " + json.dumps(TL, ensure_ascii=False) + ";\n")
print("total", TL["total"])
for k in seg:
    print(k, seg[k])
