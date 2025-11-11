import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Zap, Star, Award } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import { achievementAPI } from '../services/api';
import './Achievements.css';

const CATEGORY_ICONS = {
  'Hábitos': '🎯',
  'Streak': '🔥',
  'Nível': '⭐',
  'Conclusões': '✅',
  'Social': '👥'
};

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    unlocked: 0,
    percentage: 0
  });

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const response = await achievementAPI.getAll();
      const achievementsData = response.data.achievements;
      
      setAchievements(achievementsData);
      
      // Calcular estatísticas
      const unlocked = achievementsData.filter(a => a.unlocked).length;
      setStats({
        total: achievementsData.length,
        unlocked,
        percentage: Math.round((unlocked / achievementsData.length) * 100)
      });
    } catch (error) {
      console.error('Erro ao carregar conquistas:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(achievements.map(a => a.category))];

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const getCategoryCount = (category) => {
    if (category === 'all') return achievements.length;
    return achievements.filter(a => a.category === category).length;
  };

  const getCategoryUnlocked = (category) => {
    if (category === 'all') return stats.unlocked;
    return achievements.filter(a => a.category === category && a.unlocked).length;
  };

  return (
    <MainLayout 
      title="Conquistas" 
      subtitle="Desbloqueie conquistas e ganhe recompensas!"
    >
      <div className="achievements-page">
        {/* Header com Progresso Geral */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="achievements-header" glow>
            <div className="header-content">
              <div className="header-icon">
                <Trophy size={48} />
              </div>
              <div className="header-info">
                <h2 className="header-title">Suas Conquistas</h2>
                <p className="header-subtitle">
                  {stats.unlocked} de {stats.total} desbloqueadas
                </p>
                <div className="progress-bar-large">
                  <div 
                    className="progress-fill-large"
                    style={{ width: `${stats.percentage}%` }}
                  >
                    <span className="progress-text-large">{stats.percentage}%</span>
                  </div>
                </div>
              </div>
              <div className="header-stats">
                <div className="stat-box">
                  <Award size={32} />
                  <span className="stat-number">{stats.unlocked}</span>
                  <span className="stat-label">Desbloqueadas</span>
                </div>
                <div className="stat-box">
                  <Star size={32} />
                  <span className="stat-number">{stats.total - stats.unlocked}</span>
                  <span className="stat-label">Bloqueadas</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Filtros por Categoria */}
        <motion.div
          className="category-tabs"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              <span className="tab-icon">
                {category === 'all' ? '🏆' : CATEGORY_ICONS[category] || '🎯'}
              </span>
              <span className="tab-label">
                {category === 'all' ? 'Todas' : category}
              </span>
              <span className="tab-badge">
                {getCategoryUnlocked(category)}/{getCategoryCount(category)}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Grid de Conquistas */}
        {loading ? (
          <div className="achievements-loading">
            <div className="spinner"></div>
          </div>
        ) : (
          <motion.div
            className="achievements-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filteredAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                  hover={achievement.unlocked}
                  glow={achievement.unlocked}
                >
                  <div className="achievement-icon-wrapper">
                    <div className="achievement-icon">
                      {achievement.unlocked ? achievement.icon : <Lock size={32} />}
                    </div>
                    {achievement.unlocked && (
                      <motion.div
                        className="achievement-glow"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                  </div>

                  <div className="achievement-content">
                    <h3 className="achievement-title">
                      {achievement.unlocked ? achievement.title : '???'}
                    </h3>
                    <p className="achievement-description">
                      {achievement.unlocked 
                        ? achievement.description 
                        : 'Conquista bloqueada. Continue progredindo para desbloquear!'}
                    </p>

                    <div className="achievement-meta">
                      <span className="achievement-category">
                        {CATEGORY_ICONS[achievement.category]} {achievement.category}
                      </span>
                      <span className="achievement-xp">
                        <Zap size={14} />
                        +{achievement.xpReward} XP
                      </span>
                    </div>

                    {achievement.unlocked && achievement.unlockedAt && (
                      <div className="achievement-date">
                        Desbloqueada em {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
                      </div>
                    )}

                    {!achievement.unlocked && (
                      <div className="achievement-requirement">
                        Meta: {achievement.requirement} {achievement.category.toLowerCase()}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default Achievements;