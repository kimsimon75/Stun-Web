import { unit } from "../factory.js";

export const fiveEldersUnits = [
  unit("오로성", "나스쥬로", {
    rawcode: "o032",
    slow: -15,
    atkSpeedBuff: -15,
    difficultyBuffs: {
      nightmare: { slow: -15, atkSpeedBuff: -15 },
      god: { slow: -10, atkSpeedBuff: -10 },
    },
  }),
  unit("오로성", "워큐리", {
    rawcode: null,
    magicDefenseBonus: 10,
    difficultyBuffs: {
      nightmare: { magicDefenseBonus: 10 },
      god: { magicDefenseBonus: 7 },
    },
  }),
  unit("오로성", "새턴", {
    rawcode: null,
    percentDamageReduction: 10,
    difficultyBuffs: {
      nightmare: { percentDamageReduction: 10 },
      god: { percentDamageReduction: 7 },
    },
  }),
];
