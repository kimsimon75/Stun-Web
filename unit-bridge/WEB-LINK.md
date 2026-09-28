# 리플레이 EXE ↔ 웹 연결

## 준비된 파일

- `dist/StunReplayLink.exe`: 원본 ORDR 2.323 리플레이 분석 + Netlify 전송. Node 설치 없이 실행합니다.
- `dist/.env`: EXE의 쓰기 토큰과 수신 주소. 기존 토큰을 유지했습니다.
- `dist/web-read-token.txt`: 웹에서 사용할 조회 전용 코드. EXE 실행 시 생성합니다.
- 웹의 **게임 유닛 연동** 패널: 조회 코드를 입력해 최신 관측 기록을 표시합니다.

## 실제 사이트 연결

1. 변경된 소스를 Netlify에 배포합니다. `netlify.toml`이 웹 전용 `.site-build`와 서버 함수를 지정합니다. `dist`를 웹에 올리지 마세요.
2. Netlify 프로젝트의 Functions에서 읽을 수 있는 환경변수 `UNIT_BRIDGE_TOKEN`에 `dist/.env`의 같은 값을 등록하고 배포합니다. 이미 같은 값으로 등록했다면 변경할 필요 없습니다.
3. EXE를 더블클릭하고 **3 리플레이 웹 전송**을 선택합니다. 진행 중인 `.w3g` 파일 경로를 입력합니다. 따옴표가 있는 경로도 가능합니다. 다른 파일로 새 게임을 시작하면 EXE도 해당 파일로 다시 실행하세요.
4. 웹에서 **게임 유닛 연동 → 조회용 연결 코드**에 `web-read-token.txt` 내용을 붙여 넣고 연결합니다. 쓰기 토큰인 `.env` 내용을 웹에 넣지 않습니다.

서버는 기존 쓰기 토큰에서 조회용 코드를 SHA-256으로 파생하므로 별도 읽기 환경변수는 필요 없습니다. 조회 코드는 GET만 가능하고 POST는 거절됩니다. 토큰을 바꾸면 EXE를 다시 실행해 새 조회 코드를 사용하세요. 웹은 코드를 브라우저 저장소에 저장하지 않으며 새로고침하면 다시 입력해야 합니다.

단일 사용자/단일 최신 기록 저장 방식입니다. 여러 EXE가 같은 토큰으로 전송하면 나중에 전송된 기록이 표시됩니다. 웹은 5초마다 조회합니다. 새 기록이 없으면 마지막 수신 시각이 오래된 상태로 표시되며, 프로그램 종료가 곧 유닛 0개로 처리되지는 않습니다.

## 표시되는 정보

리플레이 시각, 관측된 개체 수, 조합 시도 수, 종류별 관측 개체 수, 마지막 관측 시각을 표시합니다. 같은 개체의 반복 선택은 중복 집계하지 않습니다. 플레이어 필터는 마지막 선택 명령을 낸 플레이어 기준이며 소유권을 뜻하지 않습니다.

관측 이력은 현재 보유 패 전체가 아닙니다. 조합으로 소멸한 재료 등은 확정하지 못하므로 기존 계산기 수량을 자동으로 덮어쓰지 않습니다. 다른 맵/버전은 이름표와 파서 검증이 필요하며 현재 2.323만 연결했습니다. 기존 수정맵 2.322 방식은 메뉴 4로 유지했습니다.

## 검증과 배포 상태

- 관련 자동 테스트 12개 통과: 데이터 검증, 조회/쓰기 권한 분리, 반복 선택 중복 방지, 부분 리플레이 등.
- 빌드한 EXE로 제공된 실제 리플레이 분석: 415개 관측 개체, 111종, 조합 시도 71건.
- 로컬 함수 핸들러 + 웹 화면에서 같은 리플레이 결과 조회, 플레이어 필터, 연결 해제 확인.
- 웹 출력물에 EXE/토큰/분석 원본이 포함되지 않는지 확인.
- **실제 Netlify 배포·환경변수 등록·원격 저장은 이번 작업에서 수행하지 않았습니다.** 로컬 화면 검증은 임시 조회 코드와 메모리 저장소로 했습니다.

## 코드와 빌드

EXE 진입점 `unit-bridge/exe.cjs`, 감시/전송 `unit-bridge/replay/watch.cjs`, 검증/토큰 `unit-bridge/core.cjs`, 서버 `netlify/functions/unit-snapshots.mjs`, 화면 `main/unit-connection.js`.

```powershell
node scripts/build-site.cjs
node --test tests/replay-link.test.mjs tests/replay-reader.test.mjs tests/netlify-unit-bridge.test.mjs tests/unit-assembler.test.mjs
node .exe-build/node_modules/@yao-pkg/pkg/lib-es5/bin.js unit-bridge/exe.cjs --targets node22-win-x64 --no-bytecode --public-packages "*" --public --output dist/StunReplayLink.exe
```

`node server.js`는 정적 웹 서버이며 Netlify 함수를 실행하지 않습니다. 해당 명령만으로 원격 연동을 로컬에서 검증할 수는 없습니다.
