const { chromium } = require('playwright'); const path = require('path');
const FONTS = ["Inter Display","Montserrat","Poppins Black","Anton","Bebas Neue","Archivo Black","Sora","Bricolage Grotesque","Outfit"];
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
 for (const [i,f] of FONTS.entries()) {
  await p.addInitScript(f => { window.FONT_OVERRIDE = f; }, f);
  await p.goto('file://' + path.resolve('poi4-board.html')); await p.waitForFunction(() => window.READY, null, {timeout:20000});
  await p.evaluate(f => document.fonts.load(`900 64px "${f}"`), f);
  for (const n of ['count','history']) { await p.evaluate(n => renderState(STATES[n]), n); await p.screenshot({ path: `../poi/font_${i}_${n}.png` }); }
 }
 await b.close(); })();
