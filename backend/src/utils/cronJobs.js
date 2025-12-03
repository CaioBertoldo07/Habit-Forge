const cron = require("node-cron");
const { checkExpiredStreaks } = require("../utils/streakSystem");
const { resetWeeklyXP } = require("./rankingSystem");

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

// Reset de XP semanal - toda segunda-feira às 00:00
const scheduleWeeklyReset = () => {
  // Cron: "0 0 * * 1" = toda segunda-feira à meia-noite
  cron.schedule(
    "0 0 * * 1",
    async () => {
      console.log("🔄 Executando reset semanal de XP...");

      try {
        await resetWeeklyXP();
        console.log("✅ Reset semanal concluído com sucesso!");
      } catch (error) {
        console.error("❌ Erro no reset semanal:", error);
      }
    },
    {
      timezone: "America/Manaus",
    }
  );

  console.log("⏰ Cron job de reset semanal agendado para segundas-feiras 00:00");
};

// Atualizar a função initializeCronJobs:
const initializeCronJobs = () => {
  scheduleStreakCheck();
  scheduleWeeklyReset(); // ADICIONAR ESTA LINHA

  console.log("✅ Todos os cron jobs inicializados");
};

module.exports = {
  initializeCronJobs,
  scheduleStreakCheck,
  scheduleWeeklyReset, // ADICIONAR
};
