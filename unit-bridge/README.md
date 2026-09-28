# ORDR 유닛 연동 프로그램

**최신 원본 맵 리플레이 방식은 [WEB-LINK.md](WEB-LINK.md)를 보세요. `dist/StunReplayLink.exe`를 사용합니다. 아래는 기존 2.322 수정맵 방식 설명입니다. 새 EXE에서는 메뉴 4로 기존 수정맵 전송을 실행합니다.**

대상: ORDR_S2_2.322_fix03_2. 맵에서 추출한 유닛 정의 1,519개로 종류와 플레이어별 수량을 집계합니다.

## 실행

1. dist/ORDR_S2_2.322_fix03_2_UnitBridge.w3x를 Warcraft III의 Maps 폴더로 복사하세요. 원본은 보존했습니다. 함께 플레이하는 사람들은 같은 수정 맵을 사용해야 합니다.
2. dist/StunUnitLink.exe를 실행하고 **2 로컬 감시**를 선택하세요. 기존 StunUnitBridge.exe 대신 새 파일을 사용합니다.
3. 요청 폴더는 기본값이면 Enter를 누릅니다. 문서 폴더가 OneDrive 등에 있다면 실제 Warcraft III/CustomMapData/networkio/requests 경로를 입력하세요.
4. 수정 맵을 실행하세요. **첫 번째 플레이어 슬롯(Player 0)의 PC**가 파일을 작성하므로 해당 PC에서 프로그램을 실행해야 합니다.
5. 약 3초마다 살아 있는 유닛을 집계합니다. playerId:0은 첫 번째 슬롯, count는 수량입니다. 몬스터·중립·보조 유닛도 포함됩니다. 목록에 없는 기본 유닛은 미확인(rawcode)으로 표시합니다. 게임 종료 후에는 마지막 수신 상태가 남습니다.

## Netlify 전송

exe 옆 .env의 기존 URL과 토큰을 유지했습니다. 토큰은 맵이나 exe에 내장하지 않습니다. Netlify 프로젝트 → Project configuration → Environment variables에 UNIT_BRIDGE_TOKEN을 같은 값으로 등록하고 Functions/Production에서 읽을 수 있게 설정하세요. 이 저장소의 함수를 포함해 사이트를 배포한 뒤 exe에서 **3 Netlify 전송**을 선택합니다.

수신 함수는 netlify/functions/unit-snapshots.mjs이며 인증 후 최근 전체 상태 하나를 Netlify Blobs에 저장합니다. GET 조회도 같은 Bearer 토큰이 필요합니다. 공개 웹 계산기에 자동 반영하는 화면은 아직 연결하지 않았습니다. 토큰을 웹 JavaScript나 Git에 넣지 마세요. 서버 배포와 실제 원격 저장은 이번 작업에서 수행하지 않았습니다.

## 동작과 제한

map/StunUnitExport.j를 맵 globals/functions에 넣고 main 마지막에서 StunUnitExportInit(0)을 호출했습니다. 모든 클라이언트에서 같은 유닛 수집을 실행하고 지정된 PC만 Preload 파일을 작성합니다. 8개씩 stun-units-0.txt 등의 파일로 출력하며 마지막 조각까지 모인 상태만 반영합니다. 4,096개를 초과하면 잘린 결과를 전송하지 않습니다.

PC 프로그램은 250ms 간격으로 파일을 두 번 확인합니다. 시작 전에 있던 파일은 무시하고 불완전한 데이터는 목록을 교체하지 않습니다. 전송 실패 시 5초 뒤 최신 완성 상태로 재시도합니다. 네트워크가 느리면 중간 상태는 생략될 수 있습니다.

wc3networkio의 Preload 요청 형식을 사용하는 전용 단방향 브리지입니다. 원본 wc3networkio 전체 프로그램이나 게임 메모리 감지기가 아니며 version/clear/응답 파일은 지원하지 않습니다. 같은 폴더에 범용 프록시를 동시에 실행하지 마세요. 원본 맵은 수집 코드가 없어 이 프로그램과 연동되지 않습니다.

검증: 전체 JASS 문법 검사 통과, MPQ 재개방 후 스크립트 일치 및 핵심 맵 데이터 보존 확인, Node 테스트 6개 통과, 빌드한 exe의 분할 파일 감시·나미 2개 집계 확인. 실제 게임 실행·멀티플레이 동기화·게임 내 파일 생성은 미검증입니다. 먼저 로컬 게임으로 확인하세요.

원본 SHA256: fca929905d5c47c9499a32693813ca75c88aac525da62e46a9d5f7afdf5715a8

## 개발

테스트: node --test tests/unit-assembler.test.mjs tests/netlify-unit-bridge.test.mjs

빌드 도구: npm install --prefix .exe-build @yao-pkg/pkg@6.22.0 --ignore-scripts

빌드: node .exe-build/node_modules/@yao-pkg/pkg/lib-es5/bin.js unit-bridge/exe.cjs --targets node22-win-x64 --no-bytecode --public-packages "*" --public --output dist/StunUnitLink.exe
