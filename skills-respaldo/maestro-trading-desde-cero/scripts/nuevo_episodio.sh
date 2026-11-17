#!/bin/bash
# Copia el proyecto de un episodio anterior a una carpeta nueva, sin salidas ni voz.
# Uso: nuevo_episodio.sh ~/reel6 ~/reel7
set -e
[ $# -eq 2 ] || { echo "uso: $0 ORIGEN DESTINO"; exit 1; }
[ -e "$2" ] && { echo "ya existe $2: elige otra carpeta"; exit 1; }
rsync -a --exclude salida --exclude 'public/voz*' "$1/" "$2/"
mkdir -p "$2/salida"
echo "LISTO: $2 (copiado de $1). Ahora: plan.json, src/propias/<Episodio>.tsx, index.ts, Reel.tsx y PortadaPropia.tsx."
