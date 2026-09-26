export const STUN = Object.freeze({
  none: () => ({ type: "none" }),
  chance: (p, dur, r) => ({ type: "chance", p, dur, r }),
  cooldown: (cd, dur, r) => ({ type: "cooldown", cd, dur, r}), // 블랙마리아 같은 케이스
});

export const SLOW = Object.freeze({
  none: () => ({ type: "none" }),
  chance: (p, dur, eff) => ({ type: "chance", p, dur, eff}),
   // 블랙마리아 같은 케이스
});
