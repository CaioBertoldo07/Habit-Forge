const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Limpar conquistas existentes (opcional)
  await prisma.achievement.deleteMany({});

  // Criar conquistas iniciais
  const achievements = [
    // Conquistas de Hábitos
    {
      title: "Primeiro Passo",
      description: "Crie seu primeiro hábito",
      icon: "🎯",
      category: "Hábitos",
      requirement: 1,
      xpReward: 50,
    },
    {
      title: "Colecionador de Hábitos",
      description: "Crie 5 hábitos diferentes",
      icon: "📚",
      category: "Hábitos",
      requirement: 5,
      xpReward: 100,
    },
    {
      title: "Mestre dos Hábitos",
      description: "Crie 10 hábitos",
      icon: "🏆",
      category: "Hábitos",
      requirement: 10,
      xpReward: 200,
    },

    // Conquistas de Streak
    {
      title: "Consistência",
      description: "Alcance uma sequência de 3 dias",
      icon: "🔥",
      category: "Streak",
      requirement: 3,
      xpReward: 75,
    },
    {
      title: "Semana Perfeita",
      description: "Alcance uma sequência de 7 dias",
      icon: "⭐",
      category: "Streak",
      requirement: 7,
      xpReward: 150,
    },
    {
      title: "Imparável",
      description: "Alcance uma sequência de 30 dias",
      icon: "💎",
      category: "Streak",
      requirement: 30,
      xpReward: 500,
    },

    // Conquistas de Nível
    {
      title: "Novato",
      description: "Alcance o nível 5",
      icon: "🌱",
      category: "Nível",
      requirement: 5,
      xpReward: 100,
    },
    {
      title: "Intermediário",
      description: "Alcance o nível 10",
      icon: "🌿",
      category: "Nível",
      requirement: 10,
      xpReward: 200,
    },
    {
      title: "Experiente",
      description: "Alcance o nível 25",
      icon: "🌳",
      category: "Nível",
      requirement: 25,
      xpReward: 500,
    },
    {
      title: "Lendário",
      description: "Alcance o nível 50",
      icon: "👑",
      category: "Nível",
      requirement: 50,
      xpReward: 1000,
    },

    // Conquistas de Conclusões
    {
      title: "Primeira Vitória",
      description: "Complete seu primeiro hábito",
      icon: "✅",
      category: "Conclusões",
      requirement: 1,
      xpReward: 25,
    },
    {
      title: "Produtivo",
      description: "Complete 10 hábitos",
      icon: "💪",
      category: "Conclusões",
      requirement: 10,
      xpReward: 100,
    },
    {
      title: "Incansável",
      description: "Complete 50 hábitos",
      icon: "🚀",
      category: "Conclusões",
      requirement: 50,
      xpReward: 300,
    },
    {
      title: "Centurião",
      description: "Complete 100 hábitos",
      icon: "🏅",
      category: "Conclusões",
      requirement: 100,
      xpReward: 500,
    },
  ];

  // Inserir conquistas
  for (const achievement of achievements) {
    await prisma.achievement.create({
      data: achievement,
    });
  }

  console.log(`✅ ${achievements.length} conquistas criadas com sucesso!`);
}

main()
  .catch((e) => {
    console.error("❌ Erro ao fazer seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
