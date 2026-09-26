import { unitRates, rankByIndex } from "./ranks.js";
import { unitStat } from "./catalog.js";

export function findUnitPos(rank, name) {
  const sortCount = unitRates[rank];
  if (sortCount == null) return null;           // unitRates에 없는 등급

  const arr = unitStat[rank];
  if (!Array.isArray(arr)) return null;         // unitStat에 없는 등급

  const unitCount = arr.findIndex(u => u.name === name);
  if (unitCount === -1) return null;            // 그 등급에 그 이름 없음

  return { sortCount, unitCount };
}

export const unitsByRankIndex = (() => {
  const arr = [];
  for (let i = 0; i < rankByIndex.length; i++) {
    const rankName = rankByIndex[i];
    arr[i] = rankName ? (unitStat[rankName] ?? []) : [];
  }
  return Object.freeze(arr);
})();

export function getUnits(rankIndex) {
  return unitsByRankIndex[rankIndex] ?? [];
}

export function getUnit(rankIndex, unitIndex) {
  const list = getUnits(rankIndex);
  return list[unitIndex] ?? null;
}

export function getUnitCount(rankIndex) {
  return getUnits(rankIndex).length;
}

export function findUnit(rank, name) {
  const list = unitStat[rank];
  if (!list) return null;
  return list.find(u => u.name === name) ?? null;
}
