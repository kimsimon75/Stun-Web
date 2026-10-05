# Stun Replay Live Link

`StunReplayLiveLink.exe`는 진행 중인 `TempReplay.w3g`를 잠그거나 수정하지 않고 읽기 공유로 복사합니다. 아직 기록 중인 파일의 68바이트 예약 헤더는 건너뛰고, 물리적으로 끝까지 기록된 zlib 블록만 해제합니다. 파일 크기나 수정 시간이 복사 도중 바뀌면 그 복사본은 버리고 다음 주기에 다시 읽습니다.

워크래프트 리플레이에는 완전한 월드 상태가 아니라 플레이어 명령이 저장됩니다. 따라서 웹에 보내는 수량은 플레이어가 선택해 리플레이에 등장한 고유 유닛의 누적 관측 수이며, 선택하지 않은 유닛이나 이후 사라진 유닛을 완전하게 판별할 수 없습니다.

실행 파일 옆 `.env`에 다음 값을 둡니다.

```dotenv
UNIT_API_URL=https://stun-calculator.netlify.app/.netlify/functions/unit-snapshots
UNIT_BRIDGE_TOKEN=64자리-소문자-16진수
```

웹에는 실행 후 생성되는 `web-read-token.txt`의 값을 입력합니다. 쓰기 토큰은 웹이나 Git에 넣지 않습니다.
