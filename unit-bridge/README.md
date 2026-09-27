# Windows Netlify 유닛 브리지

`dist/StunUnitBridge.exe`를 더블클릭해 샘플 확인, 로컬 감시, Netlify 전송을 선택합니다. Node.js 설치는 필요하지 않습니다. exe 옆 `.env`에 URL과 개인용 전송 토큰을 설정합니다. 해당 파일은 Git에서 제외됩니다. 토큰은 바이너리에 내장하지 않습니다.

서버 준비: Netlify의 stun-calculator 프로젝트 환경변수에 `.env`의 `UNIT_BRIDGE_TOKEN` 값을 동일하게 등록하고 함수 포함 사이트를 배포해야 합니다. 아직 이 서버 설정과 배포는 자동으로 수행하지 않았습니다. 토큰은 웹 JS에 넣지 마세요. 수신/조회 모두 인증이 필요하며 공개 웹 표시 기능은 별도입니다. 단일 운영자용으로 최근 상태 하나를 저장합니다.

맵이 `Documents/Warcraft III/CustomMapData/networkio/requests/stun-units.txt`에 wc3networkio 형식으로 전체 유닛 상태를 써야 합니다. 이 exe는 게임 메모리를 읽지 않습니다. 요청의 url은 `.env`의 URL, noResponse는 true, body는 아래 JSON을 직렬화한 문자열로 넣습니다.

```json
{"mapVersion":"2.322","units":[{"instanceId":"u1","typeId":"H08V","playerId":0,"alive":true}]}
```

typeId는 rawcode 또는 FourCC 정수, playerId는 0~27 슬롯입니다. 각 인스턴스 ID는 중복되지 않아야 합니다. 죽은 유닛은 제외하고, 빈 배열은 0개로 처리합니다. 목록 1,518개는 `docs/ORDR-2.322-unit-objects.csv`에서 가져왔습니다.

전용 파일만 읽는 단방향 wc3networkio 부분 구현입니다. version/clear/응답 파일은 지원하지 않습니다. 기존 범용 프록시와 동시에 같은 파일을 처리하지 마세요. 시작 전 파일은 무시하고 변경된 파일을 1초 간격으로 두 번 확인합니다. 중간 상태는 생략될 수 있으며 전송 실패 시 종료합니다. 맵 수집 코드 연결·실게임 검증은 아직 필요합니다.

빌드 도구 설치: `npm install --prefix .exe-build @yao-pkg/pkg@6.22.0 --ignore-scripts`

빌드: `node .exe-build/node_modules/@yao-pkg/pkg/lib-es5/bin.js unit-bridge/exe.cjs --targets node22-win-x64 --no-bytecode --public-packages "*" --public --output dist/StunUnitBridge.exe`
