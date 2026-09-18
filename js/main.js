(function(){
"use strict";
const R = window.HumanoidA;
const $ = (s)=>document.querySelector(s);
const state = { values:R.INIT.slice(), selected:null };

let scene, camera, renderer, root;
const joints = {};
const THREE = window.THREE;

function material(color, metal=0.25, rough=.6){return new THREE.MeshStandardMaterial({color,metalness:metal,roughness:rough});}
function box(w,h,d,mat){return new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);}
function cyl(r,h,mat){return new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,20),mat);}

function makePart(parent, name, x,y,z, w,h,d, mat){
  const m=box(w,h,d,mat); m.position.set(x,y,z); parent.add(m); return m;
}
function makeLimb(parent, len, width, depth, mat){
  const m=box(width,len,depth,mat); m.position.y=-len/2; parent.add(m); return m;
}
function jointMarker(parent){
  const m=new THREE.Mesh(new THREE.SphereGeometry(7,16,12),material(0x7b8798,.5,.45));
  parent.add(m); return m;
}

function buildRobot(){
  root=new THREE.Group(); scene.add(root);
  const dark=material(0x303844,.55,.45), light=material(0x697585,.45,.38), accent=material(0xb8c1cc,.35,.45);
  const jointMat=material(0x151b23,.8,.3);

  const pelvis=new THREE.Group(); pelvis.position.y=305; root.add(pelvis);
  makePart(pelvis,"pelvis",0,0,0,120,58,58,light);

  const torso=new THREE.Group(); torso.position.y=40; pelvis.add(torso);
  makePart(torso,"torso",0,82,0,112,160,60,light);
  makePart(torso,"chest",0,145,0,124,22,66,accent);
  const head=new THREE.Group(); head.position.y=185; torso.add(head);
  makePart(head,"head",0,25,0,64,52,58,light);
  const face=makePart(head,"face",0,28,-30,42,26,3,accent); face.position.z=-30;

  function arm(side){
    const s=side==="R"?1:-1, shoulder=new THREE.Group();
    shoulder.position.set(s*70,145,0); torso.add(shoulder);
    const shoulderJoint=new THREE.Group(); shoulder.add(shoulderJoint);
    const upper=makeLimb(shoulderJoint,118,30,30,dark);
    upper.position.y=-59;
    const elbow=new THREE.Group(); elbow.position.y=-118; shoulderJoint.add(elbow);
    jointMarker(elbow);
    const fore=makeLimb(elbow,105,27,27,light); fore.position.y=-52.5;
    const wrist=new THREE.Group(); wrist.position.y=-105; elbow.add(wrist);
    jointMarker(wrist);
    const hand=makePart(wrist,"hand",0,-22,0,35,44,30,accent);
    joints[side+"ShoulderPitch"]=shoulderJoint;
    joints[side+"ShoulderRoll"]=shoulder;
    joints[side+"Elbow"]=elbow;
    joints[side+"Wrist"]=wrist;
  }
  arm("R"); arm("L");

  function leg(side){
    const s=side==="R"?1:-1, hip=new THREE.Group();
    hip.position.set(s*39,0,0); pelvis.add(hip);
    const thigh=makeLimb(hip,125,38,42,dark); thigh.position.y=-62.5;
    const knee=new THREE.Group(); knee.position.y=-125; hip.add(knee); jointMarker(knee);
    const shin=makeLimb(knee,118,34,38,light); shin.position.y=-59;
    const ankle=new THREE.Group(); ankle.position.y=-118; knee.add(ankle); jointMarker(ankle);
    const foot=makePart(ankle,"foot",0,-17,12,50,34,78,accent);
    foot.rotation.x=0;
    joints[side+"HipRoll"]=hip; joints[side+"HipPitch"]=hip;
    joints[side+"Knee"]=knee;
    joints[side+"AnklePitch"]=ankle; joints[side+"AnkleRoll"]=ankle;
  }
  leg("R"); leg("L");

  // floor
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(900,900),new THREE.MeshStandardMaterial({color:0x10151c,roughness:.9,metalness:.05}));
  floor.rotation.x=-Math.PI/2; floor.position.y=-275; scene.add(floor);
  const grid=new THREE.GridHelper(700,28,0x29313c,0x1b222c); grid.position.y=-274.5; scene.add(grid);
}

