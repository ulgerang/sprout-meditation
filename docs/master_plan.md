# 명상 앱(Meditation App) 전체 기획 요약 및 개발 로드맵

## 1. 프로젝트 목표 (Project Objectives)
- 사용자의 스트레스 관리 및 집중력 향상을 위한 올인원 명상 플랫폼 구축.
- 단순하고 평온한 사용자 경험(UX)과 감각적인 UI 제공.
- 데이터 백업 및 통계를 통한 지속적인 명상 습관 형성 지원.

## 2. 정보 아키텍처 (Information Architecture)
전체 화면 구조는 `docs/storyboard.md`를 기반으로 하며, 다음과 같은 흐름을 가집니다.

- **Main Loop**: 타이머 홈 ↔ 프리셋 설정 ↔ 오디오 커스텀 ↔ 액티브 세션
- **Post-Session Flow**: 세션 종료 ↔ 성찰 일기 작성
- **Persistence**: 일일 로그 상세, 주간/월간 통계, 프로필 및 클라우드 동기화
- **Education**: 마음챙김 가이드

## 3. 페이지별 상세 문서 (PRD List)
각 페이지의 세부 기능 및 가이드는 아래 문서를 참조하십시오.

1.  **[홈 및 타이머](./prd/01_home_timer.md)**: 메인 화면 및 빠른 프리셋 선택.
2.  **[프리셋 설정 모달](./prd/02_preset_modal.md)**: 상세 시간 및 준비 시간 설정.
3.  **[오디오 커스터마이징](./prd/03_audio_customization.md)**: 종소리 및 앰비언트 믹싱.
4.  **[액티브 세션](./prd/04_active_session.md)**: 몰입형 명상 인터페이스 및 호흡 가이드.
5.  **[세션 종료 요약](./prd/05_session_summary.md)**: 성취 축하 및 결과 표시.
6.  **[성찰 일기](./prd/06_reflection_journal.md)**: 감정 기록 및 텍스트 일기.
7.  **[일일 로그 상세](./prd/07_daily_log.md)**: 타임라인 기반 과거 세션 확인.
8.  **[명상 통계](./prd/08_statistics.md)**: 시각화된 활동 리포트.
9.  **[마음챙김 가이드](./prd/09_mindfulness_guide.md)**: 명상 방법 교육.
10. **[프로필 및 동기화](./prd/10_profile_sync.md)**: 계정 관리 및 데이터 백업.

## 4. 공통 디자인 시스템 (Design System)
- **Primary Color**: `#678E7C` (Forest Green 계열)
- **Typography**: 
    - Display: `Noto Serif` (고전적이고 평온한 느낌)
    - Body: `Manrope` / `Noto Sans` (현대적이고 깔끔한 느낌)
- **Vibe**: 미니멀리즘, 뉴모피즘, 배경 블러(Backdrop Blur), 부드러운 애니메이션.

## 5. 개발 우선순위 (Development Roadmap)
- [x] **Phase 1 (MVP)**: 타이머 홈 + 액티브 세션 + 프리셋 설정. (완료 - 2026-01-20)
- [x] **Phase 2 (Content)**: 오디오 커스텀 + 마음챙김 가이드. (완료 - 2026-01-20)
- [x] **Phase 3 (Persistence)**: 성찰 일기 + 일일 로그 + 클라우드 동기화. (완료 - 2026-01-20)
- [x] **Phase 4 (Insight)**: 주간/월간 통계 및 공유 기능 고도화. (완료 - 2026-01-20)


## 6. 개발자 전달 사항
- 모든 UI는 `stitch/` 폴더 내의 HTML 코드를 기반으로 컴포넌트화해야 합니다.
- 다크 모드(Dark Mode)는 모든 페이지에서 필수적으로 지원되어야 합니다.
- 호흡 애니메이션과 버튼 인터랙션 등 시각적 피드백의 디테일이 앱의 완성도를 결정하므로 세심한 구현을 요청합니다.
