const { chromium } = require('playwright'); const path = require('path');
(async () => { const [out, ...names] = process.argv.slice(2);
 const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
 const errs=[]; p.on('pageerror', e => errs.push(e.message));
 await p.goto('file://' + path.resolve('poi-board.html')); await p.waitForFunction(() => window.READY, null, {timeout:20000}).catch(()=>{});
 if (errs.length) console.log('ERR', errs);
 for (const n of names) { await p.evaluate(n => renderState(STATES[n]), n); await p.screenshot({ path: `${out}/poi_${n}.png` }); }
 await b.close(); })();
