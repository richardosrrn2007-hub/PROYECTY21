const { chromium } = require('playwright'); const fs=require('fs'), path=require('path');
(async()=>{ const [dir,out]=process.argv.slice(2); fs.mkdirSync(out,{recursive:true});
 const b=await chromium.launch(); const pg=await b.newPage({viewport:{width:600,height:720}});
 for (const f of fs.readdirSync(dir).filter(f=>f.endsWith('.svg'))){
  await pg.setContent(`<html><body style="margin:0;background:transparent">${fs.readFileSync(path.join(dir,f),'utf8')}</body></html>`);
  await pg.screenshot({path:path.join(out,f.replace('.svg','.png')),omitBackground:true,clip:{x:0,y:0,width:600,height:720}});
 } await b.close(); })();
