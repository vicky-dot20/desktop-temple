const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('templeSetup',{get:()=>ipcRenderer.invoke('setup:get'),login:name=>ipcRenderer.invoke('setup:login',name),complete:layout=>ipcRenderer.invoke('setup:complete',layout)});
