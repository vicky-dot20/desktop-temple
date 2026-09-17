import * as THREE from 'three';
import {createShiva} from './shiva.js';
export function createInterior(renderer){
 const scene=new THREE.Scene();scene.background=null;
 const camera=new THREE.PerspectiveCamera(58,1,.03,40);camera.position.set(.85,1.85,3.2);scene.add(camera);
 const root=new THREE.Group();scene.add(root);const selectable=[],targets={},effects={incense:false,camphor:false,coconut:false,lamp:false};
 const stoneTexture=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');let seed=9;for(let y=0;y<256;y++)for(let i=0;i<256;i++){seed=(seed*1664525+1013904223)>>>0;const n=244+(seed%6);x.fillStyle=`rgb(${n},${n},${n})`;x.fillRect(i,y,1,1);}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;})();
 const stone=new THREE.MeshStandardMaterial({color:'#f0e7d1',map:stoneTexture,roughness:.72}),edge=new THREE.MeshStandardMaterial({color:'#c4bb9e',roughness:.85}),gold=new THREE.MeshStandardMaterial({color:'#c9a761',metalness:.78,roughness:.3}),black=new THREE.MeshStandardMaterial({color:'#25292a',roughness:.9}),wood=new THREE.MeshStandardMaterial({color:'#492d22',roughness:.9}),skin=new THREE.MeshStandardMaterial({color:'#b97e58',roughness:.85});
 function m(geometry,material,x=0,y=0,z=0,parent=root){const o=new THREE.Mesh(geometry,material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function box(w,h,d,x,y,z,mat=stone,parent=root){return m(new THREE.BoxGeometry(w,h,d),mat,x,y,z,parent);}
 function cyl(a,b,h,x,y,z,mat=stone,parent=root){return m(new THREE.CylinderGeometry(a,b,h,32),mat,x,y,z,parent);}
 function ball(r,x,y,z,mat=stone,parent=root){return m(new THREE.SphereGeometry(r,20,14),mat,x,y,z,parent);}
 function label(text,x,y,z,width=1,parent=root){const c=document.createElement('canvas');c.width=512;c.height=100;const ctx=c.getContext('2d');ctx.fillStyle='#2c2921';ctx.fillRect(0,0,512,100);ctx.strokeStyle='#9f854f';ctx.lineWidth=5;ctx.strokeRect(3,3,506,94);ctx.fillStyle='#f0deb5';ctx.font=text.length>12?'32px Georgia':'56px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,50);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return m(new THREE.PlaneGeometry(width,width*.195),new THREE.MeshBasicMaterial({map:t}),x,y,z,parent);}
 scene.add(new THREE.HemisphereLight('#fff4dc','#76654a',1.8));const mainLight=new THREE.PointLight('#fff1d6',36,18,2);mainLight.position.set(0,4,0);mainLight.castShadow=true;mainLight.shadow.autoUpdate=false;mainLight.shadow.needsUpdate=true;mainLight.shadow.mapSize.set(1024,1024);scene.add(mainLight);const altarLight=new THREE.PointLight('#ffd498',30,9,2);altarLight.position.set(0,2.7,-2.5);scene.add(altarLight);
 box(10,.24,13,0,-.15,0);box(10,6,.25,0,2.9,-5.4);box(10,.3,13,0,5.6,0);box(10,6,.2,0,2.9,6.4);
 // Side screens have real openings, allowing the desktop to show through.
 for(const x of [-5,5]){
  box(.25,1.05,13,x,.4,0);box(.25,2.05,13,x,4.675,0);
  for(const z of [-5.25,-.2,6.25])box(.32,2.75,.4,x,2.3,z);
  for(const [a,b] of [[-5.05,-.4],[0,6.05]]){
   const mid=(a+b)/2,len=b-a;box(.32,.12,len,x,1.0,mid,gold);box(.32,.12,len,x,3.65,mid,gold);
   // Thin crossed strips form the same diamond lattice seen outside.
   const panel=new THREE.Group();panel.position.set(x,2.32,mid);root.add(panel);
   for(let y=-1.2;y<=1.2;y+=.28)for(let z=-len/2+.15;z<len/2-.1;z+=.28){
    const tile=box(.09,.13,.13,0,y,z,stone,panel);tile.rotation.x=Math.PI/4;
   }
  }
 }
 for(let x=-4;x<4.5;x+=.8)for(let z=-4.9;z<6.3;z+=.8)box(.785,.022,.785,x,0,z,stone);
 for(const x of [-4.82,4.82]){box(.08,.10,12.7,x,.3,0,gold);box(.12,.12,12.7,x,4.8,0,gold);}box(9.7,.10,.08,0,.3,-5.22,gold);box(9.7,.12,.12,0,4.8,-5.22,gold);
 // Repeated carved columns and layered arches create a deep stone hall.
 for(const x of [-3.7,3.7])for(const z of [-4,-.2,3.9]){if(x>0&&z>3)continue;box(.95,.25,.95,x,.15,z);box(.78,.18,.78,x,.36,z,edge);cyl(.24,.32,3.7,x,2.27,z);for(const y of [.55,.65,.75,3.9,4.0])cyl(.29,.29,.045,x,y,z,gold);cyl(.48,.28,.4,x,4.25,z);box(1,.23,1,x,4.55,z);}
 for(const z of [-4,-.2,3.9]){const arc=m(new THREE.TorusGeometry(3.68,.17,12,56,Math.PI),stone,0,3.35,z);arc.scale.y=.48;box(7.7,.34,.65,0,5.12,z);for(let i=0;i<19;i++){const a=i*Math.PI/18;const carve=ball(.11,Math.cos(a)*3.7,3.35+Math.sin(a)*1.7,z+.1);carve.scale.y=.7;}}
 box(4.9,.24,2.35,0,.17,-4.05);box(4.4,.23,2,0,.4,-4.05);box(2.25,.15,.62,0,.15,-2.5);box(1.95,.16,.58,0,.29,-2.85);
 for(const x of [-1.8,1.8]){box(.7,.45,.85,x,.7,-3.7);cyl(.22,.28,2.75,x,2.3,-3.7);for(const y of [1,1.1,1.2,3.5,3.6])cyl(.3,.3,.045,x,y,-3.7,gold);box(.8,.25,.9,x,3.82,-3.7);}
 box(4.2,.4,1.05,0,4.03,-3.75);for(let i=0;i<4;i++)box(4.45-i*.55,.18,1.3-i*.1,0,4.32+i*.18,-3.75);cyl(.07,.7,.6,0,5.15,-3.8);ball(.12,0,5.52,-3.8,gold);
 const niche=m(new THREE.TorusGeometry(1.2,.12,12,48,Math.PI),gold,0,2.48,-4.84);for(const x of [-1.2,1.2])box(.23,1.75,.25,x,1.65,-4.84);box(2.25,2.8,.1,0,1.96,-5,black);
 // Warm recessed backdrop behind the Shiva sculpture.
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=640;const ctx=canvas.getContext('2d');const grad=ctx.createRadialGradient(256,290,10,256,290,300);grad.addColorStop(0,'#786035');grad.addColorStop(1,'#111515');ctx.fillStyle=grad;ctx.fillRect(0,0,512,640);ctx.fillStyle='#edcc83';ctx.textAlign='center';ctx.font='190px serif';// Shiva lingam sculpture replaces the Om placeholder.
const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;const imageMaterial=new THREE.MeshBasicMaterial({map:tex});m(new THREE.PlaneGeometry(1.5,1.9),imageMaterial,0,2.08,-4.87);
 box(1.6,.2,1.2,0,.61,-4.2,edge);const shiva=createShiva();shiva.position.set(0,.73,-4.2);root.add(shiva);
const marigold=new THREE.MeshStandardMaterial({color:'#dbaa3c'});for(let i=0;i<28;i++){const a=i*Math.PI/27;ball(.085,Math.cos(a)*.95,2.05+Math.sin(a)*1.3,-4.76,marigold);}
 const flameMat=new THREE.MeshBasicMaterial({color:'#ffcf78'});const fire=[];
 function flame(x,y,z,parent=root){const f=ball(.065,x,y,z,flameMat,parent);f.scale.set(.55,1.8,.55);fire.push(f);return f;}
 for(const x of [-2.35,2.35]){cyl(.34,.45,.14,x,.18,-2.7,gold);cyl(.07,.11,1.3,x,.88,-2.7,gold);cyl(.43,.13,.18,x,1.62,-2.7,gold);for(let i=0;i<5;i++){const a=i*Math.PI*2/5;flame(x+Math.cos(a)*.3,1.8,-2.7+Math.sin(a)*.3);}}
 for(const x of [-2.25,2.25]){for(let i=0;i<22;i++){const ring=m(new THREE.TorusGeometry(.05,.012,5,10),gold,x,4.9-i*.095,-1.6);ring.rotation.y=i%2*Math.PI/2;}cyl(.48,.22,.12,x,2.72,-1.6,gold);for(let i=0;i<7;i++){const a=i*Math.PI*2/7;flame(x+Math.cos(a)*.36,2.86,-1.6+Math.sin(a)*.36);}}
 for(const x of [-.65,.65]){for(const z of [0,1,2])cyl(.027,.04,.9,x,.5,z,gold);const rail=cyl(.035,.035,2.1,x,.97,1,gold);rail.rotation.x=Math.PI/2;}
 function item(type,parent){const g=new THREE.Group();parent.add(g);if(type==='incense'){cyl(.12,.15,.08,0,0,0,gold,g);for(let i=0;i<3;i++){const s=cyl(.012,.012,.55,(i-1)*.055,.29,0,wood,g);s.rotation.z=(i-1)*.1;}}
 if(type==='camphor'){cyl(.22,.2,.035,0,0,0,gold,g);box(.1,.07,.1,0,.06,0,new THREE.MeshStandardMaterial({color:'#eee8dd'}),g);}
 if(type==='coconut'){const c=ball(.17,0,.13,0,new THREE.MeshStandardMaterial({color:'#72503a',roughness:1}),g);c.scale.y=1.2;}
 if(type==='lamp'){cyl(.15,.07,.1,0,.02,0,gold,g);box(.045,.03,.1,0,.08,.08,wood,g);}return g;}
 // Free offering table is in the room to the visitor's right, facing their standing position.
 const shop=new THREE.Group();shop.position.set(3.65,0,3.0);shop.rotation.y=-Math.PI/2;root.add(shop);box(2.7,.16,.85,0,.95,0,wood,shop);for(const x of [-1.1,1.1])box(.1,.95,.65,x,.44,0,wood,shop);label('OFFERINGS · FREE',0,1.9,0,2.3,shop);
 const types=['incense','camphor','coconut','lamp'],names={incense:'Agarbathi',camphor:'Karpuram',coconut:'Coconut',lamp:'Vilakku'};
 types.forEach((type,i)=>{const g=item(type,shop);g.position.set((i-1.5)*.61,1.07,0);const tag=label(names[type],(i-1.5)*.61,.74,.46,.57,shop);g.traverse(o=>{if(o.isMesh)o.userData.action={kind:'select',type};});tag.userData.action={kind:'select',type};selectable.push(g,tag);});
 const targetPositions={incense:[-1.38,.78,-1.1],camphor:[-.45,.78,-1.1],coconut:[.55,.35,-.9],lamp:[1.45,.78,-1.1]};
 types.forEach(type=>{const [x,y,z]=targetPositions[type];const group=new THREE.Group();group.position.set(x,y,z);root.add(group);if(type==='coconut')box(.68,.17,.65,0,-.02,0,edge,group);else {cyl(.32,.38,.1,0,0,0,gold,group);cyl(.055,.09,y,0,-y/2,0,gold,group);}const trigger=m(new THREE.BoxGeometry(.78,.62,.7),new THREE.MeshBasicMaterial({visible:false}),0,.16,0,group);trigger.userData.action={kind:'use',type};group.traverse(o=>{if(o.isMesh)o.userData.action={kind:'use',type};});selectable.push(group);targets[type]=group;});
 const hand=new THREE.Group();camera.add(hand);hand.position.set(.19,-.18,-.72);hand.rotation.set(.3,-.15,-.2);hand.scale.setScalar(.38);hand.visible=false;
 const forearm=cyl(.065,.095,.46,0,-.27,.02,skin,hand);forearm.rotation.x=.12;ball(.07,0,-.1,0,skin,hand);const palm=ball(.11,0,0,0,skin,hand);palm.scale.set(.9,1.05,.5);for(let i=0;i<4;i++){const finger=cyl(.019,.022,.16,(i-1.5)*.043,.115,-.025,skin,hand);finger.rotation.x=.6;ball(.022,(i-1.5)*.043,.18,-.065,skin,hand);}const thumb=cyl(.027,.032,.14,-.1,.02,-.03,skin,hand);thumb.rotation.z=-.8;
 const held=new THREE.Group();held.position.set(0,.2,-.05);hand.add(held);
 let viewport={x:0,y:0,width:1,height:1},size={w:1,h:1};
 let paused=false,walkIn=null;
 let selected=null,yaw=0,pitch=-.12,active=false,last=0,loopId=0,status='Drag to look around · turn right for offerings';
 const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();
 const smokeCanvas=document.createElement('canvas');smokeCanvas.width=smokeCanvas.height=64;const sc=smokeCanvas.getContext('2d'),sg=sc.createRadialGradient(32,32,0,32,32,32);sg.addColorStop(0,'rgba(225,224,211,.5)');sg.addColorStop(1,'rgba(225,224,211,0)');sc.fillStyle=sg;sc.fillRect(0,0,64,64);const smokePositions=new Float32Array(70*3),smokeGeo=new THREE.BufferGeometry();smokeGeo.setAttribute('position',new THREE.BufferAttribute(smokePositions,3));const smoke=new THREE.Points(smokeGeo,new THREE.PointsMaterial({map:new THREE.CanvasTexture(smokeCanvas),color:'#dbd7c7',size:.16,transparent:true,opacity:.35,depthWrite:false}));smoke.visible=false;root.add(smoke);
 let split=null,splitAt=0;const litFlames=[];
 function select(type){selected=type;held.clear();item(type,held);hand.visible=true;status=`Holding ${names[type]} · return to the shrine and click its brass stand`;document.getElementById('temple-stage').dataset.held=type;}
 function use(type){if(selected!==type){status=selected?`Use ${names[selected]} at its matching stand`:'Choose a free offering from the table first';return;}if(effects[type]){status=`${names[type]} is already offered`;return;}effects[type]=true;const g=targets[type];if(type==='coconut'){split=new THREE.Group();g.add(split);const outer=new THREE.MeshStandardMaterial({color:'#694832'}),inner=new THREE.MeshStandardMaterial({color:'#f2e8d2'});for(const side of [-1,1]){const half=new THREE.Group();m(new THREE.SphereGeometry(.15,20,12,0,Math.PI*2,Math.PI/2,Math.PI/2),outer,0,0,0,half);const meat=m(new THREE.CircleGeometry(.135,20),inner,0,.002,0,half);meat.rotation.x=-Math.PI/2;half.userData.side=side;split.add(half);}splitAt=performance.now();}else{item(type,g).position.y=.1;if(type==='incense')smoke.visible=true;else litFlames.push(flame(0,.26,0,g));}selected=null;held.clear();hand.visible=false;document.getElementById('temple-stage').dataset.held='';document.getElementById('temple-stage').dataset['offered'+type[0].toUpperCase()+type.slice(1)]='true';status=type==='incense'?'Incense lit':type==='camphor'?'Camphor is burning':type==='lamp'?'Your lamp is lit':'Coconut offered';}
 function face(where){const target=where==='shop'?new THREE.Vector3(3.65,1.15,3):new THREE.Vector3(0,1.85,-4);const d=target.sub(camera.position);yaw=Math.atan2(-d.x,-d.z);pitch=Math.atan2(d.y,Math.hypot(d.x,d.z));look();}
 // Eye position stays inside the side lane. Drag changes orientation only, never position or zoom.
 function look(){camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0);camera.updateMatrixWorld();}
 function contains(x,y){return x>=viewport.x&&x<=viewport.x+viewport.width&&y>=viewport.y&&y<=viewport.y+viewport.height;}
 function hit(x,y){if(!contains(x,y))return null;x=(x-viewport.x)/viewport.width;y=(y-viewport.y)/viewport.height;pointer.set(x*2-1,1-y*2);ray.setFromCamera(pointer,camera);return ray.intersectObjects(selectable,true).find(h=>h.object.userData.action)?.object.userData.action||null;}
 function click(x,y){const action=hit(x,y);if(action)action.kind==='select'?select(action.type):use(action.type);}
 function frame(now){if(!active||paused)return;loopId=requestAnimationFrame(frame);if(document.hidden||paused||now-last<50)return;if(walkIn){const k=Math.min(1,(now-walkIn)/1000),e=k*k*(3-2*k);camera.position.z=3.7-.5*e;face('shrine');if(k===1)walkIn=null;}last=now;const t=now/1000;fire.forEach((f,i)=>f.scale.y=1.65+Math.sin(t*6+i)*.15);if(smoke.visible){const p=targetPositions.incense;for(let i=0;i<70;i++){const age=(t*.2+i/70)%1;smokePositions[i*3]=p[0]+Math.sin(age*10+t)*age*.14;smokePositions[i*3+1]=p[1]+.7+age*1.3;smokePositions[i*3+2]=p[2]+Math.cos(age*8)*age*.09;}smokeGeo.attributes.position.needsUpdate=true;}if(split){const k=Math.min(1,(now-splitAt)/700);split.children.forEach(h=>{h.position.set(h.userData.side*(.04+k*.17),.14+Math.sin(k*Math.PI)*.22,0);h.rotation.z=h.userData.side*k*.45;});}renderer.setScissorTest(false);renderer.setViewport(0,0,size.w,size.h);renderer.clear();renderer.setViewport(viewport.x*size.w,(1-viewport.y-viewport.height)*size.h,viewport.width*size.w,viewport.height*size.h);renderer.setScissor(viewport.x*size.w,(1-viewport.y-viewport.height)*size.h,viewport.width*size.w,viewport.height*size.h);renderer.setScissorTest(true);renderer.render(scene,camera);renderer.setScissorTest(false);if(document.getElementById('ritual-status').textContent!==status){const el=document.getElementById('ritual-status');el.textContent=status;el.animate([{opacity:1},{opacity:1,offset:.7},{opacity:0}],{duration:4000,fill:'forwards'});}}
 function setImage(url){new THREE.TextureLoader().load(url,t=>{t.colorSpace=THREE.SRGBColorSpace;imageMaterial.map=t;imageMaterial.needsUpdate=true;});}
 return {start(walk=false){cancelAnimationFrame(loopId);active=true;walkIn=walk?performance.now():null;camera.position.z=walk?3.7:3.2;face('shrine');loopId=requestAnimationFrame(frame);},stop(){active=false;cancelAnimationFrame(loopId);},resize(w,h){size={w,h};camera.aspect=(w*viewport.width)/(h*viewport.height);camera.updateProjectionMatrix();},setViewport(v){viewport=v;camera.aspect=(size.w*v.width)/(size.h*v.height);camera.updateProjectionMatrix();},contains,pause(value){paused=value;cancelAnimationFrame(loopId);if(active&&!paused)loopId=requestAnimationFrame(frame);},drag(dx,dy){walkIn=null;yaw-=dx*.006;pitch=THREE.MathUtils.clamp(pitch-dy*.004,-.65,.6);look();},face,click,hit,putBack(){selected=null;held.clear();hand.visible=false;status='Offering returned to the table';document.getElementById('temple-stage').dataset.held='';},setImage};
}







