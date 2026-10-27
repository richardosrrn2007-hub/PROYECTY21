# Reto LFX 01 — v2 (motion graphics)

Video: `../reto-lfx-01.mp4` (1080×1920, 30 fps, 105,6 s, −15 LUFS).

## Cómo se genera
1. `audio/voz-leo.mp3`: narración con la voz clonada de Leo (ElevenLabs, LEOPUPRIME).
   Convertir a `audio/voice.wav` (48 kHz mono) con ffmpeg.
2. `words.json`: tiempos de cada palabra (Whisper).
3. `python3 timeline.py` → `web/timeline.js` + `audio/voice_track.wav` (voz con los huecos del reloj).
4. `python3 sound.py` → `audio/mix.wav` (voz + efectos + música).
5. En `web/`: `node render.js ../out/pN.mp4 30 INICIO FIN` (Playwright + Chromium + ffmpeg).
6. Unir trozos y añadir el audio (ver `final.sh`).

`web/scene.js` contiene toda la animación; `web/leo.js` el personaje articulado.
