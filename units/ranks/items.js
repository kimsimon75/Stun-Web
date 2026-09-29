import { unit } from "../factory.js";
import { STUN } from "../effects.js";

export const itemsUnits = [
    unit("아이템", "그린블러드", { rawcode: "A134", stun1: STUN.cooldown(3, 1.2, 825)}),

    // 아이템은 적용된 효과 능력 코드를 사용합니다. 획득용 코드와는 다릅니다.
    unit("아이템", "우타의 헤드셋", { rawcode: "A0KM", atkSpeedBuff: 12 }),
    unit("아이템", "불사조의 깃털", { rawcode: "A0NZ", healthRegen: 0.3 }),
    unit("아이템", "둔화의 지팡이", { rawcode: "A0O1", slow: 12 }),
    unit("아이템", "비구름생성기", { rawcode: null, /* 2.322 fix03_2에서 대응 아이템 미확정 */ slow: 12 }),
    unit("아이템", "거인족의 술잔", { rawcode: "A0O2", manaRegen: 0.5 }),
    unit("아이템", "가죽장갑", { rawcode: "A0O5", atkSpeedBuff: 4 }),
  ];
