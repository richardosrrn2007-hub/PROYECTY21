#!/bin/bash
# Entrega: copia vídeo y portada a Descargas y sincroniza el proyecto al repo sin archivos prohibidos.
# Uso: guardar_repo.sh ~/reelN slug nombre_corto      (ej. ~/reel6 experimento-tortugas turtle_reel6)
set -e
[ $# -eq 3 ] || { echo "uso: $0 PROYECTO SLUG NOMBRE"; exit 1; }
P="$1"; SLUG="$2"; N="$3"; REPO=~/PROYECTY/PROYECTY21; D="$REPO/reels/$SLUG"
[ -f "$P/salida/reel.mp4" ] && cp "$P/salida/reel.mp4" ~/Downloads/"$N.mp4"
[ -f "$P/salida/portada.png" ] && cp "$P/salida/portada.png" ~/Downloads/"${N}_portada.png"
mkdir -p "$D"
rsync -a --delete --exclude node_modules --exclude salida --exclude entorno.json --exclude '*.mp4' \
  --exclude 'voz*' --exclude chicken-pie.otf --exclude matcha-world.otf --exclude matcha-style.otf \
  --exclude 'internet-friends*' "$P/" "$D/proyecto/"
[ -f "$P/salida/portada.png" ] && cp "$P/salida/portada.png" "$D/portada.png"
[ -f "$P/salida/hoja.png" ] && cp "$P/salida/hoja.png" "$D/hoja_final.png"
cd "$REPO"
[ "$(git branch --show-current)" = "claude/amazing-hawking-1mlebr" ] || echo "AVISO: no estás en claude/amazing-hawking-1mlebr"
git add "reels/$SLUG"
MALOS=$(git diff --cached --name-only | grep -iE '\.(mp4|mp3|wav|m4a)$|chicken-pie|matcha-|internet-friends' || true)
if [ -n "$MALOS" ]; then git reset -q "reels/$SLUG"; echo "PARADO: archivos prohibidos:"; echo "$MALOS"; exit 1; fi
git diff --cached --stat | tail -3
echo "LISTO: en Descargas ($N) y preparado para commit en reels/$SLUG"
