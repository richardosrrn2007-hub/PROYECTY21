# Construye el timeline del Reto LFX 01 a partir de la duración de cada locución.
# Uso: python3 timing.py [durations.json] > timing.json
# Sin durations.json estima ~2.6 palabras/segundo (solo para la vista previa).
import json, re, sys

SCRIPT = json.load(open(__file__.replace("timing.py", "script.json")))

def est(t):
    return round(len(t.split()) / 2.6 + 0.3, 2)

durs = json.load(open(sys.argv[1])) if len(sys.argv) > 1 else {}
def d(key, t):
    return durs.get(key, est(t))

def split_chunks(txt, t0, total, maxw=11):
    # Divide en frases cortas para la burbuja, con tiempos proporcionales a las palabras.
    parts = [p.strip() for p in re.split(r"(?<=[.?!])\s+", txt) if p.strip()]
    out = []
    for ptxt in parts:
        w = ptxt.split()
        while len(w) > maxw:
            cut = maxw if len(w) - maxw >= 4 else len(w) // 2
            out.append(" ".join(w[:cut])); w = w[cut:]
        out.append(" ".join(w))
    n = sum(len(c.split()) for c in out)
    res, t = [], t0
    for c in out:
        dur = total * len(c.split()) / n
        res.append([c, round(t, 2), round(t + dur, 2)]); t += dur
    return res

audio = []
T = 0.0
tl = {}

# Intro
s = SCRIPT["intro"]
di = d("intro", s)
start = 1.4
tl["intro"] = {"at": T, "dur": round(start + di + 0.6, 2),
               "leo": [["celebrate", 0, 1.6], ["idle", 1.6, 99]],
               "bubbles": [[start - 0.2, start + di + 0.4, split_chunks(s, start, di)]]}
audio.append({"key": "intro", "at": T + start})
T += tl["intro"]["dur"]

qs = []
for i, q in enumerate(SCRIPT["questions"]):
    k = f"q{i+1}"
    t = 0.5
    dq = d(k + "_q", q["say"])
    audio.append({"key": k + "_q", "at": T + t})
    t += dq + 0.2
    optAt = []
    for j, o in enumerate(q["options"]):
        optAt.append(round(t, 2))
        say = f"{'ABC'[j]}: {o}"
        do = d(f"{k}_o{j}", say)
        audio.append({"key": f"{k}_o{j}", "at": T + t})
        t += do + 0.15
    countAt = round(t + 0.6, 2)
    revealAt = countAt + 5
    da = d(k + "_a", q["answer"])
    aStart = revealAt + 0.5
    audio.append({"key": k + "_a", "at": T + aStart})
    audio.append({"key": "sfx_tick", "at": T + countAt})
    audio.append({"key": "sfx_ok", "at": T + revealAt})
    S = round(aStart + da + 0.9, 2)
    qs.append({
        "at": round(T, 2), "dur": S, "question": q["question"], "options": q["options"], "correct": q["correct"],
        "optAt": optAt, "countAt": countAt, "revealAt": revealAt,
        "leo": [["point", 0, countAt - 0.4], ["think", countAt - 0.4, revealAt], ["celebrate", revealAt, revealAt + 1.6], ["idle", revealAt + 1.6, 999]],
        "bubbles": [[countAt - 0.3, revealAt, [["Piensa bien... tienes 5 segundos.", countAt - 0.3, revealAt]]],
                    [aStart - 0.2, S - 0.1, split_chunks(q["answer"], aStart, da)]],
    })
    T += S
tl["questions"] = qs

s = SCRIPT["result"]
dr = d("result", s)
tl["result"] = {"at": round(T, 2), "dur": round(0.6 + dr + 0.8, 2),
                "leo": [["celebrate", 0, 2.2], ["idle", 2.2, 99]],
                "bubbles": [[0.4, 0.6 + dr + 0.6, split_chunks(s, 0.6, dr)]]}
audio.append({"key": "result", "at": T + 0.6})
T += tl["result"]["dur"]
tl["outro"] = {"at": round(T, 2), "dur": 4.0}
T += 4.0
tl["total"] = round(T, 2)
tl["audio_plan"] = [{**a, "at": round(a["at"], 2)} for a in audio]
print(json.dumps(tl, ensure_ascii=False))
