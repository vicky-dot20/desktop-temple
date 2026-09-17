import * as THREE from 'three';
import './style.css';
import {createShiva} from './shiva.js';
import {layouts} from './layouts.js';
import {createReferenceTemple} from './reference-temples.js';
const params=new URLSearchParams(location.search),preview=params.has('preview');
const layout=layouts.find(l=>l.id===params.get('layout'))||layouts[0];
import {createInterior} from './interior.js';
import {smoothstep} from './state.js';
const host=document.getElementById('temple-stage');
const scene=new THREE.Scene();
const model=new THREE.Group();scene.add(model);
const camera=new THREE.PerspectiveCamera(42,1,.05,100);
const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
renderer.setClearColor(0x000000,0);renderer.setPixelRatio(preview?1:Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=!preview;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;host.append(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xfff8ec,0x82785e,2.4));
const sun=new THREE.DirectionalLight(0xffefd5,3.2);sun.position.set(-8,16,10);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-12,right:12,top:13,bottom:-10});sun.shadow.bias=-.0004;scene.add(sun);
const marble=new THREE.MeshStandardMaterial({color:layout.color,roughness:.72});
const trim=new THREE.MeshStandardMaterial({color:0xc9a761,metalness:.65,roughness:.35});
const dark=new THREE.MeshStandardMaterial({color:0x353830,roughness:.95});
const stone=new THREE.MeshStandardMaterial({color:0xc4bb9e,roughness:.95});
const roofMaterial=new THREE.MeshStandardMaterial({color:layout.id==='kerala'?0x96502d:layout.id==='stone'?0x82867e:0xc9a761,roughness:.65,metalness:.2});
const brass=new THREE.MeshStandardMaterial({color:0xd4a746,metalness:.75,roughness:.3});
const wood=new THREE.MeshStandardMaterial({color:0x704733,roughness:.8});
function mesh(geo,mat,x=0,y=0,z=0,parent=model){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function box(w,h,d,x,y,z,mat=marble,parent=model){return mesh(new THREE.BoxGeometry(w,h,d),mat,x,y,z,parent);}
function cylinder(rt,rb,h,x,y,z,mat=marble,parent=model,n=24){return mesh(new THREE.CylinderGeometry(rt,rb,h,n),mat,x,y,z,parent);}
function sphere(r,x,y,z,mat=marble,parent=model){return mesh(new THREE.SphereGeometry(r,24,16),mat,x,y,z,parent);}

box(10,.3,9,0,0,0,stone);box(8.8,.45,7.6,0,.32,0);box(9.1,.12,7.9,0,.6,0,trim);
// Broad front steps leading into an open pillared mandapa.
const stairs=[];for(let i=0;i<4;i++){const step=box(3.6-i*.15,.16,1.05,0,.08+i*.16,5.3-i*.65,stone);step.userData.stair=true;stairs.push(step);}
box(8.6,.12,7.4,0,.72,0);
for(const x of [-3.6,3.6])for(const z of [-2.8,0,2.8]){
box(.8,.24,.8,x,.9,z);box(.6,.18,.6,x,1.1,z,trim);cylinder(.19,.25,2.9,x,2.58,z);cylinder(.34,.25,.35,x,4.12,z);box(.72,.17,.72,x,4.38,z);box(.85,.12,.85,x,4.51,z,trim);
for(let j=0;j<3;j++)cylinder(.27,.27,.055,x,1.3+j*.13,z,trim);
}
// Carved arch silhouettes across the open frontage.
function arch(x,z,width){const shape=new THREE.Shape();const r=width/2;shape.moveTo(-r,-.85);shape.lineTo(-r,.8);shape.lineTo(r,.8);shape.lineTo(r,-.85);shape.quadraticCurveTo(0,1.7,-r,-.85);const g=new THREE.ExtrudeGeometry(shape,{depth:.22,bevelEnabled:false,curveSegments:32});const m=mesh(g,marble,x,3.76,z);return m;}
arch(0,2.82,6.7);
box(9.2,.25,8.1,0,4.65,0);box(9.6,.13,8.5,0,4.84,0,trim);box(9.3,.16,8.2,0,5,0);
// Side lattice screens: actual perforated geometry, not painted panels.
for(const x of [-3.65,3.65])for(const zc of [-1.45,1.4]){
box(.14,1.2,2.2,x,1.45,zc);for(let y=2.15;y<3.5;y+=.24)for(let z=zc-.95;z<zc+1;z+=.24){const m=box(.09,.13,.13,x,y,z);m.rotation.x=Math.PI/4;}
box(.25,.15,2.3,x,3.64,zc,trim);
}
// Rear sanctum, door frame and stepped shikhara.
box(4.2,3.8,.3,0,2.6,-2.85,dark);box(.3,3.8,3.4,-2,2.6,-1.6);box(.3,3.8,3.4,2,2.6,-1.6);
box(3.4,.25,.35,0,3.85,-.05,trim);for(const x of [-1.6,1.6])box(.23,2.8,.35,x,2.37,-.05,trim);
if(layout.id==='ivory'){
for(let i=0;i<9;i++){const w=3.9-i*.33;cylinder(w*.46,w*.53,.39,0,5.26+i*.37,-1.2,marble,model,4).rotation.y=Math.PI/4;}
cylinder(.17,.48,.45,0,8.68,-1.2);sphere(.21,0,9,-1.2,trim);cylinder(0,.09,.43,0,9.31,-1.2,trim);
for(const x of [-3.8,3.8])for(const z of [-3,3]){box(.6,.18,.6,x,5.2,z);cylinder(.08,.38,.6,x,5.57,z);sphere(.09,x,5.94,z,trim);}
}else if(layout.id==='dravidian'){
for(let i=0;i<6;i++){const w=6.2-i*.7,y=5.2+i*.6;box(w,.42,2.7-i*.25,0,y,1.9);box(w+.3,.13,2.9-i*.25,0,y+.26,1.9,trim);for(let x=-w/2+.4;x<w/2;x+=.65){box(.22,.26,.16,x,y,3.28-i*.125,roofMaterial);}}
for(const x of [-1,0,1]){cylinder(.06,.2,.4,x,8.93,1.9,trim);sphere(.08,x,9.18,1.9,trim);}
}else if(layout.id==='kerala'){
for(const [y,w,d] of [[5.5,6.6,5.8],[6.35,4.6,3.8]]){const roof=cylinder(1,w,1.35,0,y,-.1,roofMaterial,model,4);roof.rotation.y=Math.PI/4;roof.scale.z=d/w;box(w*1.42,.14,d*1.42,0,y-.67,-.1,wood);}cylinder(0,.16,.65,0,7.3,-.1,trim);
for(const x of [-3.6,3.6])for(const z of [-2.8,0,2.8])cylinder(.2,.24,2.8,x,2.55,z,wood);
}else{
cylinder(2.15,2.35,.35,0,5.3,-.5,trim);const dome=mesh(new THREE.SphereGeometry(2.15,40,24,0,Math.PI*2,0,Math.PI/2),marble,0,5.45,-.5);dome.scale.y=.85;cylinder(.12,.25,.42,0,7.45,-.5,trim);sphere(.15,0,7.77,-.5,trim);
for(const x of [-3.8,3.8])for(const z of [-3,3]){cylinder(.4,.5,.2,x,5.18,z,trim);const d=sphere(.43,x,5.38,z);d.scale.y=.6;}
}
// Back altar, framed sacred symbol (replaceable with a local shrine photo).
box(2,.25,1.2,0,.95,-1.9,trim);box(1.75,.2,1,0,1.16,-1.9,marble);
const pictureCanvas=document.createElement('canvas');pictureCanvas.width=512;pictureCanvas.height=640;const ctx=pictureCanvas.getContext('2d');ctx.fillStyle='#29261c';ctx.fillRect(0,0,512,640);const gradient=ctx.createRadialGradient(256,285,0,256,285,240);gradient.addColorStop(0,'#986e30');gradient.addColorStop(1,'#29261c');ctx.fillStyle=gradient;ctx.fillRect(0,0,512,640);ctx.strokeStyle='#bd9c56';ctx.lineWidth=3;ctx.strokeRect(24,24,464,592);ctx.fillStyle='#f3d48a';ctx.font='180px serif';ctx.textAlign='center';const originalTexture=new THREE.CanvasTexture(pictureCanvas);originalTexture.colorSpace=THREE.SRGBColorSpace;
const portraitMaterial=new THREE.MeshBasicMaterial({map:originalTexture});const portrait=mesh(new THREE.PlaneGeometry(1.42,1.78),portraitMaterial,0,2.32,-2.56);box(1.6,1.95,.12,0,2.32,-2.65,trim);
const shiva=createShiva();shiva.position.set(0,1.27,-1.9);shiva.scale.setScalar(.85);model.add(shiva);
const warmLight=new THREE.PointLight(0xffba54,10,7,2);warmLight.position.set(0,2,-.9);scene.add(warmLight);
// Brass lamps flank the altar.
const flameMaterial=new THREE.MeshBasicMaterial({color:0xffd27d});const flames=[];
for(const x of [-1.17,1.17]){cylinder(.23,.32,.12,x,.9,-1.2,brass);cylinder(.055,.08,.72,x,1.3,-1.2,brass);cylinder(.25,.1,.12,x,1.7,-1.2,brass);const f=sphere(.07,x,1.84,-1.2,flameMaterial);f.scale.set(.7,1.9,.7);flames.push(f);}
// Flower garland around the altar frame.
const flowerMat=new THREE.MeshStandardMaterial({color:0xeaad38});for(let i=0;i<30;i++){const a=Math.PI*i/29;sphere(.06,Math.cos(a)*.94,2.42+Math.sin(a)*1.02,-2.47,flowerMat);}

// Small planted pots flank the entrance, all part of the isolated temple model.
const terracotta=new THREE.MeshStandardMaterial({color:0x9b6244,roughness:.95});
const greens=[0x355b2b,0x4f7936,0x6b8b45].map(color=>new THREE.MeshStandardMaterial({color,roughness:.88}));
for(const x of [-4.25,4.25])for(const z of [2.6,4.4]){cylinder(.35,.25,.52,x,.62,z,terracotta);cylinder(.39,.39,.1,x,.89,z,terracotta);cylinder(.29,.29,.025,x,.95,z,dark);for(let i=0;i<11;i++){const angle=i*2.399,r=.24+Math.sin(i*2)*.08;const leaf=sphere(.23,x+Math.cos(angle)*r,1.12+(i%3)*.19,z+Math.sin(angle)*r,greens[i%3]);leaf.scale.set(.6,1.5,.65);leaf.rotation.z=Math.cos(angle)*.5;leaf.rotation.x=Math.sin(angle)*.4;}}
box(2.9,.12,.75,0,.02,6.05,stone);
// Central aisle remains clear; the visitor stops in the right-hand darshan lane.
for(const x of [-.7,.7]){for(const z of [.1,.95,1.8,2.65]){cylinder(.035,.035,.83,x,1.2,z,brass);sphere(.06,x,1.65,z,brass);}for(const y of [1.1,1.58]){const bar=cylinder(.028,.028,2.65,x,y,1.375,brass);bar.rotation.x=Math.PI/2;}}
let entryPoint={x:0,z:6,y:.8},plaqueAnchor=new THREE.Vector3(2.9,.68,4.6);
if(layout.reference){model.traverse(o=>{if(o.isMesh)o.geometry.dispose();});model.clear();const reference=createReferenceTemple(layout.id);model.add(reference.root);entryPoint=reference.entrance;plaqueAnchor=reference.plaque;}
// No ground plane, sky, page surface or surrounding UI: only the temple has pixels.
const bounds=new THREE.Box3().setFromObject(model),center=bounds.getCenter(new THREE.Vector3());
const views=[new THREE.Vector3(0,6,24),new THREE.Vector3(13,9,20),new THREE.Vector3(-13,9,20)];let viewIndex=preview?1:Number(localStorage.getItem('temple-view')||0)%3;if(!Number.isInteger(viewIndex)||viewIndex<0)viewIndex=0;function orient(){camera.position.copy(center).add(views[viewIndex]);camera.lookAt(center);camera.updateMatrixWorld();}orient();
let mode='outside',journey=null,animationId=0,autoTimer=null;
const interior=preview?{resize(){},setViewport(){}}:createInterior(renderer);let insideFrame={x:0,y:0,width:1,height:1};
function matchInteriorFrame(){model.updateMatrixWorld(true);camera.updateMatrixWorld();let minX=1,minY=1,maxX=-1,maxY=-1;const v=new THREE.Vector3();model.traverse(o=>{if(!o.isMesh)return;const a=o.geometry.attributes.position;for(let i=0;i<a.count;i++){v.fromBufferAttribute(a,i).applyMatrix4(o.matrixWorld).project(camera);minX=Math.min(minX,v.x);maxX=Math.max(maxX,v.x);minY=Math.min(minY,v.y);maxY=Math.max(maxY,v.y);}});insideFrame={x:Math.max(0,(minX+1)/2),y:Math.max(0,(1-maxY)/2),width:Math.min(1,(maxX-minX)/2),height:Math.min(1,(maxY-minY)/2)};interior.setViewport(insideFrame);host.dataset.interiorFrame=JSON.stringify(insideFrame);}

const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const viewButton=document.getElementById('view');
function fit(){const width=host.clientWidth,height=host.clientHeight;if(!width||!height)return;camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height);interior.resize(width,height);if(mode==='outside'){orient();const inverse=new THREE.Matrix4().extractRotation(camera.matrixWorldInverse);let distance=0;const tan=Math.tan(THREE.MathUtils.degToRad(camera.fov/2));for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]){const p=new THREE.Vector3(x,y,z).sub(center).applyMatrix4(inverse);distance=Math.max(distance,p.z+Math.abs(p.y)/tan,p.z+Math.abs(p.x)/(tan*camera.aspect));}camera.position.copy(center).add(views[viewIndex].clone().normalize().multiplyScalar(distance*1.06));camera.lookAt(center);matchInteriorFrame();}render();}
function render(){if(mode!=='inside'){renderer.setScissorTest(false);renderer.setViewport(0,0,host.clientWidth,host.clientHeight);renderer.render(scene,camera);}const plaque=document.getElementById('plaque');if(mode==='outside'){const p=plaqueAnchor.clone().project(camera);plaque.style.left=((p.x+1)*host.clientWidth/2)+'px';plaque.style.top=((-p.y+1)*host.clientHeight/2)+'px';}else{plaque.style.left=((insideFrame.x+insideFrame.width*.65)*100)+'%';plaque.style.top=((insideFrame.y+insideFrame.height*.92)*100)+'%';}host.dataset.mode=mode;}
let entryVeil=null;
function finishEntry(){if(!reduced.matches){entryVeil=document.createElement('canvas');entryVeil.width=renderer.domElement.width;entryVeil.height=renderer.domElement.height;entryVeil.className='entry-veil';entryVeil.getContext('2d').drawImage(renderer.domElement,0,0);host.append(entryVeil);const veil=entryVeil;veil.animate([{opacity:1},{opacity:0}],{duration:700,fill:'forwards'}).finished.then(()=>veil.remove());setTimeout(()=>veil.remove(),850);}mode='inside';journey=null;document.getElementById('interior-controls').hidden=false;for(const id of ['look-shrine','look-shop','put-back'])document.getElementById(id).hidden=false;interior.start(!reduced.matches);viewButton.textContent='↶';viewButton.title='Return to temple steps';viewButton.setAttribute('aria-label','Return to temple steps');render();}
function animate(now){if(!journey)return;const t=Math.min(1,(now-journey.start)/journey.duration),k=smoothstep(t);camera.position.copy(journey.path.getPoint(k));camera.lookAt(journey.look.getPoint(k));render();if(t<1)animationId=requestAnimationFrame(animate);else finishEntry();}
function enter(){if(mode!=='outside')return;clearTimeout(autoTimer);endDrag();mode='entering';viewButton.textContent='↶';viewButton.title='Return to temple steps';viewButton.setAttribute('aria-label','Return to temple steps');journey={start:performance.now(),duration:reduced.matches?1:6500,positions:[camera.position.clone(),new THREE.Vector3(entryPoint.x,2.5,entryPoint.z+1.6),new THREE.Vector3(entryPoint.x+.8,2.45,entryPoint.z-1.4),new THREE.Vector3(entryPoint.x+.8,2.35,entryPoint.z-2.3)],targets:[center.clone(),new THREE.Vector3(0,2.2,-1.4),new THREE.Vector3(.1,2.3,-2.5),new THREE.Vector3(0,2.0,-2.2)]};journey.path=new THREE.CatmullRomCurve3(journey.positions);journey.look=new THREE.CatmullRomCurve3(journey.targets);animationId=requestAnimationFrame(animate);}
function leave(){entryVeil?.remove();interior.stop();document.getElementById('interior-controls').hidden=true;for(const id of ['look-shrine','look-shop','put-back'])document.getElementById(id).hidden=true;clearTimeout(autoTimer);cancelAnimationFrame(animationId);journey=null;mode='outside';viewButton.textContent='↻';viewButton.title='Change temple view';viewButton.setAttribute('aria-label','Change temple view');fit();}
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let hit=false,dragging=false,press=null,overStair=false,suppressEntryUntil=0;
function intersections(x,y){pointer.set(x*2-1,1-y*2);raycaster.setFromCamera(pointer,camera);return raycaster.intersectObject(model,true);}
function pick(x,y){if(mode==='inside'){hit=interior.contains(x,y);window.temple?.hover(hit);renderer.domElement.classList.remove('over-stairs');const action=interior.hit(x,y);renderer.domElement.dataset.action=action?(action.kind+":"+action.type):"";renderer.domElement.title='';return hit;}const objects=intersections(x,y);overStair=mode==='outside'&&objects[0]?.object.userData.stair===true;const rect=document.getElementById('plaque').getBoundingClientRect();const px=x*host.clientWidth,py=y*host.clientHeight;const overControl=px>=rect.left&&px<=rect.right&&py>=rect.top&&py<=rect.bottom;const next=overControl||objects.length>0;if(next!==hit){hit=next;window.temple?.hover(hit);}renderer.domElement.classList.toggle('over-temple',hit);renderer.domElement.classList.toggle('over-stairs',overStair);renderer.domElement.title=overStair?'Double-click the steps to enter':'';return next;}
window.temple?.onCursor(({x,y})=>{if(!dragging)pick(x,y);});
renderer.domElement.addEventListener('pointermove',event=>{
 if(press&&mode==='inside'){const dx=event.clientX-press.lastX,dy=event.clientY-press.lastY;if(Math.hypot(event.clientX-press.clientX,event.clientY-press.clientY)>5)press.moved=true;if(press.moved)interior.drag(dx,dy);press.lastX=event.clientX;press.lastY=event.clientY;return;}
 if(press&&!dragging&&Math.hypot(event.screenX-press.x,event.screenY-press.y)>5){press.moved=true;clearTimeout(autoTimer);suppressEntryUntil=performance.now()+900;if(window.temple){dragging=true;renderer.domElement.classList.add('dragging');window.temple.startDrag();}}
 if(!dragging){const r=renderer.domElement.getBoundingClientRect();pick((event.clientX-r.left)/r.width,(event.clientY-r.top)/r.height);}});
