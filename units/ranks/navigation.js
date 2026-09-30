import { STUN } from "../effects.js";
import { unit } from "../factory.js";

export const navigationUnits = [
    unit("항법", "레오(패왕의 길)", { rawcode: "h0C8", slow: 10 }),
    unit("항법", "레오(계엄령)", { rawcode: "h0C8", stun1: STUN.cooldown(4, 1.6, 650), slow: 20 }),
    unit("항법", "로얄로더", { rawcode: "A0IW", atkSpeedBuff: 25 }),
  ];
