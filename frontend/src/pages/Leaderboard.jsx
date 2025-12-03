import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Medal, TrendingUp, Zap, Flame, Trophy, Users } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketContexts';
import { rankingAPI } from '../services/api';
import './Leaderboard.css';

const Leaderboard = () => {
  const { user } = useAuth();
  const { ranking: realtimeRanking, userPosition: realtimePosition } = useWebSocket();
  const [ranking, setRanking] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('all');

  useEffect(() => {
    loadLeaderboard();
    loadLeagues();
  }, []);

  // Atualizar ranking em tempo real
  useEffect(() => {
    if (realtimeRanking && realtimeRanking.length > 0) {
      setRanking(realtimeRanking);
    }
  }, [realtimeRanking]);

  // Atualizar posição do usuário em tempo real
  useEffect(() => {
    if (realtimePosition) {
      setUserPosition(realtimePosition);
    }
  }, [realtimePosition]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const [rankingRes, positionRes] = await Promise.all([
        rankingAPI.getWeeklyRanking(50),
        rankingAPI.getMyPosition()
      ]);
      
      setRanking(rankingRes.data.ranking);
      setUserPosition(positionRes.data.position);
    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeagues = async () => {
    try {
      const response = await rankingAPI.getAllLeagues();
      setLeagues(response.data.leagues);
    } catch (error) {
      console.error('Erro ao carregar ligas:', error);
    }
  };

  const getMedalIcon = (position) => {
    switch (position) {
      case 1:
        return <Crown size={24} className="medal gold" />;
      case 2:
        return <Medal size={24} className="medal silver" />;
      case 3:
        return <Medal size={24} className="medal bronze" />;
      default:
        return <span className="rank-number">#{position}</span>;
    }
  };

  const getPositionClass = (position) => {
    if (position === 1) return 'rank-1';
    if (position === 2) return 'rank-2';
    if (position === 3) return 'rank-3';
    return '';
  };

  return (
    <MainLayout 
      title="Ranking Semanal" 
      subtitle="Competição baseada em XP da semana!"
    >
      <div className="leaderboard-page">
        {/* Informação sobre o ranking semanal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="info-card" variant="primary">
            <div className="info-content">
              <Users size={32} className="info-icon" />
              <div className="info-text">
                <h3>Ranking Semanal</h3>
                <p>O ranking é resetado toda segunda-feira. Ganhe XP completando hábitos para subir no ranking!</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Top 3 Pódio */}
        {!loading && ranking.length >= 3 && (
          <motion.div
            className="podium-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="podium-card">
              <h2 className="podium-title">🏆 Top 3 da Semana</h2>
              <div className="podium">
                {/* 2º Lugar */}
                <motion.div
                  className="podium-place place-2"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="podium-rank">
                    <Medal size={32} className="medal silver" />
                  </div>
                  <div className="podium-avatar">
                    {ranking[1].avatar ? (
                      <img src={ranking[1].avatar} alt={ranking[1].name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {ranking[1].name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3 className="podium-name">{ranking[1].name}</h3>
                  <div className="podium-stats">
                    <div className="stat">
                      <Zap size={16} />
                      <span>{ranking[1].xpWeek} XP</span>
                    </div>
                    <div className="stat">
                      <TrendingUp size={16} />
                      <span>Nv. {ranking[1].level}</span>
                    </div>
                  </div>
                </motion.div>

                {/* 1º Lugar */}
                <motion.div
                  className="podium-place place-1"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="podium-rank">
                    <Crown size={40} className="medal gold" />
                  </div>
                  <div className="podium-avatar podium-avatar-large">
                    {ranking[0].avatar ? (
                      <img src={ranking[0].avatar} alt={ranking[0].name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {ranking[0].name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3 className="podium-name">{ranking[0].name}</h3>
                  <div className="podium-stats">
                    <div className="stat">
                      <Zap size={18} />
                      <span>{ranking[0].xpWeek} XP</span>
                    </div>
                    <div className="stat">
                      <TrendingUp size={18} />
                      <span>Nv. {ranking[0].level}</span>
                    </div>
                  </div>
                </motion.div>

                {/* 3º Lugar */}
                <motion.div
                  className="podium-place place-3"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="podium-rank">
                    <Medal size={32} className="medal bronze" />
                  </div>
                  <div className="podium-avatar">
                    {ranking[2].avatar ? (
                      <img src={ranking[2].avatar} alt={ranking[2].name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {ranking[2].name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3 className="podium-name">{ranking[2].name}</h3>
                  <div className="podium-stats">
                    <div className="stat">
                      <Zap size={16} />
                      <span>{ranking[2].xpWeek} XP</span>
                    </div>
                    <div className="stat">
                      <TrendingUp size={16} />
                      <span>Nv. {ranking[2].level}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Posição do Usuário */}
        {userPosition && userPosition.position > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="user-rank-card" glow>
              <div className="user-rank-content">
                <Trophy className="user-rank-icon" />
                <div className="user-rank-info">
                  <h3>Sua Posição</h3>
                  <p className="rank-position">#{userPosition.position}</p>
                </div>
                <div className="user-rank-stats">
                  <div className="stat-item">
                    <Zap size={20} />
                    <span>{userPosition.xpWeek} XP esta semana</span>
                  </div>
                  <div className="stat-item">
                    <TrendingUp size={20} />
                    <span>Nível {userPosition.level}</span>
                  </div>
                  <div className="stat-item">
                    <Flame size={20} />
                    <span>{userPosition.streak} dias</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Lista Completa */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="ranking-list-card">
            <div className="ranking-header">
              <h3>Ranking Completo</h3>
              <span className="ranking-count">{ranking.length} jogadores</span>
            </div>

            {loading ? (
              <div className="ranking-loading">
                <div className="spinner"></div>
              </div>
            ) : (
              <div className="ranking-list">
                <AnimatePresence>
                  {ranking.map((player, index) => {
                    const position = index + 1;
                    const isCurrentUser = player.id === user?.id;

                    return (
                      <motion.div
                        key={player.id}
                        layout
                        className={`ranking-item ${getPositionClass(position)} ${isCurrentUser ? 'current-user' : ''}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.02 }}
                      >
                        <div className="ranking-position">
                          {getMedalIcon(position)}
                        </div>

                        <div className="ranking-avatar">
                          {player.avatar ? (
                            <img src={player.avatar} alt={player.name} />
                          ) : (
                            <div className="avatar-placeholder">
                              {player.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className="ranking-info">
                          <h4 className="ranking-name">
                            {player.name}
                            {isCurrentUser && <span className="you-badge">Você</span>}
                          </h4>
                          <div className="ranking-meta">
                            <span className="meta-item">
                              <Zap size={14} />
                              {player.xpWeek} XP esta semana
                            </span>
                            <span className="meta-separator">•</span>
                            <span className="meta-item">
                              <TrendingUp size={14} />
                              Nv. {player.level}
                            </span>
                            {player.streak > 0 && (
                              <>
                                <span className="meta-separator">•</span>
                                <span className="meta-item">
                                  <Flame size={14} />
                                  {player.streak} dias
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="ranking-level">
                          <div className="level-badge">
                            <span className="level-number">{player.level}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Leaderboard;