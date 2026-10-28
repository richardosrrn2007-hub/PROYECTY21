// node frames.js out_dir t1 t2 ...  -> PNG de cada tiempo
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const [out, ...ts] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + path.resolve('index.html'));
  await p.waitForFunction(() => window.READY || window.ERR || false, null, { timeout: 20000 }).catch(() => {});
  if (errs.length) console.log('ERRORS', errs);
  for (const t of ts) { await p.evaluate(t => renderAt(t), +t); await p.screenshot({ path: `${out}/f_${t}.png` }); }
  await b.close();
})();
