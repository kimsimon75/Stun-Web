import { unit } from "../factory.js";

export const laboratoryUnits = [
    unit("연구소", "식량 보급", { manaRegen: 0.8 }),
    unit("연구소", "해상 디너", { healthRegen: 0.45 }),
    unit("연구소", "기후 변화", { slow: 10 }),
    unit("연구소", "냉철함(아오키지)", { slow: 6 }),
    unit("연구소", "신속함(키자루)", { atkSpeedBuff: 4 }),
  ];
