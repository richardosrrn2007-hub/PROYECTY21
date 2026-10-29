import json, sys, subprocess, numpy as np
from faster_whisper import WhisperModel
m = WhisperModel("small", device="cpu", compute_type="int8")
for f in sys.argv[1:]:
    a = np.frombuffer(subprocess.run(["ffmpeg","-loglevel","error","-i",f,"-ac","1","-ar","16000","-f","f32le","-"],capture_output=True).stdout, np.float32)
    segs, info = m.transcribe(a, language="es", word_timestamps=True, beam_size=5)
    w = [[round(x.start, 3), round(x.end, 3), x.word.strip()] for s in segs for x in s.words]
    json.dump(w, open(f.replace('.mp3', '.words.json'), 'w'), ensure_ascii=False)
    print('==', f, len(w)); print(' '.join(x[2] for x in w))
