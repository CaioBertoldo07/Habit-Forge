// Script de teste para verificar conexão com banco de dados
// Execute: node test-connection.js

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  console.log('🔍 Testando conexão com banco de dados...\n');
  
  try {
    // Teste 1: Conectar ao banco
    console.log('1️⃣ Testando conexão...');
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!\n');
    
    // Teste 2: Contar tabelas
    console.log('2️⃣ Verificando tabelas...');
    const usersCount = await prisma.user.count();
    const habitsCount = await prisma.habit.count();
    const achievementsCount = await prisma.achievement.count();
    
    console.log(`✅ Tabelas encontradas:`);
    console.log(`   - Users: ${usersCount} registro(s)`);
    console.log(`   - Habits: ${habitsCount} registro(s)`);
    console.log(`   - Achievements: ${achievementsCount} registro(s)\n`);
    
    // Teste 3: Listar conquistas
    if (achievementsCount > 0) {
      console.log('3️⃣ Conquistas cadastradas:');
      const achievements = await prisma.achievement.findMany({
        take: 5,
        orderBy: { requirement: 'asc' }
      });
      
      achievements.forEach(achievement => {
        console.log(`   ${achievement.icon} ${achievement.title} - ${achievement.category} (${achievement.requirement})`);
      });
      console.log(`   ... e mais ${achievementsCount - 5} conquistas\n`);
    }
    
    console.log('✅ Todos os testes passaram com sucesso!');
    console.log('🚀 Banco de dados está pronto para uso!\n');
    
    console.log('📌 Próximos passos:');
    console.log('   1. Iniciar servidor: npm run dev');
    console.log('   2. Testar API: curl http://localhost:5000/api/health');
    console.log('   3. Abrir Prisma Studio: npx prisma studio\n');
    
  } catch (error) {
    console.error('❌ Erro ao testar banco de dados:');
    console.error(error.message);
    
    if (error.code === 'P1001') {
      console.log('\n💡 Dica: Verifique se o MySQL está rodando');
    }
    
    if (error.code === 'P1003') {
      console.log('\n💡 Dica: O banco "habit_forge" não existe');
      console.log('   Execute: mysql -u root -p');
      console.log('   CREATE DATABASE habit_forge;');
    }
    
  } finally {
    await prisma.$disconnect();
  }
}

// Executar testes
testConnection();
