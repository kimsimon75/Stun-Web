import { unit } from "../factory.js";
import { STUN, SLOW } from "../effects.js";

export const eternalUnits = [
    // 기존
    unit("영원한", "니카",     { atkSpeedBonus: 3.10, attackCycle: 0.57, stun1: STUN.chance(0.1, 2.0, 500), mana: 150, manaDuration: 3, atkSpeedBuff: 25, manaRange: 750 }),
    unit("영원한", "우타",     { atkSpeedBonus: 3.10, attackCycle: 0.67, stun1: STUN.chance(0.1, 1.5, 500), atkSpeedBuff: 27, slow: 45 }),
    unit("영원한", "카벤딧슈", { atkSpeedBonus: 3.15, attackCycle: 0.71, stun1: STUN.chance(0.1, 2.3, 550), mana: 100, manaDuration: 3, manaRange: 500 }),

    unit("영원한", "핸콕", {
      atkSpeedBonus: 3.3, attackCycle: 0.74,
      stun1: STUN.chance(0.075, 2.75, 650),
      mana: 175, manaDuration: 4, manaRange: 750,
      slow1: SLOW.chance(0.075, 2.5, 60)
    }),

    unit("영원한", "핸콕(특강)", { atkSpeedBonus: 3.3, attackCycle: 0.74, stun1: STUN.chance(0.1, 2.75, 650), mana: 175, manaDuration: 4, manaRange: 750 }),
    unit("영원한", "테조로",   { atkSpeedBonus: 3.15, attackCycle: 0.70, stun1: STUN.chance(0.12, 2.4, 625), mana: 90, manaDuration: 2.4, atkSpeedBuff: 25, manaRange: 625 }),

    // BuffState(영원한)
    unit("영원한", "버기", { atkSpeedBuff: 65, slow: 25 }),
    unit("영원한", "미호크", { slow: 45 }),
    unit("영원한", "에이스", { slow: 45 }),
  ];
