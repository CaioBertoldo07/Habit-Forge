const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Progresso diário (últimos 30 dias)
const getDailyProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Buscar conclusões agrupadas por dia
    const completions = await prisma.habitCompletion.findMany({
      where: {
        habit: {
          userId,
        },
        completedAt: {
          gte: startDate,
        },
      },
      include: {
        habit: {
          select: {
            title: true,
            category: true,
            xpReward: true,
            icon: true,
          },
        },
      },
      orderBy: {
        completedAt: "asc",
      },
    });

    // Agrupar por data
    const dailyData = {};
    completions.forEach((completion) => {
      const date = completion.completedAt.toISOString().split("T")[0];

      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          completions: 0,
          xpGained: 0,
          habits: [],
        };
      }

      dailyData[date].completions++;
      dailyData[date].xpGained += completion.habit.xpReward;
      dailyData[date].habits.push({
        title: completion.habit.title,
        icon: completion.habit.icon,
        category: completion.habit.category,
      });
    });

    // Converter para array e preencher dias vazios
    const result = [];
    for (let i = parseInt(days) - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      result.push(
        dailyData[dateStr] || {
          date: dateStr,
          completions: 0,
          xpGained: 0,
          habits: [],
        }
      );
    }

    return res.json({
      success: true,
      progress: result,
    });
  } catch (error) {
    console.error("Erro ao buscar progresso diário:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao buscar progresso diário.",
    });
  }
};

// Progresso semanal (últimas 12 semanas)
const getWeeklyProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { weeks = 12 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(weeks) * 7);

    const completions = await prisma.habitCompletion.findMany({
      where: {
        habit: {
          userId,
        },
        completedAt: {
          gte: startDate,
        },
      },
      include: {
        habit: {
          select: {
            xpReward: true,
          },
        },
      },
    });

    // Agrupar por semana
    const weeklyData = {};
    completions.forEach((completion) => {
      const date = new Date(completion.completedAt);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Domingo
      const weekKey = weekStart.toISOString().split("T")[0];

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = {
          weekStart: weekKey,
          completions: 0,
          xpGained: 0,
        };
      }

      weeklyData[weekKey].completions++;
      weeklyData[weekKey].xpGained += completion.habit.xpReward;
    });

    const result = Object.values(weeklyData).sort(
      (a, b) => new Date(a.weekStart) - new Date(b.weekStart)
    );

    return res.json({
      success: true,
      progress: result,
    });
  } catch (error) {
    console.error("Erro ao buscar progresso semanal:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao buscar progresso semanal.",
    });
  }
};

// Progresso mensal (último ano)
const getMonthlyProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { months = 12 } = req.query;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));

    const completions = await prisma.habitCompletion.findMany({
      where: {
        habit: {
          userId,
        },
        completedAt: {
          gte: startDate,
        },
      },
      include: {
        habit: {
          select: {
            xpReward: true,
          },
        },
      },
    });

    // Agrupar por mês
    const monthlyData = {};
    completions.forEach((completion) => {
      const date = new Date(completion.completedAt);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          completions: 0,
          xpGained: 0,
        };
      }

      monthlyData[monthKey].completions++;
      monthlyData[monthKey].xpGained += completion.habit.xpReward;
    });

    const result = Object.values(monthlyData).sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    return res.json({
      success: true,
      progress: result,
    });
  } catch (error) {
    console.error("Erro ao buscar progresso mensal:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao buscar progresso mensal.",
    });
  }
};

