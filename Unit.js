
export const unitRates = {
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

export const Seige = {
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

export const UNIT_DEFAULTS = Object.freeze({
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

export const RANK_DEFAULTS = Object.freeze({
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
export function unit(rank, name, patch = {}) {
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
    unit("히든", "봉쿠레",     { atkSpeedBonus: 2.6, attackCycle: 0.94, stun1: STUN.chance(0.12, 1.65, 500) }),
    unit("히든", "써니호",     { atkSpeedBonus: 2.6, attackCycle: 0.45, stun1: STUN.chance(0.1, 1.4, 600) }),
    unit("히든", "아오키지",   { atkSpeedBonus: 2.6, attackCycle: 0.79, stun1: STUN.chance(0.1, 1.7, 415), slow: 35 }),
    unit("히든", "이완코브",   { atkSpeedBonus: 2.6, attackCycle: 0.86, stun1: STUN.chance(0.11, 1.65, 500) }),
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

    unit("초월함", "로빈",   { atkSpeedBonus: 3.35, attackCycle: 0.71, stun1: STUN.chance(0.1, 2.85, 525), mana: 40, manaDuration: 1.15, manaRange: 600 }),
    unit("초월함", "료쿠규", { atkSpeedBonus: 3.35, attackCycle: 0.84,
      slow1: SLOW.chance(0.12, 3, 25),
      slow2: SLOW.chance(0.164, 3, 20)
    }),

    unit("초월함", "루피", { atkSpeedBonus: 3.35, attackCycle: 0.38,
      stun1: STUN.chance(0.025, 3.5, 500),
      mana: 160, manaDuration: 2.15, manaRange: 600,
      slow2: SLOW.chance(0.175, 2, 33)
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
    unit("불멸의", "시키(2레벨)", { atkSpeedBonus: 3.3, attackCycle: 0.49, slow2: SLOW.chance(0.032, 5, 35) }),
    unit("불멸의", "시키(3레벨)", { atkSpeedBonus: 3.3, attackCycle: 0.49, slow2: SLOW.chance(0.034,  5, 35) }),
    unit("불멸의", "시키(4레벨)", { atkSpeedBonus: 3.3, attackCycle: 0.49, slow2: SLOW.chance(0.036, 5, 35) }),

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
    unit("영원한", "카벤딧슈", { atkSpeedBonus: 3.15, attackCycle: 0.71, stun1: STUN.chance(0.1, 2.3, 550), mana: 100, manaDuration: 3, manaRange: 500 }),

    unit("영원한", "핸콕", {
      atkSpeedBonus: 3.3, attackCycle: 0.74,
      stun1: STUN.chance(0.075, 2.75, 650),
      mana: 175, manaDuration: 4, manaRange: 750,
      slow1: SLOW.chance(0.075, 2.5, 60)
    }),

    unit("영원한", "핸콕(특강)", { atkSpeedBonus: 3.3, attackCycle: 0.74, stun1: STUN.chance(0.1, 2.75, 650), mana: 175, manaDuration: 4, manaRange: 750 }),
    unit("영원한", "테조로",   { atkSpeedBonus: 3.40, attackCycle: 0.70, stun1: STUN.chance(0.12, 2.4, 625), mana: 90, manaDuration: 2.4, atkSpeedBuff: 25, manaRange: 625 }),

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
    unit("신비함", "미나토",     { atkSpeedBonus: 3.42, attackCycle: 0.73, stun1: STUN.chance(0.05, 3.0, 600), stun2: STUN.chance(0.15, 2.75, 525)}),
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



export function findUnitPos(rank, name) {
  const sortCount = unitRates[rank];
  if (sortCount == null) return null;           // unitRates에 없는 등급

  const arr = unitStat[rank];
  if (!Array.isArray(arr)) return null;         // unitStat에 없는 등급

  const unitCount = arr.findIndex(u => u.name === name);
  if (unitCount === -1) return null;            // 그 등급에 그 이름 없음

  return { sortCount, unitCount };
}

export const Rate = [
  [['우타의 헤드셋', '아이템'], ['우타', '영원한']],
  [['불사조의 깃털', '아이템'], ['마르코', '제한됨'], ['마르코(특강)', '제한됨']],
  [['아기 라분', '초월함'], ['브룩', '초월함']],
];

export const Mana = [// 이름, 등급, 공속보너스, 공격주기, 마나통, 딜레이시간
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

export const Mono = [
    ['시류', unitRates.희귀함, 1.3, 0.69, 0.1, 0.15, 0, 0, Seige.관통],
    ['류마', unitRates.희귀함, 1.3, 0.77, 0.1, 0.1, 0, 0, Seige.관통 ],
    ['핸콕', unitRates.희귀함, 1.3, 0.68, 0.1, 0.1, 0, 0, Seige.패기],

    ['루치', unitRates.전설적인, 2.95, 0.52, 0.11, 0.3, 0, 0, Seige.공성],
    ['상디', unitRates.전설적인, 2.95, 0.45, 1, 0.0285, 0, 0, Seige.공성],
    ['레이쥬', unitRates.전설적인, 2.95, 0.88, 0.055, 0.1956, 0.1, 0.1719, Seige.관통],
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


export function findUnit(rank, name) {
  const list = unitStat[rank];
  if (!list) return null;
  return list.find(u => u.name === name) ?? null;
}

export const idxToRank = (idx) => rankByIndex[idx] ?? null;

export const allUnits = Object.entries(unitStat).flatMap(([rank, arr]) =>
arr.map(u => ({ ...u, rank }))   // rank가 원래 없으니까 붙임
);

allUnits.sort((a, b) => {

return SortFunction(a, b);
});

export function SortFunction(a, b) {

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