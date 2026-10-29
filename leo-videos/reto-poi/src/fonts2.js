const { chromium } = require('playwright'); const path = require('path');
const FONTS = ["Montserrat","Anton","Archivo Black","Bricolage Grotesque","Poppins Black","Outfit"];
(async () => { const b = await chromium.launch();
 for (const [i,f] of FONTS.entries()) { const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.resolve('index-poi.html') + '?font=' + encodeURIComponent(f)); await p.waitForFunction(() => window.READY, null, {timeout:20000});
  for (const t of [27.9, 33.2]) { await p.evaluate(t => renderAt(t), t); await p.screenshot({ path: `../../poiv/frames/ff_${i}_${t}.png` }); }
  await p.close(); }
 await b.close(); })();
