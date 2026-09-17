import {_electron as electron} from '@playwright/test';
import assert from 'node:assert/strict';
import path from 'node:path';
const packaged=process.argv.includes('--packaged');
const app=await electron.launch(packaged?{executablePath:path.resolve('release-overlay/win-unpacked/Desktop Temple.exe'),args:['--user-data-dir='+path.resolve('tests/.overlay-packaged-profile')]}:{args:['.','--user-data-dir='+path.resolve('tests/.overlay-profile')]});
try {
const page=await app.firstWindow();await page.locator('canvas').waitFor();await page.waitForTimeout(800);
assert.equal(await page.locator('button,header,footer,aside').count(),0);
assert.equal(await page.evaluate(()=>getComputedStyle(document.body).backgroundColor),'rgba(0, 0, 0, 0)');
const result=await app.evaluate(async({BrowserWindow,screen})=>{const win=BrowserWindow.getAllWindows()[0];const shot=await win.webContents.capturePage();const data=shot.toBitmap();let clear=0,solid=0;for(let i=3;i<data.length;i+=4){if(data[i]===0)clear++;if(data[i]===255)solid++;}const b=win.getBounds(),work=screen.getPrimaryDisplay().workArea;return{clear,solid,pixels:data.length/4,background:win.getBackgroundColor(),resizable:win.isResizable(),alwaysOnTop:win.isAlwaysOnTop(),rightGap:work.x+work.width-b.x-b.width,bottomGap:work.y+work.height-b.y-b.height};});
assert.ok(result.clear/result.pixels>.25,JSON.stringify(result));assert.ok(result.solid/result.pixels>.15,JSON.stringify(result));assert.equal(result.resizable,false);assert.equal(result.alwaysOnTop,true);assert.equal(result.rightGap,12);assert.ok(result.bottomGap>=0&&result.bottomGap<=16);
await page.screenshot({path:'tests/overlay.png',omitBackground:true});
// Observe native pass-through calls while driving the same cursor messages used in production.
await app.evaluate(({BrowserWindow})=>{const w=BrowserWindow.getAllWindows()[0];w._testIgnore=[];const original=w.setIgnoreMouseEvents.bind(w);w.setIgnoreMouseEvents=(v,o)=>{w._testIgnore.push(v);return original(v,o);};w.webContents.send('temple:cursor',{x:.5,y:.6});});
await page.waitForTimeout(100);
await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].webContents.send('temple:cursor',{x:0,y:0}));await page.waitForTimeout(100);
const toggles=await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0]._testIgnore);assert.ok(toggles.includes(false),JSON.stringify(toggles));assert.ok(toggles.includes(true),JSON.stringify(toggles));
console.log('PASS: native transparent pixels, visible temple, no app chrome, lower-right placement, always-on-top and hit-tested click-through.');console.log(JSON.stringify(result));
}finally{await app.close();}

