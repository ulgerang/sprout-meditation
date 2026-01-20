# 기술 세부 명세 (Technical Specification)

## 1. 개발 환경 및 스택 (Tech Stack)
- **Framework**: Vite + React (or Vanilla JS) - `stitch` 자산을 컴포넌트화하기 용이함.
- **Styling**: Tailwind CSS (기존 자산 유지)
- **Mobile Bridge**: **Capacitor** (Ionic 팀에서 만든 웹-네이티브 브릿지)
- **State Management**: Zustand 또는 Context API (타이머 상태 및 사용자 설정 관리)
- **Database**: 
    - 로컬: Capacitor SQLite 또는 IndexedDB (명상 로그 및 로컬 데이터)
    - 클라우드: Google Drive REST API (PRD 10번 동기화 구현)

## 2. 핵심 로직 구현 명세 (Core Logic)

### 2.1. 타이머 엔진 (Timer Engine)
- **정밀도**: `performance.now()` 기반의 `requestAnimationFrame` 루프를 사용하는 커스텀 훅(`useTimer`) 구현. 절대 시간 기준 계산으로 오차(Drift) 제거.
- **준비 단계**: 세션 진입 전 사용자가 마음의 준비를 할 수 있는 **Preparation Phase** 자동 연동. 
- **화면 유지**: `@capacitor-community/keep-awake` 플러그인을 사용하여 명상 중 화면 꺼짐 방지.

### 2.2. 오디오 시스템 (Audio Management)
- **멀티 채널 믹싱**: Web Audio API를 사용하여 배경음(Ambient)과 종소리(Bell)를 독립적으로 제어.
- **백그라운드 재생**: `Capacitor Background Audio` 설정을 통해 화면이 꺼진 상태에서도 앰비언트 사운드 유지.

### 2.3. 데이터 구조 (Data Schema)
```typescript
interface MeditationSession {
  id: string;          // UUID
  startTime: number;   // Timestamp
  endTime: number;     // Timestamp
  duration: number;    // 목표 시간(분)
  presetId: string;    // 사용된 프리셋 ID
  audioConfig: {       // 당시 오디오 설정
    bell: string;
    ambient: string;
    volume: number;
  };
  reflection?: {       // 명상 후 기록
    mood: 'Calm' | 'Focus' | 'Restless';
    note: string;
  };
}
```

## 3. 네이티브 기능 연동 (Native Integration)
- **Haptics**: 세션 시작/종료 시 진동 피드백 (`@capacitor/haptics`).
- **Screen KeepAwake**: 세션 중 절전 모드 방지 (`@capacitor-community/keep-awake`).
- **StatusBar**: (진행 예정) 세션 중 시스템 UI 숨김 처리.

## 4. 빌드 및 배포 로드맵 (Build Roadmap)
1. **Web Build**: Vite를 사용하여 웹 앱 우선 개발 및 테스트.
2. **Capacitor Init**: 프로젝트에 Capacitor 추가 (`npx cap init`).
3. **Platform Add**: Android 플랫폼 추가 (`npx cap add android`).
4. **Android Studio**: Gradle 빌드를 통해 APK/Bundle 생성.

## 5. 보안 및 성능 고려사항
- **성능**: `stitch`에 포함된 고해상도 이미지는 WebP 포맷으로 최적화하여 패킹 사이즈 축소.
- **오프라인 우선**: 모든 데이터는 먼저 로컬에 저장하고, 네트워크 연결 시 Google Drive와 동기화.
