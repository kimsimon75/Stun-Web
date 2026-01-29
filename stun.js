const container = document.getElementsByClassName("container")[0];

const containerGrid = 25;
const GridHeight = 40 / containerGrid;

document.getElementsByClassName("container")[0].style.gridTemplateRows = `repeat(${containerGrid}, 1fr)`;
const unitRates = {
    특별함: 0,
    희귀함: 1,
    전설적인: 2,
    히든: 3,
    변이: 4,
    초월함: 5,
    불멸의: 6,
    영원한: 7,
    제한됨: 8,
    신비함: 9,
    랜덤유닛: 10,
    왜곡됨: 11,

    // ✅ BuffState에 섞여있는 카테고리(유닛 등급이랑 별개지만 인덱스로 묶기 위해 추가)
    아이템: 12,
    연구소: 13,
    항법: 14,
    특수함: 15, 
}

const Seige = {
    패기: 1.05,
    일반: 1,
    관통: 0.9,
    공성: 0.85,
    히든: 0.8,
    마법: 0.8,
}




export const STUN = Object.freeze({
  none: () => ({ type: "none" }),
  chance: (p, dur, r) => ({ type: "chance", p, dur, r }),
  cooldown: (cd, dur, r) => ({ type: "cooldown", cd, dur, r}), // 블랙마리아 같은 케이스
});
export const SLOW = Object.freeze({
  none: () => ({ type: "none" }),
  chance: (p, dur, eff) => ({ type: "chance", p, dur, eff}),
   // 블랙마리아 같은 케이스
});

const UNIT_DEFAULTS = Object.freeze({
  atkSpeedBonus: 1.0,
  attackCycle: 1.0,
  attackDelay: 0,

  stun1: STUN.none(),
  stun2: STUN.none(),
  slow1: SLOW.none(),
  slow2: SLOW.none(),

  mana: 0,
  manaDuration: 0,
  manaRange: 0,
  selfAtkSpeedBuff: 0,
  atkSpeedBuff: 0,
  manaSelfRegen: 0,

  healthRegen : 0,
  manaRegen : 0,
  
  slow: 0,
  Check: 0,

  StunCalCulate: 0,
  SlowCalculate: 0,
  EarthCalculate: 0,
});//공속, 마나, 체력, 이감, 체크

const RANK_DEFAULTS = Object.freeze({
  "특별함": {},
  "희귀함":   { atkSpeedBonus: 1.3 },
  "전설적인": { /* atkSpeedBonus: 2.95 같은 걸 여기에 둘 수도 있음 */ },
  "히든":     { },
  "초월함":   { },
  "불멸의":   { },
  "영원한":   { },
  "제한됨":   { },
  "신비함":   { },
  "왜곡됨":   { },
});

// ---- 유닛 생성기: 기본값 + (랭크기본) + patch ----
function unit(rank, name, patch = {}) {
  const base = { ...UNIT_DEFAULTS, ...(RANK_DEFAULTS[rank] ?? {}) };

  // patch는 얕게 덮고, stun 객체는 통째로 교체되는 게 맞음
  const u = { ...base, rank, name, ...patch };
  if (patch.stun1) u.stun1 = patch.stun1;
  if (patch.stun2) u.stun2 = patch.stun2;
  if (patch.slow1) u.slow1 = patch.slow1;
  if (patch.slow2) u.slow2 = patch.slow2;

  return u;
}



export const unitStat = {
  "특별함": [
    // 기존
    unit("특별함", "나미", { atkSpeedBonus: 0.53, attackCycle: 1, slow2: SLOW.chance(0.1, 4, 5) }),

    // BuffState(특수함 -> 특별함 통일)
    unit("특별함", "스모커", { slow: 5 }),
    unit("특별함", "키드", { slow: 5 }),
    unit("특별함", "크로커다일", { slow: 5 }),
  ],

  "희귀함": [
    // 기존
    unit("희귀함", "바제스",   { atkSpeedBonus: 1.3, attackCycle: 0.85, stun1: STUN.chance(0.1, 0.9, 500) }),
    unit("희귀함", "아오키지", { atkSpeedBonus: 1.3, attackCycle: 0.94, stun1: STUN.chance(0.1, 0.95, 405),slow: 10 }),
    unit("희귀함", "이완코브", { atkSpeedBonus: 1.3, attackCycle: 0.95, stun1: STUN.chance(0.07, 1.4, 500) }),
    unit("희귀함", "우솝",     { atkSpeedBonus: 1.3, attackCycle: 1.00, stun1: STUN.chance(0.1, 1.15, 485) }),
    unit("희귀함", "죠즈",     { atkSpeedBonus: 1.3, attackCycle: 0.97, stun1: STUN.chance(0.11, 0.9, 600) }),

    // BuffState
    unit("희귀함", "브룩", { atkSpeedBuff: 10 }),
    unit("희귀함", "슈가", { manaRegen: 0.6 }),
    unit("희귀함", "키드", { slow: 15 }),
    unit("희귀함", "크로커다일", { slow: 15 }),
    unit("희귀함", "페로나", { slow: 20 }),
  ],

  "전설적인": [
    // 기존
    unit("전설적인", "나미",   { atkSpeedBonus: 2.95, attackCycle: 0.66, slow2: SLOW.chance(0.088, 3, 42) }),
    unit("전설적인", "드래곤",       { atkSpeedBonus: 3.00, attackCycle: 0.77, stun1: STUN.chance(0.1, 2.85, 500), atkSpeedBuff: 5, slow: 10 }),
    unit("전설적인", "라분",         { atkSpeedBonus: 1.25, attackCycle: 1.33, stun1: STUN.chance(0.27, 2.15, 575), atkSpeedBuff: 10 }),
    unit("전설적인", "바르톨로메오", { atkSpeedBonus: 2.95, attackCycle: 0.71, stun1: STUN.chance(0.1, 2.75, 550) }),
    unit("전설적인", "샹크스",       { atkSpeedBonus: 2.95, attackCycle: 0.66, stun1: STUN.chance(0.1, 2.0, 600) }),
    unit("전설적인", "시키",         { atkSpeedBonus: 2.95, attackCycle: 0.75, stun1: STUN.chance(0.1, 3.0, 525) }),
    unit("전설적인", "쿠마",         { atkSpeedBonus: 2.95, attackCycle: 0.69, stun1: STUN.chance(0.1, 1.4, 500) }),
    unit("전설적인", "후지토라",     { atkSpeedBonus: 2.16, attackCycle: 0.95, stun1: STUN.chance(0.14, 2.4, 450), slow: 24 }),

    unit("전설적인", "흰수염", {
      atkSpeedBonus: 2.95, attackCycle: 0.74,
      slow1: SLOW.chance(0.11, 3, 25),
      slow2: SLOW.chance(0.11, 3, 10)
    }),

    unit("전설적인", "센고쿠", { atkSpeedBonus: 2.95, attackCycle: 0.67, slow1: SLOW.chance(0.1, 6, 0), slow: 20 }),
    unit("전설적인", "킹",     {
      atkSpeedBonus: 2.95, attackCycle: 0.92,
      slow1: SLOW.chance(0.1425, 2.7, 0),
      slow2: SLOW.chance(0.1425, 2, 0),
      slow: 10
    }),

    // BuffState(전설적인)
    unit("전설적인", "크래커", { atkSpeedBuff: 9 }),
    unit("전설적인", "토키", { atkSpeedBuff: 20, slow: 25 }),
    unit("전설적인", "슈가", { manaRegen: 1.25 }),
    unit("전설적인", "징베", { manaRegen: 2.5 }),
    unit("전설적인", "모리아", { slow: 30 }),
    unit("전설적인", "네코마무시", { slow: 30 }),
    unit("전설적인", "마르코", { slow: 30 }),
    unit("전설적인", "레이쥬", { slow: 35 }),
    unit("전설적인", "스모커", { slow: 50 }),
    unit("전설적인", "X-드레이크", { slow: 10 }),
  ],

  "히든": [
    // 기존
    unit("히든", "방주맥심", { atkSpeedBonus: 2.6, attackCycle: 0.64, slow2: SLOW.chance(0.14, 3, 30) }),
    unit("히든", "봉쿠레",     { atkSpeedBonus: 2.6, attackCycle: 0.94, stun1: STUN.chance(0.09, 1.55, 500) }),
    unit("히든", "써니호",     { atkSpeedBonus: 2.6, attackCycle: 0.45, stun1: STUN.chance(0.1, 1.4, 600) }),
    unit("히든", "아오키지",   { atkSpeedBonus: 2.6, attackCycle: 0.79, stun1: STUN.chance(0.1, 1.7, 415), slow: 35 }),
    unit("히든", "이완코브",   { atkSpeedBonus: 2.6, attackCycle: 0.86, stun1: STUN.chance(0.12, 1.8, 500) }),
    unit("히든", "피셔타이거", { atkSpeedBonus: 2.6, attackCycle: 0.49, stun1: STUN.chance(0.1, 2.0, 515) }),

    unit("히든", "아카이누", { atkSpeedBonus: 2.6, attackCycle: 0.75, slow2: SLOW.chance(0.16, 2, 10) }),
    unit("히든", "료쿠규",   { atkSpeedBonus: 2.6, attackCycle: 0.95, slow2: SLOW.chance(0.08, 3, 20) }),

    // BuffState(히든)
    unit("히든", "발라티에", { atkSpeedBuff: 22 }),
    unit("히든", "코알라", { manaRegen: 3.25 }),
    unit("히든", "모비딕 호", { healthRegen: 1.25, slow: 40 }),
    unit("히든", "사보", { slow: 25 }),
  ],

  "초월함": [
    // 기존
    unit("초월함", "검은수염", {
      atkSpeedBonus: 3.35, attackCycle: 0.61,
      slow1: SLOW.chance(0.1, 3, 75),
      slow2: SLOW.chance(0.1, 2, 15)
    }),

    unit("초월함", "로빈",   { atkSpeedBonus: 3.35, attackCycle: 0.71, stun1: STUN.chance(0.1, 2.85, 525) }),
    unit("초월함", "료쿠규", { atkSpeedBonus: 3.35, attackCycle: 0.84,
      slow1: SLOW.chance(0.12, 3, 25),
      slow2: SLOW.chance(0.164, 3, 20)
    }),

    unit("초월함", "루피", { atkSpeedBonus: 3.35, attackCycle: 0.38,
      stun1: STUN.chance(0.025, 3.5, 500),
      mana: 160, manaDuration: 2.15, manaRange: 600,
      slow1: SLOW.chance(0.175, 2, 33)
    }),

    unit("초월함", "보니",     { atkSpeedBonus: 3.35, attackCycle: 0.89, stun1: STUN.chance(0.12, 1.5, 500) }),
    unit("초월함", "시라호시", { atkSpeedBonus: 3.35, attackCycle: 0.70, stun1: STUN.chance(0.12, 2.35, 600), mana: 120, manaDuration: 3, manaRange: 800 }),
    unit("초월함", "샹크스",   { atkSpeedBonus: 3.55, attackCycle: 0.60, stun1: STUN.chance(0.1, 2.0, 800), stun2: STUN.chance(0.1, 1.8, 800), mana: 35, manaDuration: 3, manaRange: 1100 }),
    unit("초월함", "아오키지", { atkSpeedBonus: 3.35, attackCycle: 0.69, stun1: STUN.chance(0.1, 2.3, 550), manaRange: 700, slow: 80 }),
    unit("초월함", "조로",     { atkSpeedBonus: 3.35, attackCycle: 0.67, stun1: STUN.chance(0.03, 2.5, 500), mana: 145, manaDuration: 3, manaRange: 525, slow: 30 }),
    unit("초월함", "키드",     { atkSpeedBonus: 3.35, attackCycle: 0.99, mana: 40, manaDuration: 2.25, manaRange: 525, slow: 33 }),
    unit("초월함", "키자루",   { atkSpeedBonus: 3.35, attackCycle: 0.64, stun1: STUN.chance(0.0825, 2.75, 500) }),
    unit("초월함", "후지토라", { atkSpeedBonus: 2.16, attackCycle: 0.94, stun1: STUN.chance(0.15, 2.6, 475), stun2: STUN.chance(0.0415, 2.5, 475), slow: 55 }),

    unit("초월함", "나미",   { atkSpeedBonus: 3.55, attackCycle: 0.65, slow2: SLOW.chance(0.0415, 5, 45) }),
    unit("초월함", "로우",   { atkSpeedBonus: 3.35, attackCycle: 0.64, slow1: SLOW.chance(0.125, 3, 40) }),

    unit("초월함", "사보",   { atkSpeedBonus: 2.57, attackCycle: 0.79, slow1: SLOW.chance(0.1, 2, 30), atkSpeedBuff: 20, slow: 35 }),
    unit("초월함", "상디",   { atkSpeedBonus: 3.35, attackCycle: 0.46, slow1: SLOW.chance(0.05, 3.5, 50) }),
    unit("초월함", "아카이누", { atkSpeedBonus: 3.35, attackCycle: 0.73, slow2: SLOW.chance(0.1675, 2, 12) }),
    unit("초월함", "징베",   { atkSpeedBonus: 2.90, attackCycle: 0.89, slow1: SLOW.chance(0.0625, 3, 50), atkSpeedBuff: 20, manaRegen: 3 }),
    unit("초월함", "도플라밍고", { atkSpeedBonus: 3.35, attackCycle: 0.62,
      slow1: SLOW.chance(0.2, 4, 250),
      slow2: SLOW.chance(0.2, 3, 45)
    }),
    unit("초월함", "상디(강화)", { atkSpeedBonus: 4.0, attackCycle: 0.44, slow1: SLOW.chance(0.06, 3.5, 55), atkSpeedBuff: 15 }),

    // BuffState(초월함 추가)
    unit("초월함", "쵸파", { atkSpeedBuff: 30 }),
    unit("초월함", "코비", { atkSpeedBuff: 10 }),
    unit("초월함", "프랑키", { manaRegen: 5 }),
    unit("초월함", "조로(강화)", { slow: 45 }),
    unit("초월함", "조로(염왕)", { slow: 50 }),
    unit("초월함", "바질 호킨스", { slow: 7 }),
    unit("초월함", "브룩", { slow: 32 }),
    unit("초월함", "야마토", { slow: -15 }),
    unit("초월함", "아기 라분", { slow: 12 }),
  ],

  "불멸의": [
    // 기존
    unit("불멸의", "거프",         { atkSpeedBonus: 3.3, attackCycle: 0.63, stun1: STUN.chance(0.1, 2.5, 500) }),
    unit("불멸의", "드래곤",       { atkSpeedBonus: 3.5, attackCycle: 0.61, stun1: STUN.chance(0.1, 3.0, 525), atkSpeedBuff: 20 }),
    unit("불멸의", "센고쿠",       { atkSpeedBonus: 3.3, attackCycle: 0.70, stun1: STUN.chance(0.1, 2.85, 525) }),
    unit("불멸의", "센고쿠(특강)", { atkSpeedBonus: 3.3, attackCycle: 0.70, stun1: STUN.chance(0.1, 2.85, 525), stun2: STUN.chance(0.08, 2.5, 500) }),
    unit("불멸의", "시키",         { atkSpeedBonus: 3.3, attackCycle: 0.49, stun1: STUN.chance(0.1, 3.0, 600), mana: 125, manaDuration: 3, manaRange: 600 }),

    unit("불멸의", "흰수염", {
      atkSpeedBonus: 3.3, attackCycle: 0.73,
      stun1: STUN.chance(0.05, 3.0, 625),
      mana: 115, manaDuration: 3,
      slow1: SLOW.chance(0.125, 3.5, 45),
      slow2: SLOW.chance(0.125, 2, 15)
    }),

    unit("불멸의", "흰수염(약주)", { atkSpeedBonus: 3.3, attackCycle: 0.73, stun1: STUN.chance(0.05, 3.0, 625), mana: 115, manaDuration: 3 }),

    unit("불멸의", "시키(1레벨)", { atkSpeedBonus: 3.3, attackCycle: 0.49, slow2: SLOW.chance(0.03,  5, 35) }),
    unit("불멸의", "시키(2레벨)", { atkSpeedBonus: 3.3, attackCycle: 0.49, slow2: SLOW.chance(0.035, 5, 35) }),
    unit("불멸의", "시키(3레벨)", { atkSpeedBonus: 3.3, attackCycle: 0.49, slow2: SLOW.chance(0.04,  5, 35) }),
    unit("불멸의", "시키(4레벨)", { atkSpeedBonus: 3.3, attackCycle: 0.49, slow2: SLOW.chance(0.045, 5, 35) }),

    // BuffState(불멸의)
    unit("불멸의", "레일리", { atkSpeedBuff: 45 }),
    unit("불멸의", "로져", { slow: 50 }),
    unit("불멸의", "빅맘", { slow: 70 }),
    unit("불멸의", "제트", { slow: 35 }),
    unit("불멸의", "카이도", { slow: 60 }),
  ],

  "영원한": [
    // 기존
    unit("영원한", "니카",     { atkSpeedBonus: 3.35, attackCycle: 0.57, stun1: STUN.chance(0.1, 2.0, 500), mana: 150, manaDuration: 3, atkSpeedBuff: 25, manaRange: 750 }),
    unit("영원한", "우타",     { atkSpeedBonus: 3.37, attackCycle: 0.67, stun1: STUN.chance(0.1, 1.5, 500), atkSpeedBuff: 27, slow: 45 }),
    unit("영원한", "카벤딧슈", { atkSpeedBonus: 3.15, attackCycle: 0.71, stun1: STUN.chance(0.1, 2.3, 550) }),

    unit("영원한", "핸콕", {
      atkSpeedBonus: 3.3, attackCycle: 0.74,
      stun1: STUN.chance(0.075, 2.75, 650),
      mana: 175, manaDuration: 4, manaRange: 750,
      slow1: SLOW.chance(0.075, 2.5, 60)
    }),

    unit("영원한", "핸콕(특강)", { atkSpeedBonus: 3.3, attackCycle: 0.74, stun1: STUN.chance(0.1, 2.75, 650), mana: 175, manaDuration: 4, manaRange: 750 }),
    unit("영원한", "테조로",   { atkSpeedBonus: 3.61, attackCycle: 0.70, stun1: STUN.chance(0.12, 2.4, 625), mana: 90, manaDuration: 2.4, atkSpeedBuff: 25, manaRange: 625 }),

    // BuffState(영원한)
    unit("영원한", "버기", { atkSpeedBuff: 65, slow: 25 }),
    unit("영원한", "미호크", { slow: 45 }),
    unit("영원한", "에이스", { slow: 45 }),
  ],

  "제한됨": [
    // 기존
    unit("제한됨", "크로커다일",       { atkSpeedBonus: 2.85, attackCycle: 0.56, stun1: STUN.chance(0.05, 2.5, 550), slow: 40 }),
    unit("제한됨", "크로커다일(특강)", { atkSpeedBonus: 2.85, attackCycle: 0.56, stun1: STUN.chance(0.05, 2.5, 550), mana: 80, manaDuration: 1.05, manaRange: 500 }),

    unit("제한됨", "에넬",   { atkSpeedBonus: 2.85, attackCycle: 0.75, slow2: SLOW.chance(0.1, 4, 35), manaRegen: 1.5 }),
    unit("제한됨", "레베카", { atkSpeedBonus: 1.4,  attackCycle: 0.88, slow1: SLOW.chance(0.0825, 3, 50) }),

    // BuffState(제한됨)
    unit("제한됨", "마르코", { healthRegen: 3.3, slow: 45 }),
    unit("제한됨", "마르코(특강)", { healthRegen: 4.3, slow: 60 }),
    unit("제한됨", "카타쿠리", { healthRegen: 2.85 }),
    unit("제한됨", "시노부", { slow: 30 }),
  ],

  "신비함": [
    // 기존
    unit("신비함", "K",         { atkSpeedBonus: 3.3,  attackCycle: 0.58, stun1: STUN.chance(0.03, 3.0, 460) }),
    unit("신비함", "고죠 사토루", { atkSpeedBonus: 3.3,  attackCycle: 1.01, stun1: STUN.chance(0.1, 2.0, 600), mana: 185, manaDuration: 5, manaRange: NaN, slow2: SLOW.chance(0.1, 2, 20) }),
    unit("신비함", "나루토",     { atkSpeedBonus: 3.05, attackCycle: 0.50, stun1: STUN.chance(0.05, 2.85, 600) }),
    unit("신비함", "미나토",     { atkSpeedBonus: 3.42, attackCycle: 0.73, stun1: STUN.chance(0.0425, 3.0, 600), stun2: STUN.chance(0.16, 2.75, 525)}),
    unit("신비함", "타츠마키",   { atkSpeedBonus: 3.3,  attackCycle: 0.79, stun1: STUN.chance(0.1425, 1.75, 525), slow: 50 }),

    unit("신비함", "요우무", { atkSpeedBonus: 3.3, attackCycle: 0.71, slow2: SLOW.chance(0.1, 3, 50) }),

    // BuffState(신비함)
    unit("신비함", "아냐 포저", { atkSpeedBuff: 30, manaRegen: 1.75, healthRegen: 2, slow: 40 }),
    unit("신비함", "키쿄우", { manaRegen: 1.5, healthRegen: 1.5 }),
    unit("신비함", "사토루", { slow: 30 }),
    unit("신비함", "히그마", { slow: 30 }),
    unit("신비함", "쿠치키 뱌쿠야", { slow: 35 }),
    unit("신비함", "엘리자베스", { slow: 20 }),
  ],

  "왜곡됨": [
    // 기존
    unit("왜곡됨", "블랙마리아", { atkSpeedBonus: 0.8, attackCycle: 0.84, stun1: STUN.cooldown(5, 3.5, 900) }),
    unit("왜곡됨", "퀸",         { atkSpeedBonus: 2.8, attackCycle: 0.85, stun1: STUN.chance(0.15, 0.95, 500), slow1: SLOW.chance(0.14, 2, 0), manaRegen: 1, healthRegen: 1 }),
    unit("왜곡됨", "페로나", { slow: 45 }),
  ],

  // BuffState: 등급이 "랜덤"인 것들은 네가 쓰던 키에 맞춰 "랜덤유닛"으로 통일
  "랜덤유닛": [
    unit("랜덤유닛", "츠바사", { atkSpeedBuff: 20 }),
    unit("랜덤유닛", "카이조 토우마", { manaRegen: 0.3, healthRegen: 0.3 }),
    unit("랜덤유닛", "요츠바", { manaRegen: 2.5 }),
  ],

  // BuffState: "변화된" -> "변이" 통일
  "변이": [
    unit("변이", "비비", { slow: 20 }),
    unit("변이", "에이스", { slow: 20 }),
  ],

  "아이템": [
    unit("아이템", "우타의 헤드셋", { atkSpeedBuff: 12 }),
    unit("아이템", "불사조의 깃털", { healthRegen: 0.3 }),
    unit("아이템", "둔화의 지팡이", { slow: 12 }),
    unit("아이템", "비구름생성기", { slow: 12 }),
    unit("아이템", "거인족의 술잔", { manaRegen: 0.5 }),
    unit("아이템", "가죽장갑", { atkSpeedBuff: 4 }),
  ],

  "연구소": [
    unit("연구소", "식량 보급", { manaRegen: 0.8 }),
    unit("연구소", "해상 디너", { healthRegen: 0.45 }),
    unit("연구소", "기후 변화", { slow: 10 }),
    unit("연구소", "냉철함(아오키지)", { slow: 6 }),
    unit("연구소", "신속함(키자루)", { atkSpeedBuff: 4 }),
  ],

  "항법": [
    unit("항법", "패왕의 길", { slow: 5 }),
    unit("항법", "로얄로더", { atkSpeedBuff: 25 }),
  ],
  "특수함": [
    unit("특수함", "베티", { atkSpeedBuff: 11, manaRegen: 1.25, healthRegen: 2 }),
  ],
};



