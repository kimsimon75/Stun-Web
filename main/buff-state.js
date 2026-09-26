import { Var } from "../import.js";

export function BuffAdd(checked, item) {

    Var.speedBonusEx += checked ? item.atkSpeedBuff : -item.atkSpeedBuff;
    Var.manaRegen += checked ? item.manaRegen : -item.manaRegen;
    Var.healthRegen += checked ? item.healthRegen : -item.healthRegen;
    Var.speedDebuff += checked ? item.slow : -item.slow;
    item.Check = checked ? 1 : 0;

}
