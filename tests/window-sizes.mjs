import {_electron as electron} from '@playwright/test';
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const profile=path.resolve('tests/.ritual-profile');fs.writeFileSync(path.join(profile,'startup.json'),JSON.stringify({enabled:false}));
const app=await electron.launch({args:['.','--temple-test','--user-data-dir='+profile]});
try{const page=await app.firstWindow();await page.emulateMedia({reducedMotion:'reduce'});await page.locator('canvas').waitFor();
for(const size of [280,340,420]){
 await app.evaluate(({BrowserWindow},size)=>BrowserWindow.getAllWindows()[0].setBounds({width:size,height:Math.round(size*1.08)}),size);await page.waitForTimeout(300);
 const frame=JSON.parse(await page.locator('main').getAttribute('data-interior-frame'));assert.ok(frame.width<.98&&frame.height<.98);
 await page.evaluate(()=>{const c=document.querySelector('canvas');for(let y=innerHeight*.65;y<innerHeight;y+=2)for(let x=innerWidth*.3;x<innerWidth*.7;x+=2){c.dispatchEvent(new PointerEvent('pointermove',{clientX:x,clientY:y}));if(c.classList.contains('over-stairs')){c.dispatchEvent(new MouseEvent('dblclick',{clientX:x,clientY:y}));return;}}});
 await page.waitForFunction(()=>document.querySelector('main').dataset.mode==='inside');await page.waitForTimeout(250);
 assert.deepEqual(JSON.parse(await page.locator('main').getAttribute('data-interior-frame')),frame);
 await page.screenshot({path:`tests/size-${size}.png`,omitBackground:true});
 // Turn right toward the perforated side screen; inspect alpha inside the viewport.
 await page.evaluate(()=>{const c=document.querySelector('canvas'),x=innerWidth*.45,y=innerHeight*.45;c.dispatchEvent(new PointerEvent('pointerdown',{button:0,pointerId:1,clientX:x,clientY:y,screenX:x,screenY:y}));c.dispatchEvent(new PointerEvent('pointermove',{pointerId:1,clientX:x+250,clientY:y,screenX:x+250,screenY:y}));c.dispatchEvent(new PointerEvent('pointerup',{button:0,pointerId:1,clientX:x+250,clientY:y}));});
 await page.waitForTimeout(250);await page.screenshot({path:`tests/window-${size}.png`,omitBackground:true});
 const alpha=await app.evaluate(async({BrowserWindow},frame)=>{const im=await BrowserWindow.getAllWindows()[0].webContents.capturePage(),b=im.toBitmap(),{width:w,height:h}=im.getSize();let holes=0,n=0;for(let y=Math.ceil((frame.y+frame.height*.2)*h);y<(frame.y+frame.height*.7)*h;y++)for(let x=Math.ceil((frame.x+frame.width*.15)*w);x<(frame.x+frame.width*.85)*w;x++){n++;if(b[(y*w+x)*4+3]===0)holes++;}return holes/n;},frame);assert.ok(alpha>.02,`See-through window at ${size}: ${alpha}`);
 await page.evaluate(()=>document.querySelector('#view').click());await page.waitForTimeout(1000);console.log(`PASS ${size}: matched footprint, transparent side windows (${Math.round(alpha*100)}%)`);
}
}finally{await app.close();}
