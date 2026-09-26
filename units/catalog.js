import { specialUnits } from "./ranks/special.js";
import { rareUnits } from "./ranks/rare.js";
import { legendaryUnits } from "./ranks/legendary.js";
import { hiddenUnits } from "./ranks/hidden.js";
import { transcendentUnits } from "./ranks/transcendent.js";
import { immortalUnits } from "./ranks/immortal.js";
import { eternalUnits } from "./ranks/eternal.js";
import { limitedUnits } from "./ranks/limited.js";
import { mysticUnits } from "./ranks/mystic.js";
import { distortedUnits } from "./ranks/distorted.js";
import { randomUnits } from "./ranks/random.js";
import { mutatedUnits } from "./ranks/mutated.js";
import { itemsUnits } from "./ranks/items.js";
import { laboratoryUnits } from "./ranks/laboratory.js";
import { navigationUnits } from "./ranks/navigation.js";
import { specialBuffsUnits } from "./ranks/special-buffs.js";

// 등급과 유닛의 기존 표시 순서를 유지합니다.
export const unitStat = {
  "특별함": specialUnits,
  "희귀함": rareUnits,
  "전설적인": legendaryUnits,
  "히든": hiddenUnits,
  "초월함": transcendentUnits,
  "불멸의": immortalUnits,
  "영원한": eternalUnits,
  "제한됨": limitedUnits,
  "신비함": mysticUnits,
  "왜곡됨": distortedUnits,
  "랜덤유닛": randomUnits,
  "변이": mutatedUnits,
  "아이템": itemsUnits,
  "연구소": laboratoryUnits,
  "항법": navigationUnits,
  "특수함": specialBuffsUnits,
};
