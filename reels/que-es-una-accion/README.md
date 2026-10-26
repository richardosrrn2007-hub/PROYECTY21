# ¿Qué es una acción? — reel 9:16

- Voz: audio del vídeo de referencia (Origine), alineada con `alinear.py --motor asr --tempo 1.06 --pausa 0.22 --cola 1.2`.
- 63,7 s · 21 escenas propias de motion graphics · estilo negro y dorado.
- `proyecto/src/propias/`: escenas (Texto, Pizza, Broker, Graficas, mg).
- `proyecto/src/datos/`: plan.json y tiempos.json.
- `proyecto/src/motor/actual.ts`: zona de escena agrandada (sin personaje).

Para volver a renderizar: `preparar.py ~/reel`, copiar `proyecto/src` encima de `~/reel/src`,
alinear el audio otra vez y `node render.mjs video`.
