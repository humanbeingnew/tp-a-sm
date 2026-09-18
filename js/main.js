let scene,camera,renderer,robot,values=[...A_TYPE_INIT], dragging=false,lastX=0,lastY=0,camYaw=0.25,camPitch=.08,camDist=4.5;

const $=id=>document.getElementById(id);

function init3D(){
  scene=new THREE.Scene();
  scene.background=new THREE.Color(0x0f1115);
  camera=new THREE.PerspectiveCamera(42,1,.05,100);
  renderer=new THREE.WebGLRenderer({canvas:$("view"),antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.outputColorSpace=THREE.SRGBColorSpace;

  const hemi=new THREE.HemisphereLight(0xffffff,0x30343a,2.1); scene.add(hemi);
  const key=new THREE.DirectionalLight(0xffffff,2.2); key.position.set(3,5,5); scene.add(key);

  const floor=new THREE.Mesh(new THREE.PlaneGeometry(8,8),new THREE.MeshStandardMaterial({color:0x24282e,roughness:.9}));
  floor.rotation.x=-Math.PI/2; floor.position.y=0; scene.add(floor);
  robot=buildRobot(scene);
  resize();
  setCameraFront();
  apply();
  window.addEventListener("resize",resize);
  $("view").addEventListener("pointerdown",e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;$("view").setPointerCapture(e.pointerId)});
  $("view").addEventListener("pointerup",()=>dragging=false);
  $("view").addEventListener("pointermove",e=>{
    if(!dragging)return;
    camYaw-=(e.clientX-lastX)*.008; camPitch-=(e.clientY-lastY)*.006;
    camPitch=Math.max(-.9,Math.min(.9,camPitch)); lastX=e.clientX;lastY=e.clientY;updateCamera();
  });
  $("view").addEventListener("wheel",e=>{e.preventDefault();camDist*=Math.exp(e.deltaY*.001);camDist=Math.max(2.5,Math.min(8,camDist));updateCamera()},{passive:false});
  requestAnimationFrame(loop);
}
function resize(){const c=$("view"),w=c.clientWidth,h=c.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/Math.max(1,h);camera.updateProjectionMatrix()}
function updateCamera(){
  const target=new THREE.Vector3(0,1.2,0);
  camera.position.set(
    Math.sin(camYaw)*Math.cos(camPitch)*camDist,
    target.y+Math.sin(camPitch)*camDist,
    Math.cos(camYaw)*Math.cos(camPitch)*camDist
  ); camera.lookAt(target);
}
function setCameraFront(){camYaw=0;camPitch=.05;camDist=4.4;updateCamera()}
function loop(){renderer.render(scene,camera);requestAnimationFrame(loop)}

function buildControls(){
  const box=$("motors");
  MOTOR_META.forEach((m,i)=>{
    const row=document.createElement("div");row.className="motor";
    row.innerHTML=`<div class="motor-top">
      <div class="motor-id">ID ${m.id}</div>
      <div class="motor-name">${m.name}</div>
      <div class="val" id="v${m.id}">${values[i]}</div>
      <div class="center">C 512</div>
    </div>
    <input id="r${m.id}" type="range" min="0" max="1023" step="1" value="${values[i]}" aria-label="Motor ${m.id}">
    <input id="n${m.id}" type="number" min="0" max="1023" step="1" value="${values[i]}" aria-label="Motor ${m.id} numeric value">`;
    box.appendChild(row);
    const range=$("r"+m.id), num=$("n"+m.id);
    const set=v=>{
      v=Math.max(0,Math.min(1023,Number.isFinite(Number(v))?Math.round(Number(v)):512));
      values[i]=v;range.value=v;num.value=v;$("v"+m.id).textContent=v;apply();
    };
    range.addEventListener("input",e=>set(e.target.value));
    num.addEventListener("input",e=>set(e.target.value));
  });
}
function sync(){
  MOTOR_META.forEach((m,i)=>{$("r"+m.id).value=values[i];$("n"+m.id).value=values[i];$("v"+m.id).textContent=values[i]});
  $("arrayOut").textContent="["+values.join(", ")+"]";
}
function apply(){
  if(robot)applyRobotPose(robot,values);
  sync();
  const center=values.filter(v=>v===512).length;
  $("poseReadout").textContent=`${center}/18 motors at center 512`;
}
function setPose(arr,label){
  values=arr.map(v=>Math.max(0,Math.min(1023,Math.round(v))));
  apply(); $("poseReadout").textContent=label;
}
$("resetBtn").addEventListener("click",()=>setPose(A_TYPE_INIT,"Pose: A-Type Initial"));
$("centerBtn").addEventListener("click",()=>setPose(Array(18).fill(512),"Pose: All Center 512"));
$("frontBtn").addEventListener("click",setCameraFront);
$("copyBtn").addEventListener("click",async()=>{
  const text=JSON.stringify(values);
  try{await navigator.clipboard.writeText(text);$("status").textContent="COPIED"}catch{$("status").textContent="COPY: select array manually"}
  setTimeout(()=>$("status").textContent="READY",1200);
});

buildControls();init3D();
