const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Middleware para proteger rotas (requer autenticação)
const authenticate = async (req, res, next) => {
  try {
    // Buscar token do header ou cookie
    const token =
      req.cookies.token || req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        error: true,
        message: "Acesso negado. Token não fornecido.",
      });
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuário no banco
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        xp: true,
        xpWeek: true,
        level: true,
        coins: true,
        streak: true,
        maxStreak: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: true,
        message: "Usuário não encontrado.",
      });
    }

    // Adicionar usuário ao request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: true,
        message: "Token inválido.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: true,
        message: "Token expirado. Faça login novamente.",
      });
    }

    return res.status(500).json({
      error: true,
      message: "Erro ao autenticar.",
    });
  }
};

// Middleware opcional - não exige autenticação, mas popula req.user se token válido
const optionalAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          xp: true,
          xpWeek: true,
          level: true,
          coins: true,
        },
      });

      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Se der erro, apenas continua sem autenticação
    next();
  }
};

module.exports = { authenticate, optionalAuth };
