# Línea de tiempo del Reto POI: voz en dos tramos con la pausa de 5 s entre ellos.
import json, wave
import numpy as np
W = json.load(open("audio/take2.words.json"))
W[23][2] = "C!"  # Whisper oye "sé"
SEG = [("intro", 0.0, 8.42, 0.30), ("expl", 8.50, 42.92, 14.35)]   # clave, inicio y fin en la toma, posición
COUNT = (9.0, 14.0)
OUTRO = 47.0
TOTAL = 51.5
words = []
for k, s0, s1, at in SEG:
    for w0, w1, w in W:
        if s0 - 0.01 <= w0 < s1: words.append([round(at + w0 - s0, 3), round(at + w1 - s0, 3), w])
sr = 48000
src = wave.open("audio/voice.wav"); x = np.frombuffer(src.readframes(src.getnframes()), dtype=np.int16).astype(np.float32) / 32768
out = np.zeros(int((TOTAL + 0.5) * sr), dtype=np.float32)
for k, s0, s1, at in SEG:
    p = x[int(s0 * sr):int(s1 * sr)].copy(); f = int(0.015 * sr)
    p[:f] *= np.linspace(0, 1, f); p[-f:] *= np.linspace(1, 0, f)
    o = int(at * sr); out[o:o + len(p)] += p
w = wave.open("audio/voice_track.wav", "w"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
w.writeframes((np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
hop = sr // 60; n = len(out) // hop
rms = np.array([np.sqrt(np.mean(out[i * hop:(i + 1) * hop] ** 2)) for i in range(n)])
env = np.clip((20 * np.log10(rms + 1e-6) + 46) / 26, 0, 1)
TL = {"words": words, "count": COUNT, "outro": OUTRO, "total": TOTAL, "env": [round(float(v), 2) for v in env]}
open("../v2/web/timeline-poi.js", "w").write("const TL = " + json.dumps(TL, ensure_ascii=False) + ";\n")
print(len(words), words[-1])
