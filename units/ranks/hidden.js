import { unit } from "../factory.js";
import { STUN, SLOW } from "../effects.js";

export const hiddenUnits = [
    // 기존
    unit("히든", "방주맥심", { rawcode: "h03X", atkSpeedBonus: 2.6, attackCycle: 0.64, slow2: SLOW.chance(0.14, 3, 30) }),
    unit("히든", "봉쿠레",     { rawcode: "h03O", atkSpeedBonus: 2.6, attackCycle: 0.94, stun1: STUN.chance(0.12, 1.65, 500) }),
    unit("히든", "써니호",     { rawcode: "h03L", atkSpeedBonus: 2.6, attackCycle: 0.45, stun1: STUN.chance(0.1, 1.4, 600) }),
    unit("히든", "아오키지",   { rawcode: "h041", atkSpeedBonus: 2.6, attackCycle: 0.79, stun1: STUN.chance(0.1, 1.7, 415), slow: 35 }),
    unit("히든", "이완코브",   { rawcode: "h03Y", atkSpeedBonus: 2.6, attackCycle: 0.87, stun1: STUN.chance(0.11, 1.65, 500) }),
    unit("히든", "피셔타이거", { rawcode: "h047", atkSpeedBonus: 2.6, attackCycle: 0.49, stun1: STUN.chance(0.1, 2.0, 515) }),

    unit("히든", "아카이누", { rawcode: "h03Z", atkSpeedBonus: 2.6, attackCycle: 0.75, slow2: SLOW.chance(0.16, 2, 10) }),
    unit("히든", "료쿠규",   { rawcode: "h03N", atkSpeedBonus: 2.6, attackCycle: 0.95, slow2: SLOW.chance(0.08, 3, 20) }),

    // BuffState(히든)
    unit("히든", "발라티에", { rawcode: "h03P", atkSpeedBuff: 22 }),
    unit("히든", "코알라", { rawcode: "h03V", manaRegen: 3.25 }),
    unit("히든", "모비딕 호", { rawcode: "h03Q", healthRegen: 1.25, slow: 40 }),
    unit("히든", "사보", { rawcode: "h03M", slow: 25 }),
  ];