function findUnitPos(rank, name) {
  const sortCount = unitRates[rank];
  if (sortCount == null) return null;           // unitRates에 없는 등급

  const arr = unitStat[rank];
  if (!Array.isArray(arr)) return null;         // unitStat에 없는 등급

  const unitCount = arr.findIndex(u => u.name === name);
  if (unitCount === -1) return null;            // 그 등급에 그 이름 없음

  return { sortCount, unitCount };
}

const Rate = [
  [['우타의 헤드셋', '아이템'], ['우타', '영원한']],
  [['불사조의 깃털', '아이템'], ['마르코', '제한됨'], ['마르코(특강)', '제한됨']],
  [['아기 라분', '초월함'], ['브룩', '초월함']],
];

const Mana = [// 이름, 등급, 공속보너스, 공격주기, 마나통, 딜레이시간
    ['미호크', unitRates.영원한,1.45, 0.93, 175, 2.3], 
    ['에넬', unitRates.제한됨, 2.85, 0.75,  145, 0],
    ['핸콕', unitRates.영원한, 3.3, 0.74, 175, 1.48],
    ['에이스', unitRates.영원한, 3.14, 0.58, 185, 0],
    ['제트', unitRates.불멸의, 3.3, 0.66, 160, 1],
    ['제트(특강)', unitRates.불멸의, 2, 0.46, 160, 1],
    ['쿠마', unitRates.전설적인, 2.95, 0.69, 115, 0],
    ['오뎅', unitRates.영원한, 3.15, 0.64, 145, 0],
    ['프랑키', unitRates.초월함, 3.35, 0.75, 150, 0],
    ['시라호시', unitRates.초월함, 3.35, 0.7, 120, 0],
    ['타시기', unitRates.초월함, 3.35, 0.88, 135, 0],  
    ['반 더 데켄', unitRates.히든, 2.6, 0.66, 95, 0],
    ['류마(400스택 이상)', unitRates.영원한, 3.23, 0.71, 150, 0],
    ['코비(9스텍 + 도시락)', unitRates.초월함, 2.8, 0.71, 150, 0],
]

const Mono = [
    ['시류', unitRates.희귀함, 1.3, 0.69, 0.1, 0.15, 0, 0, Seige.관통],
    ['류마', unitRates.희귀함, 1.3, 0.77, 0.1, 0.1, 0, 0, Seige.관통 ],
    ['핸콕', unitRates.희귀함, 1.3, 0.68, 0.1, 0.1, 0, 0, Seige.패기],

    ['루치', unitRates.전설적인, 2.95, 0.52, 0.11, 0.3, 0, 0, Seige.공성],
    ['상디', unitRates.전설적인, 2.95, 0.45, 1, 0.0285, 0, 0, Seige.공성],
    ['레이쥬', unitRates.전설적인, 2.95, 0.88, 0.0525, 0.1956, 0.1, 0.1719, Seige.관통],
    ['코비', unitRates.전설적인, 2.95, 0.57, 0.125, 0.25, 0, 0, Seige.일반],

    ['류마', unitRates.히든, 2.6, 0.67, 0.125, 0.2, 0, 0, Seige.관통],
    ['스튜시', unitRates.히든, 2.6, 0.6, 0.1425, 0.25, 0, 0, Seige.일반],

    ['도플라밍고', unitRates.변이, 2.85, 0.61, 0.1, 0.2, 0, 0, Seige.관통],

    ['상디', unitRates.초월함, 3.35, 0.46, 1, 0.032, 0, 0, Seige.공성],
    ['상디(강화)', unitRates.초월함, 4, 0.46, 1, 0.032, 0, 0, Seige.공성],
    ['루치', unitRates.초월함, 3.35, 0.54, 0.18, 0.23, 0.0525, 0.4, Seige.마법],
    ['루치(300클)', unitRates.초월함, 3.35, 0.54, 0.18, 0.23, 0.06, 0.4, Seige.마법],
    ['루치(특강 300클 한정)', unitRates.초월함, 3.35, 0.54, 0.2, 0.25, 0.06, 0.4, Seige.마법],

    
    ['마르코', unitRates.제한됨, 4, 0.64, 0.1, 0.2, 0.15, 0.3, Seige.관통],
]

export const rankByIndex = (() => {
  const arr = [];
  for (const [rankName, idx] of Object.entries(unitRates)) {
    arr[idx] = rankName;   // idx가 숫자, rankName이 문자열 key
  }
  return Object.freeze(arr);
})();

// 2) rankIndex -> units[]
export const unitsByRankIndex = (() => {
  const arr = [];
  for (let i = 0; i < rankByIndex.length; i++) {
    const rankName = rankByIndex[i];
    arr[i] = rankName ? (unitStat[rankName] ?? []) : [];
  }
  return Object.freeze(arr);
})();

// 3) 접근 함수들
export function getUnits(rankIndex) {
  return unitsByRankIndex[rankIndex] ?? [];
}

export function getUnit(rankIndex, unitIndex) {
  const list = getUnits(rankIndex);
  return list[unitIndex] ?? null;
}

// (옵션) 길이 확인
export function getUnitCount(rankIndex) {
  return getUnits(rankIndex).length;
}


function findUnit(rank, name) {
  const list = unitStat[rank];
  if (!list) return null;
  return list.find(u => u.name === name) ?? null;
}

const idxToRank = (idx) => rankByIndex[idx] ?? null;


let Sort = [];



var speedDebuff= 0;
var speedBonusEx = 0;
var mana = true;
var manaRegen = 0;
var healthRegen = 0;
var totalStun = 0;

var m_nightmare = 484;
var m_god = 484;

var nameSort = 1;
var rateSort = 0;
var moveSpeedSort = 0;
var afterShockSort = 0;

var koby = 0;
var intel = 0;
var dex = 0;

const StunCalCulation = 0.2;
const min_move = 89;
const max_move = 490;

const round = 32;

var deviationToggle = false;

// unitStat(객체) -> 모든 유닛을 1차원 배열로 합치면서 rank 붙이기
const allUnits = Object.entries(unitStat).flatMap(([rank, arr]) =>
  arr.map(u => ({ ...u, rank }))   // rank가 원래 없으니까 붙임
);
UnitTotalStun();


allUnits.sort((a, b) => {

  return SortFunction(a, b);
});


function lowSpeed(sortCount, unitCount, AfterShock) {
    let Rate = 0;
    let x = 0;
    let s = 0;

    // 1. t 계산
    
    const u = getUnit(sortCount, unitCount);
    if(u.slow1.type == "none" && u.slow2.type == "none") return;

    if((AfterShock == 0 && u.slow1.type == "none") || (AfterShock == 1 && u.slow2.type == "none")) return;

    const slowIndex = allUnits.findIndex(item => item.rank == idxToRank(sortCount) && item.name == u.name);
    const slowU = allUnits[slowIndex]
    let t = 1 / u.attackCycle * Math.min(RoundX(1 + slowU.atkSpeedBonus + (speedBonusEx + dex) / 100,3), 5);


    if(slowU.rank == "희귀함"
        || slowU.rank == "전설적인" 
        || slowU.rank == "히든" 
        || slowU.rank == "왜곡됨"
        || slowU.rank == "특별함")
    {
        const royal = allUnits.find(items => items.rank == "항법" && items.name == "로얄로더");
        if(royal.Check)
        {
            t = 1 / slowU.attackCycle * Math.min(RoundX(1 + slowU.atkSpeedBonus + (speedBonusEx - royal.atkSpeedBuff) / 100,3), 5);
        }
    }    
    // 2. AfterShock가 0일 때 계산
    if (AfterShock == 0) {
        x = slowU.slow1.p; // 발이감 확률
        s = slowU.slow1.dur; // 발이감 지속시간

    }
    else {
        if (slowU.name == "료쿠규" && slowU.rank == "초월함") {
            x = RoundX(1 - RoundX(1 - 0.05, 2) * RoundX(1 - 0.12, 2),3);
        }
        else if (slowU.name == "아카이누" && slowU.rank == "초월함")
        {
            x = RoundX(1 - RoundX(1 - 0.075, 3) * RoundX(1 - 0.1, 1), 4);
        }
        else
            x = slowU.slow2.p;
        s = slowU.slow2.dur;

    }
    let n = Math.floor(s * t);

    if (slowU.name == "나미" && slowU.rank == "초월함" && AfterShock==1)
        Rate = 1 - (1 - 3 / 3.5) * -(x * s * t - n * x - 1) * Math.pow(RoundX(1 - x,4), n);
    else if (slowU.name == "요우무" && slowU.rank == "신비함" && AfterShock==1)
    {
        let spec = 25 / (200 / (1 + t + healthRegen));

        spec = spec > 1 ? 1 : spec;

        Rate = (1- Math.pow( - (x * s * t - n * x - 1) * Math.pow(RoundX(1 - x,4), n), 2)) * spec + (1 + (x * s * t - n * x - 1) * Math.pow(RoundX(1 - x,4), n)) * (1 - spec);
    }
    else
        Rate = 1 + (x * s * t - n * x - 1) * Math.pow(RoundX(1-x,4), n);

    if(x === 0 || s === 0)
        return 0;

    if(AfterShock) slowU.EarthCalculate = Rate;
    else slowU.SlowCalculate = Rate;
    return Rate;
}


function RoundX(x, n) {
    if (typeof n !== "number" || n <= 0 || !Number.isInteger(n)) {
        console.warn("❌ RoundX 경고: n이 잘못됐습니다. 기본값 3으로 처리합니다.");
        n = 3;
    }
    return Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
}

function Brave(koby){
    let t = 1 / 0.57 * Math.min(RoundX(1 + 2.95 + speedBonusEx / 100, 3) / 1000, 5);
    let core = (115 - koby * 5) / (t + manaRegen);
    if(core < koby*5)
        return 1;
    else 
        return (koby * 5 / core);
}

function StunCalCulator(T,X,S,L,luffy = 0)
    {
        if(T==0 || X==0 || S==0 || L==0)
            return 0;

        if(luffy == 0)
        {
        const n = Math.floor((S - L)/T) + 1;
        const stun_duration = (L-T) * X * ( 1 - Math.pow(1 - X, n) ) + T / X * (1 - (n * X + 1) * Math.pow(1 - X, n)) + S *  Math.pow(1-X,n);
        const total_duration = L-T + T / X;
    
        return stun_duration / total_duration;
        }
        else
        {
            const n = Math.floor(S / T);
            const delay_n = Math.ceil(luffy / T);
            const delay_T = T * delay_n;
            const realN = n - delay_n;

            console.log(n, delay_n, realN);

            const stun_duration = T / X * (1 - (realN * X + 1) * Math.pow(1 - X, realN)) + (S - delay_T) *  Math.pow(1-X,realN) + delay_T;
            const total_duration = T / X + delay_T;
            return stun_duration / total_duration;
        }
    }

