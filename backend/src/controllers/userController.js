const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// Obter perfil de usuário por ID
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        xp: true,
        level: true,
        coins: true,
        streak: true,
        maxStreak: true,
        createdAt: true,
        _count: {
          select: {
            habits: true,
            achievements: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Usuário não encontrado.",
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao buscar perfil do usuário.",
    });
  }
};

// Atualizar perfil do usuário
const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const userId = req.user.id;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(avatar && { avatar }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        xp: true,
        level: true,
        coins: true,
        streak: true,
        maxStreak: true,
      },
    });

    return res.json({
      success: true,
      message: "Perfil atualizado com sucesso!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao atualizar perfil.",
    });
  }
};

// Alterar senha
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: true,
        message: "Senha atual e nova senha são obrigatórias.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: true,
        message: "A nova senha deve ter no mínimo 6 caracteres.",
      });
    }

    // Buscar usuário com senha
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Verificar senha atual
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        error: true,
        message: "Senha atual incorreta.",
      });
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar senha
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return res.json({
      success: true,
      message: "Senha alterada com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao alterar senha.",
    });
  }
};

// Obter estatísticas do usuário
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar hábitos ativos
    const activeHabits = await prisma.habit.count({
      where: {
        userId,
        isActive: true,
      },
    });

    // Buscar total de conclusões
    const totalCompletions = await prisma.habitCompletion.count({
      where: {
        habit: {
          userId,
        },
      },
    });

    // Buscar conquistas desbloqueadas
    const unlockedAchievements = await prisma.userAchievement.count({
      where: { userId },
    });

    // Buscar total de conquistas disponíveis
    const totalAchievements = await prisma.achievement.count();

    // Calcular taxa de conclusão (últimos 7 dias)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const completionsLastWeek = await prisma.habitCompletion.count({
      where: {
        habit: {
          userId,
        },
        completedAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    const expectedCompletions = activeHabits * 7;
    const completionRate =
      expectedCompletions > 0
        ? Math.round((completionsLastWeek / expectedCompletions) * 100)
        : 0;

    return res.json({
      success: true,
      stats: {
        activeHabits,
        totalCompletions,
        unlockedAchievements,
        totalAchievements,
        completionRate,
        completionsLastWeek,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao buscar estatísticas.",
    });
  }
};

// Buscar ranking de usuários
const getLeaderboard = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const users = await prisma.user.findMany({
      take: parseInt(limit),
      orderBy: [{ xp: "desc" }, { level: "desc" }],
      select: {
        id: true,
        name: true,
        avatar: true,
        xp: true,
        level: true,
        streak: true,
      },
    });

    return res.json({
      success: true,
      leaderboard: users,
    });
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao buscar ranking.",
    });
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  changePassword,
  getUserStats,
  getLeaderboard,
};