function setupScene(){
  const el=$("#scene");
  scene=new THREE.Scene();
  camera=new THREE.PerspectiveCamera(34,1,.1,3000);
  camera.position.set(650,390,850); camera.lookAt(0,210,0);
  renderer=new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setClearColor(0x0b0e13,1);
  el.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xcbd5e1,0x202735,1.8));
  const key=new THREE.DirectionalLight(0xffffff,2.1); key.position.set(300,700,500); scene.add(key);
  const rim=new THREE.DirectionalLight(0x91a4bc,1.2); rim.position.set(-500,300,-400); scene.add(rim);
  buildRobot();
  resize();
  let dragging=false,lastX=0,lastY=0,theta=.25,phi=1.42,dist=1080;
  const updateCam=()=>{camera.position.set(dist*Math.sin(phi)*Math.sin(theta),210+dist*Math.cos(phi),dist*Math.sin(phi)*Math.cos(theta));camera.lookAt(0,190,0)};
  updateCam();
  renderer.domElement.addEventListener("pointerdown",e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)});
  renderer.domElement.addEventListener("pointermove",e=>{if(!dragging)return;theta+=(e.clientX-lastX)*.008;phi=Math.max(.35,Math.min(2.6,phi-(e.clientY-lastY)*.006));lastX=e.clientX;lastY=e.clientY;updateCam()});
  renderer.domElement.addEventListener("pointerup",()=>dragging=false);
  renderer.domElement.addEventListener("wheel",e=>{e.preventDefault();dist=Math.max(600,Math.min(1500,dist+e.deltaY*.6));updateCam()},{passive:false});
  $("#frontBtn").addEventListener("click",()=>{theta=0;phi=1.42;dist=1080;updateCam()});
  $("#resetViewBtn").addEventListener("click",()=>{theta=.25;phi=1.42;dist=1080;updateCam()});
  window.addEventListener("resize",resize);
  function resize(){const w=el.clientWidth,h=Math.max(480,el.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
  (function tick(){requestAnimationFrame(tick);renderer.render(scene,camera)})();
}

function motorAngle(v){return (v-512)*300/1024*R.DEG;}
function applyMotor(id,v){
  const d=R.MOTOR_DEFS[id-1], a=motorAngle(v)*d.sign;
  let target=null;
  if(id<=2) target=joints[(id===1?"R":"L")+"ShoulderPitch"];
  else if(id<=4) target=joints[(id===3?"R":"L")+"ShoulderRoll"];
  else if(id<=6) target=joints[(id===5?"R":"L")+"Elbow"];
  else if(id<=8) target=joints[(id===7?"R":"L")+"Wrist"];
  else if(id<=10) target=joints[(id===9?"R":"L")+"HipRoll"];
  else if(id<=12) target=joints[(id===11?"R":"L")+"HipPitch"];
  else if(id<=14) target=joints[(id===13?"R":"L")+"Knee"];
  else if(id<=16) target=joints[(id===15?"R":"L")+"AnklePitch"];
  else target=joints[(id===17?"R":"L")+"AnkleRoll"];
  if(!target)return;
  target.rotation[d.axis]=a;
}

function applyAll(){for(let i=1;i<=18;i++)applyMotor(i,state.values[i-1]);updateUI()}

function buildControls(){
  const list=$("#motorList");
  R.MOTOR_DEFS.forEach((d,i)=>{
    const row=document.createElement("div");row.className="motor";row.dataset.id=d.id;
    row.innerHTML=`<div class="motor-id">${d.id}</div><div class="motor-name"><strong>${d.label}</strong><small>${d.name}</small></div><input aria-label="Motor ${d.id} value" type="range" min="0" max="1023" value="${state.values[i]}"><input aria-label="Motor ${d.id} numeric value" type="number" min="0" max="1023" value="${state.values[i]}">`;
    const range=row.querySelector('input[type="range"]'), num=row.querySelector('input[type="number"]');
    const set=(raw)=>{
      let v=Number(raw); if(!Number.isFinite(v))v=state.values[i];v=Math.round(Math.max(0,Math.min(1023,v)));
      state.values[i]=v;range.value=v;num.value=v;applyMotor(d.id,v);updateUI();
    };
    range.addEventListener("input",e=>set(e.target.value));
    num.addEventListener("input",e=>set(e.target.value));
    row.addEventListener("click",()=>{document.querySelectorAll(".motor.selected").forEach(x=>x.classList.remove("selected"));row.classList.add("selected");state.selected=d.id;$("#selectedJoint").textContent=`ID ${d.id} · ${d.label}`});
    list.appendChild(row);
  });
}
function resetPose(){state.values=R.INIT.slice();document.querySelectorAll(".motor").forEach((row,i)=>{row.querySelector('input[type="range"]').value=state.values[i];row.querySelector('input[type="number"]').value=state.values[i]});applyAll();$("#message").textContent="ROBOTIS가 공개한 Premium Humanoid A-type 초기값으로 복원했습니다."}
function updateUI(){
  const changed=state.values.reduce((n,v,i)=>n+(v!==R.INIT[i]?1:0),0);$("#changedCount").textContent=`${changed} / 18 변경`;
  $("#poseOutput").textContent="["+state.values.join(", ")+"]";
}
$("#resetPoseBtn").addEventListener("click",resetPose);
$("#copyValuesBtn").addEventListener("click",async()=>{const t=JSON.stringify(state.values);try{await navigator.clipboard.writeText(t);$("#message").textContent="현재 18개 모터값을 복사했습니다."}catch(e){$("#message").textContent="브라우저 권한으로 자동 복사가 막혔습니다. 아래 값을 직접 복사하세요."}});
buildControls();setupScene();applyAll();
$("#statusText").textContent="18 MOTORS CONNECTED";$("#mappedCount").textContent="18 / 18";
})();
