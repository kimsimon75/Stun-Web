import { refreshStunTable } from "./stun-table.js";
import { refreshSlowTable } from "./slow-table.js";
import { Var, Func } from "../import.js";

export function CountOn() {

    Var.m_god = Math.max(Math.min(Func.RoundX(484 - 3.875*Var.speedDebuff, 3), Var.max_move), Var.min_move);
    Var.m_nightmare = Math.max(Math.min(Func.RoundX(484 - 3.875*Var.speedDebuff, 3), Var.max_move), Var.min_move);

    if (document.getElementById("container1") != null)
    {
        refreshStunTable();
    }
    if (document.getElementById("container2") != null) {
        refreshSlowTable();
    }

    Func.SetElemental();

}
