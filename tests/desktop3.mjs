import {_electron as electron} from '@playwright/test';
import assert from 'node:assert/strict';
import path from 'node:path';
const packaged=process.argv.includes('--packaged');
const app=await electron.launch(packaged?{executablePath:path.resolve('release-desktop/win-unpacked/Desktop Temple.exe'),args:['--user-data-dir='+path.resolve('tests/.desktop3-packaged-profile')]}:{args:['.','--user-data-dir='+path.resolve('tests/.desktop3-profile')]});
let closed=false;
try{const page=await app.firstWindow();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.locator('canvas').waitFor();await page.waitForTimeout(600);
assert.equal(await page.locator('header,footer,aside').count(),0);assert.equal(await page.locator('button').count(),2);
const state=await app.evaluate(async({BrowserWindow})=>{const w=BrowserWindow.getAllWindows()[0];const image=await w.webContents.capturePage(),data=image.toBitmap();let clear=0;for(let i=3;i<data.length;i+=4)if(data[i]===0)clear++;return{top:w.isAlwaysOnTop(),focusable:w.isFocusable(),width:w.getBounds().width,clear:clear/(data.length/4)};});assert.equal(state.top,false);assert.equal(state.focusable,false);assert.ok(Math.abs(state.width-340)<=4);assert.ok(state.clear>.25);
await page.evaluate(()=>{localStorage.setItem('temple-view','0');});await page.reload();await page.locator('#view').waitFor();await page.screenshot({path:'tests/desktop-front.png',omitBackground:true});await page.locator('#view').click();assert.equal(await page.evaluate(()=>localStorage.getItem('temple-view')),'1');await page.screenshot({path:'tests/desktop-angle.png',omitBackground:true});await page.locator('#view').click();await page.locator('#view').click();assert.equal(await page.evaluate(()=>localStorage.getItem('temple-view')),'0');
// A normal application window must precede the temple in native Windows z-order.
const handles=await app.evaluate(async({BrowserWindow})=>{const temple=BrowserWindow.getAllWindows()[0];const blocker=new BrowserWindow({width:100,height:100,show:false});await blocker.loadURL('data:text/html,<body>Stacking test</body>');blocker.show();await new Promise(r=>setTimeout(r,900));return {temple:String(temple.getNativeWindowHandle().readBigUInt64LE()),blocker:String(blocker.getNativeWindowHandle().readBigUInt64LE())};});
const {default:k}=await import('koffi');const get=k.load('user32.dll').func('uintptr_t __stdcall GetWindow(uintptr_t hwnd, uint32_t command)');let nativeHandle=BigInt(handles.temple),behind=false;for(let i=0;i<10000;i++){nativeHandle=get(nativeHandle,3);if(!nativeHandle)break;if(BigInt(nativeHandle)===BigInt(handles.blocker)){behind=true;break;}}if(!behind){const root=k.load('user32.dll').func('uintptr_t __stdcall GetAncestor(uintptr_t hwnd, uint32_t flags)');console.log('handles',handles,'roots',root(BigInt(handles.temple),2),root(BigInt(handles.blocker),2),'prev',get(BigInt(handles.temple),3),'next',get(BigInt(handles.temple),2));}assert.equal(behind,true);await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows().find(w=>w.webContents.getURL().startsWith('data:')).destroy());
assert.deepEqual(errors,[]);const exit=new Promise(resolve=>app.process().once('exit',resolve));await page.locator('#close').click();await Promise.race([exit,new Promise((_,reject)=>setTimeout(()=>reject(Error('Close control did not exit')),30000))]);closed=true;console.log('PASS: transparent compact window, front/angled view switch, desktop z-order below another app, integrated close exits.');console.log(state);
}finally{if(!closed)await app.close();}







