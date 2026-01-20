# PRD: Mindfulness Guide

## 1. 개요 (Overview)
- **화면명**: Mindfulness Guide (마음챙김 가이드)
- **목적**: 명상 초보자들에게 올바른 명상 방법을 안내하고, 명상의 가치를 전달하여 사용자가 앱에 더 깊이 몰입할 수 있도록 도움.
- **주요 가치**: 교육, 친절함, 영감 제공.

## 2. 주요 기능 (Key Features)
### 2.1. 인트로 섹션
- **히어로 이미지**: 히어로는 마음의 평화를 상징하는 추상적인 이미지와 'The Art of Sitting'과 같은 상징적인 제목으로 구성.
- **개요 텍스트**: 명상의 목적에 대한 짧고 강렬한 문구 제공.

### 2.2. 단계별 명상 가이드 (Step-by-Step Sections)
- **내용 구성**: 
    - **Posture**: 바른 자세(척추 세우기 등) 안내.
    - **Breathing**: 호흡에 집중하는 법 안내.
    - **Mindset**: 떠오르는 생각을 다루는 태도 안내.
- **디자인**: 각 섹션마다 의미 있는 아이콘(`self_improvement`, `air`, `filter_drama`)과 함께 텍스트 배치.

### 2.3. 전문가의 조언 (Insight Callout)
- **인용구**: Ajahn Chah와 같은 명상 대가들의 명언을 강조된 박스에 표시하여 깊이를 더함.

### 2.4. 행동 유도 (CTA)
- **Start Practice**: 가이드를 읽은 후 바로 명상을 시작할 수 있도록 홈 화면으로 유도하는 버튼 제공.

## 3. UI 컴포넌트 및 레이아웃 (Components & Layout)
- **Layout**: 아티클(Article) 형태의 수직 레이아웃. 이미지와 텍스트의 조화로운 배치.
- **컴포넌트 리스트**:
    - `HeroHeader`: 그라데이션과 혼합 이미지 모드가 적용된 비주얼 영역.
    - `GuideSection`: 아이콘, 제목, 본문을 하나의 단위로 묶은 반복 컴포넌트.
    - `InsightBox`: 따옴표와 배경색으로 강조된 인용구 영역.
    - `FloatingCTA`: 화면 하단에 고정된 명상 시작 버튼.

## 4. 기술적 고려사항 (Technical Details)
- **시각 효과**: 이미지 마스킹과 `mix-blend-mode`를 활용하여 고급스러운 디자인 연출.
- **타이포그래피**: `Manrope` 폰트를 활용하여 현대적이고 깔끔한 매거진 스타일 유지.
- **다크 모드**: 배경색 변화와 텍스트 투명도 조절로 가독성 유지.

## 5. 관련 리소스 (References)
- **HTML 코드**: `stitch/mindfulness_guide/code.html`
- **화면 이미지**: `stitch/mindfulness_guide/screen.png`
