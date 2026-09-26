import { unit } from "../factory.js";
import { STUN } from "../effects.js";

export const itemsUnits = [
    unit("아이템", "그린블러드", {stun1: STUN.cooldown(3, 1.2, 825)}),

    unit("아이템", "우타의 헤드셋", { atkSpeedBuff: 12 }),
    unit("아이템", "불사조의 깃털", { healthRegen: 0.3 }),
    unit("아이템", "둔화의 지팡이", { slow: 12 }),
    unit("아이템", "비구름생성기", { slow: 12 }),
    unit("아이템", "거인족의 술잔", { manaRegen: 0.5 }),
    unit("아이템", "가죽장갑", { atkSpeedBuff: 4 }),
  ];
