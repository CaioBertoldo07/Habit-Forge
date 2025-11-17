require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { initializeCronJobs } = require("./utils/cronJobs");

// Importar rotas
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const habitRoutes = require("./routes/habitRoutes");
const achievementRoutes = require("./routes/achievementRoutes");
const progressRoutes = require("./routes/progressRoutes");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
});

// Middlewares globais
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Disponibilizar io para as rotas
app.set("io", io);

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/progress", progressRoutes);

// Rota de teste
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Habit Forge API está funcionando!",
    timestamp: new Date().toISOString(),
  });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error("Erro:", err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Erro interno do servidor",
  });
});

// WebSocket - Eventos em tempo real
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("join_room", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Usuário ${userId} entrou na sala`);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Ambiente: ${process.env.NODE_ENV}`);
  console.log(`🔗 API disponível em: http://localhost:${PORT}/api`);

  initializeCronJobs();
});
