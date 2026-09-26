import { unitStat } from "./catalog.js";
import { SortFunction } from "./sorting.js";

export const allUnits = Object.entries(unitStat).flatMap(([rank, arr]) =>
arr.map(u => ({ ...u, rank }))   // rank가 원래 없으니까 붙임
);

allUnits.sort((a, b) => {

return SortFunction(a, b);
});
