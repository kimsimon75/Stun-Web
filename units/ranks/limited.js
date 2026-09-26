import { unit } from "../factory.js";
import { STUN, SLOW } from "../effects.js";

export const limitedUnits = [
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
  ];
