const express = require("express");
const router = express.Router();
const achievementController = require("../controllers/achievementController");
const { authenticate } = require("../middlewares/authMiddleware");

// Todas as rotas requerem autenticação
router.use(authenticate);

// Listar todas as conquistas (com status de desbloqueado)
router.get("/", achievementController.getAllAchievements);

// Listar conquistas desbloqueadas pelo usuário
router.get("/my-achievements", achievementController.getUserAchievements);

// Criar nova conquista (admin - pode adicionar middleware de admin depois)
router.post("/", achievementController.createAchievement);

module.exports = router;
