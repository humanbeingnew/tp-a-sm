/* 
 * Kinematic model for the browser simulator.
 * The motor IDs, initial values and mirror groups are taken from ROBOTIS'
 * published Premium Humanoid A-type example. The visual mesh below is a
 * simplified browser model; it is intentionally not presented as ROBOTIS CAD.
 */
(function(){
  "use strict";
  const DEG = Math.PI / 180;
  const INIT = [205,818,251,772,512,512,358,666,512,512,475,549,437,587,549,475,512,512];

  const MOTOR_DEFS = [
    {id:1, name:"Right Shoulder Pitch", group:"ARM · R", axis:"x", sign: 1,  label:"오른쪽 어깨 Pitch"},
    {id:2, name:"Left Shoulder Pitch",  group:"ARM · L", axis:"x", sign:-1,  label:"왼쪽 어깨 Pitch"},
    {id:3, name:"Right Shoulder Roll",  group:"ARM · R", axis:"z", sign: 1,  label:"오른쪽 어깨 Roll"},
    {id:4, name:"Left Shoulder Roll",   group:"ARM · L", axis:"z", sign:-1,  label:"왼쪽 어깨 Roll"},
    {id:5, name:"Right Elbow",          group:"ARM · R", axis:"x", sign: 1,  label:"오른쪽 팔꿈치"},
    {id:6, name:"Left Elbow",           group:"ARM · L", axis:"x", sign:-1,  label:"왼쪽 팔꿈치"},
    {id:7, name:"Right Wrist",          group:"ARM · R", axis:"y", sign: 1,  label:"오른쪽 손목"},
    {id:8, name:"Left Wrist",           group:"ARM · L", axis:"y", sign:-1,  label:"왼쪽 손목"},
    {id:9, name:"Right Hip Roll",       group:"LEG · R", axis:"z", sign: 1,  label:"오른쪽 골반 Roll"},
    {id:10,name:"Left Hip Roll",        group:"LEG · L", axis:"z", sign:-1,  label:"왼쪽 골반 Roll"},
    {id:11,name:"Right Hip Pitch",      group:"LEG · R", axis:"x", sign: 1,  label:"오른쪽 골반 Pitch"},
    {id:12,name:"Left Hip Pitch",       group:"LEG · L", axis:"x", sign:-1,  label:"왼쪽 골반 Pitch"},
    {id:13,name:"Right Knee",           group:"LEG · R", axis:"x", sign: 1,  label:"오른쪽 무릎"},
    {id:14,name:"Left Knee",            group:"LEG · L", axis:"x", sign:-1,  label:"왼쪽 무릎"},
    {id:15,name:"Right Ankle Pitch",    group:"LEG · R", axis:"x", sign: 1,  label:"오른쪽 발목 Pitch"},
    {id:16,name:"Left Ankle Pitch",     group:"LEG · L", axis:"x", sign:-1,  label:"왼쪽 발목 Pitch"},
    {id:17,name:"Right Ankle Roll",     group:"LEG · R", axis:"z", sign: 1,  label:"오른쪽 발목 Roll"},
    {id:18,name:"Left Ankle Roll",      group:"LEG · L", axis:"z", sign:-1,  label:"왼쪽 발목 Roll"}
  ];
  window.HumanoidA = {DEG, INIT, MOTOR_DEFS};
})();