function UnitTotalStun() {

    speedBonusEx = RoundX(speedBonusEx, 3);
    manaRegen    = RoundX(manaRegen, 3);
    healthRegen  = RoundX(healthRegen, 3);
    speedDebuff  = RoundX(speedDebuff, 3);



    for (let sortCount = 0; sortCount < Object.keys(unitStat).length; sortCount++)
    {
        for (let unitCount = 0; unitCount < unitStat[idxToRank(sortCount)].length; unitCount++)
        {
            lowSpeed(sortCount, unitCount, 0);
            lowSpeed(sortCount, unitCount, 1);
            const u = getUnit(sortCount, unitCount);
            if (!u) {
            console.error("u가 null/undefined임", u);
            return;
            }

            const stun1 = u.stun1 ?? STUN.none(); 
            if(u.stun1.type == "none" && u.manaRange == 0){
                continue;
            }
            let x1 = 0;
            let cooldown = 0;
            if(u.stun1.type == "chance")
                x1 = u.stun1.p;
            else if(u.stun1.type == "cooldown")
                cooldown = u.stun1.cd;

            let x2 = (1 - u.stun1.p) * (u.stun2.type != "none" ? u.stun2.p : 0);
            let s1 = u.stun1.dur;
            let s2 = u.stun2.type != "none" ? u.stun2.dur : 0;
            let CheckU = allUnits.find(items => items.rank === u.rank && items.name === u.name);

            let unitSpeedBonusEx = RoundX(u.atkSpeedBonus + RoundX((CheckU.Check ? (speedBonusEx - u.atkSpeedBuff) : speedBonusEx) / 100, 3), 3);

            const uta = allUnits.find(items => items.name == "우타의 헤드셋" && items.rank == "아이템");
            
            if(u.name == "우타" && uta.Check)
                {
                    unitSpeedBonusEx = RoundX(
                    u.atkSpeedBonus +
                        RoundX(
                        ((CheckU.Check > 0)
                        ? speedBonusEx - u.atkSpeedBuff
                        : speedBonusEx - (uta.atkSpeedBuff)
                        ) / 100,
                        3
                    ),
                    3
                    );

    
                }
            if(idxToRank(sortCount) == "초월함" || u.name == "니카")
                unitSpeedBonusEx = RoundX(unitSpeedBonusEx + dex / 100, 3);
            let t = u.attackCycle / ((1 + unitSpeedBonusEx) > 5 ? 5 : (1 + unitSpeedBonusEx));


            if(idxToRank(sortCount)  == "희귀함"
                 || idxToRank(sortCount)  == "전설적인" 
                 || idxToRank(sortCount)  == "히든" 
                 || idxToRank(sortCount)  == "왜곡됨")
            {
                const royal = allUnits.find(items => items.rank == "항법" && items.name == "로얄로더");
                if(royal.Check > 0)
                {
                    t =  u.attackCycle / (Math.min(5, 1 + unitSpeedBonusEx - RoundX(royal.atkSpeedBuff / 100, 3)));
                }
            }           
             

            let unitManaRegen = manaRegen + Brave(koby) + ((idxToRank(sortCount)  === "초월함" || u.name === "니카") ? intel * 0.08 : 0);
            let unitHealthRegen = healthRegen + Brave(koby) + ((idxToRank(sortCount)  === "초월함" || u.name === "니카") ? intel * 0.04 : 0);

            let maxMana = u.mana;
            let m_stun = u.manaDuration;
            let stun = 0;

            if (u.name === "라분") // 라분
            {
                let delay = 0.39/ ((1 + unitSpeedBonusEx) > 5 ? 5 : (1 + unitSpeedBonusEx))
                for (let k = 0; k < 7; k++) {
                    window['time' + k] = k * t + delay;
                }
                stun = Math.log(1 - (
                ((0.65 + time0 > 2.15) ? 2.15 : (0.65 + time0)) * 0.27 + 
                ((0.65 + time1 > 2.15) ? 2.15 : (0.65 + time1)) * 0.27 * (1 - 0.27) + 
                ((0.65 + time2 > 2.15) ? 2.15 : (0.65 + time2)) * 0.27 * Math.pow(1 - 0.27, 2) + 
                ((0.65 + time3 > 2.15) ? 2.15 : (0.65 + time3)) * 0.27 * Math.pow(1 - 0.27, 3) + 
                ((0.65 + time4 > 2.15) ? 2.15 : (0.65 + time4)) * 0.27 * Math.pow(1 - 0.27, 4) + 
                ((0.65 + time5 > 2.15) ? 2.15 : (0.65 + time5)) * 0.27 * Math.pow(1 - 0.27, 5) + 
                ((0.65 + time6 > 2.15) ? 2.15 : (0.65 + time6)) * 
                (1 - 
                    0.27 - 
                    0.27 * (1 - 0.27) - 
                    0.27 * Math.pow(1 - 0.27, 2) -
                    0.27 * Math.pow(1 - 0.27, 3) - 
                    0.27 * Math.pow(1 - 0.27, 4)- 
                    0.27 * Math.pow(1 - 0.27, 5))) / 
                    ((0.65 + time0) * 0.27 +
                    (0.65 + time1) * 0.27 * (1 - 0.27) + 
                    (0.65 + time2) * 0.27 * Math.pow(1 - 0.27, 2) + 
                    (0.65 + time3) * 0.27 * Math.pow(1 - 0.27, 3) + 
                    (0.65 + time4) * 0.27 * Math.pow(1 - 0.27, 4) + 
                    (0.65 + time5) * 0.27 * Math.pow(1 - 0.27, 5) + 
                    (0.65 + time6 ) * 
                    (1 - 
                        (0.27 + 0.27 * Math.pow(1 - 0.27, 1) + 
                    0.27 * Math.pow(1 - 0.27, 2) + 
                    0.27 * Math.pow(1 - 0.27, 3) + 
                    0.27 * Math.pow(1 - 0.27, 4) + 
                    0.27 * Math.pow(1 - 0.27, 5))))) / Math.log(StunCalCulation);
            }
            else if(u.name === "죠즈")
            {
                stun = Math.log(1 - StunCalCulator(t, x1, s1, 0.855)) / Math.log(StunCalCulation);
            }
            else if(idxToRank(sortCount)  == "왜곡됨" && u.name == "블랙마리아")
            {
                stun = Math.log(1 -RoundX(s1 / cooldown, 3)) / Math.log(StunCalCulation);
            }
            else if (idxToRank(sortCount)  === '초월함' && u.name === "샹크스") // 샹크스
            {
                stun = Math.log((1-StunCalCulator(t,x1,s1,t))* (1-StunCalCulator(t, x2, s2, t)) * (1 - 3 / 14.25) * (1 - 3 * (1.35 + unitManaRegen) / 35)) / Math.log(StunCalCulation);
            }
            else if (idxToRank(sortCount)  === '초월함' && u.name === "루피")
                {
                    x2 = 0.125;
                    s2 = 1.5;
                    if (mana)
                        stun = Math.log(1 - StunCalCulator(t, x2, s2, t) * (StunCalCulator(t, x1, s1, t, 1.75)))  / Math.log(StunCalCulation);
                    else
                        stun = Math.log(StunCalCulator(t, x1, 3.5, t)) / Math.log(StunCalCulation);
                    console.log(StunCalCulator(t, x1, s1, t, 1.75));
                }
            else if(u.name === "보니")
            {
                let n3 = Math.ceil(2 / t);
                let time = n3 * t;
                stun = Math.log(StunCalCulator(t, x1, s1, t, time)) / Math.log(StunCalCulation);
            }
            else if (idxToRank(sortCount)  ==='초월함' &&  u.name === "아오키지") // 아오키지
            {
                stun = Math.log((1-StunCalCulator(t, x1, s1, t)) * (1 - 3 / (t / 0.125 * Math.pow(1 - 0.125, Math.floor(25 / (1 + t * unitManaRegen))) + 50 / (1 / t + unitManaRegen)))) / Math.log(StunCalCulation);
            }
            else if(idxToRank(sortCount)  === "초월함" && u.name === "키드")
            {
                stun = Math.log(1 - (m_stun / (maxMana / (1/ t + unitHealthRegen + 0.2)))) / Math.log(StunCalCulation);
            }
            else if (u.name === "흰수염") // 흰수염
            {
                if(mana)
                    stun = Math.log((1 - StunCalCulator(t, x1, s1, 0.69)) *
                        (1 - ( m_stun / (maxMana / (1 /t + unitHealthRegen + 0.5))))) / Math.log(StunCalCulation);
                else
                    stun = Math.log(1 - StunCalCulator(t, x1, s1, 0.69)) / Math.log(StunCalCulation);
            }
            else if(u.name === "흰수염(약주)")
            {
                if(mana)
                    stun = Math.log((1 - StunCalCulator(t, x1, s1, 0.49)) *
                (1 - ( m_stun / (maxMana / (1 / t + unitHealthRegen + 0.5))))) / Math.log(StunCalCulation);
                else
                    stun = Math.log(1 - StunCalCulator(t, x1, s1, 0.49)) / Math.log(StunCalCulation);
                
            }
            else if (u.name === "크로커다일(특강)")
            {
                if (mana)
                    stun = Math.log((1-StunCalCulator(t, x1, s1, t)) * (1 - ((maxMana != 0) ? m_stun / (maxMana / (1 / t + unitHealthRegen)) : 0))) / Math.log(StunCalCulation);
                else
                    stun = Math.log((1-StunCalCulator(t, x1, s1, t)))/ Math.log(StunCalCulation);
            }
            else if (u.name === "니카")
            {
                const nikkaBuff = RoundX(unitSpeedBonusEx - 2.25 , 3);
                let t2 =  u.attackCycle / ((1 + nikkaBuff) > 5 ? 5 : (1 + nikkaBuff));
                let time = (4.25 + ((115 - 4.25 * (1 / t2 + unitHealthRegen + 0.25)) / (1 / t + unitHealthRegen + 0.25)) <= 4.25) ? 4.25 : (4.25 + ((115 - 4.25 * (1 /t2 + unitHealthRegen + 0.25)) / (1 / t + unitHealthRegen + 0.25)));

                if (mana)
                    stun = Math.log(
                        (((1-StunCalCulator(t2, 0.2, s1, t2)) * 4.25 / time + (1-StunCalCulator(t, x1, s1, t)) * (time - 4.25) / time)) * (1 - m_stun / maxMana * ((4.25 * 1 / t2 + (time - 4.25) * 1/ t) / time + unitManaRegen)))
                        / Math.log(StunCalCulation);
                else
                    stun = Math.log(((1-StunCalCulator(t2, 0.2, s1, t2)) * 4.25 / time ) + (1-StunCalCulator(t, x1, s1, t))* (time - 4.25) / time) / Math.log(StunCalCulation);
            }
            else if (mana)
                stun = Math.log((1-StunCalCulator(t, x1, s1, t)) * (1-StunCalCulator(t, x2, s2, t)) * (1 - ((maxMana != 0) ? m_stun / (maxMana / (1 / t + unitManaRegen)) : 0))) / Math.log(StunCalCulation);
            else
                stun = Math.log((1-StunCalCulator(t, x1, s1, t)) * (1-StunCalCulator(t, x2, s2, t))) / Math.log(StunCalCulation);
            u.StunCalCulate = stun;
        }
    }
}
let Unit = 0;
for(let i=0;i<Object.keys(unitStat).length;i++)
{
    Unit += unitStat[idxToRank(i)].length;
}
function SetElemental(){
    document.getElementsByClassName("TotalStun")[0].innerText = totalStun.toFixed(3) + "스턴";
    document.getElementsByClassName("MRegen")[0].innerText = manaRegen;
    document.getElementsByClassName("HRegen")[0].innerText = healthRegen;
    document.getElementsByClassName("AttackSpeedEx")[0].innerText = speedBonusEx + "%";
    document.getElementsByClassName("Debuff")[0].innerText = speedDebuff + "%";
}

let CountOn = () => {

    m_god = Math.max(Math.min(RoundX(484 - 3.875*speedDebuff, 3), max_move), min_move);
    m_nightmare = Math.max(Math.min(RoundX(484 - 3.875*speedDebuff, 3), max_move), min_move);


    if (document.getElementById("container1") != null)
    {
        totalStun = 0;
        for (let sortCount = 0; sortCount < Object.keys(unitStat).length; sortCount++) {
        for (let unitCount = 0; unitCount < unitStat[idxToRank(sortCount)].length; unitCount++) {
            if(getUnit(sortCount, unitCount).stun1.type == "none" && getUnit(sortCount, unitCount).manaRange == 0) continue;
            const rate = document.getElementById(`r-${sortCount}-${unitCount}`);
            if(deviationToggle == false)
                rate.innerText = getUnit(sortCount, unitCount).StunCalCulate.toFixed(3) + "스턴";
            else
                {
                    const u = getUnit(sortCount, unitCount);
                    
                    if(u.stun1.type == "none"){
                        rate.innerText = "측정 불가";
                        continue;
                    }
                    let x1 = u.stun1.p;
                    if(u.stun2.type != "none"){
                        x1 = RoundX(1 - (1- x1) * (1 - u.stun2.p),10);
                    }
                    let s1 = u.stun1.dur;
                    const bonus = RoundX(1 + u.atkSpeedBonus + (getUnit(sortCount, unitCount).Check ? 0 : speedBonusEx / 100), 3);
                    let t = 1 / u.attackCycle * Math.min(bonus, 5);
                    var n1 = Math.floor(s1 * t);
                    if (u.name == "라분") {
                        let count = 0;
                        let time1 = 0.65 + 0 / t - 2.15;
                        if (time1 > 0)
                            count++;
                        else
                            time1 = 0;

                        let time2 = 0.65 + 1 / t - 2.15;
                        if (time2 > 0)
                            count++;
                        else
                            time2 = 0;

                        let time3 = 0.65 + 2 / t - 2.15;
                        if (time3 > 0)
                            count++;
                        else
                            time3 = 0;

                        let time4 = 0.65 + 3 / t - 2.15;
                        if (time4 > 0)
                            count++;
                        else
                            time4 = 0;

                        let time5 = 0.65 + 4 / t - 2.15;
                        if (time5 > 0)
                            count++;
                        else
                            time5 = 0;

                        let time6 = 0.65 + 5 / t - 2.15;
                        if (time6 > 0)
                            count++;
                        else
                            time6 = 0;

                        let time7 = 0.65 + 5 / t - 2.15;
                        if (time7 > 0)
                            count++;
                        else
                            time7 = 0;
                        rate.innerText = `${((
                            time1 * x1 * Math.pow(1 - x1, count - 7) + 
                            time2 * x1 * Math.pow(1 - x1, count - 6) + 
                            time3 * x1 * Math.pow(1 - x1, count - 5) + 
                            time4 * x1 * Math.pow(1 - x1, count - 4) + 
                            time5 * x1 * Math.pow(1 - x1, count - 3) + 
                            time6 * x1 * Math.pow(1 - x1, count - 2) + 
                            time7 * (
                                1 - 
                                x1 - 
                                x1 * (1 - x1) - 
                                x1 * Math.pow(1 - x1, 2) - 
                                x1 * Math.pow(1 - x1, 3) - 
                                x1 * Math.pow(1 - x1, 4) - 
                                x1 * Math.pow(1 - x1, 5)))).toFixed(3)}초`;
                    }
                    else if (u.UnitName == "루피") {
                        rate.innerText = `${((n1 + 1 + 1 / x1) / t - s1).toFixed(3)}초`;
                    }
                    else
                        rate.innerText = `${((n1 + 1 + 1 / x1) / t - s1).toFixed(3)}초`;
                } 

            const percentage = document.getElementById(`per-${sortCount}-${unitCount}`);
            percentage.innerText = ((1 - Math.pow(StunCalCulation, getUnit(sortCount, unitCount).StunCalCulate)) * 100).toFixed(2) + "%";

            const Count = document.getElementById(`c-${sortCount}-${unitCount}`);
            const u = getUnit(sortCount, unitCount);
            const CheckU = allUnits.find(items => items.name == u.name && items.rank == u.rank);
            Count.innerText = CheckU.Check;

            totalStun += (CheckU.Check > 0) ? getUnit(sortCount, unitCount).StunCalCulate * CheckU.Check : 0;
        }
        }
    }
    if (document.getElementById("container2") != null) {
        let field = 0;
        for (let unitCount = 0; unitCount < allUnits.length;field++, unitCount++) {
            const u = allUnits[unitCount];

            if(u.EarthCalculate == 0 && u.SlowCalculate == 0)
            {
                field--;
                continue;
            }

            const AfterShockRate = document.getElementById(`a-${field}`);
            AfterShockRate.innerText = (u.EarthCalculate * 100).toFixed(2) + "%";

            const MoveSpeedRate = document.getElementById(`m-${field}`);
            MoveSpeedRate.innerText = (u.SlowCalculate * 100).toFixed(2) + "%";

            const unitName = document.getElementById(`n-${field}`);
            unitName.innerText = u.name;

            const unitSort = document.getElementById(`s-${field}`);
            unitSort.innerText = u.rank;
        }
        for (let i = 0; i < document.getElementsByClassName("UnitNameBar").length; i++) {

            document.getElementsByClassName("UnitNameBar")[i].textContent = (nameSort == 0) ? "유닛명" : (nameSort == -1) ? "유닛명 ⬇" : "유닛명 ⬆";
            document.getElementsByClassName("UnitSortBar")[i].textContent = (rateSort == 0) ? "등급" : (rateSort == -1) ? "등급 ⬇" : "등급 ⬆";
            document.getElementsByClassName("MoveSpeedBar")[i].textContent = (moveSpeedSort == 0) ? "이감 발동률" : (moveSpeedSort == -1) ? "이감 발동률 ⬇" : "이감 발동률 ⬆";
            document.getElementsByClassName("AfterShockBar")[i].textContent = (afterShockSort == 0) ? "여진 가동률" : (afterShockSort == -1) ? "여진 가동률 ⬇" : "여진 가동률 ⬆";
        }
    }

    SetElemental();
}



function closeOverlay() {
    const overlay = document.getElementById("overlay");
    if (overlay) {
        document.body.removeChild(overlay);
        document.removeEventListener("keydown", handleEnterKey); // 🔥 이벤트 제거
        document.removeEventListener("keydown", handleEscapeKey);
    }
}

// ✅ 엔터 키 이벤트 핸들러
function handleEnterKey(event) {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
        closeOverlay(); // 엔터를 누르면 오버레이 닫기
    }
}

function handleEscapeKey(event) {
    if (event.code === "Escape") closeOverlay();
}


