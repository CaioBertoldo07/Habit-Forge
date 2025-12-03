const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Gerar token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Registrar novo usuário
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validações básicas
    if (!name || !email || !password) {
      return res.status(400).json({
        error: true,
        message: "Nome, email e senha são obrigatórios.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: true,
        message: "A senha deve ter no mínimo 6 caracteres.",
      });
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        error: true,
        message: "Este email já está cadastrado.",
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário com weekStartDate inicializado
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        weekStartDate: new Date(), // ADICIONAR
      },
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
        createdAt: true,
      },
    });

    // Gerar token
    const token = generateToken(user.id);

    // Configurar cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    });

    return res.status(201).json({
      success: true,
      message: "Usuário registrado com sucesso!",
      user,
      token,
    });
  } catch (error) {
    console.error("Erro ao registrar:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao registrar usuário.",
    });
  }
};

// Login de usuário
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validações
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Email e senha são obrigatórios.",
      });
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        error: true,
        message: "Email ou senha incorretos.",
      });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: true,
        message: "Email ou senha incorretos.",
      });
    }

    // Gerar token
    const token = generateToken(user.id);

    // Configurar cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Remover senha do retorno
    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      success: true,
      message: "Login realizado com sucesso!",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao fazer login.",
    });
  }
};

// Logout de usuário
const logout = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.json({
      success: true,
      message: "Logout realizado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao fazer logout.",
    });
  }
};

// Obter usuário atual (perfil)
const getMe = async (req, res) => {
  try {
    // req.user já foi populado pelo middleware authenticate
    return res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("Erro ao obter perfil:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao obter perfil.",
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
};
