import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Target, 
  Trophy, 
  TrendingUp, 
  Calendar,
  Plus,
  CheckCircle,
  Clock,
  Flame
} from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { habitAPI, progressAPI, userAPI } from '../services/api';
import './Dashboard.css';
import XPBar from '../components/gamefication/XPBar';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [summary, setSummary] = useState(null);
  const [recentHabits, setRecentHabits] = useState([]);
  const [dailyProgress, setDailyProgress] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Carregar todas as informações em paralelo
      const [statsRes, summaryRes, habitsRes, progressRes] = await Promise.all([
        userAPI.getStats(),
        progressAPI.getSummary(),
        habitAPI.getAll({ isActive: true }),
        progressAPI.getDailyProgress(7)
      ]);

      setStats(statsRes.data.stats);
      setSummary(summaryRes.data.summary);
      setRecentHabits(habitsRes.data.habits.slice(0, 5));
      setDailyProgress(progressRes.data.progress);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteHabit = async (habitId) => {
    try {
      await habitAPI.complete(habitId);
      loadDashboardData(); // Recarregar dados
    } catch (error) {
      console.error('Erro ao completar hábito:', error);
    }
  };

  if (loading) {
    return (
      <MainLayout title="Dashboard" subtitle="Carregando seus dados...">
        <div className="dashboard-loading">
          <div className="spinner"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title={`Olá, ${user?.name}! 👋`} 
      subtitle="Vamos conquistar seus objetivos hoje!"
    >
      <div className="dashboard">
        {/* Stats Cards (Top) */}
        <div className="stats-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="stat-card stat-card-primary" glow>
              <div className="stat-icon">
                <Zap size={28} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Nível Atual</p>
                <h3 className="stat-value">{summary?.user?.level || 1}</h3>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${summary?.user?.xpToNextLevel 
                          ? ((100 - summary.user.xpToNextLevel) / 100) * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {summary?.user?.xp || 0} / {(summary?.user?.level || 1) * 100} XP
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="stat-card stat-card-success">
              <div className="stat-icon">
                <Flame size={28} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Sequência Atual</p>
                <h3 className="stat-value">{summary?.user?.currentStreak || 0}</h3>
                <p className="stat-subtitle">
                  Recorde: {summary?.user?.maxStreak || 0} dias 🔥
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="stat-card stat-card-warning">
              <div className="stat-icon">
                <Target size={28} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Hábitos Ativos</p>
                <h3 className="stat-value">{summary?.habits?.active || 0}</h3>
                <p className="stat-subtitle">
                  {summary?.completions?.today || 0} concluídos hoje
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="stat-card stat-card-info">
              <div className="stat-icon">
                <Trophy size={28} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Conquistas</p>
                <h3 className="stat-value">
                  {summary?.achievements?.unlocked || 0}/{summary?.achievements?.total || 0}
                </h3>
                <p className="stat-subtitle">
                  {summary?.achievements?.percentage || 0}% completo
                </p>
              </div>
            </Card>
          </motion.div>
        </div>

        <Card glow>
          <h3>Seu Progresso</h3>
          <XPBar
            currentXP={user?.xp % 100 || 0}
            requiredXP={100}
            currentLevel={user?.level || 1}
            nextLevel={(user?.level || 1) + 1}
            size="large"
            animated={true}
          />
      </Card>

        {/* Main Content Grid */}
        <div className="dashboard-grid">
          {/* Progresso Semanal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="dashboard-section"
          >
            <Card className="weekly-progress-card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Progresso Semanal</h3>
                  <p className="card-subtitle">Últimos 7 dias</p>
                </div>
                <TrendingUp className="header-icon" />
              </div>

              <div className="weekly-chart">
                {dailyProgress.map((day, index) => {
                  const date = new Date(day.date);
                  const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
                  const maxCompletions = Math.max(...dailyProgress.map(d => d.completions), 1);
                  const height = (day.completions / maxCompletions) * 100;

                  return (
                    <motion.div
                      key={day.date}
                      className="chart-bar-container"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <div className="chart-bar-wrapper">
                        <div 
                          className="chart-bar"
                          style={{ height: `${height}%` }}
                        >
                          <span className="bar-value">{day.completions}</span>
                        </div>
                      </div>
                      <span className="chart-label">{dayName}</span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="progress-summary">
                <div className="summary-item">
                  <CheckCircle size={18} />
                  <span>{summary?.completions?.thisWeek || 0} completados</span>
                </div>
                <div className="summary-item">
                  <Target size={18} />
                  <span>{summary?.habits?.active * 7} esperados</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Hábitos de Hoje */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="dashboard-section"
          >
            <Card className="habits-today-card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Hábitos de Hoje</h3>
                  <p className="card-subtitle">Continue sua sequência!</p>
                </div>
                <Link to="/habits">
                  <Button variant="ghost" size="sm" icon={<Plus size={18} />}>
                    Novo
                  </Button>
                </Link>
              </div>

              <div className="habits-list">
                {recentHabits.length > 0 ? (
                  recentHabits.map((habit, index) => (
                    <motion.div
                      key={habit.id}
                      className="habit-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <div className="habit-icon" style={{ background: habit.color }}>
                        {habit.icon}
                      </div>
                      <div className="habit-info">
                        <h4 className="habit-name">{habit.title}</h4>
                        <div className="habit-meta">
                          <span className="habit-category">{habit.category}</span>
                          <span className="habit-separator">•</span>
                          <span className="habit-xp">+{habit.xpReward} XP</span>
                        </div>
                      </div>
                      <Button
                        variant="success"
                        size="sm"
                        icon={<CheckCircle size={18} />}
                        onClick={() => handleCompleteHabit(habit.id)}
                      >
                        Concluir
                      </Button>
                    </motion.div>
                  ))
                ) : (
                  <div className="empty-state">
                    <Target size={48} className="empty-icon" />
                    <p className="empty-text">Nenhum hábito ativo</p>
                    <Link to="/habits">
                      <Button variant="primary" icon={<Plus size={18} />}>
                        Criar Primeiro Hábito
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Categoria Destaque */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="dashboard-section-small"
          >
            <Card className="category-card" variant="primary">
              <div className="card-header">
                <h3 className="card-title">Categoria Destaque</h3>
              </div>
              {summary?.topCategory ? (
                <div className="category-content">
                  <div className="category-name">
                    {summary.topCategory.name}
                  </div>
                  <div className="category-stat">
                    <span className="category-number">
                      {summary.topCategory.completions}
                    </span>
                    <span className="category-label">conclusões</span>
                  </div>
                </div>
              ) : (
                <p className="empty-text">Sem dados ainda</p>
              )}
            </Card>
          </motion.div>

          {/* Próxima Conquista */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="dashboard-section-small"
          >
            <Card className="next-achievement-card" glow>
              <div className="card-header">
                <h3 className="card-title">Próxima Conquista</h3>
              </div>
              <div className="achievement-content">
                <div className="achievement-icon">
                  <Trophy size={32} />
                </div>
                <p className="achievement-name">Colecionador de Hábitos</p>
                <p className="achievement-desc">Crie 5 hábitos diferentes</p>
                <div className="achievement-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${((summary?.habits?.total || 0) / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {summary?.habits?.total || 0} / 5
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="quick-actions"
        >
          <h3 className="section-title">Ações Rápidas</h3>
          <div className="actions-grid">
            <Link to="/habits">
              <Card className="action-card" hover>
                <Target size={32} className="action-icon" />
                <h4 className="action-title">Gerenciar Hábitos</h4>
                <p className="action-description">Criar, editar e acompanhar</p>
              </Card>
            </Link>

            <Link to="/achievements">
              <Card className="action-card" hover>
                <Trophy size={32} className="action-icon" />
                <h4 className="action-title">Ver Conquistas</h4>
                <p className="action-description">Desbloqueie recompensas</p>
              </Card>
            </Link>

            <Link to="/leaderboard">
              <Card className="action-card" hover>
                <TrendingUp size={32} className="action-icon" />
                <h4 className="action-title">Ranking</h4>
                <p className="action-description">Compare seu progresso</p>
              </Card>
            </Link>

            <Link to="/profile">
              <Card className="action-card" hover>
                <Calendar size={32} className="action-icon" />
                <h4 className="action-title">Histórico</h4>
                <p className="action-description">Veja sua jornada</p>
              </Card>
            </Link>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;