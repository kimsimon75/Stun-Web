import { unit } from "../factory.js";
import { STUN, SLOW } from "../effects.js";

export const immortalUnits = [
    // 기존
    unit("불멸의", "거프",         { atkSpeedBonus: 3.3, attackCycle: 0.63, stun1: STUN.chance(0.1, 2.5, 500) }),
    unit("불멸의", "드래곤",       { atkSpeedBonus: 3.3, attackCycle: 0.61, stun1: STUN.chance(0.1, 3.0, 525), atkSpeedBuff: 20 }),
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

    unit("불멸의", "흰수염(약주)", { atkSpeedBonus: 3.3, attackCycle: 0.73, stun1: STUN.chance(0.05, 3.0, 700), mana: 115, manaDuration: 3 }),

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
  ];
