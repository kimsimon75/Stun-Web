# 메인 화면 모듈

루트의 `main.js`는 전역 진입점 등록과 초기화 순서만 담당합니다.
각 모듈은 함수를 호출할 때 화면을 생성하거나 갱신합니다.

| 수정할 기능 | 파일 |
| --- | --- |
| 전체 수치 갱신 | `refresh.js` |
| 유닛 선택·버프 초기화 (`ClearAll`) | `clear-all.js` |
| 스턴 표 / 이감 표 갱신 | `stun-table.js`, `slow-table.js` |
| 버프 수치 적용 / 체크박스 동기화 / 변경 이벤트 | `buff-state.js`, `buff-sync.js`, `buff-events.js` |
| 하단 영역 구성 순서 / 배치 및 합계 | `stack.js`, `stack-layout.js` |
| 버프 목록 채우기 | `buff-list.js` |
| 이감 선택창 / 여는 버튼 | `debuff-menu.js`, `debuff-control.js` |
| 공속 선택창 / 여는 버튼 | `attack-speed-menu.js`, `attack-speed-control.js` |
| 마나 리젠 선택창 / 여는 버튼 | `mana-menu.js`, `mana-control.js` |
| 체력 리젠 선택창 / 여는 버튼 | `health-menu.js`, `health-control.js` |
| 도구 모음 구성 순서 | `toolbar.js` |
| 코비 / 민첩 / 지능 입력 | `koby-control.js`, `dexterity-control.js`, `intelligence-control.js` |
| 계산기 실행 및 마나 토글 버튼 | `calculator-buttons.js` |
| 이감 화면 전환 및 스턴 편차 버튼 | `view-buttons.js` |
| 버튼 마우스 효과 / 한글 검색 | `button-style.js`, `korean-search.js` |
| 패치노트 목록 및 본문 | `patch-notes.js` |
| 업데이트 연결 / 알림 표시 | `update-connection.js`, `update-notification.js` |

`window.container`, `window.CountOn`, `window.Collect`, `window.ButtonColor`,
`window.Stack`은 기존 `stun.js`, `MoveSpeed.js`, 오버레이와의 연결을 위해
유지합니다. 새 메인 모듈끼리는 전역 변수 대신 명시적인 import와 인자를 사용합니다.
