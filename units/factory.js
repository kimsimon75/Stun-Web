import { UNIT_DEFAULTS, RANK_DEFAULTS } from "./defaults.js";

export function unit(rank, name, patch = {}) {
  const base = { ...UNIT_DEFAULTS, ...(RANK_DEFAULTS[rank] ?? {}) };

  // patch는 얕게 덮고, stun 객체는 통째로 교체되는 게 맞음
  const u = { ...base, rank, name, ...patch };
  if (patch.stun1) u.stun1 = patch.stun1;
  if (patch.stun2) u.stun2 = patch.stun2;
  if (patch.slow1) u.slow1 = patch.slow1;
  if (patch.slow2) u.slow2 = patch.slow2;

  return u;
}
