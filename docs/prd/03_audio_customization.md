# PRD: Audio Customization Settings

## 1. 개요 (Overview)
- **화면명**: Audio Customization Settings (오디오 커스텀 설정)
- **목적**: 명상 중 배경으로 재생될 앰비언트 사운드와 시작/종료 종소리를 선택하고 관리함.
- **주요 가치**: 개인화된 청각적 몰입 환경 제공.

## 2. 주요 기능 (Key Features)
### 2.1. 종소리 라이브러리 (Bell Sound)
- **목록**: Tibetan Bowl, Zen Gong, Crystal Bell, Tingsha 등.
- **미리듣기**: 각 항목의 'play' 버튼을 눌러 소리 확인 가능.
- **선택**: 라디오 버튼 스타일로 하나만 선택 가능. 강조된 보더와 부드러운 배경색 변화 적용.

### 2.2. 배경 앰비언트 설정 (Ambient Background)
- **목록**: Silent(없음), Light Rain, Deep Forest, White Noise 등.
- **기능**: 명상 내내 반복 재생될 자연의 소리 또는 화이트 노이즈 선택.

### 2.3. 외부 파일 업로드
- **기능**: 사용자가 소지한 MP3 파일을 직접 업로드하여 사용할 수 있는 버튼 제공.
- **위치**: 화면 하단에 플로팅 버튼(Sticky Footer) 형태로 고정.

## 3. UI 컴포넌트 및 레이아웃 (Components & Layout)
- **Layout**: 상단 타이틀 바 - 스크롤 가능한 섹션 리스트 - 하단 고정 업로드 버튼.
- **컴포넌트 리스트**:
    - `Header`: 뒤로가기 버튼과 타이틀이 포함된 블러 헤더.
    - `SoundCard`: 아이콘, 제목, 설명, 미리보기 버튼, 라디오 버튼이 포함된 카드형 컴포넌트.
    - `SectionDivider`: 섹션 간 구분을 위한 연한 실선.
    - `UploadButton`: 다크 테마가 적용된 가로 너비 100%의 액션 버튼.

## 4. 기술적 고려사항 (Technical Details)
- **선택 상태**: CSS `has-[:checked]` 선택자를 활용하여 별도의 JS 없이도 직관적인 선택 카드 스타일링 구현.
- **스크롤**: 본문 영역은 스크롤 가능하며 헤더와 푸터는 고정. 커스텀 스크롤바 숨김 처리 (`no-scrollbar`).
- **피드백**: 카드 호버 시 그림자 깊이 증가 (`shadow-md`), 버튼 클릭 시 물리적 축소 효과.

## 5. 관련 리소스 (References)
- **HTML 코드**: `stitch/audio_customization_settings/code.html`
- **화면 이미지**: `stitch/audio_customization_settings/screen.png`
