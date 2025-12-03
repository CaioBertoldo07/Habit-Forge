// backend/src/controllers/rankingController.js
const {
  getWeeklyRanking,
  getUserRankingPosition,
  getRankingByLeague,
  LEAGUES,
} = require("../utils/rankingSystem");

// Obter ranking semanal
const getWeeklyRankingController = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const ranking = await getWeeklyRanking(parseInt(limit));

    return res.json({
      success: true,
      ranking,
    });
  } catch (error) {
    console.error("Erro ao buscar ranking semanal:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao buscar ranking semanal.",
    });
  }
};

// Obter posição do usuário
const getUserPosition = async (req, res) => {
  try {
    const userId = req.user.id;
    const position = await getUserRankingPosition(userId);

    if (!position) {
      return res.status(404).json({
        error: true,
        message: "Posição não encontrada.",
      });
    }

    return res.json({
      success: true,
      position,
    });
  } catch (error) {
    console.error("Erro ao buscar posição do usuário:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao buscar posição.",
    });
  }
};

// Obter ranking por liga
const getLeagueRanking = async (req, res) => {
  try {
    const { league } = req.params;
    const ranking = await getRankingByLeague(league);

    return res.json({
      success: true,
      ranking,
    });
  } catch (error) {
    console.error("Erro ao buscar ranking da liga:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao buscar ranking da liga.",
    });
  }
};

// Listar todas as ligas
const getAllLeagues = async (req, res) => {
  try {
    return res.json({
      success: true,
      leagues: LEAGUES,
    });
  } catch (error) {
    console.error("Erro ao buscar ligas:", error);
    return res.status(500).json({
      error: true,
      message: "Erro ao buscar ligas.",
    });
  }
};

module.exports = {
  getWeeklyRankingController,
  getUserPosition,
  getLeagueRanking,
  getAllLeagues,
};
