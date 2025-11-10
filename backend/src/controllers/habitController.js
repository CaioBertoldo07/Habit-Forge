const { PrismaClient } = require("@prisma/client");

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

// Marcar hábito como concluído
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

    // Criar conclusão
    const completion = await prisma.habitCompletion.create({
      data: {
        habitId: id,
        note,
      },
    });

    // Atualizar XP do usuário
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        xp: {
          increment: habit.xpReward,
        },
      },
    });

    // Calcular novo nível (a cada 100 XP = 1 nível)
    const newLevel = Math.floor(updatedUser.xp / 100) + 1;

    if (newLevel > updatedUser.level) {
      await prisma.user.update({
        where: { id: userId },
        data: { level: newLevel },
      });
    }

    // Emitir evento de WebSocket para atualização em tempo real
    const io = req.app.get("io");
    io.to(`user_${userId}`).emit("habit_completed", {
      habit,
      xpGained: habit.xpReward,
      newXp: updatedUser.xp,
      newLevel,
    });

    return res.json({
      success: true,
      message: "Hábito concluído! 🎉",
      completion,
      xpGained: habit.xpReward,
      newXp: updatedUser.xp,
      leveledUp: newLevel > updatedUser.level,
    });
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
