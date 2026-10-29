---
name: lfx-reels
description: Crea reels verticales animados (motion graphics) para LFX / Leonardo (Método LFX, trading): cuestionarios, explicaciones y retos con el personaje Leo, voz clonada de Leo, fondo 3D de velas, ilustraciones animadas, reloj tic-tac, confeti y cierre LFX. Úsala para cualquier video de Leo o "Reto LFX".
---

# Reels LFX con motion graphics

Kit reutilizable en `leo-videos/_kit/`. Primer video hecho con él: `leo-videos/reto-lfx-01/` (versión final `reto-lfx-01-v6.mp4`). Segundo: `leo-videos/reto-poi/` (reto sobre gráfica estilo TradingView, código en `src/`).
No rehagas los componentes: copia el kit y cambia guion, tiempos y escenas.

## Preferencias del cliente (Leo)
- Formato 1080×1920, 30 fps, MP4. Volumen −14/−15 LUFS, pico < −1 dBTP.
- Colores: negro, gris, blanco y verde esmeralda (`#2FD39A`). Tipografía Inter Display / Inter.
- Mucho motion graphic y poco texto: palabras que entran cuando se dicen, símbolos animados, cámara viva.
- Cada vez que se nombra algo (alternativa, ejemplo), se muestra una **ilustración concreta y animada**, grande, que luego se reduce y vuela a su tarjeta. Ejemplos con detalle y vida, nada de iconos de línea sueltos.
- Reloj de cuenta atrás con **tic-tac** (5 s completos, sin pistas sobre la respuesta). Le gusta tal como está.
- **Regla de velas**: cada vela abre exactamente en el cierre de la anterior (serie continua). Vale para fondo e infografías.
- Fondo: ciudad/avenida de velas japonesas 3D (`bg3d.js`), reacciona al tic-tac y a los aciertos.
- Personaje Leo (aprobado): estilo **kit vectorial plano** (como los kits de personaje de Freepik), cuerpo completo, sombreado a dos tonos. Archivo `web/leo-flat.js` (el `index.html` lo carga en lugar de `leo.js`). Look de su foto: pelo oscuro con flequillo de lado, sudadera azul marino de media cremallera, cuello rojo de camisa, "LFX" pequeño, pantalón oscuro, zapatillas blancas. Cuerpo musculoso en V pero **proporciones profesionales**: torso largo, brazos que llegan a la cadera (nada de brazos gigantes con cuerpo chico). Al hablar se ven dientes arriba/abajo, lengua y labio; cejas se mueven; ojos se entrecierran al sonreír. Pose "pensar" = brazos cruzados. En escena: encuadre de rodillas arriba, `LEFT {x:225,y:2075,s:1.02}`. Hoja de referencia: `leo-videos/reto-lfx-01/leo-kit-vectorial.jpg`.
- Cierre LFX de 4 s: logo original con halo y destello, "COMUNIDAD GRATUITA LFX" + "Link en mi descripción". **Sin flecha.**
- Respuestas cortas, una sola recomendación, datos concretos (ver preferencias del usuario).

## Formato "reto sobre gráfica" (Reto POI, `leo-videos/reto-poi/src/`)
- Estudio oscuro con la avenida de velas 3D; pantalla grande estilo TradingView (`poi3.js`) con datos de GBPJPY verificados (`gen_poi.py` comprueba que la respuesta correcta lo sea).
- Capa viral (`poi4.js`): gancho "¿A, B o C?" en el primer segundo, Leo en un círculo (abajo a la izquierda) mientras la gráfica ocupa la pantalla, subtítulos palabra a palabra (1-3 palabras, la palabra dicha entra con rebote, clave en azul subrayada + icono), cartel "Pausa y comenta tu letra" en la cuenta atrás, barra de progreso + "RETO LFX #NN", cierre oscuro con logo.
- Animación por tiempo: `poi-video.js` (`renderAt(t)`), tiempos sacados de las palabras de Whisper (nunca a mano). Voz en dos tramos con los 5 s de reloj en medio (`timeline_poi.py`).
- Tipografías probadas (`tipografias.jpg`): Inter Display, Montserrat, Poppins, Anton, Bebas Neue, Archivo Black, Sora, Bricolage Grotesque, Outfit. Se descargan de Google Fonts a `~/.fonts`. El nombre de familia debe coincidir con `fc-list` (p. ej. "Poppins Black", no "Poppins").

