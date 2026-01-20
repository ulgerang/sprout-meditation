# PRD: Active Meditation Session

## 1. 개요 (Overview)
- **화면명**: Active Meditation Session (진행 중인 명상 세션)
- **목적**: 사용자가 명상에 온전히 집중할 수 있도록 불필요한 요소를 배제하고, 진행 상황과 호흡 가이드를 시각적으로 제공함.
- **주요 가치**: 극도의 미니멀리즘, 시각적 평안, 호흡 가이드.

## 2. 주요 기능 (Key Features)
### 2.1. 대형 중앙 타이머
- **표시**: 남은 시간을 `MM:SS` 형식으로 거대하게 표시. `font-light` 스타일로 가독성과 평온함 유지.
- **애니메이션**: 타이머 주변 원형 링이 호흡 주기에 맞춰 미세하게 확장 및 축소 (`animate-breathe`).

### 2.2. 호흡 가이드 텍스트
- **메시지**: "Breathe In...", "Hold", "Breathe Out..." 등의 안내 텍스트가 타이머 하단에 규칙적으로 점멸(`animate-pulse`)하며 표시.

### 2.3. 세션 정보 뱃지
- **표시**: 현재 설정된 모드(예: Zen Mode)와 오디오 상태(예: Silent)를 하단에 아이콘과 함께 작게 표시 (투명도 조절).

### 2.4. 일시 정지 컨트롤
- **기능**: 'Pause Session' 버튼을 통해 세션을 일시 중단하거나 종료할 수 있는 메뉴로 진입.
- **디자인**: 뉴모피즘(Neumorphism) 스타일의 부드러운 버튼 디자인 적용.

## 3. UI 컴포넌트 및 레이아웃 (Components & Layout)
- **Layout**: 상하좌우 여백이 넉넉한 중앙 집중형 구조. 배경에 부드러운 그라데이션 글로우(Glow) 효과.
- **컴포넌트 리스트**:
    - `MinimalHeader`: 취소(X) 버튼만 포함된 투명 헤더.
    - `BreathingCircle`: 다중 레이어의 원형 링이 포함된 애니메이션 컨테이너.
    - `SoftIconButton`: 뉴모피즘 스타일의 입체감 있는 일시정지 버튼.

## 4. 기술적 고려사항 (Technical Details)
- **애니메이션**: `keyframes`를 사용하여 8초 주기의 호흡 애니메이션 구현.
- **몰입 유지**: 화면 꺼짐 방지(Wake Lock API) 고려 필요.
- **테마**: 라이트/다크 모드에 맞춰 배경색과 글로우 색상이 조화롭게 변경됨.

## 5. 관련 리소스 (References)
- **HTML 코드**: `stitch/active_meditation_session/code.html`
- **화면 이미지**: `stitch/active_meditation_session/screen.png`