// Progresso específico de um hábito
const getHabitProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verificar se hábito pertence ao usuário
    const habit = await prisma.habit.findFirst({
      where: { id, userId },
    });

    if (!habit) {
      return res.status(404).json({
        error: true,
        message: "Hábito não encontrado.",
      });
    }

    // Total de conclusões
    const totalCompletions = await prisma.habitCompletion.count({
      where: { habitId: id },
    });

    // Conclusões nos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentCompletions = await prisma.habitCompletion.findMany({
      where: {
        habitId: id,
        completedAt: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        completedAt: "desc",
      },
    });

    // Calcular streak atual
    const allCompletions = await prisma.habitCompletion.findMany({
      where: { habitId: id },
      orderBy: {
        completedAt: "desc",
      },
    });

    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    let lastDate = null;

    allCompletions.forEach((completion) => {
      const completionDate = new Date(completion.completedAt);
      completionDate.setHours(0, 0, 0, 0);

      if (lastDate) {
        const daysDiff = Math.floor(
          (lastDate - completionDate) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === 0 || daysDiff === 1) {
          tempStreak++;
        } else {
          maxStreak = Math.max(maxStreak, tempStreak);
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }

      lastDate = completionDate;
    });

    maxStreak = Math.max(maxStreak, tempStreak);

    // Verificar se streak está ativo
    if (allCompletions.length > 0) {
      const lastCompletion = new Date(allCompletions[0].completedAt);
      lastCompletion.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const daysSinceLastCompletion = Math.floor(
        (today - lastCompletion) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastCompletion <= 1) {
        currentStreak = tempStreak;
      }
    }

    // Taxa de sucesso baseada na frequência
    let successRate = 0;
    const daysSinceCreated = Math.floor(
      (new Date() - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24)
    );

    if (habit.frequency === "daily" && daysSinceCreated > 0) {
      successRate = Math.round((totalCompletions / daysSinceCreated) * 100);
    } else if (habit.frequency === "weekly" && daysSinceCreated > 0) {
      const weeksSinceCreated = Math.ceil(daysSinceCreated / 7);
      successRate = Math.round((totalCompletions / weeksSinceCreated) * 100);
    }

    // Melhor dia da semana
    const dayCount = {};
    allCompletions.forEach((completion) => {
      const dayOfWeek = new Date(completion.completedAt).getDay();
      dayCount[dayOfWeek] = (dayCount[dayOfWeek] || 0) + 1;
    });

    const bestDay = Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0];
    const daysOfWeek = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];

    return res.json({
      success: true,
      progress: {
        habit: {
          id: habit.id,
          title: habit.title,
          icon: habit.icon,
          category: habit.category,
          frequency: habit.frequency,
          createdAt: habit.createdAt,
        },
        totalCompletions,
        recentCompletions: recentCompletions.length,
        currentStreak,
        maxStreak,
        successRate: Math.min(successRate, 100),
        bestDay: bestDay ? daysOfWeek[bestDay[0]] : null,
        lastCompletion: allCompletions[0]?.completedAt || null,
        recentHistory: recentCompletions.slice(0, 10),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar progresso do hábito:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao buscar progresso do hábito.",
    });
  }
};

