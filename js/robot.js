const INIT=[205,818,251,772,512,512,358,666,512,512,475,549,437,587,549,475,512,512];
const META=[
{id:1,name:"R Shoulder Pitch",side:"R",joint:"shoulderPitch",sign:1},{id:2,name:"L Shoulder Pitch",side:"L",joint:"shoulderPitch",sign:-1},
{id:3,name:"R Shoulder Roll",side:"R",joint:"shoulderRoll",sign:1},{id:4,name:"L Shoulder Roll",side:"L",joint:"shoulderRoll",sign:-1},
{id:5,name:"R Elbow",side:"R",joint:"elbow",sign:1},{id:6,name:"L Elbow",side:"L",joint:"elbow",sign:-1},
{id:7,name:"R Hip Yaw",side:"R",joint:"hipYaw",sign:1},{id:8,name:"L Hip Yaw",side:"L",joint:"hipYaw",sign:-1},
{id:9,name:"R Hip Roll",side:"R",joint:"hipRoll",sign:1},{id:10,name:"L Hip Roll",side:"L",joint:"hipRoll",sign:-1},
{id:11,name:"R Hip Pitch",side:"R",joint:"hipPitch",sign:1},{id:12,name:"L Hip Pitch",side:"L",joint:"hipPitch",sign:-1},
{id:13,name:"R Knee",side:"R",joint:"knee",sign:1},{id:14,name:"L Knee",side:"L",joint:"knee",sign:-1},
{id:15,name:"R Ankle Pitch",side:"R",joint:"anklePitch",sign:1},{id:16,name:"L Ankle Pitch",side:"L",joint:"anklePitch",sign:-1},
{id:17,name:"R Ankle Roll",side:"R",joint:"ankleRoll",sign:1},{id:18,name:"L Ankle Roll",side:"L",joint:"ankleRoll",sign:-1}];
const DEG=(v,i)=>META[i].sign*(v-INIT[i])*(300/1023)*Math.PI/180;
function box(w,h,d){return new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color:0x747d87,metalness:.25,roughness:.6}))}
function limb(w,h,d){return box(w,h,d)}
function buildRobot(scene){
 const root=new THREE.Group(); root.position.y=0; scene.add(root);
 const torso=box(.72,1.0,.34); torso.position.y=1.72; root.add(torso);
 const head=box(.38,.38,.34); head.position.y=2.41; root.add(head);
 const neck=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.12,12),new THREE.MeshStandardMaterial({color:0xb8bec6}));neck.position.y=2.16;root.add(neck);
 const arms=[],legs=[];
 [-1,1].forEach(side=>{
   const x=.48*side, shoulder=new THREE.Group(); shoulder.position.set(x,1.98,0); root.add(shoulder);
   const upper=new THREE.Group(); shoulder.add(upper); upper.position.y=-.31;
   const elbow=new THREE.Group(); elbow.position.y=-.30; upper.add(elbow);
   const fore=new THREE.Group(); fore.position.y=-.03; elbow.add(fore);
   const hand=box(.18,.22,.18);hand.position.y=-.30;fore.add(hand);
   const um=box(.19,.58,.19);um.position.y=-.29;shoulder.add(um);
   const fm=box(.17,.58,.17);fm.position.y=-.29;elbow.add(fm);
   arms.push({side,shoulder,upper,elbow,fore});
   const hipYaw=new THREE.Group();hipYaw.position.set(.23*side,.91,0);root.add(hipYaw);
   const hipRoll=new THREE.Group();hipYaw.add(hipRoll);
   const hipPitch=new THREE.Group();hipPitch.position.y=-.10;hipRoll.add(hipPitch);
   const knee=new THREE.Group();knee.position.y=-.55;hipPitch.add(knee);
   const anklePitch=new THREE.Group();anklePitch.position.y=-.54;knee.add(anklePitch);
   const ankleRoll=new THREE.Group();ankleRoll.position.y=-.06;anklePitch.add(ankleRoll);
   const thigh=box(.23,.65,.23);thigh.position.y=-.30;hipPitch.add(thigh);
   const shin=box(.21,.65,.21);shin.position.y=-.30;knee.add(shin);
   const foot=box(.31,.12,.48);foot.position.set(0,-.06,.10);ankleRoll.add(foot);
   legs.push({side,hipYaw,hipRoll,hipPitch,knee,anklePitch,ankleRoll});
 });
 return {root,arms,legs};
}
function applyPose(robot,v){
 robot.arms.forEach((a,i)=>{
   const base=i===0?0:1, m1=base, m2=base+2, m3=base+4;
   a.shoulder.rotation.set(0,0,DEG(v[m1],m1));
   a.upper.rotation.x=DEG(v[m2],m2);
   a.elbow.rotation.x=DEG(v[m3],m3);
 });
 robot.legs.forEach((l,i)=>{
   const base=i===0?6:7;
   const ids=[base,base+2,base+4,base+6,base+8,base+10];
   l.hipYaw.rotation.y=DEG(v[ids[0]],ids[0]);
   l.hipRoll.rotation.z=DEG(v[ids[1]],ids[1]);
   l.hipPitch.rotation.x=DEG(v[ids[2]],ids[2]);
   l.knee.rotation.x=DEG(v[ids[3]],ids[3]);
   l.anklePitch.rotation.x=DEG(v[ids[4]],ids[4]);
   l.ankleRoll.rotation.z=DEG(v[ids[5]],ids[5]);
 });
}
