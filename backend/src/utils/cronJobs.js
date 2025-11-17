const cron = require("node-cron");
const { checkExpiredStreaks } = require("../utils/streakSystem");

/**
 * Tarefas agendadas (Cron Jobs)
 * Executam automaticamente em horários definidos
 */

// Verificar streaks expirados - executa todo dia à meia-noite
const scheduleStreakCheck = () => {
  // Executa todos os dias às 00:05 (5 minutos após meia-noite)
  cron.schedule(
    "5 0 * * *",
    async () => {
      console.log("🕐 Executando verificação de streaks...");

      try {
        const result = await checkExpiredStreaks();

        if (result) {
          console.log(`✅ Verificação concluída:`);
          console.log(`   - ${result.checked} usuários verificados`);
          console.log(`   - ${result.expired} streaks expirados`);
        }
      } catch (error) {
        console.error("❌ Erro na verificação de streaks:", error);
      }
    },
    {
      timezone: "America/Manaus", // Horário de Manaus
    }
  );

  console.log("⏰ Cron job de streaks agendado para 00:05 diariamente");
};

// Inicializar todos os cron jobs
const initializeCronJobs = () => {
  scheduleStreakCheck();

  // Adicionar mais cron jobs aqui conforme necessário
  // Exemplos:
  // - Enviar notificações diárias
  // - Limpar dados antigos
  // - Gerar relatórios semanais

  console.log("✅ Todos os cron jobs inicializados");
};

module.exports = {
  initializeCronJobs,
  scheduleStreakCheck,
};
