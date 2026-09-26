import { refreshStunTable } from "./stun-table.js";
import { refreshSlowTable } from "./slow-table.js";
import { Var, Func, Unit } from "../import.js";

export function CountOn() {

    Var.m_god = Math.max(Math.min(Func.RoundX(484 - 3.875*Var.speedDebuff, 3), Var.max_move), Var.min_move);
    Var.m_nightmare = Math.max(Math.min(Func.RoundX(484 - 3.875*Var.speedDebuff, 3), Var.max_move), Var.min_move);

    const ranges = Unit.allUnits.filter(u => u.Check > 0).flatMap(u => {
        const position = Unit.findUnitPos(u.rank, u.name);
        if (!position) return [];
        return [u.stun1.r, u.stun2.r, u.manaRange]
            .filter(range => Number.isFinite(range) && range > 0)
            .map(range => [position.sortCount, position.unitCount, range]);
    }).sort((a, b) => a[2] - b[2]);
    Var.Sort.splice(0, Var.Sort.length, ...ranges);

    Var.totalStun = Unit.allUnits.reduce((total, u) => {
        const value = Unit.findUnit(u.rank, u.name)?.StunCalCulate ?? 0;
        return total + (u.Check > 0 ? value * u.Check : 0);
    }, 0);

    if (document.getElementById("container1") != null)
    {
        refreshStunTable();
    }
    if (document.getElementById("container2") != null) {
        refreshSlowTable();
    }

    Func.SetElemental();

}
