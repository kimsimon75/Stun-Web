import { unit } from "../factory.js";
import { STUN, SLOW } from "../effects.js";

export const mysticUnits = [
    // 기존
    unit("신비함", "K",         { rawcode: "h06U", atkSpeedBonus: 3.3,  attackCycle: 0.58, stun1: STUN.chance(0.03, 3.0, 460) }),
    unit("신비함", "고죠 사토루", { rawcode: "h09M", rawcodeRequiresState: true, atkSpeedBonus: 3.3,  attackCycle: 1.01, stun1: STUN.chance(0.1, 2.0, 600), mana: 185, manaDuration: 5, manaRange: NaN, slow2: SLOW.chance(0.1, 2, 20) }),
    unit("신비함", "나루토",     { rawcode: "h06V", atkSpeedBonus: 3.05, attackCycle: 0.50, stun1: STUN.chance(0.05, 2.85, 600) }),
    unit("신비함", "미나토",     { rawcode: "h09W", atkSpeedBonus: 3.42, attackCycle: 0.73, stun1: STUN.chance(0.05, 3.0, 600), stun2: STUN.chance(0.15, 2.75, 525)}),
    unit("신비함", "타츠마키",   { rawcode: "h0BC", atkSpeedBonus: 3.3,  attackCycle: 0.79, stun1: STUN.chance(0.1425, 1.75, 525), slow: 50 }),

    unit("신비함", "요우무", { rawcode: "h0CC", atkSpeedBonus: 3.3, attackCycle: 0.71, slow2: SLOW.chance(0.1, 3, 50) }),

    // BuffState(신비함)
    unit("신비함", "아냐 포저", { rawcode: "h08M", atkSpeedBuff: 30, manaRegen: 1.75, healthRegen: 2, slow: 40 }),
    unit("신비함", "키쿄우", { rawcode: null, /* 2.322 fix03_2에서 대응 유닛 미확정 */ manaRegen: 1.5, healthRegen: 1.5 }),
    unit("신비함", "사토루", { rawcode: "h09M", rawcodeRequiresState: true, slow: 30 }),
    unit("신비함", "히그마", { rawcode: "h0AC", slow: 30 }),
    unit("신비함", "쿠치키 뱌쿠야", { rawcode: "h08I", slow: 35 }),
    unit("신비함", "엘리자베스", { rawcode: "h06Z", slow: 20 }),
  ];