// ✅ 오버레이 열기 함수 (중복 실행 방지)
function openOverlay(sortCount, unitCount) {
    if (document.getElementById("overlay")) return; // 이미 오버레이가 있으면 실행 안 함

    sortCount = Number(sortCount);
    unitCount = Number(unitCount);

    const u = getUnit(sortCount, unitCount);

    // 🔥 오버레이 생성
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    overlay.style.zIndex = 1000;
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";

    overlay.tabIndex = -1;
    if(sortCount !== 400 && unitCount !== 400 && sortCount !== 600 && unitCount !== 600 && sortCount !== 700 && unitCount !== 700)
        overlay.addEventListener("click", closeOverlay);

    const overlayContent = document.createElement("div");
    overlayContent.style.width = "22.5vw";
    overlayContent.style.height = "40vw";
    overlayContent.style.padding = "0.5rem";
    overlayContent.style.backgroundColor = "white";
    overlayContent.style.borderRadius = "5px";
    overlayContent.style.position = "relative";
    overlayContent.style.overflowY = "auto"; // 스크롤 가능

    overlayContent.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    overlay.appendChild(overlayContent);
    document.body.appendChild(overlay);

    if((sortCount !== 400 && unitCount !== 400) && (sortCount !== 600 && unitCount !== 600) && (sortCount !== 700 && unitCount !== 700))
        document.addEventListener("keydown", handleEnterKey); // 🔥 오버레이가 떴을 때만 이벤트 추가

    else

    overlayContent.addEventListener("keydown", (event) => {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
            event.preventDefault(); // 기본 스크롤 방지

            const inputs = overlayContent.querySelectorAll("input"); // overlay 내부 input 가져오기
            let currentIndex = Array.from(inputs).indexOf(document.activeElement); // 현재 포커스된 input 찾기

            if (currentIndex !== -1) {
                if (currentIndex < inputs.length - 1) {
                    // 다음 input으로 포커스 이동
                    inputs[currentIndex + 1].focus();
                } else {
                    // 마지막 input이면 "입력" 버튼 클릭
                    document.getElementsByClassName("StunButton")[0].click();
                }
            }
        }
    });
    
    setTimeout(() => {
        overlay.focus();
    }, 0);
    if((sortCount === 400 && unitCount === 400) || (sortCount === 600 && unitCount === 600) || (sortCount === 700 && unitCount === 700))
        {
            const closeButton = document.createElement("button");
            closeButton.innerText = "X";
            closeButton.style.position = "absolute";
            closeButton.style.top = "10px";
            closeButton.style.right = "10px";
            closeButton.style.background = "red";
            closeButton.style.color = "white";
            closeButton.style.border = "none";
            closeButton.style.padding = "5px 10px";
            closeButton.style.cursor = "pointer";
            closeButton.style.fontSize = "16px";
            closeButton.style.borderRadius = "5px";
            closeButton.onclick = () => document.body.removeChild(overlay);
        
            overlayContent.appendChild(closeButton);

            document.addEventListener("keydown", handleEscapeKey);
        }



    // 3. 콘텐츠 박스 상단에 타이틀 추가
    const title = document.createElement("h2");
    title.style.textAlign = "center";
    title.style.marginBottom = "1vh";

    if (sortCount == 100 && unitCount == 100) 
        title.textContent = `${totalStun.toFixed(3)}스턴`;
    else if (sortCount == 200 && unitCount == 200)
        title.textContent = `가동률 공식`;
    else if (sortCount == 300 && unitCount == 300)
        title.textContent = "이동속도 감소";
    else if(sortCount == 400 && unitCount == 400)
        title.textContent = "스턴 계산기";
    else if(sortCount === 500 && unitCount === 500)
        title.innerHTML = "마나뻥 (62라 기준)<br>(65라 5초 시전)";
    else if(sortCount === 600 && unitCount === 600)
        title.innerHTML = "방어력에 따른 물리피해 계산";
    else if(sortCount === 700 && unitCount === 700)
        title.innerHTML = "류영 오니가르기 발동 조건";
    else if(sortCount === 800 && unitCount === 800)
        title.innerHTML = "단일 효율(막라 기준)";
    else if (sortCount < 0){
        
        let unitNumber = 0;
        for(let count = -1; count < unitCount; unitNumber++)
        {
            if(allUnits[unitNumber].slow1.type != "none" || allUnits[unitNumber].slow2.type != "none"){
                count++;}
        }
        unitNumber--;
        title.textContent = `${allUnits[unitNumber].name} (${(allUnits[unitNumber].rank)})`;
    }
    else
        title.textContent = `${u.name} (${idxToRank(sortCount)})`;

    overlayContent.appendChild(title);

    // 4. 목록 추가
    const itemList = document.createElement("ul");
    itemList.style.listStyleType = "none";
    itemList.style.padding = 0;
    if (sortCount == 100 && unitCount == 100) {

        for (let i = 1; i <= 10; i++) {
            const item = document.createElement("li");
            item.textContent = ``;
            item.style.padding = "0.5rem 0";
            item.style.borderBottom = "0.1rem solid #ddd";
            let result = 0;
            switch (i) {
                case 1:
                    item.textContent = `스턴 가동률 : ${((1 - Math.pow(StunCalCulation, totalStun)) * 100).toFixed(2)}%`;
                    break;
                case 2:
                    item.textContent = `스턴 샐 확률 : ${(Math.pow(StunCalCulation, totalStun) * 100).toFixed(2)}%`;
                    break;
                case 3:
                    result = m_god * Math.pow(StunCalCulation, totalStun)
                    result = result % 1 === 0 ? result.toString() : result.toFixed(3);

                    item.textContent = `초당 몹 이동 거리(신 기준) : ${result}`;
                    break;
                case 4:                    
                    result = round * m_god * Math.pow(StunCalCulation, totalStun)
                    result = result % 1 === 0 ? result.toString() : result.toFixed(3);
                    item.textContent = `${round}초 후 몹 이동 거리(신 기준) : ${result}`;
                    break;
                case 5:
                    result = 14 * m_god * Math.pow(StunCalCulation, totalStun)
                    result = result % 1 === 0 ? result.toString() : result.toFixed(3);
                    item.textContent = `14초 후 몹 이동 거리(신 기준) : ${result}`;
                    break;
                case 6:
                    break;
                case 7:
                    result = m_nightmare * Math.pow(StunCalCulation, totalStun)
                    result = result % 1 === 0 ? result.toString() : result.toFixed(3);
                    item.textContent = `초당 몹 이동 거리(악몽 기준) : ${result}`;
                    break;
                case 8:
                    result = round * m_nightmare * Math.pow(StunCalCulation, totalStun)
                    result = result % 1 === 0 ? result.toString() : result.toFixed(3);
                    item.textContent = `${round} 후 몹 이동 거리(악몽 기준) : ${result}`;
                    break;
                case 9:
                    result = 14 * m_nightmare * Math.pow(StunCalCulation, totalStun)
                    result = result % 1 === 0 ? result.toString() : result.toFixed(3);
                    item.textContent = `14초 후 몹 이동 거리(악몽 기준) : ${result}`;
                    break;
                case 10:
                    item.textContent = `최소 스턴 범위 : ${Sort.length ? Sort[0][2] : 0}`;
                    break;
            }

            itemList.appendChild(item);
        }
    }
    else if (sortCount == 200 && unitCount == 200) {
        for (let i = 0; i <= 9; i++) {
            const item = document.createElement("li");
            item.textContent = `Item ${i}`;
            item.style.padding = "0.5rem   0";
            item.style.borderBottom = "0.1rem solid #ddd";

            switch (i) {
                case 0:
                    item.textContent = `X = 확률`
                    break;
                case 1:
                    item.textContent = `S = 지속시간`
                    break;
                case 2:
                    item.textContent = `T = 공격 주기`
                    break;
                case 3:
                    item.textContent = `n = 지속시간 동안 타격 횟수(자연수)`
                    break;
                case 4:
                    item.textContent = `일반 공식 : 1+(XS/T - nX -1)*(1-X)^n`;
                    break;
                case 5:
                    item.textContent = `아오키지 : 1+(XS/T - nX -1)*(1-X)^n * (1 - 3 / (1 / T / 0.125 * (1 - 0.125) ^ (25 / (1 + 1 / T * 마나리젠))(자연수) ) + 50 / (T + 마나리젠))(자연수) )`;
                    break;
                case 6:
                    item.textContent = `(니카 한정) X2 : 거인화 시에 스턴 확률`;
                    break;
                case 7:
                    item.textContent = `(니카 한정) T2 : 거인화 시에 공격 주기`;
                    break;
                case 8:
                    item.textContent = `(니카 한정) n2 : 거인화 시에 스턴동안 타격 횟수(자연수)`;
                    break;
                case 9:
                    item.textContent = `니카 : ((1 - (1 + (X2 * S1 * T2 - n2 * X2 - 1) * (1 - X2)^n2) * 4.25 / 거인화 주기 - (1 + (X1 * S1 * T - n1 * X1 - 1) * (1 - X1) ^ n1) * (거인화 주기 - 4.25) / 거인화 주기)) * (1 - 마나스턴 시간 / 마나 크기 * ((4.25 * t2 + (거인화 주기 - 4.25) * t) / 거인화 주기 + 마나리젠))`;
                    break;
            }

            itemList.appendChild(item);
        }

    }
    else if (sortCount == 300 && unitCount == 300)
    {
        for (let i = 0; i <= 6; i++) {
            const item = document.createElement("li");
            item.textContent = `Item ${i}`;
            item.style.padding = "0.5rem   0";
            item.style.borderBottom = "0.1rem solid #ddd";

            switch (i) {
                case 0:
                    item.textContent = `수치 : ${speedDebuff}%`
                    break;
                case 1:
                    item.textContent = `※이감 40%당 이속 155 감소`
                    break;
                case 2:
                    item.textContent = `※이감 1%당 이속 3.875 감소`
                    break;
                case 3:
                    item.textContent = `신 최대 이감 : 102%`
                    break;
                case 4:
                    item.textContent = `악몽 최대 이감 : 102%`;
                    break;
                case 5:
                    item.textContent = `몹 이동속도(신) : ${m_god}`;
                    break;
                case 6:
                    item.textContent = `몹 이동속도(악몽) : ${m_nightmare}`;
                    break;
            }

            itemList.appendChild(item);
        }
    }
    else if(sortCount == 400 && unitCount == 400)
    {
        for(let i=0; i<=5;i++)
        {   overlayContent.style.margin = "auto";

            const item = document.createElement("div");

            const input = document.createElement("input");
            input.type = "number";
            input.style.fontSize = "0.65vw";
            input.style.width = "90%";
            input.style.padding = "0.4vw";
            input.style.margin = "0.2vw 0.2vw";

            switch(i)
            {
                case 0:            
                    item.textContent = "공격 주기: ";
                    input.id = "attack_speed";
                    break;
                case 1:
                    item.textContent = "공속 보너스 (%): ";
                    input.id = "attack_speed_bonus";
                    break;
                    case 2:
                        item.textContent = "스턴 1 확률 (%): ";
                        input.id = "stun1_prob";
                        break;
                    case 3:
                        item.textContent = "스턴 1 지속시간 (초): ";
                        input.id = "stun1_duration";
                        break;                
                        case 4:
                        item.textContent = "스턴 2 확률 (%): ";
                        input.id = "stun2_prob";
                        break;
                    case 5:
                        item.textContent = "스턴 2 지속시간 (초): ";
                        input.id = "stun2_duration";
                        break;
            }
            item.appendChild(input);
            overlayContent.appendChild(item);

        }
        
        const StunButton = document.createElement("button");
        StunButton.className = "StunButton BigFont";
        StunButton.innerText = "입  력";
        StunButton.style.width = "100%";
        StunButton.style.padding = "0.4vw";
        StunButton.style.marginTop = "0.4vw";

        ButtonColor(StunButton);


        StunButton.addEventListener("click", ()=>{
            document.querySelectorAll(".StunDocument").forEach(el => overlayContent.removeChild(el));

           
            const attack_speed = parseFloat(document.getElementById("attack_speed").value);
            const attack_speed_bonus = parseFloat(document.getElementById("attack_speed_bonus").value);
            const t = attack_speed / Math.min(1 + RoundX(attack_speed_bonus / 100, 3), 5);

            const bigOne = document.getElementById("stun1_duration").value > document.getElementById("stun2_duration").value ? true : false;

            let x1 = RoundX(document.getElementById("stun1_prob").value / 100,3);
            const s1 = document.getElementById("stun1_duration").value;
            
            let x2 = RoundX(document.getElementById("stun2_prob").value / 100,3);
            const s2 = document.getElementById("stun2_duration").value;

            x1 = bigOne ? x1 : (x1 - x1 * x2);
            x2 = !bigOne ? x2 : (x2 - x1 * x2);
            
            const degree1 = StunCalCulator(t, x1, s1, t);
            const degree2 = StunCalCulator(t, x2, s2, t);
            if(attack_speed===0 || attack_speed_bonus === 0 || x1 === 0 || s1 === 0)
                alert("잘못된 정보입니다.");
            else
            for(let i=0;i<=5;i++)
            {   
                const Stun = document.createElement("div");
                Stun.className = "StunDocument SmallFont"
                switch(i)
                {
                    case 0:
                        Stun.innerText = `공격 속도 : ${(1/t).toFixed(3)}`
                        break;
                    case 1:
                        Stun.innerText = `스턴 1 등급 : ${(Math.log(1-degree1) / Math.log(StunCalCulation)).toFixed(3)} 스턴`
                        break;
                    case 2:
                        Stun.innerText = `스턴 1 가동률 : ${(degree1*100).toFixed(3)} %`
                        break;                    
                    case 3:
                        Stun.innerText = `스턴 2 등급 : ${(Math.log(1-degree2) / Math.log(StunCalCulation)).toFixed(3)} 스턴`
                        break;
                    case 4:
                        Stun.innerText = `스턴 2 가동률 : ${(degree2*100).toFixed(3)} %`
                        break;
                }
                overlayContent.appendChild(Stun);
            }
        })

        overlayContent.appendChild(StunButton);
    }
    else if(sortCount === 500 && unitCount === 500)
    {
        Mana.forEach((item,index) =>{
            const Grid = document.createElement("div");
            Grid.style.display = "grid";
            Grid.style.gridTemplateColumns = "1.5fr 1fr"

            itemList.appendChild(Grid);

            const UnitName = document.createElement("div");
            UnitName.className = "Button BigFont";
            UnitName.style.padding = "1rem";
            UnitName.style.borderRight = "none";
            if(index !== 0)
                UnitName.style.borderTop = "none";
            UnitName.innerText = item[0];

            Grid.appendChild(UnitName);

            const Time = document.createElement("div");
            Time.className = "Button unitSort BigFont";
            Time.style.padding = "1rem";
            if(index !== 0)
                Time.style.borderTop = "none";
            let AttackSpeedBuff = RoundX((1 + item[2] + speedBonusEx / 100) , 4); 

            if(item[1][0] === "초월함")
                AttackSpeedBuff += Math.round(dex / 100 * 1000)/1000;
            let t = RoundX(1 / item[3] * Math.min(AttackSpeedBuff, 5), 3);

            if(item[1][0] === "희귀함"
            || item[1][0] === "전설적인" 
            || item[1][0] === "히든" 
            || item[1][0] === "왜곡됨"
            || item[1][0] === "특별함")
            {
                const findIndex = allUnits.findIndex(items => items.name === "로얄로더")
                if(allUnits[findIndex].Check > 0)
                {
                    t = RoundX(1 / item[3] * Math.min(AttackSpeedBuff - allUnits[findIndex].atkSpeedBuff / 100, 5), 3);
                }
            }   

            let unitManaRegen = manaRegen + Brave(koby) + ((item[1][0] === "초월함") ? intel * 0.08 : 0 );

            let Buffindex = allUnits.findIndex(items => {
                return (item[0] == items.name && idxToRank(item[1]) === items.rank);
            })
            console.log(item, idxToRank(item[1]), Buffindex);

            t = RoundX(t * 0.95,3);
            const plus = 5;
            const braveKoby = Brave(koby);

            function Cycle(int)
            {
                if(item[0]==="미호크")
                {
                    let cycle = (item[4] - item[5] * (unitManaRegen + braveKoby + 2) ) / (t + unitManaRegen + braveKoby + 2) + item[5];
                    return cycle * Math.ceil(round * 3 / cycle) - round * int + plus;
                }
                else if(item[0] === "프랑키")
                {
                    const Franky = - (document.getElementsByClassName(`m${Buffindex}`)[0].checked ? allUnits[Buffindex].manaRegen : 0);
                    let cycle = (item[4] - item[5] * (unitManaRegen + braveKoby + Franky )) / (t + unitManaRegen + braveKoby + Franky) + item[5];
                    return cycle * Math.ceil(round * 3 / cycle) - round * int + plus;
                }
                else if (item[0] === "에넬")
                {
                    const enel = - (document.getElementsByClassName(`m${Buffindex}`)[0].checked ? allUnits[Buffindex].manaRegen : 0);
                    let cycle = (item[4] - item[5] * (unitManaRegen + braveKoby + enel )) / (t + unitManaRegen + braveKoby + enel) + item[5];
                    return cycle * Math.ceil(round * 3 / cycle) - round * int + plus;
                }
                else if (item[0] === "류마(400스택 이상)")
                {
                    const toki = allUnits.findIndex(items => {
                        return items.name === "토키";
                    })
                    if(allUnits[toki].Check > 0)
                    {
                        AttackSpeedBuff = RoundX(1 + item[2] + 0.2 + RoundX(speedBonusEx / 100, 3), 3);
                        t = RoundX(1 / item[3] * Math.min(AttackSpeedBuff, 5), 3);
                        t = RoundX(t * 0.95, 3);
                    }
                    let cycle = (item[4] - item[5] * (unitManaRegen + braveKoby )) / (t + unitManaRegen + braveKoby) + item[5];
                    return cycle * Math.ceil(round * 3 / cycle) - round * int + plus;
                }

                let cycle = (item[4] - item[5] * (unitManaRegen + braveKoby) ) / (t + unitManaRegen + braveKoby) + item[5];
                return cycle * Math.ceil(round * 3 / cycle) - round * int + plus;
            }


            let [c3, c4] = [RoundX(Cycle(3), 3), RoundX(Cycle(4), 3)];
            let time = c3 >= round ? c4 : c3;
            Time.innerText = time.toFixed(0) + "초";
            Grid.appendChild(Time);
        })
    }
    else if(sortCount == 600 && unitCount == 600)
    {
        for(let i=0; i<3;i++)
        {   overlayContent.style.margin = "auto";

            const item = document.createElement("div");

            const input = document.createElement("input");
            input.type = "number";
            input.style.fontSize = "0.65vw";
            input.style.width = "90%";
            input.style.padding = "0.4vw";
            input.style.margin = "0.2vw 0.2vw";

            switch(i)
            {
                case 0:            
                    item.textContent = "유닛 방어력: ";
                    input.id = "unit_armor";
                    break;
                case 1:
                    item.textContent = "현재 방깍: ";
                    input.id = "current_armor_remover";
                    break;
                    case 2:
                        item.textContent = "추가될 방깍: ";
                        input.id = "next_armor_remover";
                        break;
            }
            item.appendChild(input);
            overlayContent.appendChild(item);

        }
        
        const armorButton = document.createElement("button");
        armorButton.className = "StunButton BigFont";
        armorButton.innerText = "입  력";
        armorButton.style.width = "100%";
        armorButton.style.padding = "0.4vw";
        armorButton.style.marginTop = "0.4vw";

        ButtonColor(armorButton);


        armorButton.addEventListener("click", ()=>{
            document.querySelectorAll(".StunDocument").forEach(el => overlayContent.removeChild(el));

           
            const unit_armor = parseInt(document.getElementById("unit_armor").value);
            const current_armor_remover = parseInt(document.getElementById("current_armor_remover").value);

            const next_armor_remover = parseInt(document.getElementById("next_armor_remover").value);

            for(let i=0;i<7;i++)
            {   
                const armor = document.createElement("div");
                armor.className = "StunDocument BigFont"

                let current_damage = RoundX(100/(100 + 2 * (unit_armor - current_armor_remover)), 20);
                let next_damage = RoundX(100/ (100 + 2* (unit_armor - current_armor_remover - next_armor_remover)),20);
            if(current_armor_remover>unit_armor)
            {
                const effectiveDiff = Math.min(current_armor_remover - unit_armor, 20);
                current_damage = RoundX(2 - Math.pow(0.94, effectiveDiff), 6); // 소수점 6자리 정도면 충분
            }
            if(current_armor_remover+next_armor_remover > unit_armor)
            {
                const effectiveDiff = Math.min(current_armor_remover + next_armor_remover - unit_armor, 20);
                next_damage = RoundX(2 - Math.pow(0.94, effectiveDiff), 6); // 소수점 6자리 정도면 충분
            }

                switch(i)
                {
                    case 0:
                        armor.innerText = `방깍이 없을시 물리피해 계수: ${(100/(100 + 2 * unit_armor) * 100).toFixed(2)}%`
                        break;
                    case 1:
                        armor.innerText = `방깍 계산된 물리피해 계수: ${(current_damage*100).toFixed(2)}%`
                        break;
                    case 2:
                        armor.innerText = `방깍 계산된 물리피해 계수(짭플): ${(Math.pow(current_damage, 2)*100).toFixed(2)}%`
                        break;                    
                    case 3:
                        armor.innerText = `방깍 추가시 딜 증가 수치: ${((next_damage - current_damage) * 100).toFixed(2)}%`
                        break;
                    case 4:
                        armor.innerText = `방깍 추가시 딜 증가 수치(짭플): ${((Math.pow(next_damage,2) - Math.pow(current_damage,2))*100).toFixed(2)}%`
                        break;
                    case 5:
                        armor.innerText = `방깍 추가시 딜 증가율 ${((next_damage - current_damage) / current_damage).toFixed(2)}배`
                        break;
                    case 6:
                        armor.innerText = `방깍 추가시 딜 증가율(짭플): ${((Math.pow(next_damage, 2) - Math.pow(current_damage, 2)) / Math.pow(current_damage, 2)).toFixed(2)}배`
                        break;
                }
                overlayContent.appendChild(armor);
            }
        })

        overlayContent.appendChild(armorButton);
    }   
    else if (sortCount == 700 && unitCount == 700) {
    overlayContent.style.margin = "auto";

    // 🔽 항상 표시될 armor 박스 생성
    const armorDisplay = document.createElement("div");
    let stack = false;
    let level = false;
    let boss = false;
    let royal = false;
    armorDisplay.className = "StunDocument BigFont";
    armorDisplay.style.marginTop = "1vw";

    const updateArmorDisplay = () => {
        const armor_remover = parseInt(document.getElementById("armor_remover").value) || 0;   
        let armor = 181 + (level ? 10 : 0) + (boss ? 10 : 0);
        let damage = 100 / (100 + 2 * armor - armor_remover);

        if(armor_remover > armor)
        {
            damage = 1 - Math.pow(0.94, Math.min(armor_remover - armor,20));
        }
        armorDisplay.innerText = `필요한 공격력 증가 계수: ${Math.ceil(( (120000 / 1.05 / damage - (royal ? 25000 : 0)) / (234501 + (stack ? 100000 : 0)) - 1) * 100) }%`;
    };
    for (let i = 0; i < 5; i++) {
        const item = document.createElement("div");
        item.style.display = "flex";
        item.style.flexDirection = "column";
        item.style.alignItems = "flex-start";
        item.style.marginBottom = "0.5vw";

        let input;

        if (i >= 1) {
            input = document.createElement("input");
            input.type = "checkbox";
            input.id = "stack";
            input.className = "switch-input";

            const slider = document.createElement("span");
            slider.className = "slider";

            const label = document.createElement("label");
            label.className = "switch";
            label.appendChild(input);
            label.appendChild(slider);

            const title = document.createElement("div");
            title.style.fontSize = "1vw";
            item.appendChild(title);
            item.appendChild(label);

        switch(i) {
            case 1:
                input.id = "stack";
                title.innerText = "류영 700스택:";
                input.addEventListener("change", () => {
                    stack = input.checked;
                    updateArmorDisplay();
                });
                break;
            case 2:
                input.id = "level";
                title.innerText = "난이도:";

                const modeLabel = document.createElement("span");
                modeLabel.innerText = input.checked ? "악몽" : "신";
                modeLabel.style.fontSize = "0.8vw";
                modeLabel.style.marginLeft = "0.5vw"; // 간격 조정

                const wrapper = document.createElement("div");
                wrapper.style.display = "flex";
                wrapper.style.alignItems = "center";
                wrapper.appendChild(label);
                wrapper.appendChild(modeLabel);

                item.appendChild(title);
                item.appendChild(wrapper);

                input.addEventListener("change", () => {
                    level = input.checked;
                    modeLabel.innerText = input.checked ? "악몽" : "신"; // ✅ 텍스트 업데이트
                    updateArmorDisplay();
                });
                break;


            case 3:
                input.id = "boss";
                title.innerText = "보스 몬스터 여부:";
                input.addEventListener("change", () => {
                    boss = input.checked;
                    updateArmorDisplay();
                });
                break;
            case 4:
                input.id = "royal";
                title.innerText = "로얄로더 여부:";
                input.addEventListener("change", () => {
                    royal = input.checked;
                    updateArmorDisplay();
                });
                break;
        }
        } else {
            input = document.createElement("input");
            input.type = "number";
            input.id = "armor_remover";
            input.style.fontSize = "0.65vw";
            input.style.width = "90%";
            input.style.padding = "0.4vw";
            input.style.margin = "0.2vw 0.2vw";

            const label = document.createElement("div");
            label.innerText = "현재 방깍:";
            item.appendChild(label);
            item.appendChild(input);

            input.addEventListener("input", updateArmorDisplay);
        }

        overlayContent.appendChild(item);
    }

    // 🔽 최초 표시 초기화
    updateArmorDisplay();
    overlayContent.appendChild(armorDisplay);
    }
    else if(sortCount == 800 && unitCount == 800)
    {
        Mono.forEach((item,index) =>{
            var t = 1 / item[3] * Math.min(RoundX(1 + item[2] + (speedBonusEx + dex) / 100,3), 5);

        if(item[1][0] === "희귀함"
        || item[0] === "전설적인" 
        || item[0] === "히든" 
        || item[0] === "왜곡됨"
        || item[0] === "특별함")
        {
            const findIndex = allUnits.findIndex(items => items.name === "로얄로더")
            if(allUnits[findIndex].Check > 0)
            {
                t = item[3] / (1 + item[2]) * Math.min(RoundX(1 + item[2] + (speedBonusEx + dex - allUnits[findIndex].atkSpeedBuff) / 100,3), 5);
            }
        }    

            const Grid = document.createElement("div");
            Grid.style.display = "grid";
            Grid.style.gridTemplateColumns = "1.5fr 1fr 1fr"

            itemList.appendChild(Grid);

            const UnitName = document.createElement("div");
            UnitName.className = "Button BigFont";
            UnitName.style.padding = "1rem";
            UnitName.style.borderRight = "none";
            if(index !== 0)
                UnitName.style.borderTop = "none";
            UnitName.innerText = item[0] + `(${idxToRank(item[1])})`;

            Grid.appendChild(UnitName);

            const first = document.createElement("div");
            first.className = "Button BigFont";
            first.style.padding = "1rem";
            first.style.borderRight = "none";
            if(index !== 0)
                first.style.borderTop = "none";

            first.innerText = RoundX(Math.log(1 - item[5] * item[8]) / Math.log(1 - 0.75) * item[4] * t * 10 / 1.7, 3);   


            Grid.appendChild(first);

            
            const second = document.createElement("div");
            second.className = "Button BigFont";
            second.style.padding = "1rem";
            if(index !== 0)
                second.style.borderTop = "none";
            second.innerText = RoundX(Math.log(1 - item[7] * item[8]) / Math.log(1 - 0.75) * item[6] * t * 10/ 1.7 , 3);

            Grid.appendChild(second);

        })
    }


    else if (sortCount == -1) {
        
        let unitNumber = 0;
        for(let count = -1; count < unitCount; unitNumber++)
        {
            if(allUnits[unitNumber].slow1.type != "none" || allUnits[unitNumber].slow2.type != "none"){
                count++;}
        }
        unitNumber--;

        
        const u = allUnits[unitNumber];
        const totalBonus = RoundX(1 + u.atkSpeedBonus + speedBonusEx / 100, 3);
        const t = 1 / u.attackCycle * Math.min(totalBonus, 5);

        var s = u.slow1.dur;
        var x = u.slow1.p;
        for (let i = 0; i < 5; i++) {
            const item = document.createElement("li");
            item.textContent = `Item ${i}`;
            item.style.padding = "0.5rem 0";
            item.style.borderBottom = "0.1rem solid #ddd";

            switch (i) {
                case 0:
                    item.textContent = `이감 확률 : ${(x * 100).toFixed(3)}%`;
                    break;
                case 1:
                    item.textContent = `이감 지속시간 : ${s.toFixed(2)}초`;
                    break;
                case 2:
                    item.textContent = `이감 수치 : ${u.slow1.eff}%`
                    break;
                case 3:
                    item.textContent = `이감 발동률 : ${(u.SlowCalculate * 100).toFixed(2)}%`;
                    break;
                case 4:
                    item.textContent = `이감이 다시 잡히는 평균 시간 : ${(1 / t / x).toFixed(3)}초`
                    break;
            }

            itemList.appendChild(item);
        }
    }
    else if (sortCount == -2) {
        
        let unitNumber = 0;
        for(let count = -1; count < unitCount; unitNumber++)
        {
            if(allUnits[unitNumber].slow1.type != "none" || allUnits[unitNumber].slow2.type != "none"){
                count++;}
        }
        unitNumber--;

        const u = allUnits[unitNumber];
        let t = 1 / u.attackCycle * (((1 + u.atkSpeedBonus +
                parseFloat((speedBonusEx / 100).toFixed(3))) > 5) ? 5 :
                (1 + u.atkSpeedBonus +
                    parseFloat((speedBonusEx / 100).toFixed(3))));
        let s = u.slow2.dur;
        let x = u.slow2.p;
        for (let i = 0; i < 4; i++) {
            const item = document.createElement("li");
            item.textContent = `Item ${i}`;
            item.style.padding = "0.5rem 0";
            item.style.borderBottom = "0.1rem solid #ddd";

            switch (i) {
                case 0:
                    item.textContent = `여진 확률 : ${(x * 100).toFixed(0)}%`;
                    break;
                case 1:
                    item.textContent = `여진 지속시간 : ${s.toFixed(2)}초`;
                    break;
                case 2:
                    item.textContent = `여진 수치 : ${u.slow2.eff}%`
                    break;
                case 3:
                    item.textContent = `여진 가동률 : ${(u.EarthCalculate * 100).toFixed(2)}%`;
                    break;
            }

            itemList.appendChild(item);
        }
    }
    else if (u.name === "니카") {
        var x1 = u.stun1.p;
        var s1 = u.stun1.dur;
        const rawBonus = (getUnit(sortCount, unitCount).Check)
        ? (speedBonusEx + dex) - u.atkSpeedBuff
        : (speedBonusEx + dex);

        const bonus = RoundX(1 + u.atkSpeedBonus + rawBonus / 100, 3);
        const bonus2 = RoundX(bonus - 2.25, 3);

        let t = 1 / u.attackCycle * Math.min(bonus, 5);
        let t2 = 1 / u.attackCycle * Math.min(bonus2, 5);
        let unitHealthRegen = healthRegen + intel * 0.04 + Brave(koby);


        let time = (4.25 + ((115 - 4.25 * (t2 + (unitHealthRegen + intel*0.04) + 0.25)) / (t + (unitHealthRegen + intel*0.04) + 0.25)) <= 4.25) ? 4.25 : (4.25 + ((115 - 4.25 * (t2 + (unitHealthRegen + intel*0.04) + 0.25)) / (t + (unitHealthRegen + intel*0.04) + 0.25)));
        let unitManaRegen = manaRegen + intel * 0.08 + Brave(koby);

        var maxMana = u.mana;
        var m_stun = u.manaDuration;
        var n1 = Math.floor(s1 * t);
        var n2 = Math.floor(s1 * t2);

        for (let i = 0; i <= 21; i++) {

            const item = document.createElement("li");
            item.textContent = `Item ${i}`;
            item.style.padding = "0.5rem 0";
            item.style.borderBottom = "0.1rem solid #ddd";

            switch (i) {
                case 0:
                    item.textContent = `스턴 지수 : ${getUnit(sortCount, unitCount).StunCalCulate.toFixed(3)}스턴`
                    break;
                case 1:
                    item.textContent = `스턴 가동률 : ${((1 - Math.pow(StunCalCulation, getUnit(sortCount, unitCount).StunCalCulate)) * 100).toFixed(2)}%`
                    break;
                case 2:
                    item.textContent = `일반 모드 공속 : 초당${t.toFixed(3)}`
                    break;
                case 3:
                    item.textContent = `거인화 모드 공속 : 초당${t2.toFixed(3)}`
                    break;
                case 4:
                    item.textContent = `공속 보너스(자체 버프 포함) : ${(u.atkSpeedBonus + parseFloat(((speedBonusEx + dex) / 100).toFixed(3)) - ((getUnit(sortCount, unitCount).Check) ? parseFloat((u.atkSpeedBuff / 100).toFixed(3)) : 0)) * 100}%`;
                    break;
                case 5:
                    item.innerText = `공속 버프 : ${u.atkSpeedBuff}%`
                    break;
                case 6:
                    item.innerText = `스턴 지속시간 : ${s1}초 (거인화, 일반 동일)`;
                    break;
                case 7:
                    item.innerText = `스턴 범위 : ${u.stun1.r} (거인화, 일반 동일)`;
                    break;
                case 8:
                    item.innerText = `일반 모드 스턴 확률 : ${(x1 * 100).toFixed(2)}%`
                    break;
                case 9:
                    item.innerText = `일반 모드 스턴 수치 : ${(Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1)) / Math.log(StunCalCulation)).toFixed(3)}스턴`;
                    break;
                case 10:
                    item.innerText = `일반 모드 스턴 가동률 : ${((1 + (x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1)) * 100).toFixed(2)}%`;
                    break;
                case 11:
                    item.innerText = `거인화 모드 스턴 확률 : ${(0.2 * 100).toFixed(2)}%`
                    break;
                case 12:
                    item.innerText = `거인화 모드 스턴 가동률 : ${((1 + (0.2 * s1 * t2 - n2 * 0.2 - 1) * Math.pow(1 - 0.2, n2)) * 100).toFixed(2)}%`;
                    break;
                case 13:
                    item.innerText = `거인화 모드 스턴 수치 : ${(Math.log(-(0.2 * s1 * t2 - n2 * 0.2 - 1) * Math.pow(1 - 0.2, n2)) / Math.log(StunCalCulation)).toFixed(3)}스턴`;
                    break;
                case 14:
                    item.innerText = `거인화 모드 지속시간 : 4.25초`;
                    break;
                case 15:
                    item.innerText = `거인화 모드 주기 : ${time.toFixed(2)}초`;
                    break;
                case 16:
                    item.innerText = `거인화 모드 비중 : ${(4.25 / time * 100).toFixed(2)}%`;
                    break;
                case 17:
                    item.innerText = `마나통 : ${maxMana}`;
                    break;
                case 18:
                    item.innerText = `마나 스턴 지속시간 : ${m_stun}초`;
                    break;
                case 19:
                    item.innerText = `마나 스턴 범위 : ${u.manaRange}`;
                    break;
                case 20:
                    item.innerText = `마나 스턴 가동률 : ${(m_stun / maxMana * ((4.25 * t2 + (time - 4.25) * t) / time + unitManaRegen) * 100).toFixed(2)}%`
                    break;
                case 21:
                    item.innerText = `마나 스턴 수치 : ${(Math.log(1 - (m_stun / maxMana * ((4.25 * t2 + (time - 4.25) * t) / time + unitManaRegen))) / Math.log(StunCalCulation)).toFixed(3)}스턴`
                    break;
            }
            itemList.appendChild(item);
        }


    }
    else {
        let x1 = u.stun1.p;
        let x2 = (1 - u.stun1.p) * u.stun2.p;
        let s1 = u.stun1.dur;
        let s2 = u.stun2.dur;
        const bonus = RoundX(1 + u.atkSpeedBonus + (getUnit(sortCount, unitCount).Check ? 0 : speedBonusEx / 100), 3);
        let t = 1 / u.attackCycle * Math.min(bonus, 5);
        let unitManaRegen = manaRegen + Brave(koby) + ((idxToRank(sortCount) === "초월함") ? intel * 0.08 : 0) ;
        let unitHealthRegen = healthRegen + Brave(koby) + ((idxToRank(sortCount) === "초월함") ? intel * 0.04 : 0); 

        let maxMana = u.mana;
        let m_stun = u.manaDuration;
        let n1 = Math.floor(s1 * t);
        let n2 = Math.floor(s2 * t);

        for (let i = 1; i <= 22; i++) {
            const item = document.createElement("li");
            item.textContent = `Item ${i}`;
            item.style.padding = "0.5rem 0";
            item.style.borderBottom = "0.1rem solid #ddd";

            if(u.stun1.type == "none" && i>= 6 && i <=10 )
                i = 12;

            if (u.stun2.type == "none" && i >= 12 && i <= 16)
                i = 18;
            if (maxMana == 0 && i >= 18 && i <= 22)
            {
                i = 22;
                continue;
            }
            switch (i) {
                case 1:
                    item.innerText = "스턴 지수 : " + getUnit(sortCount, unitCount).StunCalCulate.toFixed(3) + "스턴";
                    break;
                case 2:
                    item.innerText = "스턴 가동률 : " + ((1 - Math.pow(StunCalCulation,getUnit(sortCount, unitCount).StunCalCulate))*100).toFixed(2) + "%";
                    break;
                case 3:
                    item.innerText = `공속 : 초당${t.toFixed(3)}`;
                    break;
                case 4:
                    const bonus = RoundX(u.atkSpeedBonus + speedBonusEx / 100 - (getUnit(sortCount, unitCount).Check ? u.atkSpeedBuff / 100 : 0), 3);
                    item.innerText = `공속 보너스(자체 버프 포함) : ${(bonus * 100).toFixed(2)}%`;

                    break;
                case 5:
                    item.innerText = `공속 버프 : ${u.atkSpeedBuff}%`
                    break;
                case 6:
                    if(idxToRank(sortCount) === "왜곡됨" && u.name === "블랙마리아") item.innerText = `스턴 1 쿨타임 : ${x1}초`;
                    else item.innerText = `스턴 1 확률 : ${(x1 * 100).toFixed(2)}%`
                    break;
                case 7:
                    item.innerText = `스턴 1 지속시간 : ${s1}초`;
                    break;
                case 8:
                    item.innerText = `스턴 1 범위 : ${u.stun1.r}`;
                    break;
                case 9:
                    if (u.name == "루피") {
                        let n3 = Math.ceil(1.75 * t);
                        let time = n3 / t;
                        let n4 = Math.floor((2.75 - time) * t);
                        item.innerText = `스턴 1 수치 : ${(Math.log(1 - ((time + 1 / t / 0.0125 * (1 - (n4 * 0.0125 + 1) * Math.pow(1 - 0.0125, n4))) / (time + 1 / t / 0.0125)) * (1 + (x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1))) / Math.log(StunCalCulation)).toFixed(3)}스턴`;
                    }
                    else if(idxToRank(sortCount) === "왜곡됨" && u.name === "블랙마리아")
                    {
                        item.innerText = `스턴 1 수치 : ${getUnit(sortCount, unitCount).StunCalCulate.toFixed(3)} 스턴`
                    }
                    else if (u.name == "라분") {
                        item.innerText = `스턴 1 수치 : ${getUnit(sortCount, unitCount).StunCalCulate.toFixed(3)}스턴`;
                    }
                    else
                        item.innerText = `스턴 1 수치 : ${(Math.log(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1)) / Math.log(StunCalCulation)).toFixed(3)}스턴`;
                    break;
                case 10:
                    if (u.name == "라분" || (idxToRank(sortCount) === "왜곡됨" && u.name === "블랙마리아")) {
                        item.innerText = `스턴 1 샐 확률 : ${(Math.pow(StunCalCulation, getUnit(sortCount, unitCount).StunCalCulate)*100).toFixed(2)}%`;
                    }
                    else if (u.name == "루피")
                    {
                        let n3 = Math.ceil(1.75 * t);
                        let time = n3 / t;
                        let n4 = Math.floor((2.75 - time) * t);
                        item.innerText = `스턴 1 샐 확률 : ${((1 - ((time + 1 / t / 0.0125 * (1 - (n4 * 0.0125 + 1) * Math.pow(1 - 0.0125, n4))) / (time + 1 / t / 0.0125)) * (1 + (x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1))) * 100).toFixed(2)}%`
                    }
                    else
                        item.innerText = `스턴 1 샐 확률 : ${(-(x1 * s1 * t - n1 * x1 - 1) * Math.pow(1 - x1, n1) * 100).toFixed(2)}%`;
                    break;
                case 11:
                    if (u.name == "라분") {
                        let count = 0;
                        let time1 = 0.65 + 0 / t - 2.15;
                        if (time1 > 0)
                            count++;
                        else
                            time1 = 0;

                        let time2 = 0.65 + 1 / t - 2.15;
                        if (time2 > 0)
                            count++;
                        else
                            time2 = 0;

                        let time3 = 0.65 + 2 / t - 2.15;
                        if (time3 > 0)
                            count++;
                        else
                            time3 = 0;

                        let time4 = 0.65 + 3 / t - 2.15;
                        if (time4 > 0)
                            count++;
                        else
                            time4 = 0;

                        let time5 = 0.65 + 4 / t - 2.15;
                        if (time5 > 0)
                            count++;
                        else
                            time5 = 0;

                        let time6 = 0.65 + 5 / t - 2.15;
                        if (time6 > 0)
                            count++;
                        else
                            time6 = 0;

                        let time7 = 0.65 + 5 / t - 2.15;
                        if (time7 > 0)
                            count++;
                        else
                            time7 = 0;
                        item.innerText = `스턴 1 편차 : ${((
                            time1 * x1 * Math.pow(1 - x1, count - 7) + 
                            time2 * x1 * Math.pow(1 - x1, count - 6) + 
                            time3 * x1 * Math.pow(1 - x1, count - 5) + 
                            time4 * x1 * Math.pow(1 - x1, count - 4) + 
                            time5 * x1 * Math.pow(1 - x1, count - 3) + 
                            time6 * x1 * Math.pow(1 - x1, count - 2) + 
                            time7 * (
                                1 - 
                                x1 - 
                                x1 * (1 - x1) - 
                                x1 * Math.pow(1 - x1, 2) - 
                                x1 * Math.pow(1 - x1, 3) - 
                                x1 * Math.pow(1 - x1, 4) - 
                                x1 * Math.pow(1 - x1, 5)))).toFixed(3)}초`;
                    }
                    else if (u.UnitName == "루피") {
                        item.innerText = `스턴 1 편차 : ${((n1 + 1 + 1 / x1) / t - s1).toFixed(3)}초`;
                    }
                    else
                        item.innerText = `스턴 1 편차 : ${((n1 + 1 + 1 / x1) / t - s1).toFixed(3)}초`;
                    break;
                case 12:
                    item.innerText = `스턴 2 확률 : ${(u.stun2.p * 100).toFixed(2)}%`
                    break;
                case 13:
                    item.innerText = `스턴 2 지속시간 : ${s2}초`;
                    break;
                case 14:
                    item.innerText = `스턴 2 범위 : ${u.stun2.r}`;
                    break;
                case 15:
                    item.innerText = `스턴 2 수치 : ${(Math.log(-(x2 * s2 * t - n2 * x2 - 1) * Math.pow(1 - x2, n2)) / Math.log(StunCalCulation)).toFixed(3)}스턴`;
                    break;
                case 16:
                    item.innerText = `스턴 2 샐 확률 : ${(-(x2 * s2 * t - n2 * x2 - 1) * Math.pow(1 - x2, n2) * 100).toFixed(2)}%`;
                    break;
                case 17:
                    item.innerText = `스턴 2 편차 : ${((n2 + 1 + 1 / x2) / t - s2).toFixed(3)}초`;
                    break;
                case 18:
                    item.innerText = `마나(체력) 통 : ${maxMana}`;
                    break;
                case 19:
                    item.innerText = `마나(체력)스턴 지속시간 : ${m_stun}초`;
                    break;
                case 20:
                    item.innerText = `마나(체력)스턴 범위 : ${u.manaRange}`;
                    break;
                case 21:
                    item.innerText = `마나(체력)스턴 수치 : `;
                    if (u.name === "샹크스" && idxToRank(sortCount) == '초월함') {
                        item.innerText += (Math.log((1 - 3 / 14.25) * (1 - 3 * (1.35 + unitManaRegen) / 35)) / Math.log(StunCalCulation)).toFixed(3);
                    }
                    else if (u.name === "아오키지" && idxToRank(sortCount) == '초월함') {
                        item.innerText += (Math.log(1 - 3 / (1 / t / 0.125 * Math.pow(1 - 0.125, floor(25 / (1 + 1 / t * unitManaRegen))) + 50 / (t + unitManaRegen))) / Math.log(StunCalCulation)).toFixed(3);
                    }
                    else if (u.name === "흰수염") {
                        item.innerText += (Math.log(1 - m_stun / (maxMana / (t + unitHealthRegen + 0.5))) / Math.log(StunCalCulation)).toFixed(3);
                    }                    
                    else if (u.name === "키드" && idxToRank(sortCount) == '초월함') {
                        item.innerText += (Math.log(1 - m_stun / (maxMana / (t + unitHealthRegen + 0.2))) / Math.log(StunCalCulation)).toFixed(3);
                    }
                    else if (maxMana)
                        item.innerText += (Math.log(1 - m_stun / (maxMana / (unitManaRegen + t))) / Math.log(StunCalCulation)).toFixed(3);
                    else
                        item.innerText += 0;
                    item.innerText += '스턴';
                    break;
                case 22:
                    item.innerText = `마나(체력)스턴 공백 :`;
                    if (u.name === "샹크스" && idxToRank(sortCount) == '초월함') {
                        item.innerText += ((1 - 3 / 14.25) * (1 - 3 * (1.35 + unitManaRegen) / 35) * 100).toFixed(2);
                    }
                    else if (u.name === "아오키지" && idxToRank(sortCount) == '초월함') {
                        item.innerText += ((1 - 3 / (1 / t / 0.125 * Math.pow(1 - 0.125, Math.floor(25 / (1 + 1 / t * unitManaRegen))) + 50 / (t + unitManaRegen))) * 100).toFixed(2);
                    }
                    else if (u.name === "흰수염") {
                        item.innerText += ((1 - ((maxMana != 0) ? m_stun / (maxMana / (t + unitHealthRegen + 0.5)) : 0)) * 100).toFixed(2);
                    }                    
                    else if (u.name === "키드" && idxToRank(sortCount) == '초월함') {
                        item.innerText += (( 1 - m_stun / (maxMana / (t + unitHealthRegen + 0.2))) * 100).toFixed(2);
                    }
                    else if (maxMana)
                        item.innerText += ((1 - m_stun / (maxMana / (unitManaRegen + t))) * 100).toFixed(2);
                    else
                        item.innerText = 0;
                    item.innerText += `%`;
                    break;

                }
  
                itemList.appendChild(item);
            }}
    overlayContent.appendChild(itemList);

    overlay.appendChild(overlayContent);

    // 7. 오버레이를 body에 추가
    document.body.appendChild(overlay);
}

