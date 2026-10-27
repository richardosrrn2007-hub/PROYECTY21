#!/bin/bash
# Espera a los renders, une los trozos y añade el audio normalizado.
cd "$(dirname "$0")"
while pgrep -f "node render.js" >/dev/null; do sleep 5; done
printf "file 'out/p1.mp4'\nfile 'out/p2.mp4'\nfile 'out/p3.mp4'\nfile 'out/p4.mp4'\n" > out/list.txt
ffmpeg -v error -y -f concat -safe 0 -i out/list.txt -c copy out/video.mp4
ffmpeg -v error -y -i out/video.mp4 -i audio/mix.wav -map 0:v -map 1:a -c:v copy \
  -af "loudnorm=I=-14:TP=-1.0:LRA=11" -ar 48000 -c:a aac -b:a 256k -shortest -movflags +faststart out/reto-lfx-01.mp4
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of compact out/reto-lfx-01.mp4
