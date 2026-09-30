# Stun Live Link

`StunLiveLink`는 기록 중인 `.w3g` 파일을 열지 않습니다. Warcraft III가 제공하는
`War3StatsObserverSharedMemory`를 2초마다 읽어 ORDR 2.323의 현재 보유 유닛을
플레이어별 rawcode 수량으로 Netlify에 전송합니다.

이 API는 Warcraft III의 관전자 API입니다. 일반 플레이어로 참가한 유즈맵에서는
공유 메모리 블록이 존재하더라도 게임 시간·맵·플레이어 값이 모두 비어 있을 수
있습니다. 이 경우 프로그램은 빈 수량을 전송하지 않고 지원되지 않는 상태를
콘솔에 표시합니다.

- `PlayerType.Player` 슬롯만 읽으므로 중립 몹과 컴퓨터 슬롯은 제외됩니다.
- 일반 유닛은 `current_amount`, 영웅은 현재 영웅 목록을 집계합니다.
- `food_used` 값은 특성 포인트 확인을 위해 `traitPoints`로 함께 전송합니다.
- 공유 메모리의 두 번 연속 읽기가 같을 때만 전송합니다.
- EXE 옆 `.env`에 `UNIT_API_URL`, `UNIT_BRIDGE_TOKEN`이 있어야 합니다.

빌드:

```powershell
dotnet publish unit-bridge/live-observer/StunLiveLink.csproj -c Release -o .exe-build/live-publish
```

메모리 레이아웃은 LGPL-3.0-or-later로 배포되는
[Warcraft3StatsObserverRs](https://github.com/garlic-hub/Warcraft3StatsObserverRs)의
공개 형식 정의를 참고했습니다. 이 프로젝트는 해당 라이브러리를 링크하거나 포함하지 않습니다.
