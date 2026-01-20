# PRD: Meditation Reflection (Journaling)

## 1. 개요 (Overview)
- **화면명**: Meditation Reflection (명상 성찰 및 기록)
- **목적**: 명상 직후 사용자가 느꼈던 감정이나 떠오른 생각들을 자유롭게 기록하고 저장함.
- **UI 패턴**: 모달(Modal) 형태의 입력 인터페이스.

## 2. 주요 기능 (Key Features)
### 2.1. 성찰 노트 입력 (Note Input)
- **자유 입력**: 별도의 경계선 없이 텍스트에만 집중할 수 있는 텍스트 영역 제공.
- **포커스 효과**: 입력 영역 클릭 시 하단에 Primary Color의 옅은 언더라인이 나타나 활성 상태 표시.

### 2.2. 감정 상태 선택 (Mood Selector)
- **카테고리**: Calm, Focus, Restless 세 가지 주요 감정 상태 제공.
- **인터랙션**: 각 옵션은 큰 아이콘과 텍스트가 포함된 버튼 형태이며, 선택 시 Primary Color 배경과 채워진 아이콘으로 변경.

### 2.3. 저장 및 취소
- **Save Entry**: 작성한 노트와 선택한 감정을 데이터베이스에 저장. (성공 시 아이콘 이동 애니메이션)
- **Cancel**: 기록하지 않고 화면을 닫음.

## 3. UI 컴포넌트 및 레이아웃 (Components & Layout)
- **Layout**: 하단 고정 오버레이 (모바일 브라우저 환경에 최적화된 바텀 시트 스타일).
- **컴포넌트 리스트**:
    - `ReflectionModal`: 전체적인 그림자와 둥근 모서리가 적용된 카드 컨테이너.
    - `NoteTextArea`: 리사이즈가 불가능하고 스크롤바가 커스텀된 입력 영역.
    - `MoodToggleGroup`: 3개의 아이콘 버튼이 수평으로 배열된 그룹.
    - `ActionButtonGroup`: 취소(보조)와 저장(주요) 버튼이 1:2 비율로 배치.

## 4. 기술적 고려사항 (Technical Details)
- **애니메이션**: `animate-modal` 설정을 통한 `scale` 및 `translate` 조합의 팝업 효과.
- **사용자 경험**: 텍스트 영역에 `placeholder`를 활용하여 작성 유도 ("How was your session?...").
- **모바일 최적화**: 모바일 키보드 팝업 시 입력란이 가려지지 않도록 뷰포트 고려.

## 5. 관련 리소스 (References)
- **HTML 코드**: `stitch/meditation_note_entry_1/code.html`
- **화면 이미지**: `stitch/meditation_note_entry_1/screen.png`
