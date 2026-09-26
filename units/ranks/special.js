import { unit } from "../factory.js";
import { SLOW } from "../effects.js";

export const specialUnits = [
    // 기존
    unit("특별함", "나미", { atkSpeedBonus: 0.53, attackCycle: 1, slow2: SLOW.chance(0.1, 4, 5) }),

    // BuffState(특수함 -> 특별함 통일)
    unit("특별함", "스모커", { slow: 5 }),
    unit("특별함", "키드", { slow: 5 }),
    unit("특별함", "크로커다일", { slow: 5 }),
  ];
