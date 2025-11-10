const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middlewares/authMiddleware");

// Todas as rotas de usuário requerem autenticação
router.use(authenticate);

// Rotas de perfil
router.get("/profile/:id", userController.getUserProfile);
router.put("/profile", userController.updateProfile);
router.put("/change-password", userController.changePassword);

// Rotas de estatísticas e ranking
router.get("/stats", userController.getUserStats);
router.get("/leaderboard", userController.getLeaderboard);

module.exports = router;
