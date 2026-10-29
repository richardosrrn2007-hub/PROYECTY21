const { chromium } = require('playwright'); const path = require('path');
(async () => { const [out, ...ts] = process.argv.slice(2);
 const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
 p.on('pageerror', e => console.log('ERR', e.message));
 await p.goto('file://' + path.resolve('index-poi.html')); await p.waitForFunction(() => window.READY, null, {timeout:20000});
 for (const t of ts) { await p.evaluate(t => renderAt(t), +t); await p.screenshot({ path: `${out}/f_${t}.png` }); }
 await b.close(); })();
