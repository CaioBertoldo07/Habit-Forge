const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Sistema de Streak (Sequências)
 * Atualiza e gerencia a sequência de dias consecutivos do usuário
 */

// Verificar e atualizar streak do usuário
const updateUserStreak = async (userId) => {
  try {
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        streak: true,
        maxStreak: true,
        updatedAt: true,
      },
    });

    if (!user) return null;

    // Buscar última conclusão
    const lastCompletion = await prisma.habitCompletion.findFirst({
      where: {
        habit: {
          userId,
        },
      },
      orderBy: {
        completedAt: "desc",
      },
    });

    if (!lastCompletion) {
      // Primeiro hábito concluído
      await prisma.user.update({
        where: { id: userId },
        data: {
          streak: 1,
          maxStreak: Math.max(1, user.maxStreak),
        },
      });
      return {
        streak: 1,
        maxStreak: Math.max(1, user.maxStreak),
        status: "started",
      };
    }

    // Calcular diferença de dias
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastCompletionDate = new Date(lastCompletion.completedAt);
    lastCompletionDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
      (today - lastCompletionDate) / (1000 * 60 * 60 * 24)
    );

    let newStreak = user.streak;
    let status = "maintained";

    if (daysDiff === 0) {
      // Mesma data - mantém streak
      status = "same_day";
    } else if (daysDiff === 1) {
      // Dia consecutivo - aumenta streak
      newStreak = user.streak + 1;
      status = "increased";
    } else {
      // Quebrou a sequência
      newStreak = 1;
      status = "broken";
    }

    const newMaxStreak = Math.max(newStreak, user.maxStreak);

    // Atualizar usuário
    await prisma.user.update({
      where: { id: userId },
      data: {
        streak: newStreak,
        maxStreak: newMaxStreak,
      },
    });

    return {
      streak: newStreak,
      maxStreak: newMaxStreak,
      status,
      daysGained: status === "increased" ? 1 : 0,
      broken: status === "broken",
      isRecord: newStreak === newMaxStreak && status === "increased",
    };
  } catch (error) {
    console.error("Erro ao atualizar streak:", error);
    return null;
  }
};

// Verificar se usuário perdeu o streak (executar diariamente via cron)
const checkExpiredStreaks = async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 59, 999);

    // Buscar usuários com streak > 0
    const users = await prisma.user.findMany({
      where: {
        streak: {
          gt: 0,
        },
      },
      include: {
        habits: {
          include: {
            completions: {
              orderBy: {
                completedAt: "desc",
              },
              take: 1,
            },
          },
        },
      },
    });

    const expiredUsers = [];

    for (const user of users) {
      // Verificar se completou algo ontem ou hoje
      const hasRecentCompletion = user.habits.some((habit) => {
        if (habit.completions.length === 0) return false;

        const lastCompletion = new Date(habit.completions[0].completedAt);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        yesterday.setHours(0, 0, 0, 0);

        return lastCompletion >= yesterday;
      });

      if (!hasRecentCompletion) {
        // Resetar streak
        await prisma.user.update({
          where: { id: user.id },
          data: { streak: 0 },
        });

        expiredUsers.push(user.id);
      }
    }

    return {
      checked: users.length,
      expired: expiredUsers.length,
      users: expiredUsers,
    };
  } catch (error) {
    console.error("Erro ao verificar streaks expirados:", error);
    return null;
  }
};

// Calcular bônus de XP baseado no streak
const getStreakXPBonus = (streak) => {
  if (streak < 3) return 0;
  if (streak < 7) return 5;
  if (streak < 14) return 10;
  if (streak < 30) return 20;
  if (streak < 60) return 35;
  if (streak < 100) return 50;
  return 75;
};

// Obter milestone de streak (conquistas especiais)
const getStreakMilestone = (streak) => {
  const milestones = {
    3: { emoji: "🔥", message: "Sequência de 3 dias!" },
    7: { emoji: "⭐", message: "Uma semana inteira!" },
    14: { emoji: "💪", message: "2 semanas de dedicação!" },
    30: { emoji: "💎", message: "1 mês imparável!" },
    60: { emoji: "👑", message: "2 meses de consistência!" },
    90: { emoji: "🏆", message: "3 meses lendários!" },
    100: { emoji: "🎖️", message: "100 dias - Você é incrível!" },
    365: { emoji: "🌟", message: "1 ANO COMPLETO!" },
  };

  return milestones[streak] || null;
};

module.exports = {
  updateUserStreak,
  checkExpiredStreaks,
  getStreakXPBonus,
  getStreakMilestone,
};
