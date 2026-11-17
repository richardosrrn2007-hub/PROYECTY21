# Fallos ya vistos

| Síntoma | Causa | Arreglo |
|---|---|---|
| ElevenLabs: «Instantly cloned voices are not available on your current plan» | El plan no permite JUSU | No reintentar. Richard genera la voz en la web y pasa los MP3. |
| Un audio llega como `example.com` u otro nombre raro | Descarga renombrada | `file archivo` → si dice MPEG/MP3, úsalo. Pregunta el orden si no es obvio. |
| `ffprobe: command not found` | No está instalado | Usa `ffmpeg -i archivo 2>&1 \| grep Duration` (`~/.local/bin/ffmpeg`). |
| Falta `@remotion/three` tras copiar | `cp -R` incompleto | `rsync -a viejo/node_modules/ nuevo/node_modules/`. |
| La portada sale del episodio anterior | `PortadaPropia.tsx` no se reescribió | Reescribirla y mirar `salida/portada.png` antes de entregar. |
| Vídeo > 60 s | Voz larga + 2 s de logo | Subir tempo hasta 1,25× como mucho; si no basta, quitar una frase. |
| `ritmo.py` marca huecos | Tramos sin entradas | Ver mundo-visual.md → «Para rellenar huecos». |
| Errores de tsc en `Tipos.tsx` | Previos, no afectan | Fíate de `node render.mjs resumen`. |
| Avisos «Multiple instances of Three.js» | Ruido de Remotion | Ignorar. |
