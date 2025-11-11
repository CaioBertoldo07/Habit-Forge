const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");
const { authenticate } = require("../middlewares/authMiddleware");

// Todas as rotas requerem autenticação
router.use(authenticate);

// Progresso temporal
router.get("/daily", progressController.getDailyProgress);
router.get("/weekly", progressController.getWeeklyProgress);
router.get("/monthly", progressController.getMonthlyProgress);

// Progresso por hábito
router.get("/habit/:id", progressController.getHabitProgress);

// Dashboard
router.get("/heatmap", progressController.getHeatmap);
router.get("/summary", progressController.getDashboardSummary);

// Análises
router.get("/compare", progressController.compareProgress);
router.get("/categories", progressController.getCategoryAnalysis);

module.exports = router;
