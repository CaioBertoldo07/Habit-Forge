import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp } from 'lucide-react';
import './XPBar.css';

/**
 * Barra de Progresso de XP
 * Exibe visualmente o progresso do usuário até o próximo nível
 */

const XPBar = ({ 
  currentXP, 
  requiredXP, 
  currentLevel, 
  nextLevel,
  showLabels = true,
  size = 'medium', // 'small', 'medium', 'large'
  animated = true 
}) => {
  const percentage = Math.min((currentXP / requiredXP) * 100, 100);

  return (
    <div className={`xp-bar-container ${size}`}>
      {showLabels && (
        <div className="xp-bar-header">
          <div className="level-badge current">
            <span>Nível {currentLevel}</span>
          </div>
          <div className="xp-text">
            <span className="xp-current">{currentXP}</span>
            <span className="xp-separator">/</span>
            <span className="xp-required">{requiredXP} XP</span>
          </div>
          <div className="level-badge next">
            <span>Nível {nextLevel}</span>
          </div>
        </div>
      )}

      <div className="xp-bar-track">
        <motion.div
          className="xp-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: animated ? 1.5 : 0, 
            ease: "easeOut" 
          }}
        >
          <div className="xp-bar-glow" />
          
          {percentage > 20 && (
            <motion.span 
              className="xp-percentage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {Math.round(percentage)}%
            </motion.span>
          )}
        </motion.div>

        {/* Partículas de energia */}
        {animated && Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="energy-particle"
            initial={{ 
              left: `${Math.random() * 100}%`,
              opacity: 0 
            }}
            animate={{
              y: [-20, -40],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {percentage >= 100 && (
        <motion.div 
          className="level-up-ready"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Zap size={16} />
          <span>Pronto para o próximo nível!</span>
        </motion.div>
      )}
    </div>
  );
};

export default XPBar;