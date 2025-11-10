const express = require("express");
const router = express.Router();
const habitController = require("../controllers/habitController");
const { authenticate } = require("../middlewares/authMiddleware");

// Todas as rotas de hábitos requerem autenticação
router.use(authenticate);

// CRUD de hábitos
router.post("/", habitController.createHabit);
router.get("/", habitController.getHabits);
router.get("/:id", habitController.getHabitById);
router.put("/:id", habitController.updateHabit);
router.delete("/:id", habitController.deleteHabit);

// Marcar hábito como concluído
router.post("/:id/complete", habitController.completeHabit);

module.exports = router;
