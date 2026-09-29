import { unit } from "../factory.js";
import { STUN } from "../effects.js";

export const rareUnits = [
    // 기존
    unit("희귀함", "바제스",   { rawcode: "h01V", atkSpeedBonus: 1.3, attackCycle: 0.85, stun1: STUN.chance(0.1, 0.9, 500) }),
    unit("희귀함", "아오키지", { rawcode: "h02B", atkSpeedBonus: 1.3, attackCycle: 0.94, stun1: STUN.chance(0.1, 0.95, 405),slow: 10 }),
    unit("희귀함", "이완코브", { rawcode: "h02A", atkSpeedBonus: 1.3, attackCycle: 0.95, stun1: STUN.chance(0.07, 1.4, 500) }),
    unit("희귀함", "우솝",     { rawcode: "h02C", atkSpeedBonus: 1.3, attackCycle: 1.00, stun1: STUN.chance(0.1, 1.15, 485) }),
    unit("희귀함", "죠즈",     { rawcode: "h02E", atkSpeedBonus: 1.3, attackCycle: 0.97, stun1: STUN.chance(0.11, 0.9, 600) }),

    // BuffState
    unit("희귀함", "브룩", { rawcode: "h01N", atkSpeedBuff: 10 }),
    unit("희귀함", "슈가", { rawcode: "h027", manaRegen: 0.6 }),
    unit("희귀함", "키드", { rawcode: "h02D", slow: 15 }),
    unit("희귀함", "크로커다일", { rawcode: "h02H", slow: 15 }),
    unit("희귀함", "페로나", { rawcode: "h05K", slow: 20 }),
  ];
