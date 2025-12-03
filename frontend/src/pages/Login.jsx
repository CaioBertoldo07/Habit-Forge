import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Sparkles, Zap, Trophy, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Partículas flutuantes de fundo
  const particles = Array.from({ length: 20 }, (_, i) => i);

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🔵 Iniciando login...', loginData);

    try {
      const result = await login(loginData);
      
      console.log('🟢 Resultado do login:', result);
      
      if (result.success) {
        console.log('✅ Login bem-sucedido, redirecionando...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
      } else {
        console.log('❌ Erro no login:', result.error);
        setError(result.error);
      }
    } catch (err) {
      console.error('🔴 Erro no login:', err);
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!registerData.name || !registerData.email || !registerData.password) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    if (registerData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    const result = await register({ 
      name: registerData.name,
      email: registerData.email, 
      password: registerData.password 
    });

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setLoginData({ email: '', password: '' });
    setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="login-page">
      {/* Partículas de fundo animadas */}
      <div className="particles-container">
        {particles.map((particle) => (
          <motion.div
            key={particle}
            className="particle"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: [null, Math.random() * -100 - 50],
              x: [null, Math.random() * 100 - 50],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Grid de fundo */}
      <div className="grid-background"></div>

      {/* Container principal */}
      <div className="login-container">
        {/* Lado esquerdo - Branding */}
        <motion.div 
          className="login-branding"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            className="branding-icon"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Target size={80} />
          </motion.div>

          <motion.h1 
            className="branding-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Habit Forge
          </motion.h1>

          <motion.p 
            className="branding-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Forme hábitos, não apenas intenções
          </motion.p>

          {/* Features */}
          <motion.div 
            className="branding-features"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <div className="feature-item">
              <Zap className="feature-icon" />
              <span>Sistema de XP e Níveis</span>
            </div>
            <div className="feature-item">
              <Trophy className="feature-icon" />
              <span>Conquistas Épicas</span>
            </div>
            <div className="feature-item">
              <Sparkles className="feature-icon" />
              <span>Progresso Visual</span>
            </div>
          </motion.div>

          {/* Estatísticas animadas */}
          <motion.div 
            className="branding-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <div className="stat-item">
              <motion.span 
                className="stat-number"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring" }}
              >
                10K+
              </motion.span>
              <span className="stat-label">Usuários</span>
            </div>
            <div className="stat-item">
              <motion.span 
                className="stat-number"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.4, type: "spring" }}
              >
                50K+
              </motion.span>
              <span className="stat-label">Hábitos Criados</span>
            </div>
            <div className="stat-item">
              <motion.span 
                className="stat-number"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.6, type: "spring" }}
              >
                1M+
              </motion.span>
              <span className="stat-label">Objetivos Alcançados</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Lado direito - Formulário */}
        <motion.div 
          className="login-form-container"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="login-form-card">
            {/* Toggle Login/Register */}
            <div className="form-toggle">
              <button
                className={`toggle-btn ${isLogin ? 'active' : ''}`}
                onClick={() => isLogin || toggleMode()}
              >
                Entrar
              </button>
              <button
                className={`toggle-btn ${!isLogin ? 'active' : ''}`}
                onClick={() => !isLogin || toggleMode()}
              >
                Registrar
              </button>
              <motion.div 
                className="toggle-indicator"
                animate={{ x: isLogin ? 0 : '100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>

            {/* Título dinâmico */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="form-header"
              >
                <h2 className="form-title">
                  {isLogin ? 'Bem-vindo de volta!' : 'Comece sua jornada!'}
                </h2>
                <p className="form-description">
                  {isLogin 
                    ? 'Entre para continuar evoluindo seus hábitos' 
                    : 'Crie sua conta e comece a transformar sua vida'}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Mensagem de erro */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="form-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Zap size={18} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Formulários */}
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.form
                  key="login-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleLoginSubmit}
                  className="auth-form"
                >
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="seu@email.com"
                    icon={<Mail size={20} />}
                    required
                    autoFocus
                  />

                  <Input
                    label="Senha"
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="••••••••"
                    icon={<Lock size={20} />}
                    required
                  />

                  <div className="form-options">
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      <span>Lembrar-me</span>
                    </label>
                    <Link to="/forgot-password" className="forgot-link">
                      Esqueceu a senha?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    icon={<Zap size={20} />}
                  >
                    Entrar
                  </Button>
                </motion.form>
              ) : (
                <motion.form
                  key="register-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleRegisterSubmit}
                  className="auth-form"
                >
                  <Input
                    label="Nome"
                    type="text"
                    name="name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    placeholder="Seu nome"
                    icon={<Sparkles size={20} />}
                    required
                    autoFocus
                  />

                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="seu@email.com"
                    icon={<Mail size={20} />}
                    required
                  />

                  <Input
                    label="Senha"
                    type="password"
                    name="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder="••••••••"
                    icon={<Lock size={20} />}
                    required
                  />

                  <Input
                    label="Confirmar Senha"
                    type="password"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    icon={<Lock size={20} />}
                    required
                  />

                  <Button
                    type="submit"
                    variant="secondary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    icon={<Sparkles size={20} />}
                  >
                    Criar Conta
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Rodapé */}
            <div className="form-footer">
              <p>
                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                <button onClick={toggleMode} className="toggle-mode-btn">
                  {isLogin ? 'Registre-se' : 'Faça login'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;