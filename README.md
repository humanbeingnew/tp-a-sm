# ROBOTIS Premium Humanoid A-Type Simulator

브라우저에서 실행하는 **18-motor Premium Humanoid A-Type 모션/포즈 실험용 시뮬레이터**입니다.

## 현재 버전에서 고친 것

- ROBOTIS 공개 문서의 Premium Humanoid A-type 초기 모터값 18개 반영
- 18개 모터 모두 3D 관절에 연결
- 상위 관절 → 하위 관절로 이어지는 계층형 구조
- 슬라이더와 숫자 입력을 서로 동기화
- 0~1023 입력 검증 및 클램프
- 초기 자세 복원
- 현재 포즈 배열 표시/복사
- 3D 회전/줌/정면/뷰 리셋
- 모바일/좁은 화면 반응형 레이아웃
- 외부 3D 모델(CAD) 없이 실행되는 정적 GitHub Pages 구조

## 중요한 정확도 안내

이 프로젝트의 **모터 ID, 초기값, 좌우 미러 그룹은 ROBOTIS가 공개한 Premium Humanoid A-type 예제를 기준**으로 했습니다.

반면 브라우저의 3D 몸체는 ROBOTIS의 CAD/IGES 파일을 재배포하지 않고 동작을 검증하기 위해 만든 **단순화된 자체 모델**입니다. 따라서 이 버전은 실제 R+ Motion의 CAD 형상과 1:1 동일한 모델이라고 주장하지 않습니다.

다음 단계에서는 실제 R+ Motion의 `RobotInfo/Object3D` 구조와 더 가까운 관절 좌표/축 보정을 추가할 수 있습니다.

## 실행

`index.html`을 정적 웹서버 또는 GitHub Pages에서 실행합니다.

### GitHub Pages

1. GitHub 저장소 생성
2. 이 폴더의 파일 업로드
3. Settings → Pages
4. Branch를 선택해 배포

Three.js는 jsDelivr CDN을 사용합니다.

## 모터 초기값

```text
[205, 818, 251, 772, 512, 512, 358, 666,
 512, 512, 475, 549, 437, 587, 549, 475,
 512, 512]
```

출처: ROBOTIS R+ Motion 문서의 Premium Humanoid A-type 예제.

## 다음 개발 단계

- 실제 R+ Motion `Object3D`에 가까운 관절 축/좌표 보정
- 모터값 ↔ 각도 표시
- Key Frame 편집
- 모션 재생
- 모션 저장/불러오기
- R+ Motion 2/3용 값 출력 포맷
- 손인사 같은 자연어 모션을 Key Frame으로 변환
