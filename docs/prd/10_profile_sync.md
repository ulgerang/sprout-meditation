# PRD: Profile & Cloud Sync Settings

## 1. 개요 (Overview)
- **화면명**: Profile & Cloud Sync Settings (프로필 및 클라우드 동기화 설정)
- **목적**: 사용자의 프로필 정보를 관리하고, 명상 데이터를 클라우드(Google Drive)에 안전하게 백업 및 복구할 수 있는 기능을 제공함.
- **주요 가치**: 데이터 신뢰성, 개인화.

## 2. 주요 기능 (Key Features)
### 2.1. 사용자 프로필 관리
- **프로필 정보**: 아바타 이미지, 이름(Eleanor Pena), 이메일 주소 표시.
- **수정**: 'edit' 버튼을 통해 프로필 정보 변경 가능.

### 2.2. 클라우드 동기화 (Google Drive)
- **연동 상태 확인**: 현재 연동된 계정(Google Drive) 정보와 마지막 동기화 시간 표시.
- **백업 및 복구**:
    - **Backup Now**: 현재 기기의 데이터를 즉시 클라우드로 업로드.
    - **Restore Data**: 클라우드에 저장된 과거 데이터를 기기로 가져오기.
- **자동 백업 설정**: Wi-Fi 환경에서의 일일 자동 백업 활성화 토글 버튼 제공.

### 2.3. 하단 브랜드 아이콘
- **디자인**: "Sync your peace of mind"라는 문구와 함께 천천히 점멸하는 브랜드 아이콘(`spa`) 배치.

## 3. UI 컴포넌트 및 레이아웃 (Components & Layout)
- **Layout**: 상단 사용자 정보 - 중앙 클라우드 설정 - 하단 브랜드 강조 구조.
- **컴포넌트 리스트**:
    - `ProfileCard`: 둥근 아바타와 텍스트, 편집 버튼이 포함된 카드.
    - `CloudSyncBox`: 입체감 있는 아이콘과 버튼, 동기화 요약이 포함된 강조 박스.
    - `PrimarySwitch`: 데이터 자동 백업을 위한 토글 스위치.
    - `ActionGroup`: Primary 버튼(백업)과 Secondary 버튼(복구)이 수직으로 배열된 버튼 그룹.

## 4. 기술적 고려사항 (Technical Details)
- **API 연동**: Google Drive SDK 등을 활용한 데이터 입출력 로직 필요.
- **애니메이션**: `Backup Now` 버튼 클릭 시 아이콘의 부드러운 위치 이동 효과.
- **진행 표시**: 동기화 중일 때 스피너(Spinner) 또는 프로그레스 바 노출 고려.

## 5. 관련 리소스 (References)
- **HTML 코드**: `stitch/meditation_note_entry_2/code.html`
- **화면 이미지**: `stitch/meditation_note_entry_2/screen.png`