renderer.domElement.addEventListener('pointerdown',event=>{if(event.button!==0||mode==='entering')return;clearTimeout(autoTimer);const r=renderer.domElement.getBoundingClientRect();pick((event.clientX-r.left)/r.width,(event.clientY-r.top)/r.height);if(!hit)return;press={x:event.screenX,y:event.screenY,clientX:event.clientX,clientY:event.clientY,lastX:event.clientX,lastY:event.clientY,time:performance.now(),moved:false};renderer.domElement.setPointerCapture(event.pointerId);});
renderer.domElement.addEventListener('pointerup',event=>{if(press){if(mode==='inside'&&!press.moved){const r=renderer.domElement.getBoundingClientRect();interior.click((event.clientX-r.left)/r.width,(event.clientY-r.top)/r.height);}if(press.moved||performance.now()-press.time>350)suppressEntryUntil=performance.now()+900;}endDrag();});
function endDrag(){press=null;dragging=false;renderer.domElement.classList.remove('dragging');window.temple?.endDrag();}
for(const name of ['pointercancel','lostpointercapture'])renderer.domElement.addEventListener(name,endDrag);
renderer.domElement.addEventListener('dblclick',event=>{if(performance.now()<suppressEntryUntil)return;const r=renderer.domElement.getBoundingClientRect();const objects=intersections((event.clientX-r.left)/r.width,(event.clientY-r.top)/r.height);if(mode==='outside'){let stairHit=objects[0]?.object.userData.stair;for(const dx of [-2,0,2])for(const dy of [-2,0,2])if(!stairHit)stairHit=intersections((event.clientX-r.left+dx)/r.width,(event.clientY-r.top+dy)/r.height)[0]?.object.userData.stair;if(stairHit)enter();}});
// No wheel, pinch or browser zoom; moving the temple never changes camera scale.
renderer.domElement.addEventListener('wheel',event=>event.preventDefault(),{passive:false});
for(const name of ['gesturestart','gesturechange'])renderer.domElement.addEventListener(name,event=>event.preventDefault());
window.addEventListener('blur',endDrag);
renderer.domElement.addEventListener('contextmenu',event=>{event.preventDefault();if(hit)window.temple?.menu();});
new ResizeObserver(fit).observe(host);fit();
document.addEventListener('visibilitychange',()=>{if(!document.hidden)render();});
renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();document.getElementById('error').hidden=false;});
renderer.domElement.addEventListener('webglcontextrestored',()=>{document.getElementById('error').hidden=true;fit();});
viewButton.addEventListener('click',()=>{if(mode!=='outside'){leave();return;}clearTimeout(autoTimer);viewIndex=(viewIndex+1)%3;localStorage.setItem('temple-view',String(viewIndex));fit();});
document.getElementById('close').addEventListener('click',()=>{if(window.temple)window.temple.quit();else host.hidden=true;});
document.getElementById('plaque').addEventListener('pointerenter',()=>window.temple?.hover(true));
// Only native app startup claims the daily entrance. Double-click is never gated.
if(!preview&&window.temple?.dailyEntry)window.temple.dailyEntry().then(shouldEnter=>{if(shouldEnter)autoTimer=setTimeout(enter,1600);});


document.getElementById('look-shrine').onclick=()=>interior.face('shrine');
document.getElementById('look-shop').onclick=()=>interior.face('shop');
document.getElementById('put-back').onclick=()=>interior.putBack();




window.temple?.onActivity(active=>{interior.pause(!active);if(!active){clearTimeout(autoTimer);endDrag();if(journey){cancelAnimationFrame(animationId);journey.pausedAt=performance.now();}}else{if(journey?.pausedAt){journey.start+=performance.now()-journey.pausedAt;delete journey.pausedAt;animationId=requestAnimationFrame(animate);}render();}});

if(preview){document.getElementById('plaque').hidden=true;host.style.pointerEvents='none';}
