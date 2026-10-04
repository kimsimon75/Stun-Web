export function getDifficultyEffect(unit, difficulty, field) {
  return unit?.difficultyBuffs?.[difficulty]?.[field] ?? unit?.[field] ?? 0;
}

export const MAGIC_DEFENSE_BY_DIFFICULTY = Object.freeze({
  nightmare: 10,
  god: 5,
});

export function applyFiveElderPercentDamageEffect({
  damageType,
  damageMultiplier,
  elder,
  difficulty,
}) {
  if (damageType === "마법") {
    const baseMagicDefense = MAGIC_DEFENSE_BY_DIFFICULTY[difficulty] ?? 0;
    const warcuryBonus = elder?.name === "워큐리"
      ? getDifficultyEffect(elder, difficulty, "magicDefenseBonus")
      : 0;
    return damageMultiplier * (1 - (baseMagicDefense + warcuryBonus) / 100);
  }

  if (elder?.name === "새턴") {
    const reduction = getDifficultyEffect(elder, difficulty, "percentDamageReduction");
    return damageMultiplier * (1 - reduction / 100);
  }

  return damageMultiplier;
}
