const fs=require('node:fs');const path=require('node:path');
module.exports=function startup(app){
const file=path.join(app.getPath('userData'),'startup.json');let prefs={enabled:true,lastEntranceDay:null};try{prefs={...prefs,...JSON.parse(fs.readFileSync(file,'utf8'))};}catch{}
const test=process.argv.includes('--temple-test');const executable=process.env.PORTABLE_EXECUTABLE_FILE||process.execPath;
const options={path:executable,args:['--temple-login'],name:'Desktop Temple'};
function save(){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(prefs));}
function setEnabled(value){prefs.enabled=Boolean(value);if(app.isPackaged&&!test&&(process.platform==='win32'||process.platform==='darwin'))app.setLoginItemSettings({...options,openAtLogin:prefs.enabled});save();}
// Register the portable launcher itself, never its temporary extracted runtime.
if(app.isPackaged&&!test)setEnabled(prefs.enabled);
return {enabled:()=>prefs.enabled,setEnabled,claim(){const now=new Date(),day=`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;if(!prefs.enabled||prefs.lastEntranceDay===day)return false;prefs.lastEntranceDay=day;save();return true;}};
};
