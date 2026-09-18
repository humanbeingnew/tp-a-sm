/* ROBOTIS Premium Humanoid A-type browser kinematic definition.
 * Official motor IDs / initial values / mirror pairs are from ROBOTIS documentation.
 * The browser mesh is a simplified kinematic model, not ROBOTIS CAD.
 */
(function(){
  "use strict";
  const DEG=Math.PI/180;
  const INIT=[205,818,251,772,512,512,358,666,512,512,475,549,437,587,549,475,512,512];
  const MOTOR_DEFS=[
    {id:1,label:"오른쪽 어깨 Roll",name:"Right Shoulder Roll",joint:"RShoulderRoll",axis:"z",sign:1},
    {id:2,label:"왼쪽 어깨 Roll",name:"Left Shoulder Roll",joint:"LShoulderRoll",axis:"z",sign:-1},
    {id:3,label:"오른쪽 어깨 Pitch",name:"Right Shoulder Pitch",joint:"RShoulderPitch",axis:"x",sign:1},
    {id:4,label:"왼쪽 어깨 Pitch",name:"Left Shoulder Pitch",joint:"LShoulderPitch",axis:"x",sign:-1},
    {id:5,label:"오른쪽 팔꿈치",name:"Right Elbow",joint:"RElbow",axis:"x",sign:1},
    {id:6,label:"왼쪽 팔꿈치",name:"Left Elbow",joint:"LElbow",axis:"x",sign:-1},
    {id:7,label:"오른쪽 고관절 Yaw",name:"Right Hip Yaw",joint:"RHipYaw",axis:"y",sign:1},
    {id:8,label:"왼쪽 고관절 Yaw",name:"Left Hip Yaw",joint:"LHipYaw",axis:"y",sign:-1},
    {id:9,label:"오른쪽 고관절 Roll",name:"Right Hip Roll",joint:"RHipRoll",axis:"z",sign:1},
    {id:10,label:"왼쪽 고관절 Roll",name:"Left Hip Roll",joint:"LHipRoll",axis:"z",sign:-1},
    {id:11,label:"오른쪽 고관절 Pitch",name:"Right Hip Pitch",joint:"RHipPitch",axis:"x",sign:1},
    {id:12,label:"왼쪽 고관절 Pitch",name:"Left Hip Pitch",joint:"LHipPitch",axis:"x",sign:-1},
    {id:13,label:"오른쪽 무릎",name:"Right Knee",joint:"RKnee",axis:"x",sign:1},
    {id:14,label:"왼쪽 무릎",name:"Left Knee",joint:"LKnee",axis:"x",sign:-1},
    {id:15,label:"오른쪽 발목 Pitch",name:"Right Ankle Pitch",joint:"RAnklePitch",axis:"x",sign:1},
    {id:16,label:"왼쪽 발목 Pitch",name:"Left Ankle Pitch",joint:"LAnklePitch",axis:"x",sign:-1},
    {id:17,label:"오른쪽 발목 Roll",name:"Right Ankle Roll",joint:"RAnkleRoll",axis:"z",sign:1},
    {id:18,label:"왼쪽 발목 Roll",name:"Left Ankle Roll",joint:"LAnkleRoll",axis:"z",sign:-1}
  ];
  window.HumanoidA={DEG,INIT,MOTOR_DEFS,RESOLUTION_DEG:300/1024};
})();
