#!/bin/bash
# Une los trozos del render, normaliza el audio (2 pasadas + limitador) y crea el MP4 final: final.sh salida.mp4
set -e
cd "$(dirname "$0")"
printf "file 'p0.mp4'\nfile 'p1.mp4'\nfile 'p2.mp4'\nfile 'p3.mp4'\n" > out/list.txt
ffmpeg -v error -y -f concat -safe 0 -i out/list.txt -c copy out/video.mp4
J=$(ffmpeg -hide_banner -i audio/mix.wav -af loudnorm=I=-15:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
mi=$(echo "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);print(f\"measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}\")")
ffmpeg -v error -y -i audio/mix.wav -af "loudnorm=I=-15:TP=-1.5:LRA=11:$mi:linear=true,aresample=192000,alimiter=limit=0.84:level=false,aresample=48000" audio/mix_final.wav
ffmpeg -v error -y -i out/video.mp4 -i audio/mix_final.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart "$1"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$1"
ffmpeg -hide_banner -i "$1" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)"
