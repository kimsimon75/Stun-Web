import { STUN, SLOW } from "./effects.js";

export const UNIT_DEFAULTS = Object.freeze({
  atkSpeedBonus: 1.0,
  attackCycle: 1.0,
  attackDelay: 0,

  stun1: STUN.none(),
  stun2: STUN.none(),
  slow1: SLOW.none(),
  slow2: SLOW.none(),

  mana: 0,
  manaDuration: 0,
  manaRange: 0,
  selfAtkSpeedBuff: 0,
  atkSpeedBuff: 0,
  manaSelfRegen: 0,

  healthRegen : 0,
  manaRegen : 0,

  slow: 0,
  Check: 0,

  StunCalCulate: 0,
  SlowCalculate: 0,
  EarthCalculate: 0,
});

export const RANK_DEFAULTS = Object.freeze({
  "특별함": {},
  "희귀함":   { atkSpeedBonus: 1.3 },
  "전설적인": { /* atkSpeedBonus: 2.95 같은 걸 여기에 둘 수도 있음 */ },
  "히든":     { },
  "초월함":   { },
  "불멸의":   { },
  "영원한":   { },
  "제한됨":   { },
  "신비함":   { },
  "왜곡됨":   { },
});
