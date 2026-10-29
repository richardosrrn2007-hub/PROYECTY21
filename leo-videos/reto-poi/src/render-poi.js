// node render.js out.mp4 fps start end  -> vídeo sin audio de [start, end)
const { chromium } = require('playwright'); const path = require('path'); const { spawn } = require('child_process');
(async () => {
  const [out, fpsS, s0, s1] = process.argv.slice(2); const fps = +fpsS;
  const f0 = Math.round(+s0 * fps), f1 = Math.round(+s1 * fps);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.error('PAGEERR', e.message));
  await p.goto('file://' + path.resolve('index-poi.html'));
  await p.waitForFunction(() => window.READY, null, { timeout: 30000 });
  for (let f = f0; f < f1; f++) {
    await p.evaluate(t => renderAt(t), f / fps);
    const buf = await p.screenshot({ type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - f0) % 150 === 0) console.log(out, f - f0, '/', f1 - f0);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
})();
