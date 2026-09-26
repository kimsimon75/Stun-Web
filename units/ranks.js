export const unitRates = {
    특별함: 0,
    희귀함: 1,
    전설적인: 2,
    히든: 3,
    변이: 4,
    초월함: 5,
    불멸의: 6,
    영원한: 7,
    제한됨: 8,
    신비함: 9,
    랜덤유닛: 10,
    왜곡됨: 11,

    // ✅ BuffState에 섞여있는 카테고리(유닛 등급이랑 별개지만 인덱스로 묶기 위해 추가)
    아이템: 12,
    연구소: 13,
    항법: 14,
    특수함: 15,
}

export const rankByIndex = (() => {
  const arr = [];
  for (const [rankName, idx] of Object.entries(unitRates)) {
    arr[idx] = rankName;   // idx가 숫자, rankName이 문자열 key
  }
  return Object.freeze(arr);
})();

export const idxToRank = (idx) => rankByIndex[idx] ?? null;
