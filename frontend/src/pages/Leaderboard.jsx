import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Medal, TrendingUp, Zap, Flame, Trophy } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import './Leaderboard.css';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getLeaderboard(50);
      const data = response.data.leaderboard;
      
      setLeaderboard(data);
      
      // Encontrar posição do usuário
      const rankIndex = data.findIndex(u => u.id === user?.id);
      if (rankIndex !== -1) {
        setUserRank(rankIndex + 1);
      }
    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
    } finally {
      setLoading(false);
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
      title="Ranking Global" 
      subtitle="Veja sua posição entre os melhores!"
    >
      <div className="leaderboard-page">
        {/* Top 3 Pódio */}
        {!loading && leaderboard.length >= 3 && (
          <motion.div
            className="podium-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="podium-card">
              <h2 className="podium-title">🏆 Top 3 Campeões</h2>
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
                    {leaderboard[1].avatar ? (
                      <img src={leaderboard[1].avatar} alt={leaderboard[1].name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {leaderboard[1].name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3 className="podium-name">{leaderboard[1].name}</h3>
                  <div className="podium-stats">
                    <div className="stat">
                      <Zap size={16} />
                      <span>{leaderboard[1].xp} XP</span>
                    </div>
                    <div className="stat">
                      <TrendingUp size={16} />
                      <span>Nv. {leaderboard[1].level}</span>
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
                    {leaderboard[0].avatar ? (
                      <img src={leaderboard[0].avatar} alt={leaderboard[0].name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {leaderboard[0].name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3 className="podium-name">{leaderboard[0].name}</h3>
                  <div className="podium-stats">
                    <div className="stat">
                      <Zap size={18} />
                      <span>{leaderboard[0].xp} XP</span>
                    </div>
                    <div className="stat">
                      <TrendingUp size={18} />
                      <span>Nv. {leaderboard[0].level}</span>
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
                    {leaderboard[2].avatar ? (
                      <img src={leaderboard[2].avatar} alt={leaderboard[2].name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {leaderboard[2].name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3 className="podium-name">{leaderboard[2].name}</h3>
                  <div className="podium-stats">
                    <div className="stat">
                      <Zap size={16} />
                      <span>{leaderboard[2].xp} XP</span>
                    </div>
                    <div className="stat">
                      <TrendingUp size={16} />
                      <span>Nv. {leaderboard[2].level}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Posição do Usuário */}
        {userRank && userRank > 3 && (
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
                  <p className="rank-position">#{userRank}</p>
                </div>
                <div className="user-rank-stats">
                  <div className="stat-item">
                    <Zap size={20} />
                    <span>{user?.xp} XP</span>
                  </div>
                  <div className="stat-item">
                    <TrendingUp size={20} />
                    <span>Nível {user?.level}</span>
                  </div>
                  <div className="stat-item">
                    <Flame size={20} />
                    <span>{user?.streak} dias</span>
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
              <span className="ranking-count">{leaderboard.length} jogadores</span>
            </div>

            {loading ? (
              <div className="ranking-loading">
                <div className="spinner"></div>
              </div>
            ) : (
              <div className="ranking-list">
                {leaderboard.map((player, index) => {
                  const position = index + 1;
                  const isCurrentUser = player.id === user?.id;

                  return (
                    <motion.div
                      key={player.id}
                      className={`ranking-item ${getPositionClass(position)} ${isCurrentUser ? 'current-user' : ''}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
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
                            {player.xp} XP
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
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Leaderboard;