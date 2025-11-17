import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Trophy, Flame, TrendingUp, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import './RewardToast.css';

/**
 * Toast de Recompensas
 * Exibe notificações animadas quando o usuário ganha XP, sobe de nível, etc.
 */

const RewardToast = ({ rewards, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-fechar após 5 segundos
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    // Confetti se subiu de nível
    if (rewards?.level?.leveledUp) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300); // Aguardar animação de saída
  };

  if (!rewards) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="reward-toast"
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <button className="toast-close" onClick={handleClose}>
            <X size={18} />
          </button>

          <div className="toast-content">
            {/* XP Ganho */}
            {rewards.xp && (
              <motion.div 
                className="reward-item xp-reward"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Zap size={24} className="reward-icon" />
                <div className="reward-details">
                  <span className="reward-label">XP Ganho</span>
                  <span className="reward-value">
                    +{rewards.xp.total} XP
                  </span>
                  {rewards.xp.bonus > 0 && (
                    <span className="reward-bonus">
                      (Base: {rewards.xp.base} + Bônus: {rewards.xp.bonus})
                    </span>
                  )}
                </div>
              </motion.div>
            )}

            {/* Coins Ganhas */}
            {rewards.coins > 0 && (
              <motion.div 
                className="reward-item coins-reward"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <span className="coin-icon">🪙</span>
                <div className="reward-details">
                  <span className="reward-label">Coins</span>
                  <span className="reward-value">+{rewards.coins}</span>
                </div>
              </motion.div>
            )}

            {/* Subiu de Nível */}
            {rewards.level?.leveledUp && (
              <motion.div 
                className="reward-item level-reward"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <TrendingUp size={24} className="reward-icon level-icon" />
                <div className="reward-details">
                  <span className="reward-label">Level Up!</span>
                  <span className="reward-value">
                    Nível {rewards.level.current}
                  </span>
                  {rewards.level.rewards?.title && (
                    <span className="reward-title">
                      "{rewards.level.rewards.title}"
                    </span>
                  )}
                </div>
              </motion.div>
            )}

            {/* Streak Milestone */}
            {rewards.streakMilestone && (
              <motion.div 
                className="reward-item streak-reward"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <span className="milestone-emoji">
                  {rewards.streakMilestone.emoji}
                </span>
                <div className="reward-details">
                  <span className="reward-label">Milestone!</span>
                  <span className="reward-value">
                    {rewards.streakMilestone.message}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Conquistas Desbloqueadas */}
            {rewards.achievements?.unlocked > 0 && (
              <motion.div 
                className="reward-item achievement-reward"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                <Trophy size={24} className="reward-icon achievement-icon" />
                <div className="reward-details">
                  <span className="reward-label">Nova Conquista!</span>
                  <span className="reward-value">
                    {rewards.achievements.unlocked} desbloqueada
                    {rewards.achievements.unlocked > 1 ? 's' : ''}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Streak Atualizado */}
            {rewards.streak && (
              <motion.div 
                className="reward-item streak-info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Flame size={20} className="streak-icon" />
                <span className="streak-text">
                  Sequência: {rewards.streak.streak} dias
                  {rewards.streak.isRecord && " 🎖️ RECORDE!"}
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RewardToast;