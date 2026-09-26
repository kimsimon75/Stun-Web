# Stun-Web

유닛 선택과 버프를 반영해 스턴 가동률과 이감 수치를 계산하는 웹 도구입니다.

## 실행

의존성이 설치된 상태에서 `node server.js`를 실행하고 `http://localhost:8080`을 엽니다.

## 코드 위치

- `main.js`: 화면 초기화와 기존 전역 진입점 연결
- `main/`: 입력, 버프, 초기화, 표 갱신, 패치노트와 업데이트 연결
- `units/`: 등급별 데이터와 유닛 조회
- `overlays/`: 각 상세창과 계산기
- `function.js`: 스턴·이감 계산
- `MoveSpeed.js`: 이감 화면 생성과 복귀

세부 파일 안내는 `main/README.md`, `units/README.md`를 참고하세요.

## 검증

Node.js 22.7 이상에서 `npm test` 또는 `node --test tests/regression.test.mjs`를 실행합니다.
테스트는 유닛 데이터 계산, 정렬과 버프 인덱스, 편차 합계, 버프 그룹,
능력치 입력, 계산기, 초기화와 선택 범위 정리를 확인합니다.

이감 화면은 `main/slow-units.js`에서 정렬한 복사본을 사용합니다.
`Unit.allUnits`의 순서를 바꾸면 버프 체크박스의 인덱스가 달라지므로 직접 정렬하지 마세요.
능력치 입력은 `main/stat-control.js`를 통해 숫자로 저장합니다.
패치노트 로딩 실패는 계산기 실행에 영향을 주지 않습니다.
