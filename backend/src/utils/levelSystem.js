/**
 * Sistema de Níveis e XP
 * Fórmula progressiva: XP necessário = 100 * nível * multiplicador
 */

// Calcular XP necessário para um nível específico
const getXPForLevel = (level) => {
  if (level <= 1) return 0;

  // Fórmula progressiva: cresce 15% a cada nível
  const baseXP = 100;
  const multiplier = 1.15;

  let totalXP = 0;
  for (let i = 2; i <= level; i++) {
    totalXP += Math.floor(baseXP * Math.pow(multiplier, i - 2));
  }

  return totalXP;
};

// Calcular nível baseado no XP total
const calculateLevel = (xp) => {
  let level = 1;
  let xpForNextLevel = getXPForLevel(2);

  while (xp >= xpForNextLevel && level < 100) {
    level++;
    xpForNextLevel = getXPForLevel(level + 1);
  }

  return level;
};

// Calcular XP atual no nível (para barra de progresso)
const getXPProgressInLevel = (totalXP, currentLevel) => {
  const xpForCurrentLevel = getXPForLevel(currentLevel);
  const xpForNextLevel = getXPForLevel(currentLevel + 1);
  const xpInLevel = totalXP - xpForCurrentLevel;
  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;

  return {
    current: xpInLevel,
    required: xpNeededForLevel,
    percentage: Math.floor((xpInLevel / xpNeededForLevel) * 100),
    total: totalXP,
    nextLevel: currentLevel + 1,
  };
};

// Recompensas por nível
const getLevelRewards = (level) => {
  const rewards = {
    coins: level * 50, // 50 coins por nível
    xpBonus: 0,
    title: null,
  };

  // Títulos especiais
  const titles = {
    1: "Novato",
    5: "Aprendiz",
    10: "Dedicado",
    15: "Comprometido",
    20: "Experiente",
    25: "Veterano",
    30: "Expert",
    40: "Mestre",
    50: "Lendário",
    75: "Épico",
    100: "Divino",
  };

  if (titles[level]) {
    rewards.title = titles[level];
  }

  // Bônus de XP a cada 10 níveis
  if (level % 10 === 0) {
    rewards.xpBonus = level * 10;
  }

  return rewards;
};

// Verificar se subiu de nível
const checkLevelUp = (oldXP, newXP) => {
  const oldLevel = calculateLevel(oldXP);
  const newLevel = calculateLevel(newXP);

  if (newLevel > oldLevel) {
    return {
      leveledUp: true,
      oldLevel,
      newLevel,
      levelsGained: newLevel - oldLevel,
      rewards: getLevelRewards(newLevel),
    };
  }

  return {
    leveledUp: false,
    oldLevel,
    newLevel: oldLevel,
  };
};

module.exports = {
  getXPForLevel,
  calculateLevel,
  getXPProgressInLevel,
  getLevelRewards,
  checkLevelUp,
};
