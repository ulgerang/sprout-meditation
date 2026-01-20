# PRD: Session Complete Summary

## 1. 개요 (Overview)
- **화면명**: Session Complete Summary (세션 완료 요약)
- **목적**: 명상 세션 종료 후 사용자의 성취를 축하하고, 수행 결과를 요약하여 보여줌으로써 지속적인 동기를 부여함.
- **주요 가치**: 성취감, 보상, 공유.

## 2. 주요 기능 (Key Features)
### 2.1. 성취 축하 메시지
- **헤드라인**: "Session Complete" 문구와 함께 부드러운 애니메이션 효과 적용.
- **명언(Quote)**: "Quiet the mind, and the soul will speak."와 같은 동기 부여용 문구 인용.

### 2.2. 통계 요약 (Stats Block)
- **수행 시간**: 오늘 수행한 총 명상 시간 표시 (예: 15:00).
- **스트릭(Streak)**: 연속 명상 일수 표시. 불꽃 아이콘(`local_fire_department`)으로 시각적 강조.

### 2.3. 행동 유도 버튼 (Action Buttons)
- **Share Progress**: 오늘 세션 결과를 카드 형태로 생성하거나 직접 SNS 등에 공유. (그라데이션 호버 애니메이션 적용)
- **Close**: 결과 화면을 닫고 홈 화면으로 돌아감.

## 3. UI 컴포넌트 및 레이아웃 (Components & Layout)
- **Layout**: 화면 중앙에 띄워진 플로팅 카드(Floating Card) 디자인. 배경에 질감이 있는 텍스처(Japanese rice paper texture) 적용.
- **컴포넌트 리스트**:
    - `CelebratedIcon`: 원형 배경과 리플 효과가 포함된 `spa` 아이콘.
    - `FloatingCard`: 모서리가 큰 라운드형(`rounded-[2rem]`) 카드 컨테이너.
    - `PrimaryAction`: 셰이머(Shimmer) 효과가 적용된 소셜 공유 버튼.
    - `SecondaryAction`: 아웃라인 스타일의 닫기 버튼.

## 4. 기술적 고려사항 (Technical Details)
- **애니메이션**: 카드 로드 시 `animate-fade-in-up` 효과로 띄워줌.
- **텍스처 처리**: 배경 이미지에 `mix-blend-multiply` 속성을 사용하여 부드럽게 배경색과 통합.
- **다크 모드**: 다크 모드 시 배경 텍스처의 투명도를 낮추어 시인성 확보.

## 5. 관련 리소스 (References)
- **HTML 코드**: `stitch/session_complete_summary/code.html`
- **화면 이미지**: `stitch/session_complete_summary/screen.png`
