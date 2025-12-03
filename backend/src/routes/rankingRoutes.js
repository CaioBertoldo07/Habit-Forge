// backend/src/routes/rankingRoutes.js
const express = require("express");
const router = express.Router();
const rankingController = require("../controllers/rankingController");
const { authenticate } = require("../middlewares/authMiddleware");

// Todas as rotas requerem autenticação
router.use(authenticate);

// Ranking semanal
router.get("/weekly", rankingController.getWeeklyRankingController);

// Posição do usuário
router.get("/my-position", rankingController.getUserPosition);

// Ranking por liga
router.get("/league/:league", rankingController.getLeagueRanking);

// Listar ligas
router.get("/leagues", rankingController.getAllLeagues);

module.exports = router;
