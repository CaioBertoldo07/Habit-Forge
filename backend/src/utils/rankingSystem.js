// backend/src/utils/rankingSystem.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Sistema de Ligas/Divisões baseado em XP
 */
const LEAGUES = [
  { name: "Bronze", minXP: 0, maxXP: 499, color: "#cd7f32", icon: "🥉" },
  { name: "Prata", minXP: 500, maxXP: 999, color: "#c0c0c0", icon: "🥈" },
  { name: "Ouro", minXP: 1000, maxXP: 1999, color: "#ffd700", icon: "🥇" },
  { name: "Platina", minXP: 2000, maxXP: 3999, color: "#e5e4e2", icon: "💎" },
  { name: "Diamante", minXP: 4000, maxXP: 7999, color: "#b9f2ff", icon: "💠" },
  { name: "Mestre", minXP: 8000, maxXP: 15999, color: "#9d00ff", icon: "👑" },
  {
    name: "Lendário",
    minXP: 16000,
    maxXP: Infinity,
    color: "#ff6b6b",
    icon: "⚡",
  },
];

/**
 * Obter liga baseado no XP total
 */
const getLeague = (xp) => {
  return (
    LEAGUES.find((league) => xp >= league.minXP && xp <= league.maxXP) ||
    LEAGUES[0]
  );
};

/**
 * Obter ranking semanal completo
 */
const getWeeklyRanking = async (limit = 50) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        avatar: true,
        xp: true,
        xpWeek: true,
        level: true,
        streak: true,
      },
      orderBy: [{ xpWeek: "desc" }, { xp: "desc" }],
      take: limit,
    });

    return users.map((user, index) => ({
      ...user,
      position: index + 1,
      league: getLeague(user.xp),
    }));
  } catch (error) {
    console.error("Erro ao buscar ranking semanal:", error);
    return [];
  }
};

/**
 * Obter posição de um usuário específico
 */
const getUserRankingPosition = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        avatar: true,
        xp: true,
        xpWeek: true,
        level: true,
        streak: true,
      },
    });

    if (!user) return null;

    // Contar quantos usuários têm mais XP semanal
    const usersAhead = await prisma.user.count({
      where: {
        OR: [
          { xpWeek: { gt: user.xpWeek } },
          {
            xpWeek: user.xpWeek,
            xp: { gt: user.xp },
          },
        ],
      },
    });

    return {
      ...user,
      position: usersAhead + 1,
      league: getLeague(user.xp),
    };
  } catch (error) {
    console.error("Erro ao buscar posição do usuário:", error);
    return null;
  }
};

/**
 * Resetar XP semanal de todos os usuários (executar toda segunda-feira)
 */
const resetWeeklyXP = async () => {
  try {
    console.log("🔄 Iniciando reset de XP semanal...");

    const result = await prisma.user.updateMany({
      data: {
        xpWeek: 0,
        weekStartDate: new Date(),
      },
    });

    console.log(`✅ XP semanal resetado para ${result.count} usuários`);
    return result;
  } catch (error) {
    console.error("❌ Erro ao resetar XP semanal:", error);
    throw error;
  }
};

/**
 * Atualizar XP semanal de um usuário
 */
const updateWeeklyXP = async (userId, xpGained) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        xpWeek: {
          increment: xpGained,
        },
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        xp: true,
        xpWeek: true,
        level: true,
        streak: true,
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Erro ao atualizar XP semanal:", error);
    return null;
  }
};

/**
 * Obter ranking por liga
 */
const getRankingByLeague = async (leagueName) => {
  try {
    const league = LEAGUES.find((l) => l.name === leagueName);
    if (!league) return [];

    const users = await prisma.user.findMany({
      where: {
        xp: {
          gte: league.minXP,
          lte: league.maxXP === Infinity ? undefined : league.maxXP,
        },
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        xp: true,
        xpWeek: true,
        level: true,
        streak: true,
      },
      orderBy: [{ xpWeek: "desc" }, { xp: "desc" }],
      take: 50,
    });

    return users.map((user, index) => ({
      ...user,
      position: index + 1,
      league: getLeague(user.xp),
    }));
  } catch (error) {
    console.error("Erro ao buscar ranking por liga:", error);
    return [];
  }
};

module.exports = {
  LEAGUES,
  getLeague,
  getWeeklyRanking,
  getUserRankingPosition,
  resetWeeklyXP,
  updateWeeklyXP,
  getRankingByLeague,
};
