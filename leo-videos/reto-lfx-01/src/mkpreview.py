# Inserta TIMING y fotogramas de vista previa en edit.js -> edit.out.js
import json, sys
t = json.load(open(sys.argv[1] if len(sys.argv) > 1 else 'timing.json'))
q = t['questions'][0]
prev = [[round(t['intro']['dur'] - 1.2, 2), "renders/p1-intro.png"],
        [round(q['at'] + q['countAt'] + 2.2, 2), "renders/p2-pregunta.png"],
        [round(q['at'] + q['revealAt'] + 2.5, 2), "renders/p3-revelado.png"],
        [round(t['result']['at'] + 2.5, 2), "renders/p4-resultado.png"],
        [round(t['outro']['at'] + 3.2, 2), "renders/p5-cierre.png"]]
render = sys.argv[2] if len(sys.argv) > 2 else None
s = open('edit.js').read().replace('__TIMING__', json.dumps(t, ensure_ascii=False)).replace('__PREVIEW__', json.dumps(prev if not render else None))
open('edit.out.js', 'w').write(s)
print(prev)