function ClearAll() {
    speedBonusEx = 0;
    totalStun = 0;
    manaRegen = 0;
    healthRegen = 0;
    speedDebuff = 0;


    if (document.getElementById("container1") != null)
        for (var sortCount = 0; sortCount < unitStat.length; sortCount++) {
            for (var unitCount = 1; unitCount < unitStat[sortCount].length; unitCount++) {
                getUnit(sortCount, unitCount).Check = 0;
                document.getElementById(`c-${sortCount}-${unitCount}`).innerText = "0";
            }
        }

    allUnits.forEach((item) => {
        item.Check = 0;
    })

    document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
        checkbox.checked = false;
    })

    UnitTotalStun();
    CountOn();
}


// slow1/slow2에서 "수치" 뽑기 (네 SLOW 구조에 맞춰 r 우선)
function slowValue(slowObj) {
  if (!slowObj) return 0;
  if (slowObj.type === "none") return 0;
  return slowObj.eff ?? slowObj.value ?? 0; // r이 없으면 value 같은거 대비
}

function SortFunction(a, b) {

  const nameCmp = String(a.name).localeCompare(String(b.name), "ko");
  if (nameCmp !== 0) return nameCmp;
  
  const ra = unitRates[a.rank] ?? 9999;
  const rb = unitRates[b.rank] ?? 9999;
  if (ra !== rb) return rb - ra;

  const s2a = slowValue(a.slow2), s2b = slowValue(b.slow2);
  if(s2b !== s2a) return s2b - s2a; // 이감2 내림차순

  const s1a = slowValue(a.slow1), s1b = slowValue(b.slow1);
  if (s1a !== s1b) return s1b - s1a; // 이감1 큰 게 위면 내림차순 (원하면 반대로)

}

