import { unit } from "../factory.js";
import { STUN, SLOW } from "../effects.js";

export const legendaryUnits = [
    // 기존
    unit("전설적인", "나미",   { atkSpeedBonus: 2.95, attackCycle: 0.66, slow2: SLOW.chance(0.088, 3, 42) }),
    unit("전설적인", "드래곤",       { atkSpeedBonus: 2.95, attackCycle: 0.77, stun1: STUN.chance(0.1, 2.75, 500), atkSpeedBuff: 5, slow: 10 }),
    unit("전설적인", "라분",         { atkSpeedBonus: 1.15, attackCycle: 1.33, stun1: STUN.chance(0.27, 2.15, 575), atkSpeedBuff: 17 }),
    unit("전설적인", "바르톨로메오", { atkSpeedBonus: 2.95, attackCycle: 0.71, stun1: STUN.chance(0.1, 2.75, 550) }),
    unit("전설적인", "샹크스",       { atkSpeedBonus: 2.95, attackCycle: 0.66, stun1: STUN.chance(0.11, 2.2, 600) }),
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
  ];