## Voz
- ElevenLabs, voz clonada de Leo: **LEOPUPRIME**, `voice_id Gj9upVGwYXkkr7bSsufy`, modelo `eleven_v4`. Generar todo el guion en una sola toma (voz uniforme) con etiquetas `[energetic, friendly]`, `[excited]`, `[warm]`. Coste aprox.: 1.250 créditos por toma de ~80 s.
- Elegir la toma con mejor transcripción (Whisper).
- PROYECTO21 (Higgsfield) tiene 0 créditos: no usarlo para generar; su sandbox (`sandbox_exec`) sí sirve gratis para Whisper:
  `faster_whisper` modelo `small`, `language="es"`, `word_timestamps=True` → `words.json` ([inicio, fin, palabra]).
  Subir archivos al sandbox con `media_upload` + `curl PUT` (cabecera `If-None-Match: *`) + `media_confirm`.

## Flujo
1. Guion: intro, pregunta + opciones leídas ("A: …"), respuesta, cierre. Ajustar duración (con las 3 opciones leídas sale ~1:45).
2. Voz → `audio/voice.wav` (48 kHz mono) y `words.json` con Whisper.
3. `timeline.py`: define los cortes de la toma (`SEG`) y los huecos (5 s de reloj tras cada bloque de opciones). Genera `web/timeline.js` + `audio/voice_track.wav` + envolvente de boca.
4. `web/scene.js`: adaptar `Q` (respuesta correcta, ilustraciones `illus`, etiquetas cortas, palabra a resaltar `hl`, infografía `info`) y textos de intro/resultado.
5. Vista previa: `cd web && node frames.js ../frames 2.5 16 30.7 …` y revisar las imágenes antes de renderizar.
6. Sonido: `python3 sound.py` → `audio/mix.wav` (voz + efectos sintetizados + música lo-fi con ducking). Normalizar en dos pasadas (`loudnorm` con `linear=true`) + `alimiter` con sobremuestreo a 192 kHz.
7. Render: 4 procesos en paralelo, `node render.js ../out/pN.mp4 30 INICIO FIN` (Playwright + Chromium + ffmpeg), concat y mux del audio.
8. Control de calidad: extraer fotogramas del MP4 final y revisarlos. Guardar en `leo-videos/<nombre>/`, commit y push.

## Componentes (archivos en `_kit/web/`)
- `lib.js`: easing, `P`/`tw`/`win`/`kf`, helpers SVG. Todo es función pura de `t`.
- `leo.js`: personaje (`createLeo`, `POSE`: rest, wave, point, pointUp, present, explainR/L, think, cheer, shrug).
- `bg3d.js`: `createCity` (avenida de velas 3D, cuadrícula, niebla; `update(t, {pulse, pump, dark})`).
- `illus.js` / `illus2.js`: ilustraciones animadas `IL.*` (coins, calendar, swarm, trader, company, bank, fund, retail, bankClients), `ilHuman` (persona con brazos y parpadeo), `Whale` (ballena jorobada detallada), `ilCoin`, `ilBank`.
- `scene.js`: `Kinetic` (texto palabra a palabra), `Captions` (subtítulos karaoke en bocadillo), `Card` (tarjeta de opción con revelado), `Clock` (reloj tic-tac), `Hero` (símbolo por pregunta), `Info1/2/3` (infografías: precio + ballena, mercado-océano, barras de volumen, cuenta propia), `Interstitial` (transición con vela gigante), HUD con cinta de cotizaciones, confeti, cámara (temblor, zoom), resultado interactivo (botones 1/3-3/3 con mano), cierre LFX.
- `sound.py`: efectos sintetizados (whoosh, pop, tic/tac, campana, golpe, destellos, monedas, subida) + música.

## Errores ya resueltos (no repetir)
- La pregunta debe caber en 2 líneas (auto-ajuste de tamaño) o la palabra final queda tapada.
- Subtítulos: trozos de ≤ 20 caracteres para que no se salgan del bocadillo, y espacio extra entre palabras (el rebote de la animación las junta).
- Medir texto con el motor SVG (`getComputedTextLength`), no con canvas: el canvas usa otra fuente.
- Elementos de capas globales (transiciones, subtítulos) se actualizan siempre, no solo cuando su escena es visible.
- Higgsedit (skill video-editing de PROYECTO21) no sirve para este estilo: sin pivotes de brazos ni partículas. Usar este kit.
