import { unit } from "../factory.js";
import { STUN, SLOW } from "../effects.js";

export const transcendentUnits = [
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
    unit("초월함", "사보", { atkSpeedBonus: 2.57, attackCycle: 0.79, stun1: STUN.cooldown(12.5, 2.5, 475), slow1: SLOW.chance(0.1, 2, 30), atkSpeedBuff: 20, slow: 35 }),
    unit("초월함", "시라호시", { atkSpeedBonus: 3.35, attackCycle: 0.70, stun1: STUN.chance(0.12, 2.35, 600), mana: 120, manaDuration: 3, manaRange: 800 }),
    unit("초월함", "샹크스",   { atkSpeedBonus: 3.55, attackCycle: 0.60, stun1: STUN.chance(0.1, 2.0, 800), stun2: STUN.chance(0.1, 1.8, 800), mana: 35, manaDuration: 3, manaRange: 1100 }),
    unit("초월함", "아오키지", { atkSpeedBonus: 3.35, attackCycle: 0.69, stun1: STUN.chance(0.1, 2.3, 550), manaRange: 700, slow: 80 }),
    unit("초월함", "우초 식물",     { atkSpeedBonus: 4, attackCycle: 5, stun1: STUN.chance(0.20, 2, 425) }),
    // 샷건을 기본 스턴으로 계산하고, 로켓은 상세창의 마나 스턴으로 따로 계산합니다.
    unit("초월함", "요크(베가펑크)", { atkSpeedBonus: 3.35, attackCycle: 0.75, stun1: STUN.chance(0.1, 2.75, 575), mana: 100, manaDuration: 3.75, manaRange: 575, showSkillBreakdown: true }),
    unit("초월함", "조로",     { atkSpeedBonus: 3.35, attackCycle: 0.67, stun1: STUN.chance(0.03, 2.5, 500), mana: 145, manaDuration: 3, manaRange: 525, slow: 30 }),
    unit("초월함", "키드",     { atkSpeedBonus: 3.35, attackCycle: 0.99, mana: 40, manaDuration: 2.25, manaRange: 525, slow: 35 }),
    unit("초월함", "키자루",   { atkSpeedBonus: 3.35, attackCycle: 0.64, stun1: STUN.chance(0.0825, 2.75, 500) }),
    unit("초월함", "후지토라", { atkSpeedBonus: 2.16, attackCycle: 0.94, stun1: STUN.chance(0.15, 2.6, 475), stun2: STUN.chance(0.0415, 2.5, 475), slow: 55 }),

    unit("초월함", "나미",   { atkSpeedBonus: 3.55, attackCycle: 0.63, slow2: SLOW.chance(0.0415, 5, 45) }),
    unit("초월함", "로우",   { atkSpeedBonus: 3.35, attackCycle: 0.64, slow1: SLOW.chance(0.125, 3, 40) }),

    unit("초월함", "상디",   { atkSpeedBonus: 3.35, attackCycle: 0.46, slow1: SLOW.chance(0.05, 3.5, 50) }),
    unit("초월함", "아카이누", { atkSpeedBonus: 3.35, attackCycle: 0.73, slow2: SLOW.chance(0.1675, 2, 12) }),
    unit("초월함", "징베",   { atkSpeedBonus: 2.70, attackCycle: 0.89, slow1: SLOW.chance(0.0625, 3, 50), atkSpeedBuff: 20, manaRegen: 3 }),
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
  ];
