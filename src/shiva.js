import * as THREE from 'three';
// Shared sculpture keeps the exterior doorway and first-person shrine consistent.
export function createShiva(){
 const group=new THREE.Group();const black=new THREE.MeshStandardMaterial({color:'#101214',roughness:.32,metalness:.12}),white=new THREE.MeshStandardMaterial({color:'#e4dfd3'}),red=new THREE.MeshStandardMaterial({color:'#a83725'});
 function add(geo,mat,x,y,z){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;group.add(m);return m;}
 const base=add(new THREE.CylinderGeometry(.57,.65,.16,32),black,0,.08,0);base.scale.z=.75;
 add(new THREE.BoxGeometry(.85,.1,.22),black,.62,.11,0);add(new THREE.CylinderGeometry(.3,.34,.73,32),black,0,.52,0);
 const crown=add(new THREE.SphereGeometry(.3,24,16),black,0,.89,0);crown.scale.y=.75;
 for(let i=0;i<3;i++)add(new THREE.BoxGeometry(.42,.035,.015),white,0,.70+i*.075,.307);
 add(new THREE.SphereGeometry(.035,16,12),red,0,.78,.33);return group;
}
