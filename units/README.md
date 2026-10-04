# 유닛 데이터와 조회 기능

루트의 `Unit.js`는 기존 공개 이름을 다시 내보내는 진입점입니다.
기존 `import.js`와 `Unit.*` 호출은 그대로 사용할 수 있습니다.

| 수정할 내용 | 파일 |
| --- | --- |
| 등급 번호와 이름 변환 | `ranks.js` |
| 공격 유형별 계수 (`Seige`) | `damage-types.js` |
| 스턴·이감 효과 생성 (`STUN`, `SLOW`) | `effects.js` |
| 유닛 및 등급 기본값 | `defaults.js` |
| 유닛 생성 (`unit`) | `factory.js` |
| 등급별 데이터 조합 및 표시 순서 | `catalog.js` |
| 번호·등급·이름으로 유닛 조회 | `lookup.js` |
| 전체 유닛 목록 | `all-units.js` |
| 이름·등급·이감 순 정렬 | `sorting.js` |
| 중복 버프 적용 그룹 (`Rate`) | `buff-groups.js` |
| 마나뻥 계산용 목록 (`Mana`) | `mana.js` |
| 단일 효율 계산용 목록 (`Mono`) | `single-target.js` |

## 등급별 데이터

| 등급·분류 | 파일 |
| --- | --- |
| 특별함 | `ranks/special.js` |
| 희귀함 | `ranks/rare.js` |
| 전설적인 | `ranks/legendary.js` |
| 히든 | `ranks/hidden.js` |
| 초월함 | `ranks/transcendent.js` |
| 불멸의 | `ranks/immortal.js` |
| 영원한 | `ranks/eternal.js` |
| 제한됨 | `ranks/limited.js` |
| 신비함 | `ranks/mystic.js` |
| 왜곡됨 | `ranks/distorted.js` |
| 랜덤유닛 | `ranks/random.js` |
| 변이 | `ranks/mutated.js` |
| 아이템 | `ranks/items.js` |
| 연구소 | `ranks/laboratory.js` |
| 항법 | `ranks/navigation.js` |
| 특수함 | `ranks/special-buffs.js` |
| 오로성 | `ranks/five-elders.js` |

`unitStat`의 키 순서와 등급별 배열 순서는 화면 및 조회 인덱스에 사용됩니다.
`unitsByRankIndex`는 해당 배열을 그대로 참조합니다.
`allUnits`는 기존처럼 유닛을 얕게 복사해 정렬하므로, `Check` 같은 최상위
상태는 별개이고 `stun1`, `slow2` 같은 내부 효과 객체는 공유합니다.
