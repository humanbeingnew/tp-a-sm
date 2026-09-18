let scene,camera,renderer,robot,values=[...INIT],yaw=0,pitch=.04,dist=4.5,drag=false,lx=0,ly=0;
const $=id=>document.getElementById(id);
function setup(){
 scene=new THREE.Scene();scene.background=new THREE.Color(0x0e1013);
 camera=new THREE.PerspectiveCamera(40,1,.05,100);
 renderer=new THREE.WebGLRenderer({canvas:$("view"),antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));
 scene.add(new THREE.HemisphereLight(0xffffff,0x35383d,2.2));const dl=new THREE.DirectionalLight(0xffffff,2.4);dl.position.set(3,5,4);scene.add(dl);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(8,8),new THREE.MeshStandardMaterial({color:0x252a30,roughness:.9}));floor.rotation.x=-Math.PI/2;scene.add(floor);
 robot=buildRobot(scene);resize();front();apply();
 addEvents();requestAnimationFrame(loop);
}
function resize(){const c=$("view"),w=c.clientWidth,h=c.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/Math.max(1,h);camera.updateProjectionMatrix()}
function cam(){const t=new THREE.Vector3(0,1.25,0);camera.position.set(Math.sin(yaw)*Math.cos(pitch)*dist,t.y+Math.sin(pitch)*dist,Math.cos(yaw)*Math.cos(pitch)*dist);camera.lookAt(t)}
function front(){yaw=0;pitch=.04;dist=4.5;cam()}
function loop(){renderer.render(scene,camera);requestAnimationFrame(loop)}
function addEvents(){
 window.addEventListener("resize",resize);const c=$("view");
 c.addEventListener("pointerdown",e=>{drag=true;lx=e.clientX;ly=e.clientY;c.setPointerCapture(e.pointerId)});
 c.addEventListener("pointerup",()=>drag=false);c.addEventListener("pointermove",e=>{if(!drag)return;yaw-=(e.clientX-lx)*.008;pitch-=(e.clientY-ly)*.006;pitch=Math.max(-.8,Math.min(.8,pitch));lx=e.clientX;ly=e.clientY;cam()});
 c.addEventListener("wheel",e=>{e.preventDefault();dist=Math.max(2.8,Math.min(7,dist*Math.exp(e.deltaY*.001)));cam()},{passive:false});
}
function controls(){
 const list=$("list");
 META.forEach((m,i)=>{
  const d=document.createElement("div");d.className="motor";d.innerHTML=`<div class="top"><span class="id">ID ${m.id}</span><span class="name">${m.name}</span><span class="val" id="v${m.id}">${values[i]}</span><span class="init">I ${INIT[i]}</span></div><input id="r${m.id}" type="range" min="0" max="1023" step="1" value="${values[i]}"><input id="n${m.id}" type="number" min="0" max="1023" step="1" value="${values[i]}">`;
  list.appendChild(d);
  const set=v=>{v=Number(v);if(!Number.isFinite(v))return;v=Math.max(0,Math.min(1023,Math.round(v)));values[i]=v;$("r"+m.id).value=v;$("n"+m.id).value=v;$("v"+m.id).textContent=v;apply()};
  $("r"+m.id).addEventListener("input",e=>set(e.target.value));$("n"+m.id).addEventListener("input",e=>set(e.target.value));
 });
}
function sync(){$("out").textContent="["+values.join(", ")+"]"}
function apply(){applyPose(robot,values);sync();$("status").textContent=values.every((v,i)=>v===INIT[i])?"INIT":values.every(v=>v===512)?"CENTER":"EDITING"}
function setValues(v){values=v.slice();META.forEach((m,i)=>{$("r"+m.id).value=values[i];$("n"+m.id).value=values[i];$("v"+m.id).textContent=values[i]});apply()}
$("init").addEventListener("click",()=>setValues(INIT));
$("center").addEventListener("click",()=>setValues(Array(18).fill(512)));
$("front").addEventListener("click",front);
$("copy").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(JSON.stringify(values));$("status").textContent="COPIED";setTimeout(apply,900)}catch{$("status").textContent="COPY FAILED"}});
controls();setup();