function BuffAdd(checked, item) //이중 계산 방지 speedBonusEx는 제외
{
    speedBonusEx += checked ? item.atkSpeedBuff : -item.atkSpeedBuff;
    manaRegen += checked ? item.manaRegen : -item.manaRegen;
    healthRegen += checked ? item.healthRegen : -item.healthRegen;
    speedDebuff += checked ? item.slow : -item.slow;
    item.Check = checked ? 1 : 0;
}


function Collect(item, index)
{
    const ClassN = [`s${index}`, `m${index}`, `h${index}`, `d${index}`]
    const items = [];
    items[0] = item.atkSpeedBuff;
    items[1] = item.manaRegen;
    items[2] = item.healthRegen;
    items[3] = item.slow;

    for(let i=0;i<=3;i++)
    {
        if(items[i] != 0)
        {
            if(document.getElementById("container2") !== null)
            {
                document.getElementsByClassName(ClassN[i])[1].checked = item.Check;    
            }

            console.log(i);
            document.getElementsByClassName(ClassN[i])[0].checked = item.Check;
        }
    }        
}

function CheckEvent(CheckEl, item, fallbackIndex) {
  CheckEl.addEventListener("change", (event) => {
    const checked = event.target.checked === true;

    const findAllUnitIndex = (name, rank) =>
      allUnits.findIndex(u => u.name === name && u.rank === rank);

    // item이 속한 Rate 그룹 찾기
    const groupIndex = Rate.findIndex(group =>
      group.some(([name, rank]) => name === item.name && rank === item.rank)
    );

    // 그룹 아니면 그냥 on/off
    if (groupIndex === -1) {
      item.Check = checked ? 1 : 0;
      BuffAdd(checked, item);

      const idx = allUnits.findIndex(u => u === item);
      Collect(item, idx !== -1 ? idx : fallbackIndex);

      UnitTotalStun();
      CountOn();
      return;
    }

    const group = Rate[groupIndex];
    const row = group.findIndex(([name, rank]) => name === item.name && rank === item.rank);
    if (row === -1) return;

    // 현재 활성(버프 적용) 항목 찾기 (가장 높은 티어)
    const getActiveRow = () => {
      for (let i = group.length - 1; i >= 0; i--) {
        const [n, r] = group[i];
        const idx = findAllUnitIndex(n, r);
        if (idx !== -1 && !!allUnits[idx].Check) return i;
      }
      return -1;
    };

    const oldActiveRow = getActiveRow();

    // ✅ 핵심: 체크/해제에 따른 그룹 Check 상태 재설정
    // checked  : i <= row  => 1, i > row  => 0
    // unchecked: i <  row  => 1 유지, i >= row => 0 (즉, 하위 끄면 상위도 꺼짐)
    for (let i = 0; i < group.length; i++) {
      const [name, rank] = group[i];
      const idx = findAllUnitIndex(name, rank);
      if (idx === -1) continue;

      const desired = checked ? (i <= row ? 1 : 0)
                             : (i <  row ? 1 : 0);

      const prev = allUnits[idx].Check ? 1 : 0;
      allUnits[idx].Check = desired;

      // UI 동기화는 무조건 해주는 게 안전(인덱스/정렬 문제 방지)
      Collect(allUnits[idx], idx);
    }

    const newActiveRow = getActiveRow();

    // 버프는 “활성 1개만”
    if (oldActiveRow !== newActiveRow) {
      if (oldActiveRow !== -1) {
        const [oldName, oldRank] = group[oldActiveRow];
        const oldIdx = findAllUnitIndex(oldName, oldRank);
        if (oldIdx !== -1) BuffAdd(false, allUnits[oldIdx]);
      }
      if (newActiveRow !== -1) {
        const [newName, newRank] = group[newActiveRow];
        const newIdx = findAllUnitIndex(newName, newRank);
        if (newIdx !== -1) BuffAdd(true, allUnits[newIdx]);
      }
    }

    UnitTotalStun();
    CountOn();
  });
}

function ButtonColor(name) {
    name.style.background = "rgb(235, 235, 235)";

    name.addEventListener('mouseenter', () => {
        name.style.background = "rgb(215, 215, 215)";
    });

    name.addEventListener('mouseleave', () => {
        name.style.background ="rgb(235, 235, 235)";
    });

    name.addEventListener('mousedown', () => {
        name.style.background = "rgb(250, 250, 250)";
    });

    name.addEventListener('mouseup', () => {
        name.style.background = "rgb(225, 225, 225)";
    });
}

function separateKorean(text) {
    const CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
    const JUNG = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
    const JONG = "ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ";

    let result = "";
    
    for (let char of text) {
        const code = char.charCodeAt(0) - 44032;
        
        if (code < 0 || code > 11171) {
            result += char; // 한글이 아니면 그대로 추가
            continue;
        }
        
        const cho = CHO[Math.floor(code / 588)];
        const jung = JUNG[Math.floor((code % 588) / 28)];
        const jong = JONG[(code % 28) - 1] || ""; // 받침이 없으면 빈 문자열

        result += cho + jung + jong; // 초성 + 중성 + 종성 합쳐서 저장
    }
    
    return result;
}


