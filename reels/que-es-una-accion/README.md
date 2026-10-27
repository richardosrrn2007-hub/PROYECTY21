# ¿Qué es una acción? — reel 9:16

- Voz: audio del vídeo de referencia, alineada con `alinear.py --motor asr --tempo 1.06 --pausa 0.22 --cola 1.2`.
- 63,7 s · 21 escenas propias · plano continuo con zoom entre escenas (como la referencia del teclado).
- Colores e identidad de Origine: negro, crema y bronce, planeta nocturno de fondo y velas monocromas.
- Fuentes: Internet Friends (títulos sin tildes) y Le Jardin Secret (resto). Licencia: 2 € por proyecto.

Archivos:
- `proyecto/src/propias/`: escenas (Texto, Pizza, Broker, Graficas, Velas, Planeta, SubArriba, mg).
- `proyecto/src/datos/`: plan.json y tiempos.json.
- `proyecto/src/motor/`, `Reel.tsx`, `tipos.ts`: cambios al motor (transición "zoom", subtítulos arriba, zona de escena).
- `proyecto/public/fuentes/`: las dos fuentes de marca.

Para volver a renderizar: `preparar.py ~/reel`, copiar `proyecto/` encima de `~/reel/`,
alinear el audio otra vez y `node render.mjs video`.
