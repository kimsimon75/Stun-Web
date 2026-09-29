import { unit } from "../factory.js";

export const laboratoryUnits = [
    unit("연구소", "식량 보급", { rawcode: "Rhpt", /* 적용 능력: A0PB */ manaRegen: 0.8 }),
    unit("연구소", "해상 디너", { rawcode: "Rhgb", /* 적용 능력: A0PA */ healthRegen: 0.45 }),
    unit("연구소", "기후 변화", { rawcode: "Rhfc", /* 적용 능력: A0P9 */ slow: 10 }),
    // 두 효과는 연구 완료가 아니라 해군대장 처치 시 LogPoseUnit에 부여됩니다.
    unit("연구소", "냉철함(아오키지)", { rawcode: "A0KY", slow: 6 }),
    unit("연구소", "신속함(키자루)", { rawcode: "A0KX", atkSpeedBuff: 4 }),
  ];
