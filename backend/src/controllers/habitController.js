const { PrismaClient } = require("@prisma/client");
const { checkLevelUp, getXPProgressInLevel } = require("../utils/levelSystem");
const {
  updateUserStreak,
  getStreakXPBonus,
  getStreakMilestone,
} = require("../utils/streakSystem");
const { checkAndUnlockAchievements } = require("./achievementController");

const prisma = new PrismaClient();

// Criar novo hábito
const createHabit = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      frequency,
      goal,
      difficulty,
      color,
      icon,
    } = req.body;
    const userId = req.user.id;

    if (!title || !category || !frequency) {
      return res.status(400).json({
        error: true,
        message: "Título, categoria e frequência são obrigatórios.",
      });
    }

    // Calcular XP baseado na dificuldade
    const xpRewards = {
      easy: 10,
      medium: 20,
      hard: 30,
    };

    const habit = await prisma.habit.create({
      data: {
        title,
        description,
        category,
        frequency,
        goal: goal || 1,
        difficulty: difficulty || "medium",
        color: color || "#6366f1",
        icon: icon || "📝",
        xpReward: xpRewards[difficulty || "medium"],
        userId,
      },
    });

    // Verificar conquistas (criação de hábitos)
    await checkAndUnlockAchievements(userId);

    return res.status(201).json({
      success: true,
      message: "Hábito criado com sucesso!",
      habit,
    });
  } catch (error) {
    console.error("Erro ao criar hábito:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao criar hábito.",
    });
  }
};

// Listar hábitos do usuário
const getHabits = async (req, res) => {
  try {
    const userId = req.user.id;
    const { isActive, category } = req.query;

    const where = {
      userId,
      ...(isActive !== undefined && { isActive: isActive === "true" }),
      ...(category && { category }),
    };

    const habits = await prisma.habit.findMany({
      where,
      include: {
        _count: {
          select: {
            completions: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      success: true,
      habits,
    });
  } catch (error) {
    console.error("Erro ao buscar hábitos:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao buscar hábitos.",
    });
  }
};

// Obter hábito por ID
const getHabitById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const habit = await prisma.habit.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        completions: {
          orderBy: {
            completedAt: "desc",
          },
          take: 10,
        },
        _count: {
          select: {
            completions: true,
          },
        },
      },
    });

    if (!habit) {
      return res.status(404).json({
        error: true,
        message: "Hábito não encontrado.",
      });
    }

    return res.json({
      success: true,
      habit,
    });
  } catch (error) {
    console.error("Erro ao buscar hábito:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao buscar hábito.",
    });
  }
};

// Atualizar hábito
const updateHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const {
      title,
      description,
      category,
      frequency,
      goal,
      difficulty,
      color,
      icon,
      isActive,
    } = req.body;

    // Verificar se o hábito pertence ao usuário
    const existingHabit = await prisma.habit.findFirst({
      where: { id, userId },
    });

    if (!existingHabit) {
      return res.status(404).json({
        error: true,
        message: "Hábito não encontrado.",
      });
    }

    const habit = await prisma.habit.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(category && { category }),
        ...(frequency && { frequency }),
        ...(goal !== undefined && { goal }),
        ...(difficulty && { difficulty }),
        ...(color && { color }),
        ...(icon && { icon }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return res.json({
      success: true,
      message: "Hábito atualizado com sucesso!",
      habit,
    });
  } catch (error) {
    console.error("Erro ao atualizar hábito:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao atualizar hábito.",
    });
  }
};

// Deletar hábito
const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verificar se o hábito pertence ao usuário
    const habit = await prisma.habit.findFirst({
      where: { id, userId },
    });

    if (!habit) {
      return res.status(404).json({
        error: true,
        message: "Hábito não encontrado.",
      });
    }

    await prisma.habit.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: "Hábito deletado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao deletar hábito:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao deletar hábito.",
    });
  }
};

// Marcar hábito como concluído (VERSÃO MELHORADA)
const completeHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const userId = req.user.id;

    // Verificar se o hábito pertence ao usuário
    const habit = await prisma.habit.findFirst({
      where: { id, userId, isActive: true },
    });

    if (!habit) {
      return res.status(404).json({
        error: true,
        message: "Hábito não encontrado ou inativo.",
      });
    }

    // Verificar se já completou hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const completedToday = await prisma.habitCompletion.findFirst({
      where: {
        habitId: id,
        completedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (completedToday) {
      return res.status(400).json({
        error: true,
        message: "Você já completou este hábito hoje!",
      });
    }

    // Buscar usuário atual
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Atualizar streak
    const streakResult = await updateUserStreak(userId);
    const streakBonus = getStreakXPBonus(streakResult?.streak || 0);
    const streakMilestone = getStreakMilestone(streakResult?.streak || 0);

    // Calcular XP total (base + bônus de streak)
    const totalXP = habit.xpReward + streakBonus;

    // Criar conclusão
    const completion = await prisma.habitCompletion.create({
      data: {
        habitId: id,
        note,
      },
    });

    // Atualizar XP e coins do usuário
    const newTotalXP = currentUser.xp + totalXP;
    const coinsGained = Math.floor(totalXP / 10); // 1 coin a cada 10 XP

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        xp: newTotalXP,
        coins: {
          increment: coinsGained,
        },
      },
    });

    // Verificar se subiu de nível
    const levelResult = checkLevelUp(currentUser.xp, newTotalXP);

    if (levelResult.leveledUp) {
      // Atualizar nível no banco
      await prisma.user.update({
        where: { id: userId },
        data: {
          level: levelResult.newLevel,
          coins: {
            increment: levelResult.rewards.coins, // Recompensa por nível
          },
        },
      });
    }

    // Verificar e desbloquear conquistas
    const newAchievements = await checkAndUnlockAchievements(userId);

    // Calcular progresso no nível atual
    const xpProgress = getXPProgressInLevel(newTotalXP, levelResult.newLevel);

    // Preparar resposta
    const response = {
      success: true,
      message: "Hábito concluído! 🎉",
      completion,
      rewards: {
        xp: {
          base: habit.xpReward,
          bonus: streakBonus,
          total: totalXP,
        },
        coins: coinsGained,
        newTotalXP,
        newTotalCoins:
          updatedUser.coins +
          (levelResult.leveledUp ? levelResult.rewards.coins : 0),
      },
      streak: streakResult,
      streakMilestone,
      level: {
        current: levelResult.newLevel,
        leveledUp: levelResult.leveledUp,
        levelsGained: levelResult.levelsGained || 0,
        rewards: levelResult.leveledUp ? levelResult.rewards : null,
        progress: xpProgress,
      },
      achievements: {
        unlocked: newAchievements.length,
        new: newAchievements,
      },
    };

    // Emitir evento de WebSocket para atualização em tempo real
    const io = req.app.get("io");
    if (io) {
      io.to(`user_${userId}`).emit("habit_completed", response);

      // Eventos específicos
      if (levelResult.leveledUp) {
        io.to(`user_${userId}`).emit("level_up", {
          level: levelResult.newLevel,
          rewards: levelResult.rewards,
        });
      }

      if (newAchievements.length > 0) {
        io.to(`user_${userId}`).emit("achievements_unlocked", {
          achievements: newAchievements,
        });
      }

      if (streakMilestone) {
        io.to(`user_${userId}`).emit("streak_milestone", streakMilestone);
      }
    }

    return res.json(response);
  } catch (error) {
    console.error("Erro ao completar hábito:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao completar hábito.",
    });
  }
};

module.exports = {
  createHabit,
  getHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
  completeHabit,
};
