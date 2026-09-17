const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('temple',{isDesktop:true,dailyEntry:()=>ipcRenderer.invoke('temple:daily-entry'),quit:()=>ipcRenderer.send('temple:quit'),hover:hit=>ipcRenderer.send('temple:hover',Boolean(hit)),menu:()=>ipcRenderer.send('temple:menu'),startDrag:()=>ipcRenderer.send('temple:drag-start'),endDrag:()=>ipcRenderer.send('temple:drag-end'),onActivity:callback=>ipcRenderer.on('temple:activity',(_event,active)=>callback(active)),onCursor:callback=>ipcRenderer.on('temple:cursor',(_event,point)=>callback(point))});


