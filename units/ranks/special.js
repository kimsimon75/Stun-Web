import { unit } from "../factory.js";
import { SLOW } from "../effects.js";

export const specialUnits = [
    // 기존
    unit("특별함", "나미", { rawcode: "h00P", atkSpeedBonus: 0.53, attackCycle: 1, slow2: SLOW.chance(0.1, 4, 5) }),

    // BuffState(특수함 -> 특별함 통일)
    unit("특별함", "스모커", { rawcode: "h01F", slow: 5 }),
    unit("특별함", "키드", { rawcode: "h00Y", slow: 5 }),
    unit("특별함", "크로커다일", { rawcode: "h01A", slow: 5 }),
  ];
