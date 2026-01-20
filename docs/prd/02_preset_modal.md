# PRD: Preset Configuration Modal

## 1. 개요 (Overview)
- **화면명**: Preset Configuration Modal (프리셋 설정 모달)
- **목적**: 명상 세션의 구체적인 옵션(지속 시간, 준비 시간, 시작 종소리)을 세밀하게 조정하고 저장함.
- **UI 패턴**: 바텀 시트(Bottom Sheet) 스타일의 오버레이 모달.

## 2. 주요 기능 (Key Features)
### 2.1. 지속 시간 설정 (Duration)
- **휠 피커 (Wheel Picker)**: 분(min)과 초(sec)를 수직 스크롤 휠 방식으로 선택.
- **시각적 가이드**: 선택된 숫자는 크고 진하게 표시하고 위아래는 투명도 그라데이션 적용.

### 2.2. 세션별 맞춤 설정
- **시간 조절**: 1분 단위 증감 버튼 및 길게 누르기 시 가속 기능 제공.
- **준비 시간**: 0s, 10s, 20s, 30s 중 선택 가능.
- **오디오 구성 (Audio Config)**:
    - **종소리 (Bell)**: 명상 시작/종료 시 울릴 사운드 선택 (Tibetan, Gong 등).
    - **배경음 (Ambient)**: 세션 내내 루핑될 사운드 선택 (Rain, Forest 등).
- **저장**: 설정된 오디오 정보는 프리셋별로 저장되어 세션 시작 시 자동 적용됨.

### 2.3. 액션 버튼
- **Save Changes**: 변경된 사항을 저장하고 모달 닫기.
- **Cancel**: 저장하지 않고 나가기.

## 3. UI 컴포넌트 및 레이아웃 (Components & Layout)
- **Layout**: 화면 하단에서 위로 올라오는 애니메이션 적용 (`animate-slide-up`).
- **컴포넌트 리스트**:
    - `DragHandle`: 모달 상단의 바 형태 디자인 요소.
    - `WheelSelector`: `min:sec` 구조의 수직 스태킹 컨테이너.
    - `ToggleGroup`: 세그먼트 컨트롤 형태의 준비 시간 버튼.
    - `HorizontalScrollContainer`: 커스텀 스크롤바가 숨겨진 소리 선택 영역.

## 4. 기술적 고려사항 (Technical Details)
- **애니메이션**: `cubic-bezier`를 이용한 부드러운 `slideUp` 효과.
- **마스킹**: 휠 피커 상하단에 `linear-gradient` 마스크를 씌워 페이드인/아웃 효과 구현.
- **인터랙션**: 버튼 클릭 시 `active:scale-95` 스케일 애니메이션.

## 5. 관련 리소스 (References)
- **HTML 코드**: `stitch/preset_configuration_modal/code.html`
- **화면 이미지**: `stitch/preset_configuration_modal/screen.png`
