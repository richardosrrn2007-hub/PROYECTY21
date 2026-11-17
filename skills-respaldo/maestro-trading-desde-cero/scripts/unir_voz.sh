#!/bin/bash
# Une las partes de la voz en orden, recorta silencios, ajusta el tempo para que quepa y normaliza a -14 LUFS.
# Uso: unir_voz.sh ~/reelN parte1.mp3 [parte2.mp3 …]      (OBJETIVO=58 por defecto, en segundos de voz)
set -e
P="$1"; shift
[ $# -ge 1 ] || { echo "uso: $0 PROYECTO parte1.mp3 [parte2.mp3 …]"; exit 1; }
FF=$(command -v ffmpeg || echo ~/.local/bin/ffmpeg)
OBJ=${OBJETIVO:-58}
T=$(mktemp -d)
ins=(); f=""; i=0
for a in "$@"; do cp "$a" "$T/p$i.mp3"; ins+=(-i "$T/p$i.mp3"); f="$f[$i:a]"; i=$((i+1)); done
CORTE="concat=n=$i:v=0:a=1,silenceremove=stop_periods=-1:stop_duration=0.2:stop_threshold=-40dB"
"$FF" -y -v error "${ins[@]}" -filter_complex "$f$CORTE" "$T/base.wav"
DUR=$("$FF" -i "$T/base.wav" 2>&1 | sed -n 's/.*Duration: \([0-9:.]*\).*/\1/p' | awk -F: '{print $1*3600+$2*60+$3}')
TEMPO=$(python3 -c "print(round(max(1.15, $DUR/$OBJ), 3))")
"$FF" -y -v error -i "$T/base.wav" -af "atempo=$TEMPO,loudnorm=I=-14:TP=-1.5:LRA=11" -ar 44100 -b:a 192k "$P/public/voz.mp3"
FIN=$("$FF" -i "$P/public/voz.mp3" 2>&1 | sed -n 's/.*Duration: \([0-9:.]*\).*/\1/p')
echo "voz sin recortar: ${DUR}s · tempo ${TEMPO}× · final $FIN → $P/public/voz.mp3"
python3 -c "import sys; sys.exit(0 if $TEMPO <= 1.25 else 1)" || echo "AVISO: tempo > 1,25×, suena apurada. Mejor quitar una frase."
rm -rf "$T"
