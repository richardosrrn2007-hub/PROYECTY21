# Para cada fotograma del reel (30 fps), qué fotograma de la grabación de Leo mostrar: mismos cortes y velocidad que la voz.
import json, sys
d = json.load(open(sys.argv[3] if len(sys.argv) > 3 else "audio/pieces.json")); P = d["pieces"]; W = d["words"]
SP, FPS, TOTAL, NF = (float(sys.argv[5]) if len(sys.argv) > 5 else 1.07), 30, float(sys.argv[1]), int(sys.argv[2])
starts = sorted(w[0] for w in W)
out = []
for f in range(int(TOTAL * FPS) + 2):
    u = f / FPS * SP
    s = None
    for k, (p0, p1, at) in enumerate(P):
        if at <= u < at + (p1 - p0): s = p0 + (u - at); break
    if s is None:
        prev = [p for p in P if p[2] + (p[1] - p[0]) <= u]
        if not prev: s = 0.0
        else:
            p0, p1, at = prev[-1]; cont = p1 + (u - (at + p1 - p0))
            nxt = [w for w in starts if w >= p1 - 0.02]
            s = min(cont, (nxt[0] - 0.12) if nxt else cont)
    out.append(min(NF, max(1, round(s * 30) + 1)))
open(sys.argv[4] if len(sys.argv) > 4 else "../v2/web/cam-map.js", "w").write("const CAMMAP = " + json.dumps(out) + ";\n")
print(len(out), out[:5], out[-3:])
