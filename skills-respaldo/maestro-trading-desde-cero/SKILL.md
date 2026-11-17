---
name: maestro-trading-desde-cero
description: Skill maestra de la serie «Trading desde cero» de Origine. Hace de principio a fin un reel vertical educativo de trading o de historia de los mercados (Soros, tortugas, tulipanes, velas…): guion verificado con fuentes, fotogramas de referencia, voz de Richard, escenas propias en Remotion, render, control de ritmo, portada, repo y kit para publicar. Úsala cuando Richard pida un vídeo o reel nuevo de la serie, o retomar uno a medias.
---

# Maestro · Trading desde cero

Orquesta todo el vídeo. El motor (Remotion, alinear, ritmo, render) es la skill **becario-reels**, que vive en
`~/PROYECTY/PROYECTY21/.claude/skills/becario-reels` (`BECARIO` en los comandos). Esta skill añade lo que la
serie ya decidió: estilo Origine, reglas de Richard, pasos de aprobación y entrega.

`MAESTRO` = la carpeta de este archivo. `REPO` = `~/PROYECTY/PROYECTY21`.

## Reglas fijas (no negociables)

1. Español siempre, también en los mensajes de estado. Frases cortas. Una sola recomendación por decisión.
   Datos con fuente. Sé crítico.
2. **Dos aprobaciones antes de gastar:** guion aprobado → fotogramas de referencia aprobados → solo entonces
   voz y render.
3. **Voz:** la de Richard. Si ElevenLabs (voz JUSU `3FJV5P6lWp5AD8SVqCYw`, `eleven_v4`) falla o el plan no la
   permite, no reintentes: cada llamada cobra. Pide a Richard que la genere él en la web y te pase los MP3.
4. **Repo:** rama `claude/amazing-hawking-1mlebr`. Se sube código, guion, previas y portada. **Nunca .mp4,
   ni voz, ni fuentes de pago** (`chicken-pie.otf`, `matcha-world.otf`, `matcha-style.otf`, `internet-friends*`).
5. Velas encadenadas: cada una abre donde cerró la anterior (`serieVelas` / `continua()`).
6. Sonido: solo en momentos clave, swoosh solo en cambios de capítulo, kenney CC0. Nada de música con
   copyright dentro del render (si Richard quiere una canción, se pone al publicar desde la app).
7. Nada quieto más de 0,6 s (`ritmo.py` lo mide). Duración objetivo ≤ 60 s.
8. Gasta pocos créditos y tokens: fotos sueltas antes que vídeos, un render final, sin regenerar voz.
9. Ponytail apagado. Las skills guionista-reels, montador-* y crecer-en-instagram solo si Richard las nombra.

## Flujo (copia la lista y ve marcando)

```
- [ ] 1. Tema y guion con fuentes  → APROBACIÓN 1
- [ ] 2. Proyecto nuevo copiado del último episodio
- [ ] 3. plan.json + escenas propias del episodio
- [ ] 4. Fotogramas de referencia con tiempos provisionales → APROBACIÓN 2
- [ ] 5. Texto para la voz → Richard pasa el/los MP3
- [ ] 6. Unir voz, alinear, hoja de contacto con tiempos reales
- [ ] 7. Render + ritmo.py sin huecos + portada propia del episodio
- [ ] 8. Repo (commit/push) + entrega en Descargas + kit para publicar
```

### 1. Guion
Lee `MAESTRO/references/guion.md`. 8–12 frases, ~150 palabras. Comprueba cada dato (Wikipedia + una fuente
más) y enseña al lado una lista de **correcciones** sobre lo que trajo Richard. Guárdalo en
`REPO/reels/<slug>/GUION.md` (tabla voz | tarjeta EN, correcciones, fuentes). Espera «apruebo».

### 2. Proyecto
```bash
bash MAESTRO/scripts/nuevo_episodio.sh ~/reel5 ~/reel7      # copia el último episodio con node_modules
```
Usa `rsync`, no `cp -R` (se dejaba paquetes como `@remotion/three`).

### 3. Plan y escenas
Lee `MAESTRO/references/mundo-visual.md`. Cada episodio tiene **su mundo** (paleta, fondo, objeto
protagonista) dentro del estilo Origine, en un archivo nuevo `src/propias/<Episodio>.tsx`, registrado en
`src/propias/index.ts`, con escenas `{"tipo":"propia","nombre":X,"en":[palabras]}`. Reutiliza piezas de
`Soros.tsx` y `Tortugas.tsx` antes de dibujar otras. Cambia el fondo en `src/Reel.tsx`.
Reescribe **también** `src/propias/PortadaPropia.tsx` (si no, sale la portada del episodio anterior).

### 4. Fotogramas de referencia
```bash
cd ~/reelN && python3 BECARIO/scripts/alinear.py --sin-voz --ppm 158 --proyecto ~/reelN
cd ~/reelN && node render.mjs resumen && node render.mjs foto 1 9 20 …   # 1 foto por escena
```
Monta las fotos en una o dos hojas (`ffmpeg … hstack`) y mándalas con SendUserFile. Espera aprobación.

### 5–6. Voz
Pasa el texto de `plan.json` (`voz` con números escritos en letra). Cuando llegue el audio (puede venir en
varias partes y con nombres raros: compruébalo con `file`):
```bash
bash MAESTRO/scripts/unir_voz.sh ~/reelN parte1.mp3 parte2.mp3 …   # une, recorta silencios, ajusta a ≤ 58 s, -14 LUFS
cd ~/reelN && python3 BECARIO/scripts/alinear.py public/voz.mp3 --proyecto ~/reelN
cd ~/reelN && node render.mjs resumen && node render.mjs fotos
```
Mira la hoja entera (`salida/hoja.png`). Si el tempo pasa de 1,25× avisa a Richard: mejor quitar una frase.

### 7. Render
```bash
cd ~/reelN && node render.mjs video     # en segundo plano; si dice PARCIAL, relanzar
cd ~/reelN && python3 BECARIO/scripts/ritmo.py salida/reel.mp4 --tiempos src/datos/tiempos.json
cd ~/reelN && node render.mjs portada
```
Cada hueco que marque `ritmo.py`: haz que algo entre o cambie en ese tramo (cinta, contador más largo,
elementos escalonados, chispas). Comprueba con `node render.mjs foto <s>` y vuelve a renderizar.
**Mira la portada** antes de entregarla.

### 8. Entrega
```bash
bash MAESTRO/scripts/guardar_repo.sh ~/reelN <slug> <nombre_corto>
```
Copia vídeo y portada a `~/Downloads/<nombre_corto>.mp4` / `_portada.png`, sincroniza el proyecto al repo sin
archivos prohibidos y deja todo en `git add`. Luego commit (con la línea Co-Authored-By que toque) y push.
Manda vídeo y portada con SendUserFile y el kit de `MAESTRO/references/entrega.md`.
Actualiza `REPO/reels/CONTINUAR.md` (vídeos hechos y el siguiente prometido).

## Si algo falla
`MAESTRO/references/errores.md` recoge los fallos ya vistos y su arreglo. Míralo antes de improvisar.
