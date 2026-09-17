const {app,BrowserWindow,ipcMain,screen,Menu,Tray,nativeImage,powerMonitor,shell}=require('electron');
const path=require('node:path');
let win,tray,pointerTimer,drag=null,ignore=true,size=340,quitting=false,layer=null,layerTimer=null,userHidden=false,startup=null,prefs=null,saveTimer=null,paused=false,setup=null,onboarding=null;
function homeBounds(){const {x,y,width,height}=screen.getPrimaryDisplay().workArea;const w=Math.min(size,width-24),h=Math.min(Math.round(size*1.08),height-24);return {x:x+width-w-12,y:y+height-h-8,width:w,height:h};}
function saveWindow(){if(win&&!win.isDestroyed()&&prefs){const {x,y}=win.getBounds();prefs.save({size,position:{x,y}});}}
function persistSoon(){clearTimeout(saveTimer);saveTimer=setTimeout(saveWindow,250);}
function repairBounds(){drag=null;win.setBounds(prefs.bounds(screen.getAllDisplays()));persistSoon();}
function activity(value){paused=!value;if(win&&!win.isDestroyed())win.webContents.send('temple:activity',value);}
function hide(){userHidden=true;drag=null;win.hide();activity(false);}
function shortcut(){if(process.platform!=='win32'||!app.isPackaged||process.argv.includes('--temple-test'))return;const target=process.env.PORTABLE_EXECUTABLE_FILE||process.execPath;const icon=path.join(app.getPath('userData'),'temple.ico');require('node:fs').copyFileSync(path.join(__dirname,'../assets/temple.ico'),icon);return shell.writeShortcutLink(path.join(app.getPath('desktop'),'Desktop Temple.lnk'),'create',{target,icon,iconIndex:0,description:'Open your desktop temple',appUserModelId:'studio.desktoptemple.app'});}
function needsSetup(){return !setup.get().complete&&(!process.argv.includes('--temple-test')||process.argv.includes('--test-onboarding'));}
function loadTemple(){return win.loadFile(path.join(__dirname,'../dist/index.html'),{query:{layout:setup.get().layout}});}
function openSetup(){if(onboarding&&!onboarding.isDestroyed()){onboarding.show();onboarding.focus();return;}if(win){win.hide();activity(false);}const area=screen.getPrimaryDisplay().workArea;onboarding=new BrowserWindow({width:Math.min(760,area.width-32),height:Math.min(830,area.height-32),title:'Welcome to Desktop Temple',backgroundColor:'#f8f5ec',icon:path.join(__dirname,'../assets/temple.png'),autoHideMenuBar:true,resizable:true,webPreferences:{preload:path.join(__dirname,'onboarding-preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true}});onboarding.webContents.setWindowOpenHandler(()=>({action:'deny'}));onboarding.webContents.on('will-navigate',e=>e.preventDefault());onboarding.loadFile(path.join(__dirname,'../dist/onboarding.html'));onboarding.on('closed',()=>{onboarding=null;if(setup.get().complete)show();else app.quit();});}
function show(){if(needsSetup()){openSetup();return;}if(onboarding&&!onboarding.isDestroyed())return;userHidden=false;activity(true);win.showInactive();win.setAlwaysOnTop(false);layer?.lower();}
function reset(){drag=null;win.setBounds(homeBounds());persistSoon();show();}
function menu(){return Menu.buildFromTemplate([{label:'Desktop Temple',enabled:false},{type:'separator'},{label:win.isVisible()?'Hide temple':'Show temple',click:()=>{if(win.isVisible()){hide();}else show();}},{label:'Choose temple design…',click:openSetup},{label:'Temple size',submenu:[280,340,420].map((value,i)=>({label:['Small','Medium','Large'][i],type:'radio',checked:size===value,click:()=>{size=value;reset();}}))},{label:'Open with Windows + daily darshan',type:'checkbox',checked:startup?.enabled()??true,click:item=>startup.setEnabled(item.checked)},{label:'Create desktop shortcut',visible:process.platform==='win32',click:shortcut},{label:'Return to bottom-right',click:reset},{type:'separator'},{label:'Quit Desktop Temple',click:()=>app.quit()}]);}
function setIgnore(value){if(ignore===value)return;ignore=value;win.setIgnoreMouseEvents(value,{forward:true});}
function trayIcon(){return nativeImage.createFromPath(path.join(__dirname,'../assets/temple.png')).resize({width:32,height:32});}

if(!app.requestSingleInstanceLock())app.quit();else{
app.on('second-instance',()=>{if(win)show();});
app.whenReady().then(()=>{setup=require('./setup.cjs')(app);startup=require('./startup.cjs')(app);prefs=require('./preferences.cjs')(app);size=prefs.get().size;if(process.platform==='win32')app.setAppUserModelId('studio.desktoptemple.app');
win=new BrowserWindow({...prefs.bounds(screen.getAllDisplays()),icon:path.join(__dirname,'../assets/temple.png'),frame:false,transparent:true,backgroundColor:'#00000000',hasShadow:false,resizable:false,maximizable:false,fullscreenable:false,show:false,skipTaskbar:true,alwaysOnTop:false,focusable:false,webPreferences:{backgroundThrottling:false,preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true}});
layer=require('./desktop-layer.cjs')(win);layerTimer=setInterval(()=>{if(!win||win.isDestroyed()||paused)return;if(!userHidden&&layer.desktopActive()&&!win.isVisible())show();if(win.isVisible())layer.lower();},400);win.setIgnoreMouseEvents(true,{forward:true});
loadTemple();
win.once('ready-to-show',()=>{show();if(!require('node:fs').existsSync(path.join(app.getPath('desktop'),'Desktop Temple.lnk')))shortcut();});win.on('move',persistSoon);win.on('resize',persistSoon);win.webContents.setVisualZoomLevelLimits(1,1);win.webContents.on('before-input-event',(event,input)=>{if((input.control||input.meta)&&['+','-','=','0'].includes(input.key))event.preventDefault();});
win.webContents.setWindowOpenHandler(()=>({action:'deny'}));win.webContents.on('will-navigate',e=>e.preventDefault());
tray=new Tray(trayIcon());tray.setToolTip('Desktop Temple · right-click for options');tray.on('click',()=>{show();});tray.on('right-click',()=>tray.popUpContextMenu(menu()));
ipcMain.handle('setup:get',event=>{if(event.sender!==onboarding?.webContents)throw Error('Invalid sender');return setup.get();});
ipcMain.handle('setup:login',(event,name)=>{if(event.sender!==onboarding?.webContents)throw Error('Invalid sender');return setup.login(name);});
ipcMain.handle('setup:complete',async(event,layout)=>{if(event.sender!==onboarding?.webContents)throw Error('Invalid sender');setup.complete(layout);await loadTemple();setTimeout(()=>{onboarding?.close();show();},100);return true;});
ipcMain.handle('temple:daily-entry',event=>event.sender===win.webContents&&!needsSetup()&&startup.claim());
ipcMain.on('temple:quit',event=>{if(event.sender===win.webContents)hide();});
ipcMain.on('temple:hover',(event,hit)=>{if(event.sender===win.webContents&&!drag)setIgnore(!hit);});
ipcMain.on('temple:menu',event=>{if(event.sender===win.webContents)menu().popup({window:win});});
ipcMain.on('temple:drag-start',event=>{if(event.sender!==win.webContents)return;drag={cursor:screen.getCursorScreenPoint(),bounds:win.getBounds()};setIgnore(false);});
ipcMain.on('temple:drag-end',()=>{drag=null;});
// Poll the native cursor so transparent margins can always recover hover after click-through.
pointerTimer=setInterval(()=>{if(!win||win.isDestroyed()||!win.isVisible()||paused)return;const cursor=screen.getCursorScreenPoint();if(drag){const x=Math.round(drag.bounds.x+cursor.x-drag.cursor.x),y=Math.round(drag.bounds.y+cursor.y-drag.cursor.y);win.setPosition(x,y);return;}const b=win.getBounds();if(cursor.x<b.x||cursor.y<b.y||cursor.x>b.x+b.width||cursor.y>b.y+b.height){setIgnore(true);return;}win.webContents.send('temple:cursor',{x:(cursor.x-b.x)/b.width,y:(cursor.y-b.y)/b.height});},70);
win.on('blur',()=>{drag=null;});for(const event of ['lock-screen','suspend'])powerMonitor.on(event,()=>{drag=null;activity(false);saveWindow();});
for(const event of ['unlock-screen','resume'])powerMonitor.on(event,()=>{repairBounds();if(!userHidden)show();});
screen.on('display-metrics-changed',repairBounds);screen.on('display-removed',repairBounds);app.on('activate',show);
});app.on('before-quit',()=>{quitting=true;clearTimeout(saveTimer);saveWindow();clearInterval(pointerTimer);clearInterval(layerTimer);if(tray&&!tray.isDestroyed())tray.destroy();});app.on('window-all-closed',()=>{if(!quitting)app.quit();});}




