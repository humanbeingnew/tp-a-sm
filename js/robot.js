/* V4 robot model
   Coordinate convention:
   - Y up
   - Z front
   - X right
   Each motor has a separate 0..1023 center reference (512).
   The A-Type init values are pose data, not motor centers.
*/
const A_TYPE_INIT = [205,818,251,772,512,512,358,666,512,512,475,549,437,587,549,475,512,512];

const MOTOR_META = [
 {id:1,name:"R shoulder pitch",axis:"Z",sign:1},
 {id:2,name:"L shoulder pitch",axis:"Z",sign:-1},
 {id:3,name:"R shoulder roll",axis:"X",sign:1},
 {id:4,name:"L shoulder roll",axis:"X",sign:-1},
 {id:5,name:"R elbow",axis:"X",sign:1},
 {id:6,name:"L elbow",axis:"X",sign:-1},
 {id:7,name:"R hip yaw",axis:"Y",sign:1},
 {id:8,name:"L hip yaw",axis:"Y",sign:-1},
 {id:9,name:"R hip roll",axis:"Z",sign:1},
 {id:10,name:"L hip roll",axis:"Z",sign:-1},
 {id:11,name:"R hip pitch",axis:"X",sign:1},
 {id:12,name:"L hip pitch",axis:"X",sign:-1},
 {id:13,name:"R knee",axis:"X",sign:-1},
 {id:14,name:"L knee",axis:"X",sign:1},
 {id:15,name:"R ankle pitch",axis:"X",sign:1},
 {id:16,name:"L ankle pitch",axis:"X",sign:-1},
 {id:17,name:"R ankle roll",axis:"Z",sign:1},
 {id:18,name:"L ankle roll",axis:"Z",sign:-1}
];

function valueToDeg(v, sign=1) {
  return sign * (Number(v)-512) * (300/1023);
}

function makeBox(w,h,d){
  return new THREE.Mesh(
    new THREE.BoxGeometry(w,h,d),
    new THREE.MeshStandardMaterial({color:0x7f8995,metalness:.25,roughness:.6})
  );
}
function makeJoint(){
  const m=new THREE.Mesh(
    new THREE.SphereGeometry(0.105,16,12),
    new THREE.MeshStandardMaterial({color:0xb7bec7,metalness:.45,roughness:.42})
  );
  return m;
}
function makeLimb(a,b,r=.075){
  const dir=new THREE.Vector3().subVectors(b,a), len=dir.length();
  const m=new THREE.Mesh(
    new THREE.CylinderGeometry(r,r,len,12),
    new THREE.MeshStandardMaterial({color:0x69727d,metalness:.25,roughness:.65})
  );
  m.position.copy(a).add(b).multiplyScalar(.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());
  return m;
}

function buildRobot(scene){
  const root=new THREE.Group();
  root.position.y=1.55;
  scene.add(root);

  const torso=makeBox(.72,1.05,.36); torso.position.y=1.38; root.add(torso);
  const neck=makeJoint(); neck.position.set(0,1.98,0); root.add(neck);
  const head=makeBox(.38,.38,.34); head.position.set(0,2.23,.0); root.add(head);

  const parts={root,torso,head, arms:[], legs:[]};

  // Hierarchical chains. Joint groups rotate children rather than only the visible segment.
  for(const side of [-1,1]){
    const s=side<0?"R":"L", x=.48*side;
    const shoulder=new THREE.Group(); shoulder.position.set(x,1.72,0); root.add(shoulder);
    const upper=new THREE.Group(); upper.position.set(0,-.28,0); shoulder.add(upper);
    const elbow=new THREE.Group(); elbow.position.set(0,-.48,0); upper.add(elbow);
    const fore=new THREE.Group(); fore.position.set(0,-.06,0); elbow.add(fore);
    const hand=makeBox(.18,.25,.18); hand.position.y=-.34; fore.add(hand);
    const upperMesh=makeBox(.18,.56,.18); upperMesh.position.y=-.28; shoulder.add(upperMesh);
    const foreMesh=makeBox(.16,.55,.16); foreMesh.position.y=-.28; elbow.add(foreMesh);
    parts.arms.push({side,s,shoulder,upper,elbow,fore});
  }

  for(const side of [-1,1]){
    const s=side<0?"R":"L", x=.23*side;
    const hipYaw=new THREE.Group(); hipYaw.position.set(x,.86,0); root.add(hipYaw);
    const hipRoll=new THREE.Group(); hipRoll.position.set(0,-.05,0); hipYaw.add(hipRoll);
    const hipPitch=new THREE.Group(); hipPitch.position.set(0,-.12,0); hipRoll.add(hipPitch);
    const thigh=new THREE.Group(); thigh.position.set(0,-.12,0); hipPitch.add(thigh);
    const knee=new THREE.Group(); knee.position.set(0,-.48,0); thigh.add(knee);
    const shin=new THREE.Group(); shin.position.set(0,-.06,0); knee.add(shin);
    const anklePitch=new THREE.Group(); anklePitch.position.set(0,-.48,0); shin.add(anklePitch);
    const ankleRoll=new THREE.Group(); ankleRoll.position.set(0,-.08,0); anklePitch.add(ankleRoll);
    const foot=makeBox(.30,.12,.48); foot.position.set(0,-.06,.10); ankleRoll.add(foot);
    const thighMesh=makeBox(.22,.56,.22); thighMesh.position.y=-.28; hipPitch.add(thighMesh);
    const shinMesh=makeBox(.20,.56,.20); shinMesh.position.y=-.28; knee.add(shinMesh);
    parts.legs.push({side,s,hipYaw,hipRoll,hipPitch,thigh,knee,shin,anklePitch,ankleRoll});
  }
  return parts;
}

function applyRobotPose(parts, values){
  // reset every controlled group
  parts.arms.forEach(a=>{
    a.shoulder.rotation.set(0,0,0); a.upper.rotation.set(0,0,0); a.elbow.rotation.set(0,0,0);
  });
  parts.legs.forEach(l=>{
    [l.hipYaw,l.hipRoll,l.hipPitch,l.knee,l.anklePitch,l.ankleRoll].forEach(g=>g.rotation.set(0,0,0));
  });

  const rad=Math.PI/180;
  const deg=id=>valueToDeg(values[id-1], MOTOR_META[id-1].sign)*rad;
  const R=parts.arms[0], L=parts.arms[1];
  // Arm mapping: 1/2 pitch, 3/4 roll, 5/6 elbow.
  R.shoulder.rotation.z=deg(1); L.shoulder.rotation.z=deg(2);
  R.upper.rotation.x=deg(3); L.upper.rotation.x=deg(4);
  R.elbow.rotation.x=deg(5); L.elbow.rotation.x=deg(6);

  const r=parts.legs[0], l=parts.legs[1];
  r.hipYaw.rotation.y=deg(7); l.hipYaw.rotation.y=deg(8);
  r.hipRoll.rotation.z=deg(9); l.hipRoll.rotation.z=deg(10);
  r.hipPitch.rotation.x=deg(11); l.hipPitch.rotation.x=deg(12);
  r.knee.rotation.x=deg(13); l.knee.rotation.x=deg(14);
  r.anklePitch.rotation.x=deg(15); l.anklePitch.rotation.x=deg(16);
  r.ankleRoll.rotation.z=deg(17); l.ankleRoll.rotation.z=deg(18);
}
