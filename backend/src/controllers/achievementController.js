const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Listar todas as conquistas disponíveis
const getAllAchievements = async (req, res) => {
  try {
    const userId = req.user.id;

    const achievements = await prisma.achievement.findMany({
      include: {
        users: {
          where: {
            userId,
          },
          select: {
            unlockedAt: true,
          },
        },
      },
      orderBy: {
        requirement: "asc",
      },
    });

    // Formatar resposta
    const formattedAchievements = achievements.map((achievement) => ({
      ...achievement,
      unlocked: achievement.users.length > 0,
      unlockedAt: achievement.users[0]?.unlockedAt || null,
      users: undefined,
    }));

    return res.json({
      success: true,
      achievements: formattedAchievements,
    });
  } catch (error) {
    console.error("Erro ao buscar conquistas:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao buscar conquistas.",
    });
  }
};

// Listar conquistas do usuário
const getUserAchievements = async (req, res) => {
  try {
    const userId = req.user.id;

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: {
        unlockedAt: "desc",
      },
    });

    return res.json({
      success: true,
      achievements: userAchievements,
    });
  } catch (error) {
    console.error("Erro ao buscar conquistas do usuário:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao buscar conquistas do usuário.",
    });
  }
};

// Criar nova conquista (admin)
const createAchievement = async (req, res) => {
  try {
    const { title, description, icon, category, requirement, xpReward } =
      req.body;

    if (!title || !description || !category || !requirement) {
      return res.status(400).json({
        error: true,
        message: "Título, descrição, categoria e requisito são obrigatórios.",
      });
    }

    const achievement = await prisma.achievement.create({
      data: {
        title,
        description,
        icon: icon || "🏆",
        category,
        requirement,
        xpReward: xpReward || 50,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Conquista criada com sucesso!",
      achievement,
    });
  } catch (error) {
    console.error("Erro ao criar conquista:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao criar conquista.",
    });
  }
};

// Verificar e desbloquear conquistas automaticamente
const checkAndUnlockAchievements = async (userId) => {
  try {
    // Buscar estatísticas do usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        habits: true,
        achievements: {
          include: {
            achievement: true,
          },
        },
      },
    });

    // Total de conclusões
    const totalCompletions = await prisma.habitCompletion.count({
      where: {
        habit: {
          userId,
        },
      },
    });

    // Buscar conquistas ainda não desbloqueadas
    const unlockedIds = user.achievements.map((ua) => ua.achievement.id);
    const availableAchievements = await prisma.achievement.findMany({
      where: {
        id: {
          notIn: unlockedIds,
        },
      },
    });

    const newlyUnlocked = [];

    for (const achievement of availableAchievements) {
      let shouldUnlock = false;

      // Verificar condições baseadas na categoria
      switch (achievement.category) {
        case "Hábitos":
          if (user.habits.length >= achievement.requirement) {
            shouldUnlock = true;
          }
          break;

        case "Streak":
          if (user.streak >= achievement.requirement) {
            shouldUnlock = true;
          }
          break;

        case "Nível":
          if (user.level >= achievement.requirement) {
            shouldUnlock = true;
          }
          break;

        case "Conclusões":
          if (totalCompletions >= achievement.requirement) {
            shouldUnlock = true;
          }
          break;
      }

      // Desbloquear conquista
      if (shouldUnlock) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
          },
        });

        // Adicionar XP bônus
        await prisma.user.update({
          where: { id: userId },
          data: {
            xp: {
              increment: achievement.xpReward,
            },
          },
        });

        newlyUnlocked.push(achievement);
      }
    }

    return newlyUnlocked;
  } catch (error) {
    console.error("Erro ao verificar conquistas:", error);
    return [];
  }
};

module.exports = {
  getAllAchievements,
  getUserAchievements,
  createAchievement,
  checkAndUnlockAchievements,
};