// Heatmap de atividades (para calendário visual)
const getHeatmap = async (req, res) => {
  try {
    const userId = req.user.id;
    const { year = new Date().getFullYear() } = req.query;

    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const completions = await prisma.habitCompletion.findMany({
      where: {
        habit: {
          userId,
        },
        completedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Agrupar por data
    const heatmapData = {};
    completions.forEach((completion) => {
      const date = completion.completedAt.toISOString().split("T")[0];
      heatmapData[date] = (heatmapData[date] || 0) + 1;
    });

    // Converter para array de objetos
    const result = Object.entries(heatmapData).map(([date, count]) => ({
      date,
      count,
      level: count >= 5 ? 4 : count >= 3 ? 3 : count >= 2 ? 2 : 1,
    }));

    return res.json({
      success: true,
      heatmap: result,
    });
  } catch (error) {
    console.error("Erro ao buscar heatmap:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao buscar heatmap.",
    });
  }
};

// Dashboard completo (resumo de tudo)
const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        xp: true,
        level: true,
        coins: true,
        streak: true,
        maxStreak: true,
      },
    });

    // Total de hábitos
    const totalHabits = await prisma.habit.count({
      where: { userId },
    });

    const activeHabits = await prisma.habit.count({
      where: { userId, isActive: true },
    });

    // Total de conclusões
    const totalCompletions = await prisma.habitCompletion.count({
      where: {
        habit: {
          userId,
        },
      },
    });

    // Conclusões hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const completionsToday = await prisma.habitCompletion.count({
      where: {
        habit: {
          userId,
        },
        completedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Conclusões esta semana
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const completionsThisWeek = await prisma.habitCompletion.count({
      where: {
        habit: {
          userId,
        },
        completedAt: {
          gte: startOfWeek,
        },
      },
    });

    // Conquistas
    const totalAchievements = await prisma.achievement.count();
    const unlockedAchievements = await prisma.userAchievement.count({
      where: { userId },
    });

    // Categoria mais completada
    const completionsByCategory = await prisma.habitCompletion.groupBy({
      by: ["habitId"],
      _count: {
        id: true,
      },
      where: {
        habit: {
          userId,
        },
      },
    });

    const habits = await prisma.habit.findMany({
      where: { userId },
      select: {
        id: true,
        category: true,
      },
    });

    const categoryCount = {};
    completionsByCategory.forEach((item) => {
      const habit = habits.find((h) => h.id === item.habitId);
      if (habit) {
        categoryCount[habit.category] =
          (categoryCount[habit.category] || 0) + item._count.id;
      }
    });

    const topCategory = Object.entries(categoryCount).sort(
      (a, b) => b[1] - a[1]
    )[0];

    // XP até próximo nível
    const xpToNextLevel = user.level * 100 - user.xp;

    return res.json({
      success: true,
      summary: {
        user: {
          level: user.level,
          xp: user.xp,
          xpToNextLevel: xpToNextLevel > 0 ? xpToNextLevel : 0,
          coins: user.coins,
          currentStreak: user.streak,
          maxStreak: user.maxStreak,
        },
        habits: {
          total: totalHabits,
          active: activeHabits,
          inactive: totalHabits - activeHabits,
        },
        completions: {
          total: totalCompletions,
          today: completionsToday,
          thisWeek: completionsThisWeek,
        },
        achievements: {
          unlocked: unlockedAchievements,
          total: totalAchievements,
          percentage: Math.round(
            (unlockedAchievements / totalAchievements) * 100
          ),
        },
        topCategory: topCategory
          ? {
              name: topCategory[0],
              completions: topCategory[1],
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar resumo:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao buscar resumo.",
    });
  }
};

// Comparar períodos
const compareProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = "week" } = req.query; // week, month

    const now = new Date();
    let currentStart, currentEnd, previousStart, previousEnd;

    if (period === "week") {
      // Semana atual
      currentEnd = new Date(now);
      currentStart = new Date(now);
      currentStart.setDate(now.getDate() - 7);

      // Semana anterior
      previousEnd = new Date(currentStart);
      previousStart = new Date(currentStart);
      previousStart.setDate(currentStart.getDate() - 7);
    } else {
      // Mês atual
      currentEnd = new Date(now);
      currentStart = new Date(now);
      currentStart.setDate(now.getDate() - 30);

      // Mês anterior
      previousEnd = new Date(currentStart);
      previousStart = new Date(currentStart);
      previousStart.setDate(currentStart.getDate() - 30);
    }

    // Dados do período atual
    const currentCompletions = await prisma.habitCompletion.count({
      where: {
        habit: {
          userId,
        },
        completedAt: {
          gte: currentStart,
          lte: currentEnd,
        },
      },
    });

    const currentXP = await prisma.habitCompletion.findMany({
      where: {
        habit: {
          userId,
        },
        completedAt: {
          gte: currentStart,
          lte: currentEnd,
        },
      },
      include: {
        habit: {
          select: {
            xpReward: true,
          },
        },
      },
    });

    const currentXPTotal = currentXP.reduce(
      (sum, c) => sum + c.habit.xpReward,
      0
    );

    // Dados do período anterior
    const previousCompletions = await prisma.habitCompletion.count({
      where: {
        habit: {
          userId,
        },
        completedAt: {
          gte: previousStart,
          lte: previousEnd,
        },
      },
    });

    const previousXP = await prisma.habitCompletion.findMany({
      where: {
        habit: {
          userId,
        },
        completedAt: {
          gte: previousStart,
          lte: previousEnd,
        },
      },
      include: {
        habit: {
          select: {
            xpReward: true,
          },
        },
      },
    });

    const previousXPTotal = previousXP.reduce(
      (sum, c) => sum + c.habit.xpReward,
      0
    );

    // Calcular diferenças
    const completionsDiff = currentCompletions - previousCompletions;
    const xpDiff = currentXPTotal - previousXPTotal;
    const completionsChange =
      previousCompletions > 0
        ? Math.round((completionsDiff / previousCompletions) * 100)
        : 0;
    const xpChange =
      previousXPTotal > 0 ? Math.round((xpDiff / previousXPTotal) * 100) : 0;

    return res.json({
      success: true,
      comparison: {
        period,
        current: {
          completions: currentCompletions,
          xp: currentXPTotal,
          startDate: currentStart,
          endDate: currentEnd,
        },
        previous: {
          completions: previousCompletions,
          xp: previousXPTotal,
          startDate: previousStart,
          endDate: previousEnd,
        },
        change: {
          completions: completionsDiff,
          completionsPercentage: completionsChange,
          xp: xpDiff,
          xpPercentage: xpChange,
          trend:
            completionsDiff > 0
              ? "up"
              : completionsDiff < 0
              ? "down"
              : "stable",
        },
      },
    });
  } catch (error) {
    console.error("Erro ao comparar progresso:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao comparar progresso.",
    });
  }
};

// Análise por categorias
const getCategoryAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar todos os hábitos com conclusões
    const habits = await prisma.habit.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            completions: true,
          },
        },
      },
    });

    // Agrupar por categoria
    const categoryData = {};
    habits.forEach((habit) => {
      if (!categoryData[habit.category]) {
        categoryData[habit.category] = {
          category: habit.category,
          totalHabits: 0,
          activeHabits: 0,
          totalCompletions: 0,
          habits: [],
        };
      }

      categoryData[habit.category].totalHabits++;
      if (habit.isActive) {
        categoryData[habit.category].activeHabits++;
      }
      categoryData[habit.category].totalCompletions += habit._count.completions;
      categoryData[habit.category].habits.push({
        id: habit.id,
        title: habit.title,
        icon: habit.icon,
        completions: habit._count.completions,
      });
    });

    const result = Object.values(categoryData).sort(
      (a, b) => b.totalCompletions - a.totalCompletions
    );

    return res.json({
      success: true,
      categories: result,
    });
  } catch (error) {
    console.error("Erro ao analisar categorias:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao analisar categorias.",
    });
  }
};

module.exports = {
  getDailyProgress,
  getWeeklyProgress,
  getMonthlyProgress,
  getHabitProgress,
  getHeatmap,
  getDashboardSummary,
  compareProgress,
  getCategoryAnalysis,
};
