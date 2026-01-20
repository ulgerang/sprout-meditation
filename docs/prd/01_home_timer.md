# PRD: Meditation Timer Home

## 1. 개요 (Overview)
- **화면명**: Meditation Timer Home (메인 홈)
- **목적**: 앱의 진입점이자 명상 시작을 위한 핵심 인터페이스로, 사용자가 현재 설정된 명상 시간을 확인하고 즉시 세션을 시작할 수 있도록 함.
- **주요 가치**: 단순함, 평온함, 직관적인 시작.

## 2. 주요 기능 (Key Features)
### 2.1. 중앙 타이머 디스플레이
- **시간 표시**: 현재 설정된 명상 시간을 `MM:SS` 형식으로 크게 표시.
- **진행 표시(Progress Ring)**: 원형 테두리를 통해 시간 진행률을 시각화.
- **시간 수정**: 타이머 우측의 'edit' 아이콘 클릭 시 시간 직접 설정(프리셋 모달) 진입.

### 2.2. 프리셋 선택 (Preset Selection)
- **빠른 선택 버튼**: 10, 15, 30, 45, 60분 등의 프리셋 버튼 제공.
- **활성 상태**: 선택된 시간은 강조(Primary Color 보더 등) 표시.
- **수정/삭제**: 각 버튼의 'edit' 아이콘을 통해 개별 프리셋 수정 가능.
- **추가**: '+' 버튼을 통해 새로운 시간 프리셋 생성.

### 2.3. 세션 시작 버튼
- **기능**: 'Start' 버튼 클릭 시 `Active Meditation Session` 화면으로 전환.
- **디자인**: 하단 중앙에 위치하며, Primary Color로 강조.

### 2.4. 상단 헤더 및 통계 요약
- **브랜드 로고/아이콘**: 좌측 상단 `spa` 아이콘.
- **스트릭 표시**: 우측 상단에 현재 연속 명상 일수(예: Day 4) 표시.

### 2.5. 하단 네비게이션
- **메뉴 구성**: Timer(현재), Stats, Guide, Settings.

## 3. UI 컴포넌트 및 레이아웃 (Components & Layout)
- **Layout**: `max-w-md` 중앙 정렬, 상단 헤더 - 중앙 타이머/프리셋 - 하단 메뉴 구조.
- **컴포넌트 리스트**:
    - `Header`: 로고 및 스트릭 뱃지.
    - `PrimaryTimer`: 대형 원형 타이머 + 시간 텍스트.
    - `StartButton`: 그림자 효과와 호버 애니메이션이 적용된 버튼.
    - `PresetGrid`: 3열 그리드로 구성된 시간 선택 버튼들.
    - `BottomNav`: 블러(Backdrop blur) 처리가 된 고정형 네비게이션 바.

## 4. 기술적 고려사항 (Technical Details)
- **다크 모드**: `dark:bg-background-dark` 등 Tailwind CSS 다크 모드 속성 완벽 지원 필요.
- **애니메이션**: 
    - 배경 구름/그라데이션에 `animate-breathe` 효과 적용.
    - 버튼 클릭 시 `active:scale-95` 피드백.
- **접근성 (Accessibility)**: 각 버튼에 `aria-label` 부여.

## 5. 관련 리소스 (References)
- **HTML 코드**: `stitch/meditation_timer_home/code.html`
- **화면 이미지**: `stitch/meditation_timer_home/screen.png`
