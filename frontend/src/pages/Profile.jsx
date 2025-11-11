import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Edit, 
  Save, 
  X,
  Zap,
  Trophy,
  Target,
  TrendingUp,
  Lock,
  Camera
} from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, progressAPI } from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [summary, setSummary] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    avatar: user?.avatar || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const [statsRes, summaryRes] = await Promise.all([
        userAPI.getStats(),
        progressAPI.getSummary()
      ]);
      
      setStats(statsRes.data.stats);
      setSummary(summaryRes.data.summary);
    } catch (error) {
      console.error('Erro ao carregar dados do perfil:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await userAPI.updateProfile(formData);
      updateUser(response.data.user);
      setSuccess('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setSuccess('Senha alterada com sucesso!');
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('pt-BR', { 
        month: 'long', 
        year: 'numeric' 
      })
    : '';

  return (
    <MainLayout title="Meu Perfil" subtitle="Gerencie suas informações e progresso">
      <div className="profile-page">
        {/* Mensagens de Feedback */}
        {error && (
          <motion.div
            className="alert alert-error"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}
        
        {success && (
          <motion.div
            className="alert alert-success"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {success}
          </motion.div>
        )}

        {/* Header do Perfil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="profile-header" glow>
            <div className="profile-banner">
              <div className="banner-gradient"></div>
            </div>
            
            <div className="profile-info-section">
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button className="avatar-edit-btn">
                    <Camera size={18} />
                  </button>
                </div>
                <div className="profile-level-badge">
                  <Zap size={16} />
                  <span>{user?.level}</span>
                </div>
              </div>

              <div className="profile-main-info">
                <h1 className="profile-name">{user?.name}</h1>
                <p className="profile-email">{user?.email}</p>
                <div className="profile-meta">
                  <span className="meta-item">
                    <Calendar size={16} />
                    Membro desde {memberSince}
                  </span>
                </div>
              </div>

              <div className="profile-actions">
                {isEditing ? (
                  <>
                    <Button 
                      variant="ghost" 
                      icon={<X size={18} />}
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      variant="primary" 
                      icon={<Save size={18} />}
                      onClick={handleUpdateProfile}
                      loading={loading}
                    >
                      Salvar
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="primary" 
                    icon={<Edit size={18} />}
                    onClick={() => setIsEditing(true)}
                  >
                    Editar Perfil
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="profile-stats-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="stat-card-profile">
              <div className="stat-icon-profile">
                <Zap size={32} />
              </div>
              <div className="stat-content-profile">
                <p className="stat-label-profile">Experiência Total</p>
                <h3 className="stat-value-profile">{user?.xp || 0} XP</h3>
                <div className="progress-bar-profile">
                  <div 
                    className="progress-fill-profile"
                    style={{ width: `${((user?.xp % 100) / 100) * 100}%` }}
                  ></div>
                </div>
                <p className="stat-subtitle-profile">
                  {100 - (user?.xp % 100)} XP até o nível {(user?.level || 1) + 1}
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="stat-card-profile">
              <div className="stat-icon-profile stat-icon-success">
                <Target size={32} />
              </div>
              <div className="stat-content-profile">
                <p className="stat-label-profile">Hábitos Ativos</p>
                <h3 className="stat-value-profile">{stats?.activeHabits || 0}</h3>
                <p className="stat-subtitle-profile">
                  {stats?.totalCompletions || 0} conclusões no total
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="stat-card-profile">
              <div className="stat-icon-profile stat-icon-warning">
                <Trophy size={32} />
              </div>
              <div className="stat-content-profile">
                <p className="stat-label-profile">Conquistas</p>
                <h3 className="stat-value-profile">
                  {stats?.unlockedAchievements || 0}/{stats?.totalAchievements || 0}
                </h3>
                <p className="stat-subtitle-profile">
                  {Math.round((stats?.unlockedAchievements / stats?.totalAchievements) * 100) || 0}% completo
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="stat-card-profile">
              <div className="stat-icon-profile stat-icon-info">
                <TrendingUp size={32} />
              </div>
              <div className="stat-content-profile">
                <p className="stat-label-profile">Taxa de Sucesso</p>
                <h3 className="stat-value-profile">{stats?.completionRate || 0}%</h3>
                <p className="stat-subtitle-profile">
                  Últimos 7 dias
                </p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Formulário de Edição */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="edit-form-card">
              <h3 className="form-title">Editar Informações</h3>
              <form onSubmit={handleUpdateProfile} className="profile-form">
                <Input
                  label="Nome"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  icon={<User size={20} />}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  value={user?.email}
                  disabled
                  icon={<Mail size={20} />}
                />

                <div className="form-footer-profile">
                  <p className="form-note">
                    Para alterar seu email, entre em contato com o suporte.
                  </p>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Segurança */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="security-card">
            <div className="security-header">
              <div>
                <h3 className="section-title">Segurança</h3>
                <p className="section-subtitle">Gerencie sua senha e segurança da conta</p>
              </div>
              <Lock size={32} className="section-icon" />
            </div>

            <div className="security-content">
              <div className="security-item">
                <div className="security-info">
                  <h4>Senha</h4>
                  <p>Última alteração há 30 dias</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPasswordModal(true)}
                >
                  Alterar Senha
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Modal de Alteração de Senha */}
        {showPasswordModal && (
          <>
            <div 
              className="modal-overlay" 
              onClick={() => setShowPasswordModal(false)}
            />
            <motion.div
              className="modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="modal-header">
                <h2>Alterar Senha</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowPasswordModal(false)}
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="modal-content">
                <Input
                  label="Senha Atual"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ 
                    ...passwordData, 
                    currentPassword: e.target.value 
                  })}
                  icon={<Lock size={20} />}
                  required
                />

                <Input
                  label="Nova Senha"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ 
                    ...passwordData, 
                    newPassword: e.target.value 
                  })}
                  icon={<Lock size={20} />}
                  required
                />

                <Input
                  label="Confirmar Nova Senha"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ 
                    ...passwordData, 
                    confirmPassword: e.target.value 
                  })}
                  icon={<Lock size={20} />}
                  required
                />

                <div className="modal-footer">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    loading={loading}
                  >
                    Alterar Senha
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Profile;