const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Limpar conquistas existentes (opcional)
  await prisma.achievement.deleteMany({});

  // Criar conquistas iniciais
  const achievements = [
    // ============ Conquistas de Hábitos ============
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
    {
      title: "Arsenal Completo",
      description: "Crie 20 hábitos",
      icon: "⚔️",
      category: "Hábitos",
      requirement: 20,
      xpReward: 500,
    },

    // ============ Conquistas de Streak ============
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
      title: "Duas Semanas Forte",
      description: "Alcance uma sequência de 14 dias",
      icon: "💪",
      category: "Streak",
      requirement: 14,
      xpReward: 300,
    },
    {
      title: "Imparável",
      description: "Alcance uma sequência de 30 dias",
      icon: "💎",
      category: "Streak",
      requirement: 30,
      xpReward: 500,
    },
    {
      title: "Lenda Viva",
      description: "Alcance uma sequência de 60 dias",
      icon: "👑",
      category: "Streak",
      requirement: 60,
      xpReward: 1000,
    },
    {
      title: "Imortal",
      description: "Alcance uma sequência de 100 dias",
      icon: "🎖️",
      category: "Streak",
      requirement: 100,
      xpReward: 2000,
    },

    // ============ Conquistas de Nível ============
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
      title: "Avançado",
      description: "Alcance o nível 15",
      icon: "🌳",
      category: "Nível",
      requirement: 15,
      xpReward: 300,
    },
    {
      title: "Experiente",
      description: "Alcance o nível 25",
      icon: "🦅",
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
    {
      title: "Ascendido",
      description: "Alcance o nível 75",
      icon: "✨",
      category: "Nível",
      requirement: 75,
      xpReward: 2000,
    },
    {
      title: "Divino",
      description: "Alcance o nível 100",
      icon: "🌟",
      category: "Nível",
      requirement: 100,
      xpReward: 5000,
    },

    // ============ Conquistas de Conclusões ============
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
      title: "Dedicado",
      description: "Complete 25 hábitos",
      icon: "⚡",
      category: "Conclusões",
      requirement: 25,
      xpReward: 200,
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
    {
      title: "Máquina",
      description: "Complete 250 hábitos",
      icon: "🤖",
      category: "Conclusões",
      requirement: 250,
      xpReward: 1000,
    },
    {
      title: "Lenda das Lendas",
      description: "Complete 500 hábitos",
      icon: "🏆",
      category: "Conclusões",
      requirement: 500,
      xpReward: 2500,
    },
    {
      title: "Conquistador Supremo",
      description: "Complete 1000 hábitos",
      icon: "💫",
      category: "Conclusões",
      requirement: 1000,
      xpReward: 5000,
    },

    // ============ Conquistas Especiais ============
    {
      title: "Madrugador",
      description: "Complete um hábito antes das 6h da manhã",
      icon: "🌅",
      category: "Especial",
      requirement: 1,
      xpReward: 100,
    },
    {
      title: "Coruja Noturna",
      description: "Complete um hábito depois das 23h",
      icon: "🦉",
      category: "Especial",
      requirement: 1,
      xpReward: 100,
    },
    {
      title: "Multitarefa",
      description: "Complete 5 hábitos diferentes no mesmo dia",
      icon: "🎭",
      category: "Especial",
      requirement: 5,
      xpReward: 200,
    },
    {
      title: "Guerreiro de Fim de Semana",
      description: "Complete hábitos em 4 fins de semana consecutivos",
      icon: "⚔️",
      category: "Especial",
      requirement: 4,
      xpReward: 250,
    },
    {
      title: "Perfeccionista",
      description: "Complete todos os hábitos ativos por 7 dias seguidos",
      icon: "💯",
      category: "Especial",
      requirement: 7,
      xpReward: 500,
    },

    // ============ Conquistas de Categorias ============
    {
      title: "Corpo Saudável",
      description: "Complete 50 hábitos de Saúde/Fitness",
      icon: "💪",
      category: "Categoria",
      requirement: 50,
      xpReward: 300,
    },
    {
      title: "Mente Brilhante",
      description: "Complete 50 hábitos de Estudos",
      icon: "🧠",
      category: "Categoria",
      requirement: 50,
      xpReward: 300,
    },
    {
      title: "Profissional Dedicado",
      description: "Complete 50 hábitos de Trabalho",
      icon: "💼",
      category: "Categoria",
      requirement: 50,
      xpReward: 300,
    },
    {
      title: "Zen Master",
      description: "Complete 50 hábitos de Mindfulness",
      icon: "🧘",
      category: "Categoria",
      requirement: 50,
      xpReward: 300,
    },
  ];

  // Inserir conquistas
  for (const achievement of achievements) {
    await prisma.achievement.create({
      data: achievement,
    });
  }

  console.log(`✅ ${achievements.length} conquistas criadas com sucesso!`);

  // Estatísticas
  const stats = {
    habitos: achievements.filter((a) => a.category === "Hábitos").length,
    streak: achievements.filter((a) => a.category === "Streak").length,
    nivel: achievements.filter((a) => a.category === "Nível").length,
    conclusoes: achievements.filter((a) => a.category === "Conclusões").length,
    especial: achievements.filter((a) => a.category === "Especial").length,
    categoria: achievements.filter((a) => a.category === "Categoria").length,
  };

  console.log("\n📊 Conquistas por categoria:");
  console.log(`   🎯 Hábitos: ${stats.habitos}`);
  console.log(`   🔥 Streak: ${stats.streak}`);
  console.log(`   ⭐ Nível: ${stats.nivel}`);
  console.log(`   ✅ Conclusões: ${stats.conclusoes}`);
  console.log(`   🌟 Especial: ${stats.especial}`);
  console.log(`   📂 Categoria: ${stats.categoria}`);
  console.log(`   📈 TOTAL: ${achievements.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Erro ao fazer seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
