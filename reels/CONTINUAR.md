Soy Richard Arias. Continúa conmigo la serie de reels "Trading desde cero" de la marca Origine (TikTok/Reels, vertical 1080×1920). Escribe en español, frases cortas, al grano. Si te pido una decisión, dame UNA recomendación. Datos concretos, cero lenguaje de anuncio. Sé crítico y objetivo.

## Reglas de trabajo (obligatorias)
1. ANTES de renderizar, mándame siempre imágenes de referencia (fotogramas) y espera mi visto bueno.
2. Los vídeos se hacen con código: skill `becario-reels` (Remotion 4.0.538) que está en `.claude/skills/becario-reels/` del repo `richardosrrn2007-hub/PROYECTY21`. Rama de trabajo: `claude/amazing-hawking-1mlebr`. Haz commit y push de código, imágenes de prueba y portadas; los .mp4 no se suben.
3. Voz: ElevenLabs, voz clonada "JUSU" (voice_id `3FJV5P6lWp5AD8SVqCYw`), modelo eleven_v4, con etiquetas tipo [intrigante], [segura], [cercana]. Nunca vuelvas a llamar a la generación para "reintentar" (cobra otra vez): consulta el estado.
4. Fuentes de pago (NO están en el repo, pídemelas si faltan): CHICKEN Pie (`chicken-pie.otf`, secundaria), Matcha World (`matcha-world.otf`) y Matcha Style (`matcha-style.otf`) (principales), `internet-friends-es.ttf`. Van en `public/fuentes/`. Nunca las subas al repo.
5. Regla de los gráficos: cada vela ABRE donde CERRÓ la anterior (sin huecos). Series inventadas: `serieVelas`; datos reales: pasarlos por `continua()` (en `src/propias/Velas.tsx`).
6. Sonido: efectos solo en momentos importantes y sincronizados al fotograma de su animación; swoosh solo al cambiar de capítulo; nada de ruido de ambiente de fondo; golpes/ganar/perder con temática (videojuego de lucha en el vídeo 2, japonesa en el 3). Bancos gratis CC0 de kenney.nl (impact, rpg, interface, sci-fi). Música de fondo solo si suma, muy baja y que baje sola cuando habla la voz.
7. Me gusta el anime y mucho motion graphic: que sea entretenido, que cambie algo en pantalla cada pocos segundos (comprobar con `ritmo.py`: ningún tramo de más de 0,6 s sin movimiento), sin ruido visual innecesario.

## Estilo de la serie (ver `reels/SERIE_ORIGINE.md`)
Fondo negro con el planeta de noche con borde dorado (`Planeta.tsx`), dorado #D4AA6E y crema #F2E8D5, subtítulos arriba con palabras clave en caja dorada, cierre: el monitor se apaga como una tele, la línea de luz sube y aparece el logo (`Cierre.tsx`, `public/logo.mp4`, 2 s).

## Vídeos hechos
1. `reels/que-es-una-accion/` — ¿Qué es una acción? (terminado).
2. `reels/como-leer-una-vela/` — Cómo leer una vela (51,7 s, terminado). Batalla: magnates en el gancho (arranque VS), luego toro y oso musculosos tiran de una cuerda cuyo nudo es el precio que dibuja la vela; partes señaladas (apertura, cierre, máximo, mínimo); primer plano de anime, zoom dentro de la vela, K.O., repetición VHS; gráfico real de Apple diario 2016-17 en estilo "papel" de TradingView; respuesta final con las 4 partes. PENDIENTE: el cierre dice "Comenta VELA y te mando la guía" pero NO hay guía → regenerar solo esa frase (ej. "¿Te quedó claro? Comenta VELA. En el próximo, de dónde salió esta figura") y quitar la tarjeta de la guía. También pendiente: aplicar `continua()` a su gráfico real.
3. `reels/historia-de-las-velas/` — De dónde salieron las velas (57,2 s, terminado, a falta de mi revisión). Viaje: mundo normal → la cámara baja al planeta → órbita sobre Japón (planeta enorme, Japón en dorado, sol rojo) → historia en tinta y papel (mapa, Dojima con comerciantes con personalidad, futuros, Homma, pincel con 4 precios, máscaras miedo/codicia, banderas en montañas, canción, 1991 Steve Nison) → vuelta al planeta → apps con la vela hecha de arroz → "¿Lo sabías? Si no, comenta ARROZ. En el próximo: las 3 velas que más vas a ver." Música de koto hecha con código solo en la parte de Japón.
4. Siguiente vídeo: "Las 3 velas que más vas a ver" (prometido en el vídeo 3).

## Cómo retomar el proyecto en una sesión nueva
- Cada vídeo tiene su proyecto en `reels/<video>/proyecto/` (src, render.mjs, package.json, public sin las fuentes de pago).
- Copia esa carpeta fuera del repo (ej. `~/reel4`), pon las fuentes de pago en `public/fuentes/`, `npm install`, y usa la skill: `python3 .claude/skills/becario-reels/scripts/alinear.py <voz.mp3> --proyecto <dir> --motor asr --tempo 1.08 --pausa 0.22 --cola 1.5`, luego `node render.mjs resumen`, `node render.mjs foto <segundos…>`, `node render.mjs video` (si dice PARCIAL, repetir), `node render.mjs portada`, y `python3 .claude/skills/becario-reels/scripts/ritmo.py salida/reel.mp4 --tiempos src/datos/tiempos.json`.
- Escenas propias de cada vídeo: `src/propias/` (Batalla.tsx en el 2; Japon.tsx y FondoViaje.tsx en el 3), registradas en `src/propias/index.ts`; el guion y las escenas en `src/datos/plan.json`.

Empieza leyendo `reels/SERIE_ORIGINE.md` y este archivo, y dime en 3 líneas qué entendiste antes de tocar nada.
