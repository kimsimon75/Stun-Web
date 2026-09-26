import { unitRates } from "./ranks.js";

export function SortFunction(a, b) {

  const nameCmp = String(a.name).localeCompare(String(b.name), "ko");
  if (nameCmp !== 0) return nameCmp;

  const ra = unitRates[a.rank] ?? 9999;
  const rb = unitRates[b.rank] ?? 9999;
  if (ra !== rb) return rb - ra;

  const s2a = slowValue(a.slow2), s2b = slowValue(b.slow2);
  if(s2b !== s2a) return s2b - s2a; // 이감2 내림차순

  const s1a = slowValue(a.slow1), s1b = slowValue(b.slow1);
  if (s1a !== s1b) return s1b - s1a; // 이감1 큰 게 위면 내림차순 (원하면 반대로)

}

function slowValue(slowObj) {
  if (!slowObj || slowObj.type === "none") return 0;
  return slowObj.eff ?? slowObj.value ?? 0;
}
