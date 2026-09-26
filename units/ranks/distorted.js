import { unit } from "../factory.js";
import { STUN, SLOW } from "../effects.js";

export const distortedUnits = [
    // 기존
    unit("왜곡됨", "블랙마리아", { atkSpeedBonus: 0.8, attackCycle: 0.84, stun1: STUN.cooldown(5, 3.5, 900) }),
    unit("왜곡됨", "에이스", { slow: 20 }),
    unit("왜곡됨", "퀸",         { atkSpeedBonus: 2.8, attackCycle: 0.85, stun1: STUN.chance(0.15, 0.95, 500), slow1: SLOW.chance(0.14, 2, 0), manaRegen: 1, healthRegen: 1 }),
    unit("왜곡됨", "페로나", { slow: 45 }),
  ];