function Stack() {

    for (let i = 0; i <= 5; i++) {
        const Stack = document.createElement("div");
        Stack.className = `Stack${i}`
        Stack.style.display = "grid";   
        Stack.style.gridArea = ` ${containerGrid - i} / 3 /  ${containerGrid + 1 - i} / 4`;

        document.getElementsByClassName("container")[0].appendChild(Stack);

        if (i === 0)
            Stack.style.gridTemplateColumns = "6fr 4fr";
        else
            Stack.style.gridTemplateColumns = "repeat(4, 1fr)";
    }
    


    const TotalStun = document.createElement("div");
    TotalStun.className = 'Button TotalStun SmallFont';
    TotalStun.addEventListener('click', () => {
        openOverlay(100, 100);
    });
    TotalStun.innerText = `${totalStun.toFixed(3)}스턴`;
    ButtonColor(TotalStun);

    document.getElementsByClassName(`Stack0`)[0].appendChild(TotalStun);


    const clear = document.createElement("div");
    clear.className = "Button clear SmallFont";
    clear.innerText = '초기화';
    clear.addEventListener("click", ()=>{
        location.reload();
    });
    ButtonColor(clear);

    document.getElementsByClassName(`Stack0`)[0].appendChild(clear);

    const DebuffOverlay = document.createElement("div");
    DebuffOverlay.className = "DebuffOverlay";
    DebuffOverlay.style.position = "fixed";
    DebuffOverlay.style.top = 0;
    DebuffOverlay.style.left = 0;
    DebuffOverlay.style.width = "100%";
    DebuffOverlay.style.height = "100%";
    DebuffOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    DebuffOverlay.style.zIndex = 1000;
    DebuffOverlay.style.display = "flex";
    DebuffOverlay.style.justifyContent = "center";
    DebuffOverlay.style.alignItems = "center";
    DebuffOverlay.style.visibility = "hidden";

    DebuffOverlay.addEventListener("click", () => {
        DebuffOverlay.style.visibility = (DebuffOverlay.style.visibility === "hidden") ? "visible" : "hidden";
        DebuffScroll.style.visibility = (DebuffScroll.style.visibility === "hidden") ? "visible" : "hidden";

        DebuffspeedBonusExSearchBar.querySelector("input").value = ""; 

        // 모든 항목 다시 보이게 설정
        let items = document.querySelectorAll(".CheckBox-Stack");
        items.forEach(item => {
            item.style.display = "flex"; // 모든 항목을 표시
        });
    });

    document.body.appendChild(DebuffOverlay);

// ✅ 1️⃣ 스크롤 가능한 컨테이너(`DebuffScroll`) 동적 생성
    const DebuffScroll = document.createElement("div");
    DebuffScroll.className = "SmallFont";
    DebuffScroll.style.position = "absolute";
    DebuffScroll.style.height = "60vh";
    DebuffScroll.style.overflowY = "auto";  // 스크롤 가능하게 설정
    DebuffScroll.style.background = "white";
    DebuffScroll.style.border = "0.05rem solid #ccc";
    DebuffScroll.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";


    // ✅ 2️⃣ 검색창(`DebuffspeedBonusExSearchBar`)을 `DebuffScroll` 안에 동적으로 추가
    const DebuffspeedBonusExSearchBar = document.createElement("div");
    DebuffspeedBonusExSearchBar.className = "search-bar";
    DebuffspeedBonusExSearchBar.style.position = "sticky"; // ✅ 스크롤해도 고정되게 설정
    DebuffspeedBonusExSearchBar.style.zIndex = 1000;
    DebuffspeedBonusExSearchBar.style.top = "0";
    DebuffspeedBonusExSearchBar.style.left = "0";
    DebuffspeedBonusExSearchBar.style.width = "100%";
    DebuffspeedBonusExSearchBar.style.background = "white";
    DebuffspeedBonusExSearchBar.style.padding = "10px";
    DebuffspeedBonusExSearchBar.style.borderBottom = "1px solid #ccc";
    DebuffspeedBonusExSearchBar.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    DebuffspeedBonusExSearchBar.innerHTML = `<input type="text" placeholder="검색어 입력..." style="width: 80%; padding: 8px;">`;

    DebuffspeedBonusExSearchBar.querySelector("input").addEventListener("input", function () {
        let query = this.value.trim().toLowerCase(); // 검색어를 공백을 제외한 소문자로 변환
        query = separateKorean(query); // 검색어 한글 분리
    
        let items = document.querySelectorAll(".CheckBox-Stack");
    
        if (query === "") {
            items.forEach(item => {
                item.style.display = "flex"; // 검색어가 없으면 모든 항목 표시
            });
        } else {
            items.forEach(item => {
                let text = item.innerText.toLowerCase(); // 텍스트 가져오기
                let separatedText = separateKorean(text); // 리스트 항목도 한글 분리
    
                if (separatedText.includes(query)) {
                    item.style.display = "flex"; // 검색어가 포함되면 표시
                } else {
                    item.style.display = "none"; // 검색어가 없으면 숨김
                }
            });
        }
    });

// ✅ 3️⃣ `DebuffScroll`에 `DebuffspeedBonusExSearchBar` 추가 + `body`에 추가
    DebuffScroll.appendChild(DebuffspeedBonusExSearchBar);  // 검색창을 스크롤 박스 안에 추가

// ✅ 4️⃣ `scroll` 이벤트 필요 없음 (CSS `sticky` 사용)

    
    // ✅ 클릭 이벤트 방지 (필요하면 유지)
    DebuffScroll.addEventListener("click", function (event) {
        event.stopPropagation();
    });
    

    const SpeedBonusExButton = document.createElement("div");
    SpeedBonusExButton.className = "AttackSpeedEx Button SmallFont";
    SpeedBonusExButton.innerText = `${speedBonusEx}%`;
    SpeedBonusExButton.style.textAlign = "right";
    SpeedBonusExButton.style.alignContent = "center";
    SpeedBonusExButton.style.paddingRight = "0.25vw";
    ButtonColor(SpeedBonusExButton);
    

    const SpeedBonusExOverlay = document.createElement("div");
    SpeedBonusExOverlay.className = "SpeedBonusExOverlay";
    SpeedBonusExOverlay.style.position = "fixed";
    SpeedBonusExOverlay.style.top = 0;
    SpeedBonusExOverlay.style.left = 0;
    SpeedBonusExOverlay.style.width = "100%";
    SpeedBonusExOverlay.style.height = "100%";
    SpeedBonusExOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    SpeedBonusExOverlay.style.zIndex = 1000;
    SpeedBonusExOverlay.style.display = "flex";
    SpeedBonusExOverlay.style.justifyContent = "center";
    SpeedBonusExOverlay.style.alignItems = "center";
    SpeedBonusExOverlay.style.visibility = "hidden";

    SpeedBonusExOverlay.addEventListener("click", () => {
        SpeedBonusExOverlay.style.visibility = (SpeedBonusExOverlay.style.visibility === "hidden") ? "visible" : "hidden";
        speedBonusExScroll.style.visibility = (speedBonusExScroll.style.visibility === "hidden") ? "visible" : "hidden";

        speedBonusExSearchBar.querySelector("input").value = ""; 

        // 모든 항목 다시 보이게 설정
        let items = document.querySelectorAll(".CheckBox-Stack");
        items.forEach(item => {
            item.style.display = "flex"; // 모든 항목을 표시
        });
        
       });

    document.body.appendChild(SpeedBonusExOverlay);

    const speedBonusExScroll = document.createElement("div");
    speedBonusExScroll.className = "SmallFont";
    speedBonusExScroll.style.position = "absolute";
    speedBonusExScroll.style.height = "60vh";
    speedBonusExScroll.style.overflowY = "auto";
    speedBonusExScroll.style.background = "white";
    speedBonusExScroll.style.border = "0.05rem solid #ccc";
    speedBonusExScroll.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";

    speedBonusExScroll.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    const speedBonusExSearchBar = document.createElement("div");
    speedBonusExSearchBar.className = "search-bar";
    speedBonusExSearchBar.style.position = "sticky"; // ✅ 스크롤해도 고정되게 설정
    speedBonusExSearchBar.style.zIndex = 1000;
    speedBonusExSearchBar.style.top = "0";
    speedBonusExSearchBar.style.left = "0";
    speedBonusExSearchBar.style.width = "100%";
    speedBonusExSearchBar.style.background = "white";
    speedBonusExSearchBar.style.padding = "10px";
    speedBonusExSearchBar.style.borderBottom = "1px solid #ccc";
    speedBonusExSearchBar.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    speedBonusExSearchBar.innerHTML = `<input type="text" placeholder="검색어 입력..." style="width: 80%; padding: 8px;">`;

    speedBonusExSearchBar.querySelector("input").addEventListener("input", function () {
        let query = this.value.trim().toLowerCase(); // 검색어를 공백을 제외한 소문자로 변환
        query = separateKorean(query); // 검색어 한글 분리
    
        let items = document.querySelectorAll(".CheckBox-Stack");
    
        if (query === "") {
            items.forEach(item => {
                item.style.display = "flex"; // 검색어가 없으면 모든 항목 표시
            });
        } else {
            items.forEach(item => {
                let text = item.innerText.toLowerCase(); // 텍스트 가져오기
                let separatedText = separateKorean(text); // 리스트 항목도 한글 분리
    
                if (separatedText.includes(query)) {
                    item.style.display = "flex"; // 검색어가 포함되면 표시
                } else {
                    item.style.display = "none"; // 검색어가 없으면 숨김
                }
            });
        }
    });
    speedBonusExScroll.appendChild(speedBonusExSearchBar);  // 검색창을 스크롤 박스 안에 추가

    const MRegenOverlay = document.createElement("div");
    MRegenOverlay.className = "MRegenOverlay";
    MRegenOverlay.style.position = "fixed";
    MRegenOverlay.style.top = 0;
    MRegenOverlay.style.left = 0;
    MRegenOverlay.style.width = "100%";
    MRegenOverlay.style.height = "100%";
    MRegenOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    MRegenOverlay.style.zIndex = 1000;
    MRegenOverlay.style.display = "flex";
    MRegenOverlay.style.justifyContent = "center";
    MRegenOverlay.style.alignItems = "center";
    MRegenOverlay.style.visibility = "hidden";

    MRegenOverlay.addEventListener("click", () => {
        MRegenOverlay.style.visibility = (MRegenOverlay.style.visibility === "hidden") ? "visible" : "hidden";
        MRegenScroll.style.visibility = (MRegenScroll.style.visibility === "hidden") ? "visible" : "hidden";
    });

    document.body.appendChild(MRegenOverlay);

    const MRegenScroll = document.createElement("div");
    MRegenScroll.style.position = "absolute";
    MRegenScroll.className = "SmallFont";
    MRegenScroll.style.height = "60vh";
    MRegenScroll.style.overflowY = "auto";
    MRegenScroll.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    MRegenScroll.style.border = "0.05rem solid #ccc";
    MRegenScroll.style.background = "white";

    MRegenScroll.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    const HRegenOverlay = document.createElement("div");
    HRegenOverlay.className = "HRegenOverlay";
    HRegenOverlay.style.position = "fixed";
    HRegenOverlay.style.top = 0;
    HRegenOverlay.style.left = 0;
    HRegenOverlay.style.width = "100%";
    HRegenOverlay.style.height = "100%";
    HRegenOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    HRegenOverlay.style.zIndex = 1000;
    HRegenOverlay.style.display = "flex";
    HRegenOverlay.style.justifyContent = "center";
    HRegenOverlay.style.alignItems = "center";
    HRegenOverlay.style.visibility = "hidden";

    HRegenOverlay.addEventListener("click", () => {
        HRegenOverlay.style.visibility = (HRegenOverlay.style.visibility === "hidden") ? "visible" : "hidden";
        HRegenScroll.style.visibility = (HRegenScroll.style.visibility === "hidden") ? "visible" : "hidden";
    });

    document.body.appendChild(HRegenOverlay);

    const HRegenScroll = document.createElement("div");
    HRegenScroll.style.position = "absolute";
    HRegenScroll.className = "SmallFont";
    HRegenScroll.style.height = "60vh";
    HRegenScroll.style.overflowY = "auto";
    HRegenScroll.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    HRegenScroll.style.border = "0.05rem solid #ccc";
    HRegenScroll.style.background = "white";

    HRegenScroll.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    DebuffOverlay.appendChild(DebuffScroll);
    HRegenOverlay.appendChild(HRegenScroll);
    MRegenOverlay.appendChild(MRegenScroll);
    SpeedBonusExOverlay.appendChild(speedBonusExScroll);

    const Scrolls = [speedBonusExScroll, MRegenScroll, HRegenScroll, DebuffScroll];

    allUnits.forEach((item, index) => {
        const items = [];
        items[0] = item.atkSpeedBuff;
        items[1] = item.manaRegen;
        items[2] = item.healthRegen;
        items[3] = item.slow;

        for(let i=0;i<=3;i++)
        {
            if(items[i]!==0)
            {

                const menu = document.createElement("label");
                menu.className = "CheckBox-Stack";
                menu.style.border = "0.001rem solid black";
                Scrolls[i].appendChild(menu);
    
                const unitName = document.createElement("p");
                unitName.innerText = `${item.name}(${item.rank}) ${items[i]}${(i===0||i==3) ? "%" : ""}`;
                switch(i)
                {
                    case 0:
                        unitName.className = `u-s${index}`;
                        break;
                        case 1:
                            unitName.className = `u-m${index}`;
                            break;
                            case 2:
                                unitName.className = `u-h${index}`;
                                break;
                                case 3:
                                    unitName.className = `u-d${index}`;
                                    break;
                }
                unitName.style.margin = "0";
                unitName.style.padding = "0.5rem";
                menu.appendChild(unitName);
    
                const Check = document.createElement("input");
                Check.type = "checkbox";
                const CheckName = [`s${index}`,`m${index}`,`h${index}`,`d${index}`]; 
                Check.className = CheckName[i];
                Check.style.position = 'relative';
                Check.style.zIndex = 10;
                Check.style.marginRight = "0.7vw";
                Check.style.transform = "scale(1.5)";
                Check.dataset.value = items[i];
                Check.checked = item.Check;   
    
                CheckEvent(Check, item, index);
    
                menu.appendChild(Check);
            }
        }

    })

    const MoveSpeedDebuffButton = document.createElement("div");
    MoveSpeedDebuffButton.className = "Debuff Button SmallFont";
    MoveSpeedDebuffButton.style.textAlign = "right";
    MoveSpeedDebuffButton.style.alignContent = "center";
    MoveSpeedDebuffButton.style.paddingRight = "0.25vw";
    MoveSpeedDebuffButton.innerText = speedDebuff + "%";

    ButtonColor(MoveSpeedDebuffButton);

    MoveSpeedDebuffButton.addEventListener("click", (event) => {
        event.stopPropagation();


        if (DebuffOverlay.style.visibility === "hidden") {
            DebuffOverlay.style.visibility = "visible";
            DebuffScroll.style.visibility = "visible";
            const rect = MoveSpeedDebuffButton.getBoundingClientRect();
            const dropdownHeight = DebuffScroll.offsetHeight || 160;

            DebuffScroll.style.left = `${rect.left / window.innerWidth * 100}vw`; // vw 사용
            DebuffScroll.style.top = `${(rect.top - dropdownHeight) / window.innerHeight * 100}vh`;
        }
        else {
            DebuffScroll.style.visibility = "hidden";
            DebuffOverlay.style.visibility = "hidden";
        }
    });

    document.getElementsByClassName('Stack1')[0].appendChild(MoveSpeedDebuffButton);


    const Debuff = document.createElement("div");
    Debuff.className = "Button Bonus SmallFont";
    Debuff.innerText = "이속 감소";

    ButtonColor(Debuff);
    
    Debuff.addEventListener("click", () =>openOverlay(300, 300));

    document.getElementsByClassName('Stack1')[0].appendChild(Debuff);

    SpeedBonusExButton.addEventListener("click", (event) => {
        event.stopPropagation();


        if (SpeedBonusExOverlay.style.visibility === "hidden") {
            SpeedBonusExOverlay.style.visibility = "visible";
            speedBonusExScroll.style.visibility = "visible";
            const rect = SpeedBonusExButton.getBoundingClientRect();
            const dropdownHeight = speedBonusExScroll.offsetHeight || 160;

            speedBonusExScroll.style.left = `${rect.left / window.innerWidth * 100}vw`; // vw 사용
            speedBonusExScroll.style.top = `${(rect.top - dropdownHeight) / window.innerHeight * 100}vh`;
        }
        else {
            speedBonusExScroll.style.visibility = "hidden";
            SpeedBonusExOverlay.style.visibility = "hidden";
        }
    });

    document.getElementsByClassName('Stack1')[0].appendChild(SpeedBonusExButton);
    speedBonusExScroll.style.width = `${(SpeedBonusExButton.offsetWidth * 2) / window.innerWidth * 100}vw`;

    const SpeedBonusEx = document.createElement("div");
    SpeedBonusEx.className = "Bonus SmallFont";
    SpeedBonusEx.innerText = "추가 공속";

    document.getElementsByClassName('Stack1')[0].appendChild(SpeedBonusEx);


    const MRegenButton = document.createElement("div");
    MRegenButton.className = "MRegen Button SmallFont";
    MRegenButton.id = "MRegen";
    MRegenButton.innerText = `${manaRegen}`;
    MRegenButton.style.boxSizing = "border-box";
    MRegenButton.style.textAlign = "right";
    MRegenButton.style.alignContent = "center";
    MRegenButton.style.paddingRight = "0.25vw";
    ButtonColor(MRegenButton);

    MRegenButton.addEventListener("click", (event) => {
        event.stopPropagation();


        if (MRegenOverlay.style.visibility === "hidden") {
            MRegenScroll.style.visibility = "visible";
            MRegenOverlay.style.visibility = "visible";
            const rect = MRegenButton.getBoundingClientRect();
            const dropdownHeight = MRegenScroll.offsetHeight || 160;

            MRegenScroll.style.left = `${rect.left / window.innerWidth * 100}vw`; // vw 사용
            MRegenScroll.style.top = `${(rect.top - dropdownHeight) / window.innerHeight * 100}vh`;
        }
        else {
            MRegenScroll.style.visibility = "hidden";
            MRegenOverlay.style.visibility = "hidden";
        }

    });

    document.getElementsByClassName('Stack2')[0].appendChild(MRegenButton);
    MRegenScroll.style.width = `${(MRegenButton.offsetWidth * 2) / window.innerWidth * 100}vw`;

    const MRegen = document.createElement("div");
    MRegen.className = "Bonus SmallFont";
    MRegen.innerText = "마나 리젠";
    MRegen.style.boxSizing = "border-box";

    document.getElementsByClassName('Stack2')[0].appendChild(MRegen);

    const HRegenButton = document.createElement("div");
    HRegenButton.className = "HRegen Button SmallFont";
    HRegenButton.id = "HRegen";
    HRegenButton.innerText = `${healthRegen}`;
    HRegenButton.style.boxSizing = "border-box";
    HRegenButton.style.textAlign = "right";
    HRegenButton.style.alignContent = "center";
    HRegenButton.style.paddingRight = "0.25vw";
    ButtonColor(HRegenButton);

    HRegenButton.addEventListener("click", (event) => {
        event.stopPropagation();


        if (HRegenOverlay.style.visibility === "hidden") {
            HRegenScroll.style.visibility = "visible";
            HRegenOverlay.style.visibility = "visible";
            const rect = HRegenButton.getBoundingClientRect();
            const dropdownHeight = HRegenScroll.offsetHeight || 160;

            HRegenScroll.style.left = `${rect.left / window.innerWidth * 100}vw`; // vw 사용
            HRegenScroll.style.top = `${(rect.top - dropdownHeight) / window.innerHeight * 100}vh`;
        }
        else {
            HRegenScroll.style.visibility = "hidden"; 
            MRegenOverlay.style.visibility = "hidden";
        }

    });

    document.getElementsByClassName('Stack2')[0].appendChild(HRegenButton);
    HRegenScroll.style.width = `${(HRegenButton.offsetWidth * 2) / window.innerWidth * 100}vw`;

    const HRegen = document.createElement("div");
    HRegen.className = "Bonus SmallFont";
    HRegen.innerText = "체력 리젠";
    HRegen.style.boxSizing = "border-box";

    document.getElementsByClassName('Stack2')[0].appendChild(HRegen);   

}

function Checked(target, sort, unit)
        {

            if(getUnit(sort, unit).name==="퀸")
                {
                    if(target.id.split(`-`)[0] === "p")
                    {
                        manaRegen += 1;
                        healthRegen += 1;
                    }
                    else
                    {
                        manaRegen -= 1;
                        healthRegen -= 1;
                    }
                    const index = allUnits.findIndex(items => items.rank == "왜곡됨" && items.name == "퀸");
                    allUnits[index].Check = target.id.split(`-`)[0]==="p" ? 1 : 0;
                    document.getElementsByClassName(`m${index}`)[0].checked = target.id.split(`-`)[0]==="p" ? true : false;
                    document.getElementsByClassName(`h${index}`)[0].checked = target.id.split(`-`)[0]==="p" ? true : false;
                }
            else if(getUnit(sort, unit).name === '우타')
            {
                let index = allUnits.findIndex(items => items.name == "우타의 헤드셋" && items.rank == "아이템");

                const uta = getUnit(sort, unit)
                const utaIndex = allUnits.findIndex((items => items.name === '우타'));
                if(target.id.split(`-`)[0] === "p")
                {
                    if(allUnits[index].Check == 0)
                    {
                        allUnits[index].Check = 1 ;
                        document.getElementsByClassName(`s${index}`)[0].checked = true;
                        document.getElementsByClassName(`s${utaIndex}`)[0].checked = true;
                        document.getElementsByClassName(`d${utaIndex}`)[0].checked = true;
                    }
                    else
                    {
                        speedBonusEx -= allUnits[index].atkSpeedBuff;
                    }
                }
                else
                {
                    speedBonusEx += allUnits[index].atkSpeedBuff;
                    allUnits[utaIndex].Check = 0;
                    Collect(allUnits[utaIndex], utaIndex);
                }

                const CheckUta = allUnits.find(items => items.rank == uta.rank && items.name == uta.name).Check;
            
                speedDebuff += CheckUta > 0 ? uta.slow : -uta.slow;

            }
            else{
                const U = getUnit(sort, unit);
                const index = allUnits.findIndex(items => items.name == U.name && items.rank == U.rank);
                const slowU = allUnits[index];
                if(slowU !== null)
                {
                    slowU.Check = target.id.split(`-`)[0] === "p" ? 1 : 0;    
                    manaRegen += slowU.Check ? slowU.manaRegen : -slowU.manaRegen;
                    healthRegen +=  slowU.Check ? slowU.healthRegen : -slowU.healthRegen;
                    speedDebuff +=  slowU.Check ? slowU.atkSpeedBuff : -slowU.atkSpeedBuff;
                    Collect(slowU, index);
                }
            }
        }


//스턴 지수
for(let sortCount = 0; sortCount < Object.keys(unitStat).length; sortCount++){
    let check = false;
   for(let unitCount =0; unitCount < unitStat[idxToRank(sortCount)].length; unitCount++)
 {

        if(getUnit(sortCount, unitCount).stun1.type == "none" && getUnit(sortCount, unitCount).manaRange == 0) 
            {
                continue;
            }

        if (!check) {

        const UnitBar = document.createElement("div");
        UnitBar.style.display = "flex";
        UnitBar.style.boxSizing = "border-box";
        container.appendChild(UnitBar);

        const newChild = document.createElement("div");
        newChild.className = 'unitSort SmallFont';
        newChild.innerText = idxToRank(sortCount);
        newChild.style.border = "0.001rem solid black";
        newChild.style.width = "100%";

        switch (sortCount) {
            case unitRates.희귀함:
                newChild.style.color = "rgb(204,0,255)";
                break;
            case unitRates.전설적인:
                newChild.style.color = "rgb(255,0,0)";
                break;
            case unitRates.히든:
                newChild.style.color = "rgb(156,195,230)";
                break;
            case unitRates.초월함:
                newChild.style.color = "rgb(0,255,204)";
                newChild.style.background = "rgb(64,64,64)";
                break;
            case unitRates.불멸의:
                newChild.style.color = "rgb(153,51,0)";
                break;
            case unitRates.영원한:
                newChild.style.color = "rgb(204,0,204)";
                break;
            case unitRates.제한됨:
                newChild.style.color = "rgb(255 255,0)";
                newChild.style.background = "rgb(89,89,89)";
                break;
            case unitRates.신비함:
                newChild.style.color = "rgb(091,151,213)";
                break;
            case 8:
                break;
        }
        UnitBar.appendChild(newChild);
        check = true;
    }


    const UnitBar = document.createElement("div");
    UnitBar.style.display = "flex";
    UnitBar.style.boxSizing = "border-box";
    container.appendChild(UnitBar);
  
            
        const UnitChildBar = document.createElement("div");
        UnitChildBar.style.display = "grid";
        UnitChildBar.style.gridTemplateColumns = "repeat(3, 1fr)";
        UnitChildBar.style.width = "100%";

        UnitBar.appendChild(UnitChildBar);

        const unitName = document.createElement("button");
        unitName.className = 'Button unitName SmallFont';
        unitName.id = `n-${sortCount}-${unitCount}`;
        unitName.innerText = getUnit(sortCount,unitCount).name;
        if (getUnit(sortCount,unitCount).name === "크로커다일(특강)")
            unitName.style.fontSize = "0.65vw";

        unitName.addEventListener("click", (event) => {
            openOverlay(event.target.id.split('-')[1], event.target.id.split('-')[2]);
        })
        ButtonColor(unitName);

        const stunRate = document.createElement("div");
        stunRate.className = 'Rate SmallFont';
        stunRate.id = `r-${sortCount}-${unitCount}`;
        stunRate.style.boxSizing = 'border-box';
        stunRate.innerText = getUnit(sortCount, unitCount).StunCalCulate.toFixed(3) + "스턴";
        stunRate.style.justifyContent = "center";

        const percentage = document.createElement("div");
        percentage.className = 'Rate SmallFont';
        percentage.id = `per-${sortCount}-${unitCount}`;
        percentage.style.boxSizing = 'border-box';
        percentage.innerText = ((1 - Math.pow(StunCalCulation, getUnit(sortCount, unitCount).StunCalCulate)) * 100).toFixed(2) + "%";
        percentage.style.justifyContent = "center";

        const count = document.createElement("div");
        count.className = 'Count SmallFont';
        count.id = `c-${sortCount}-${unitCount}`;

        const u = getUnit(sortCount, unitCount);

        count.innerText = `${allUnits.find(items => items.name == u.name && items.rank == u.rank).Check}`;
        count.style.justifyContent = "center";
        count.style.aspectRatio = "1";
        count.style.height = `${GridHeight}vw`;
        count.style.boxSizing = "border-box";

        const preloadImages = ["plus.svg", "minus.svg"];
        preloadImages.forEach(src => {
        const img = new Image();
        img.src = src;
        });

        const plus = document.createElement("img");
        plus.className = 'IMG SmallFont';
        plus.src = "plus.svg";
        plus.id = `p-${sortCount}-${unitCount}`;
        plus.style.height = `${GridHeight}vw`;
        plus.style.aspectRatio = "1";
        plus.style.boxSizing = "border-box";
        plus.addEventListener('click', () => {
            const id = plus.id.split(`-`);
            const sort = id[1];
            const unit = id[2];
            const u = getUnit(sortCount, unitCount)
            const CheckU = allUnits.find(items => items.name == u.name && items.rank == u.rank);
            CheckU.Check++;
            if (CheckU.Check == 1) {
                speedBonusEx += getUnit(sortCount,unitCount).atkSpeedBuff;

                Checked(plus, sort, unit);
                const u = getUnit(sort, unit);

                Sort.push([sort, unit, u.stun1.r]);
                Sort.push([sort, unit, u.stun2.r]);
                Sort.push([sort, unit, u.manaRange]);

                Sort.sort((a, b) => a[2] - b[2]);
            }
            UnitTotalStun();
            CountOn();
        });                
        ButtonColor(plus);

        const minus = document.createElement("IMG");
        minus.className = 'IMG SmallFont';
        minus.src = "minus.svg";
        minus.id = `m-${sortCount}-${unitCount}`;
        minus.style.height = `${GridHeight}vw`;
        minus.style.aspectRatio = "1";
        minus.style.boxSizing = "border-box";
        minus.addEventListener('click', () => {
            const id = minus.id.split(`-`);
            const sort = id[1];
            const unit = id[2];
            const u = getUnit(sortCount, unitCount)
            const CheckU = allUnits.find(items => items.name == u.name && items.rank == u.rank);
            CheckU.Check--;
            if (CheckU.Check < 0){
                CheckU.Check = 0;
            }
            else if (CheckU.Check == 0) {
                speedBonusEx -= getUnit(sortCount,unitCount).atkSpeedBuff;
                Checked(minus, sort, unit);

                const u = getUnit(sort,unit);

                Sort = Sort.filter(item => item[0] !== sort || item[1] !== unit || item[2] !== u.stun1.r);
                Sort = Sort.filter(item => item[0] !== sort || item[1] !== unit || item[2] !== u.stun2.r);
                Sort = Sort.filter(item => item[0] !== sort || item[1] !== unit || item[2] !== u.manaRange);
  
            }  
            UnitTotalStun();
            CountOn();
        }
        );

        ButtonColor(minus);

        UnitChildBar.appendChild(unitName);
        UnitChildBar.appendChild(stunRate);
        UnitChildBar.appendChild(percentage);
        UnitBar.appendChild(count);
        UnitBar.appendChild(plus);
        UnitBar.appendChild(minus);
    }
}
 

