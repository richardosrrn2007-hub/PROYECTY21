# Reel "Comprar tarde" (Leo)

- Guion: la grabación de Leo (`video_1080p_menos_30MB.mp4`). Voz: **su voz real** sacada de esa grabación
  (la voz clonada LEOPUPRIME falló: el plan de ElevenLabs ya no permite voces clonadas). Limpieza: filtro, reducción de ruido,
  compresión; frase repetida fuera, silencios largos acortados, +7 % de ritmo (`src/timeline_ent.py`). Cuenta atrás de 3 s.
- Gráfica: **datos reales EURUSD 4h** (Yahoo, contado, 31 ene – 7 mar 2025), elegidos con `src/find_fx.py` y verificados en
  `src/ent_data.py`: estructura L→H→HL→HH, compra tardía con stop bajo un mínimo pequeño que salta, toque de la base que coincide
  con el 70,5–79 % del Fibonacci, entrada en 1,03649 llenada, TP en el máximo previo alcanzado, stop correcto intacto.
  Los futuros del oro (GC=F) se descartaron por los saltos de cambio de contrato.
- Escenario "si se va sin tocar mi entrada": velas azules semitransparentes, ilustrativas.
- Motor: `src/poi3…poi8.js` + `src/ent-video.js` (`renderAt(t)`), `render-ent.js` (4 procesos), `sound_ent.py`, `final.sh`.

## Versiones
- `leo-comprar-tarde-sin-musica.mp4`: igual, sin música de fondo (solo voz y efectos).
- Versión con cámara (`index-cam.html`, `window.CAM`): la grabación real de Leo arriba (recorte a la cara, 1080×700),
  sincronizada con los mismos cortes y velocidad de la voz (`src/cam_map.py` → `cam-map.js`), la gráfica a pantalla completa debajo,
  títulos y pasos como rótulo en la parte baja de la cámara. Los fotogramas se extraen a `web/cam/` con ffmpeg (no se guardan en el repo).
- Versión "estilo referencia" (`src/ref-scene.js`, `index-ref.html`): tarjeta redondeada con la cámara de Leo y subtítulos de 1–2 palabras,
  lienzo gris claro con gráfica minimalista (velas verdes/rojas), botones 3D con mano, "?" 3D, Máx/Mín, caja TP azul / SL roja,
  campo de comentario "ZONAS". Inicio con pantalla estilo MT5: compra en el máximo, salta el stop (−502,13 USD con 1 lote) y el saldo cae.
- v3 corta (~70 s, `src/ref3.js`, `timeline_v3.py`, `sound_v3.py`): gancho de 1 s con "STOP LOSS −502,13 USD" en grande,
  frases repetidas fuera (sin "déjame mostrarte…", "por eso yo no solamente compro…", "dentro de este movimiento", etc.),
  voz +12 %, pausas más cortas, y zoom de la gráfica a la vela que saca el stop.
- v4: inicio como MT5 real en el móvil (marco iPhone, barra de estado, pestañas Gráfico/Historial, notificación de iOS
  "Stop loss activado", historial con −502.00 y balance 9 498.00; la operación son las velas reales de EURUSD).
  Voz con más presencia (EQ 250 Hz −3 dB, 3,2 kHz +4 dB, compresión 4:1), efectos que se apartan cuando habla,
  máster a −11 LUFS (`final_v4.sh`, `sound_v4.py`).
