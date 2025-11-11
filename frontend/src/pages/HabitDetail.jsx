import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  CheckCircle,
  Edit,
  Trash2,
  Calendar,
  TrendingUp,
  Flame,
  Target,
  Clock,
  Award,
  Zap
} from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { habitAPI, progressAPI } from '../services/api';
import './HabitDetail.css';

const HabitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [habit, setHabit] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHabitData();
  }, [id]);

  const loadHabitData = async () => {
    try {
      setLoading(true);
      const [habitRes, progressRes] = await Promise.all([
        habitAPI.getById(id),
        progressAPI.getHabitProgress(id)
      ]);
      
      setHabit(habitRes.data.habit);
      setProgress(progressRes.data.progress);
    } catch (error) {
      console.error('Erro ao carregar hábito:', error);
      navigate('/habits');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      await habitAPI.complete(id);
      loadHabitData();
    } catch (error) {
      console.error('Erro ao completar hábito:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este hábito?')) {
      try {
        await habitAPI.delete(id);
        navigate('/habits');
      } catch (error) {
        console.error('Erro ao deletar hábito:', error);
      }
    }
  };

  const getFrequencyLabel = (frequency) => {
    const labels = {
      daily: 'Diário',
      weekly: 'Semanal',
      monthly: 'Mensal'
    };
    return labels[frequency] || frequency;
  };

  const getDifficultyLabel = (difficulty) => {
    const labels = {
      easy: 'Fácil',
      medium: 'Médio',
      hard: 'Difícil'
    };
    return labels[difficulty] || difficulty;
  };

  if (loading) {
    return (
      <MainLayout title="Carregando...">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </MainLayout>
    );
  }

  if (!habit || !progress) {
    return null;
  }

  return (
    <MainLayout 
      title={habit.title}
      subtitle={habit.description || 'Detalhes do hábito'}
    >
      <div className="habit-detail-page">
        {/* Back Button */}
        <Button
          variant="ghost"
          icon={<ArrowLeft size={20} />}
          onClick={() => navigate('/habits')}
          className="back-button"
        >
          Voltar para Hábitos
        </Button>

        {/* Habit Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="habit-detail-header" glow>
            <div className="header-content-detail">
              <div 
                className="habit-icon-large"
                style={{ background: habit.color }}
              >
                {habit.icon}
              </div>

              <div className="header-info-detail">
                <h1 className="habit-title-large">{habit.title}</h1>
                {habit.description && (
                  <p className="habit-description-large">{habit.description}</p>
                )}

                <div className="habit-badges">
                  <span className="badge badge-category">{habit.category}</span>
                  <span className="badge badge-frequency">
                    {getFrequencyLabel(habit.frequency)}
                  </span>
                  <span className="badge badge-difficulty">
                    {getDifficultyLabel(habit.difficulty)}
                  </span>
                  <span className="badge badge-xp">
                    <Zap size={14} />
                    +{habit.xpReward} XP
                  </span>
                </div>
              </div>

              <div className="header-actions-detail">
                <Button
                  variant="success"
                  size="lg"
                  icon={<CheckCircle size={20} />}
                  onClick={handleComplete}
                >
                  Concluir Hoje
                </Button>
                <div className="action-buttons">
                  <Button
                    variant="outline"
                    icon={<Edit size={18} />}
                    onClick={() => navigate(`/habits`)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    icon={<Trash2 size={18} />}
                    onClick={handleDelete}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="detail-stats-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="detail-stat-card">
              <div className="stat-icon-detail">
                <Target size={32} />
              </div>
              <div className="stat-content-detail">
                <p className="stat-label-detail">Total de Conclusões</p>
                <h3 className="stat-value-detail">{progress.totalCompletions}</h3>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="detail-stat-card">
              <div className="stat-icon-detail stat-icon-fire">
                <Flame size={32} />
              </div>
              <div className="stat-content-detail">
                <p className="stat-label-detail">Sequência Atual</p>
                <h3 className="stat-value-detail">{progress.currentStreak} dias</h3>
                <p className="stat-subtitle-detail">
                  Recorde: {progress.maxStreak} dias
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="detail-stat-card">
              <div className="stat-icon-detail stat-icon-success">
                <TrendingUp size={32} />
              </div>
              <div className="stat-content-detail">
                <p className="stat-label-detail">Taxa de Sucesso</p>
                <h3 className="stat-value-detail">{progress.successRate}%</h3>
                <p className="stat-subtitle-detail">
                  Baseado na frequência
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="detail-stat-card">
              <div className="stat-icon-detail stat-icon-calendar">
                <Calendar size={32} />
              </div>
              <div className="stat-content-detail">
                <p className="stat-label-detail">Melhor Dia</p>
                <h3 className="stat-value-detail">{progress.bestDay || 'N/A'}</h3>
                <p className="stat-subtitle-detail">
                  Dia com mais conclusões
                </p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity & History */}
        <div className="detail-content-grid">
          {/* Recent Completions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="recent-completions-card">
              <div className="card-header-detail">
                <h3 className="card-title-detail">
                  <Clock size={20} />
                  Histórico Recente
                </h3>
                <span className="completion-count">
                  {progress.recentCompletions} nos últimos 30 dias
                </span>
              </div>

              <div className="completions-list">
                {progress.recentHistory && progress.recentHistory.length > 0 ? (
                  progress.recentHistory.map((completion, index) => (
                    <motion.div
                      key={completion.id}
                      className="completion-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                    >
                      <div className="completion-check">
                        <CheckCircle size={20} />
                      </div>
                      <div className="completion-info">
                        <p className="completion-date">
                          {new Date(completion.completedAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="completion-time">
                          {new Date(completion.completedAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {completion.note && (
                        <div className="completion-note">
                          <p>{completion.note}</p>
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="empty-state-small">
                    <Calendar size={48} className="empty-icon-small" />
                    <p>Nenhuma conclusão recente</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Progress Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="progress-info-card">
              <div className="card-header-detail">
                <h3 className="card-title-detail">
                  <Award size={20} />
                  Informações
                </h3>
              </div>

              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Criado em:</span>
                  <span className="info-value">
                    {new Date(progress.habit.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-label">Última conclusão:</span>
                  <span className="info-value">
                    {progress.lastCompletion 
                      ? new Date(progress.lastCompletion).toLocaleDateString('pt-BR')
                      : 'Nunca'}
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-label">XP total ganho:</span>
                  <span className="info-value">
                    {progress.totalCompletions * habit.xpReward} XP
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-label">Meta:</span>
                  <span className="info-value">
                    {habit.goal}x por {getFrequencyLabel(habit.frequency).toLowerCase()}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-section">
                <h4 className="progress-title">Progresso Geral</h4>
                <div className="progress-bar-detail">
                  <div 
                    className="progress-fill-detail"
                    style={{ width: `${Math.min(progress.successRate, 100)}%` }}
                  >
                    <span className="progress-text-detail">
                      {progress.successRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Motivational Message */}
              <div className="motivation-box">
                {progress.successRate >= 80 ? (
                  <>
                    <p className="motivation-emoji">🔥</p>
                    <p className="motivation-text">
                      Incrível! Continue assim!
                    </p>
                  </>
                ) : progress.successRate >= 50 ? (
                  <>
                    <p className="motivation-emoji">💪</p>
                    <p className="motivation-text">
                      Você está indo bem! Foco na consistência!
                    </p>
                  </>
                ) : (
                  <>
                    <p className="motivation-emoji">🎯</p>
                    <p className="motivation-text">
                      Vamos lá! Cada dia conta!
                    </p>
                  </>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HabitDetail;