Stack();

const bar = document.getElementById("bar");

    const Koby = document.createElement("div");
    Koby.className = "Button SmallFont";
    Koby.innerText = "코비";
    Koby.style.alignContent = "center";
    Koby.style.textAlign = "center";

    bar.appendChild(Koby);

    const KobyButton = document.createElement("div");
    KobyButton.className = "Button SmallFont";
    KobyButton.innerText = "0";
    KobyButton.style.paddingRight = "0.25vw";
    KobyButton.style.alignContent = "center";
    KobyButton.style.textAlign = "right";
    
    ButtonColor(KobyButton);
    bar.appendChild(KobyButton);
    
    // 버튼을 클릭하면 input으로 변환
    KobyButton.addEventListener("click", function () {
        const input = document.createElement("input");
        input.type = "text";
        input.value = KobyButton.innerText;
        input.className = "SmallFont";
        input.style.textAlign = "right";
        input.style.boxSizing = "border-box";
        input.style.width = getComputedStyle(KobyButton).width;
    
        // 버튼 숨기기
        KobyButton.style.display = "none";
    
        // 버튼 다음에 input 삽입
        KobyButton.after(input);
        input.focus();
    
        function revertToButton() {
            KobyButton.innerText = input.value; // 입력값 유지
            koby = parseInt(input.value);
            UnitTotalStun();
            CountOn();
            input.remove(); // input 삭제
            KobyButton.style.display = ""; // 버튼 다시 표시
        }
    
        input.addEventListener("blur", revertToButton);
        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                this.blur();
            }
        });
    });

    const Dex = document.createElement("div");
    Dex.className = "Button SmallFont";
    Dex.innerText = "민첩성";
    Dex.style.alignContent = "center";
    Dex.style.textAlign = "center";

    bar.appendChild(Dex);

    const DexButton = document.createElement("div");
    DexButton.className = "Button SmallFont";
    DexButton.innerText = "0";
    DexButton.style.paddingRight = "0.25vw";
    DexButton.style.alignContent = "center";
    DexButton.style.textAlign = "right";
    
    ButtonColor(DexButton);
    bar.appendChild(DexButton);
    
    // 버튼을 클릭하면 input으로 변환
    DexButton.addEventListener("click", function () {
        const input = document.createElement("input");
        input.type = "text";
        input.value = DexButton.innerText;
        input.className = "SmallFont";
        input.style.textAlign = "right";
        input.style.boxSizing = "border-box";
        input.style.width = getComputedStyle(DexButton).width;
    
        // 버튼 숨기기
        DexButton.style.display = "none";
    
        // 버튼 다음에 input 삽입
        DexButton.after(input);
        input.focus();
    
        function revertToButton() {
            DexButton.innerText = input.value; // 입력값 유지
            dex = input.value;
            UnitTotalStun();
            CountOn();
            input.remove(); // input 삭제
            DexButton.style.display = ""; // 버튼 다시 표시
        }
    
        input.addEventListener("blur", revertToButton);
        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                this.blur();
            }
        });
    });

    const Intel = document.createElement("div");
    Intel.className = "Button SmallFont";
    Intel.innerText = "지능";
    Intel.style.alignContent = "center";
    Intel.style.textAlign = "center";

    bar.appendChild(Intel);

    const IntelButton = document.createElement("div");
    IntelButton.className = "Button SmallFont";
    IntelButton.innerText = "0";
    IntelButton.style.paddingRight = "0.25vw";
    IntelButton.style.alignContent = "center";
    IntelButton.style.textAlign = "right";
    
    ButtonColor(IntelButton);
    bar.appendChild(IntelButton);
    
    // 버튼을 클릭하면 input으로 변환
    IntelButton.addEventListener("click", function () {
        const input = document.createElement("input");
        input.type = "text";
        input.value = IntelButton.innerText;
        input.className = "SmallFont";
        input.style.textAlign = "right";
        input.style.boxSizing = "border-box";
        input.style.width = getComputedStyle(IntelButton).width;
    
        // 버튼 숨기기
        IntelButton.style.display = "none";
    
        // 버튼 다음에 input 삽입
        IntelButton.after(input);
        input.focus();
    
        function revertToButton() {
            IntelButton.innerText = input.value; // 입력값 유지
            intel = input.value;
            UnitTotalStun();
            CountOn();
            input.remove(); // input 삭제
            IntelButton.style.display = ""; // 버튼 다시 표시
        }
    
        input.addEventListener("blur", revertToButton);
        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                this.blur();
            }
        });

    });

    const Formula = document.createElement("div");
    Formula.className = "Button Formula SmallFont";
    Formula.innerText = "가동률\n공식";
    Formula.style.alignContent = "center";
    Formula.style.textAlign = "center";
    Formula.style.padding = ".5vw 0 .5vw 0";
    Formula.addEventListener("click", () => {
        openOverlay(200, 200);
    });
    ButtonColor(Formula);   

    bar.appendChild(Formula);

    const StunCalCulateMachine = document.createElement("div");
    StunCalCulateMachine.className = "Button SmallFont";
    StunCalCulateMachine.innerText = "스턴\n계산기";
    StunCalCulateMachine.style.alignContent = "center";
    StunCalCulateMachine.style.textAlign = "center";
    StunCalCulateMachine.addEventListener("click", () =>
    {
        openOverlay(400, 400);
    })

    bar.appendChild(StunCalCulateMachine);
    ButtonColor(StunCalCulateMachine);

    const ManaControlCalculate = document.createElement("div");
    ManaControlCalculate.className = "Button SmallFont";
    ManaControlCalculate.innerText = "마나뻥\n계산기";
    ManaControlCalculate.style.alignContent = "center";
    ManaControlCalculate.style.textAlign = "center";    
    ManaControlCalculate.addEventListener("click", () =>
        {
            openOverlay(500, 500);
        })

    bar.appendChild(ManaControlCalculate);
    ButtonColor(ManaControlCalculate);

    if (document.getElementById("container1")) {
        const Mana = document.createElement("div");
        Mana.className = "Button Mana SmallFont";
        Mana.innerText = "마나\n끄기";
        Mana.style.alignContent = "center";
        Mana.style.textAlign = "center";
        Mana.addEventListener("click", () => {
            if (mana)
                Mana.innerText = "마나\n켜기";
            else
                Mana.innerText = "마나\n끄기";
            mana = !mana;
            UnitTotalStun();
            CountOn();
        });

        ButtonColor(Mana);
        bar.appendChild(Mana);
    }    

    const Physical = document.createElement("div");
    Physical.className = "Button SmallFont";
    Physical.innerText = "방깍\n계산";
    Physical.style.alignContent = "center";
    Physical.style.textAlign = "center";

    Physical.addEventListener('click', () => {
        openOverlay(600, 600);
    });
    
    ButtonColor(Physical);
    bar.appendChild(Physical);   
    
    const Ryuma = document.createElement("div");
    Ryuma.className = "Button SmallFont";
    Ryuma.innerText = "오니\n가르기";
    Ryuma.style.alignContent = "center";
    Ryuma.style.textAlign = "center";    
    
    Ryuma.addEventListener('click', () => {
        openOverlay(700, 700);
    });
    
    ButtonColor(Ryuma);
    bar.appendChild(Ryuma);   
    
    const mono = document.createElement("div");
    mono.className = "Button SmallFont";
    mono.innerText = "단일\n효율";
    mono.style.alignContent = "center";
    mono.style.textAlign = "center";    
    
    mono.addEventListener('click', () => {
        openOverlay(800, 800);
    });
    
    ButtonColor(mono);
    bar.appendChild(mono);
    

const MoveSpeedPage = document.createElement("button");
MoveSpeedPage.className = "Button MoveSpeedPage SmallFont";
MoveSpeedPage.innerText = "발동 이감";
MoveSpeedPage.style.gridArea = "1/4/2/5";

MoveSpeedPage.addEventListener('click', () => {

    const Container2 = document.createElement('div');
    Container2.className = "container";
    Container2.id = "container2";
    Container2.style.gridTemplateRows = `repeat(${containerGrid}, 1fr)`;

    let i = 0;

    container.replaceWith(Container2);
    for (let unitCount = 0; unitCount <= allUnits.length + Math.floor(i/containerGrid);unitCount++, i++) {

        if (i % containerGrid == 0) {
            const Unit = document.createElement("div"); 
            Unit.id = `u-${i}`;
            Unit.style.boxSizing = "border-box";
            Unit.style.display = "grid";
            Unit.style.gridTemplateColumns = "repeat(4, 1fr)";
            Container2.appendChild(Unit);

            const UnitName = document.createElement("button");
            UnitName.className = "Button unitSort MoreSmallFont UnitNameBar";
            UnitName.boxSizing = "border-box";
            UnitName.textContent = (nameSort == 0) ? "유닛명" : (nameSort == -1) ? "유닛명 ⬇" : "유닛명 ⬆";
            UnitName.addEventListener("click", () => {
                if (nameSort <= 0)
                    nameSort = 1;
                else
                    nameSort = -1;
                rateSort = 0;
                moveSpeedSort = 0;
                afterShockSort = 0;

                allUnits.sort((a, b) => {
                    if (nameSort == 1) {    
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;
                    }
                    if (nameSort == -1) {
                        if (a.name < b.name) return 1;
                        if (a.name > b.name) return -1;
                    }
                    return SortFunction(a, b);
                });
                CountOn();
            })

            ButtonColor(UnitName);
            Unit.append(UnitName);

            const UnitSort = document.createElement("button");
            UnitSort.className = "Button unitSort MoreSmallFont UnitSortBar";
            UnitSort.boxSizing = "border-box";
            UnitSort.textContent = "등급";
            UnitSort.addEventListener("click", () => {
                nameSort = 0;
                if (rateSort <= 0)
                    rateSort = 1;
                else
                    rateSort = -1;
                moveSpeedSort = 0;
                afterShockSort = 0;

                  allUnits.sort((a, b) => {
                    const ra = unitRates[a.rank] ?? 9999;
                    const rb = unitRates[b.rank] ?? 9999;

                    if (ra !== rb) return (ra - rb) * rateSort; // ✅ 숫자 등급 정렬

                    return SortFunction(a, b); // 같은 등급이면 나머지 기준
                });
                CountOn();
            })

            ButtonColor(UnitSort);
            Unit.append(UnitSort);

            const MoveSpeed = document.createElement("button");
            MoveSpeed.className = "Button unitSort MoreSmallFont MoveSpeedBar";
            MoveSpeed.style.boxSizing = "border-box"; // boxSizing 추가
            MoveSpeed.textContent = "이감 발동률";
            MoveSpeed.addEventListener("click", () => {
                nameSort = 0;
                rateSort = 0;
                if (moveSpeedSort <=0)
                    moveSpeedSort = 1;
                else
                    moveSpeedSort = -1;
                afterShockSort = 0;

                allUnits.sort((a, b) => {
                    if (a.SlowCalculate > b.SlowCalculate) return (moveSpeedSort == 1) ? -1 : 1;
                    if (a.SlowCalculate < b.SlowCalculate) return (moveSpeedSort == 1) ? 1 : -1;

                    return SortFunction(a, b);
                });
                CountOn();
            })

            ButtonColor(MoveSpeed);
            Unit.appendChild(MoveSpeed);

            const AfterShock = document.createElement("button");
            AfterShock.className = "Button unitSort MoreSmallFont AfterShockBar";
            AfterShock.style.boxSizing = "border-box"; // boxSizing 추가
            AfterShock.textContent = "여진 가동률";

            AfterShock.addEventListener("click", () => {
                nameSort = 0;
                rateSort = 0;
                moveSpeedSort = 0;
                if (afterShockSort <= 0)
                    afterShockSort = 1;
                else
                    afterShockSort = -1;

                allUnits.sort((a, b) => {
                    if (a.EarthCalculate > b.EarthCalculate) return (afterShockSort == 1) ? -1 : 1;
                    if (a.EarthCalculate < b.EarthCalculate) return (afterShockSort == 1) ? 1 : -1;

                    return SortFunction(a, b);
                });
                CountOn();
            })

            ButtonColor(AfterShock);
            Unit.appendChild(AfterShock);
        }
        else
            {
                let newInt = unitCount - 1 - Math.floor(i/containerGrid);
            if(allUnits[newInt].SlowCalculate == 0 && allUnits[newInt].EarthCalculate == 0){
                i--;
                continue;
            }

                const chairInt = i - 1 - Math.floor(i / containerGrid);

            const Unit = document.createElement("div");
            Unit.id = `u-${newInt}`;
            Unit.style.boxSizing = "border-box";
            Unit.style.display = "grid";
            Unit.style.gridTemplateColumns = "repeat(4, 1fr)";
            Container2.appendChild(Unit);
                
            const UnitName = document.createElement("div");
            UnitName.className = "unitName SmallFont";
            UnitName.id = `n-${chairInt}`;
            UnitName.style.border = "0.001rem solid black";
            UnitName.style.boxSizing = "border-box"; // boxSizing 추가
            UnitName.textContent = `${allUnits[newInt].name}`;

            Unit.appendChild(UnitName);

            const UnitSort = document.createElement("div");
            UnitSort.className = "unitName SmallFont";
            UnitSort.id = `s-${chairInt}`;
            UnitSort.style.border = "0.001rem solid black";
            UnitSort.boxSizing = "border-box";
            UnitSort.textContent = `${allUnits[newInt].rank}`;

            Unit.append(UnitSort);

            const MoveSpeed = document.createElement("button");
            MoveSpeed.className = "Button SmallFont";
            MoveSpeed.id = `m-${chairInt}`;
            MoveSpeed.style.boxSizing = "border-box"; // boxSizing 추가
            MoveSpeed.addEventListener('click', () => {
        
                let unitNumber = 0;
                for(let count = -1; count < chairInt; unitNumber++)
                {
                    if(allUnits[unitNumber].slow1.type != "none" || allUnits[unitNumber].slow2.type != "none"){
                        count++;}
                }
                unitNumber--;

                if(allUnits[unitNumber].slow1.type == "none") return;
                openOverlay(-1, chairInt);

            })

            ButtonColor(MoveSpeed);
            Unit.appendChild(MoveSpeed);
            MoveSpeed.textContent = `${((allUnits[newInt].SlowCalculate) * 100).toFixed(2)}%`;

            const AfterShock = document.createElement("button");
            AfterShock.className = "Button SmallFont";
            AfterShock.id = `a-${chairInt}`;
            AfterShock.style.boxSizing = "border-box"; // boxSizing 추가
            AfterShock.addEventListener('click', () => {
        
                let unitNumber = 0;
                for(let count = -1; count < chairInt; unitNumber++)
                {
                    if(allUnits[unitNumber].slow1.type != "none" || allUnits[unitNumber].slow2.type != "none"){
                        count++;}
                }
                unitNumber--;

                if(allUnits[unitNumber].slow2.type == "none") return;
                openOverlay(-2, chairInt);
            })

            ButtonColor(AfterShock);
            Unit.appendChild(AfterShock);
            AfterShock.textContent = `${((allUnits[newInt].EarthCalculate) * 100).toFixed(2)}%`; 
    }
}

    Stack();


    const StunPage = document.createElement("button");
    StunPage.className = "Button Stun SmallFont";
    StunPage.innerText = "스턴";
    StunPage.style.gridArea = "1/4/2/5";

    StunPage.addEventListener('click', () => {

        Container2.replaceWith(container);
        CountOn();
        SetElemental();
    })

    ButtonColor(StunPage);
    document.getElementsByClassName(`Stack4`)[0].appendChild(StunPage);

})

const deviation = document.createElement("button");
    deviation.className = "Button Stun SmallFont";
    deviation.innerText = "스턴 편차";
    deviation.style.gridArea = "1/3/2/4";

    deviation.addEventListener('click', () => {
        deviationToggle = !deviationToggle;
        CountOn();
    })

    ButtonColor(deviation);
    document.getElementsByClassName(`Stack4`)[0].appendChild(deviation);

ButtonColor(MoveSpeedPage);
document.getElementsByClassName(`Stack4`)[0].appendChild(MoveSpeedPage);

CountOn();

function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = '#fff';
    notification.style.padding = '10px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    notification.innerHTML = '웹사이트에 새로운 업데이트가 있습니다!';
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '닫기';
    closeButton.style.marginLeft = '10px';
    closeButton.style.backgroundColor = '#fff';
    closeButton.style.color = '#4CAF50';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => notification.remove();
    
    notification.appendChild(closeButton);
    document.body.appendChild(notification);
  }

  import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

const selector = document.getElementById("versionSelector");
const contentDiv = document.getElementById("content");

// index.json 가져와서 버전 목록 표시
fetch("https://patchnote.s3.ap-northeast-2.amazonaws.com/patchnotes/index.json", {
    cache: "no-store"
  })
  .then(res => res.json())
  .then(versions => {
    versions.forEach(entry => {
        const option = document.createElement("option");
        option.value = entry.version;
        option.textContent = `${entry.version} (${entry.date})`;
        selector.appendChild(option);
      });

    // 첫 번째 자동 로딩
    loadMarkdown(versions[0].version);
  });

selector.addEventListener("change", () => {
  const version = selector.value;
  loadMarkdown(version);
});

function loadMarkdown(version) {
  const url = `https://patchnote.s3.ap-northeast-2.amazonaws.com/patchnotes/${version}.md`;
  fetch(url)
    .then(res => res.text())
    .then(md => {
      contentDiv.innerHTML = marked.parse(md);
    })
    .catch(err => {
      contentDiv.innerHTML = `<p style="color:red;">❌ 로딩 실패: ${err.message}</p>`;
    });
}

let socket;
let reconnectAttempts = 0;
let first = true;

function connectWebSocket(){
    socket = new WebSocket("wss://4ixs2roym1.execute-api.ap-northeast-2.amazonaws.com/production");

 
    socket.onopen = () => {
        console.log("✅ WebSocket 연결됨");
    
        // 연결되자마자 서버에 초기 데이터 요청
        if(first)
        {
            socket.send(JSON.stringify({
                action: ""
            }));
            first = false;
        }

    };
    
    socket.onmessage = (event) => {
        if(JSON.parse(event.data).message === "Update")
        {
            showUpdateNotification();
        }
        else 
        {
            console.log("알 수 없는 메세지");
        }
    };
    
    socket.onerror = (error) => {
        console.error("❌ WebSocket 오류 발생:", error);
    };
    
    socket.onclose = (event) => {
        console.warn("⚠️ WebSocket 연결 종료! 코드:", event.code, "이유:", event.reason);

        // 백오프 전략 적용 (최대 30초까지 증가)
        let delay = Math.min(3000 * (2 ** reconnectAttempts), 30000);
        console.log(`⏳ ${delay / 1000}초 후 재연결 시도...`);
        setTimeout(connectWebSocket, delay);

        reconnectAttempts++;
    };
}

connectWebSocket();

