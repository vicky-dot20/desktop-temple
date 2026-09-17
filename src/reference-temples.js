import * as THREE from 'three';
import {createShiva} from './shiva.js';
// Reference studies: visible proportions reconstructed from single images, not surveyed replicas.
export function createReferenceTemple(id){
 const root=new THREE.Group(),white=id==='marble-reference',wide=id==='sandstone-reference';
 const stone=new THREE.MeshStandardMaterial({color:white?'#f0efe6':wide?'#dca05f':'#987660',roughness:.88});
 const edge=new THREE.MeshStandardMaterial({color:white?'#d7d7cb':wide?'#c38951':'#806350',roughness:.9});
 const gold=new THREE.MeshStandardMaterial({color:white?'#c4a446':wide?'#dcb26a':'#997755',metalness:.35,roughness:.5});
 const door=new THREE.MeshStandardMaterial({color:white?'#986220':'#493426',roughness:.85});
 const green=new THREE.MeshStandardMaterial({color:'#4d713b',roughness:1});
 const cache=new Map();function geo(key,make){if(!cache.has(key))cache.set(key,make());return cache.get(key);}
 function add(g,mat,x,y,z){const m=new THREE.Mesh(g,mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;root.add(m);return m;}
 function box(w,h,d,x,y,z,mat=stone){return add(geo(`b${w},${h},${d}`,()=>new THREE.BoxGeometry(w,h,d)),mat,x,y,z);}
 function cyl(a,b,h,x,y,z,mat=stone,n=16){return add(geo(`c${a},${b},${h},${n}`,()=>new THREE.CylinderGeometry(a,b,h,n)),mat,x,y,z);}
 function orb(r,x,y,z,mat=stone){return add(geo('s'+r,()=>new THREE.SphereGeometry(r,12,8)),mat,x,y,z);}
 function ring(r,t,x,y,z,mat=stone){return add(geo(`r${r},${t}`,()=>new THREE.TorusGeometry(r,t,5,12)),mat,x,y,z);}
 function finial(x,y,z,s=1){cyl(.45*s,.65*s,.15*s,x,y,z);const a=orb(.4*s,x,y+.17*s,z,gold);a.scale.y=.65;cyl(.08*s,.26*s,.36*s,x,y+.49*s,z,gold);orb(.11*s,x,y+.74*s,z,gold);}
 function pillar(x,y,z,h=3){box(.58,.18,.58,x,y+.09,z);box(.45,.22,.45,x,y+.29,z,edge);const points=[[.20,.38],[.19,.55],[.23,.65],[.16,.8],[.14,h-.7],[.24,h-.52],[.19,h-.3],[.32,h-.12]].map(([r,v])=>new THREE.Vector2(r,v));add(geo('pillar'+h,()=>new THREE.LatheGeometry(points,12)),stone,x,y,z);for(const k of [.55,.67,h-.6,h-.48])cyl(.245,.245,.045,x,y+k,z,edge);box(.68,.14,.68,x,y+h,z);for(const dx of [-.28,.28]){const bracket=box(.18,.45,.24,x+dx,y+h-.22,z);bracket.rotation.z=dx>0?-.5:.5;}}
 function arch(x,y,z,w,h=.9,side=false){const r=w/2,shape=new THREE.Shape();shape.moveTo(-r,0);shape.lineTo(-r,h);shape.lineTo(r,h);shape.lineTo(r,0);shape.quadraticCurveTo(r*.8,h*.08,r*.7,h*.28);shape.quadraticCurveTo(r*.4,h*.48,0,h*.82);shape.quadraticCurveTo(-r*.4,h*.48,-r*.7,h*.28);shape.quadraticCurveTo(-r*.8,h*.08,-r,0);const a=add(geo(`arch${w},${h}`,()=>new THREE.ExtrudeGeometry(shape,{depth:.16,bevelEnabled:false,curveSegments:10})),stone,x,y,z);if(side)a.rotation.y=Math.PI/2;}
 function cornice(x,y,z,w,d){box(w+.3,.16,d+.3,x,y,z);box(w+.55,.1,d+.55,x,y+.14,z,edge);box(w+.36,.12,d+.36,x,y+.25,z);for(let xx=x-w/2+.3;xx<x+w/2;xx+=.48){ring(.12,.035,xx,y+.36,z+d/2+.18);orb(.045,xx,y+.36,z+d/2+.23,edge);}}
 function tierRoof(x,y,z,w,d,levels=7){for(let i=0;i<levels;i++){const k=1-i/(levels+1),ww=w*k,dd=d*k;box(ww,.22,dd,x,y+i*.25,z);box(ww+.2,.07,dd+.2,x,y+i*.25+.13,z,edge);for(const dx of [-1,1])for(const dz of [-1,1]){cyl(.01,.1,.22,x+dx*ww*.48,y+i*.25+.24,z+dz*dd*.48);}}finial(x,y+levels*.25+.1,z,.75);}
 function tower(x,y,z,w,h){for(let i=0;i<30;i++){const t=i/30,ww=w*Math.pow(1-.86*t,.57);box(ww,h/30*.85,ww,x,y+i*h/30,z);box(ww+.08,.045,ww+.08,x,y+i*h/30+.08,z,edge);for(const side of [-1,1]){box(ww*.19,h/30,.18,x,y+i*h/30,z+side*ww/2);box(.18,h/30,ww*.19,x+side*ww/2,y+i*h/30,z);}}for(const dx of [-.8,0,.8]){box(.35,.7,.25,x+dx,y+.65,z+w/2+.08);cyl(.01,.25,.65,x+dx,y+1.3,z+w/2+.08);}finial(x,y+h+.12,z,.85);}
 function stairs(x,z,width,y=.8){const n=5;for(let i=0;i<n;i++){const step=box(width,.16,.38,x,.08+i*.16,z-i*.34,edge);step.userData.stair=true;}}
 function hall(x,z,w,d,y=.8,h=3,roof=true){box(w+.45,.25,d+.45,x,y-.13,z);for(const xx of [x-w/2,x,x+w/2])for(const zz of [z-d/2,z+d/2])pillar(xx,y,zz,h);for(const zz of [z-d/2,z+d/2])for(const xx of [x-w/4,x+w/4])arch(xx,y+h-.65,zz,w/2);for(const xx of [x-w/2,x+w/2])arch(xx,y+h-.65,z,d,.9,true);cornice(x,y+h+.1,z,w,d);if(roof)tierRoof(x,y+h+.5,z,w,d);}
 let entrance={x:0,z:5.7,y:.8};
 if(wide){
  box(25,.55,8.2,0,.25,0);for(const x of [-10,-5,0,5,10])box(4.9,.18,8.4,x,.61,0,edge);
  // Tall left sanctum with three stacked pillared galleries.
  box(3.8,6,4.6,-8,3.6,-.6,edge);for(let level=0;level<3;level++)hall(-8,0,5.1,5.8,.8+level*1.55,1.35,false);tower(-8,5.8,-.7,3.2,6.1);
  // Large central hall, lower open connector and right pavilion.
  box(5,4.6,4.6,-2.8,3,-.6);hall(-2.8,0,5.6,5.8,.8,4.5,false);tierRoof(-2.8,5.6,0,5.8,6.0,8);
  hall(3.5,.15,5.1,5.5,.8,1.45,false);hall(3.5,.15,5.1,5.5,2.55,1.45,false);tierRoof(3.5,4.4,.15,5.5,5.9,7);
  hall(9,.1,4.3,4.9,.8,1.9,false);tierRoof(9,3.1,.1,4.7,5.2,4);
  hall(-3.8,3.7,3.6,2.3,.8,1.45,false);hall(-3.8,3.7,3.6,2.3,2.5,1.45,false);tierRoof(-3.8,4.2,3.7,4.1,2.7,4);
  for(let x=-11.8;x<=11.8;x+=.3){box(.13,.44,.15,x,.3,4.18,edge);}
  stairs(3.5,5.6,3.0);entrance={x:3.5,z:5.6,y:.8};
 }else{
  const w=white?10:8,d=white?9:8;
  box(w+1,.48,d+1,0,.2,0,edge);box(w+.55,.25,d+.55,0,.56,0);box(w+.75,.12,d+.75,0,.74,0,edge);
  // Rear enclosed sanctum and forward pillared mandapa.
  const tx=-1.7,tz=-2.0;box(3.9,3.7,3.8,tx,2.6,tz);for(let y=1;y<4.5;y+=.3)box(4.0,.07,3.9,tx,y,tz,edge);
  cornice(tx,4.5,tz,4.2,4.1);tower(tx,4.95,tz,3.35,white?6.5:6.0);
  hall(.4,1.45,white?8.3:6.9,4.7,.82,3.25,false);tierRoof(.4,4.55,1.15,white?7.8:6.6,4.9,8);
  // Ornamental niches beside the open front arch.
  for(const x of [-2.4,2.4]){box(.75,2.3,.16,x,2,3.68,edge);box(.47,1.85,.1,x,2,3.8,door);arch(x,2.65,3.86,.6,.6);}
  if(white){
   // Low pierced balustrade, entry porch, flowers and the tall red-white flag.
   for(const x of [-4.7,4.7]){box(.2,.14,8.5,x,1.6,0);for(let z=-4;z<4.2;z+=.27){const b=box(.1,.14,.14,x,1.05+(Math.round((z+4)/.27)%2)*.23,z);b.rotation.x=Math.PI/4;}for(const z of [-4,-2,0,2,4]){box(.32,.9,.32,x,1.15,z);orb(.18,x,1.65,z);}}
   for(const x of [-3.3,3.3]){box(2.6,.14,.2,x,1.62,4.25);for(let xx=x-1.2;xx<x+1.3;xx+=.22)cyl(.06,.06,.72,xx,1.2,4.25);}
   for(const x of [-4.95,4.95])for(let z=-3.7;z<4.2;z+=.43){const bush=orb(.24,x,.69,z,green);bush.scale.y=.8;orb(.085,x,.92,z,new THREE.MeshStandardMaterial({color:Math.round(z*10)%2?'#963e75':'#ba4b34'}));}
   cyl(.025,.025,3.0,-2.0,12.7,-2.0,gold);const pts=[],uv=[];for(let i=0;i<=12;i++){const y=13.9-i*.17,x=-2.0+Math.sin(i*.38)*.35;pts.push(x,y,-2,x-.3,y-.1,-2);uv.push(0,i/12,1,i/12);}const flag=new THREE.BufferGeometry();flag.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));flag.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));const idx=[];for(let i=0;i<12;i++)idx.push(i*2,i*2+1,i*2+2,i*2+1,i*2+3,i*2+2);flag.setIndex(idx);flag.computeVertexNormals();const c=document.createElement('canvas');c.width=32;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#f2e9dc';ctx.fillRect(0,0,32,128);ctx.fillStyle='#b52e28';ctx.fillRect(8,0,16,128);add(flag,new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(c),side:THREE.DoubleSide}),0,0,0);
  }
  stairs(0,white?6:5.6,3);entrance={x:0,z:white?6:5.6,y:.8};
 }
 const shiva=createShiva();shiva.position.set(wide?-2.8:0,.9,wide?-1.5:-1);shiva.scale.setScalar(.65);root.add(shiva);
 // Repeated stone motifs remain real geometry, but share buffers to limit memory.
 return {root,entrance,plaque:new THREE.Vector3(entrance.x+1.7,.55,entrance.z-.5)};
}
