// Desktop-level z-order on Windows without reparenting Chromium into Explorer.
// Only this application's HWND is changed; other windows and wallpaper are untouched.
module.exports=function desktopLayer(win){
if(process.platform!=='win32')return {lower:()=>{},desktopActive:()=>false};
const koffi=require('koffi'),user32=koffi.load('user32.dll');
const setPos=user32.func('bool __stdcall SetWindowPos(uintptr_t hwnd, uintptr_t after, int x, int y, int width, int height, uint32_t flags)');
const foreground=user32.func('uintptr_t __stdcall GetForegroundWindow()');
const className=user32.func('int __stdcall GetClassNameA(uintptr_t hwnd, _Out_ uint8_t *name, int count)');
const handle=win.getNativeWindowHandle();const hwnd=handle.length===8?handle.readBigUInt64LE():BigInt(handle.readUInt32LE());
return {lower(){if(!win.isDestroyed())setPos(hwnd,1,0,0,0,0,0x13);},desktopActive(){const name=Buffer.alloc(128);className(foreground(),name,128);return /^(Progman|WorkerW)$/.test(name.toString('utf8').replace(/\0.*$/s,''));}};
};
