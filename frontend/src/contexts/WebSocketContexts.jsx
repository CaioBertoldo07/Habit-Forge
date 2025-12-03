// frontend/src/contexts/WebSocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [ranking, setRanking] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Conectar ao WebSocket
    const newSocket = io('http://localhost:5000', {
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      console.log('✅ WebSocket conectado:', newSocket.id);
      setConnected(true);
      
      // Entrar na sala do usuário
      newSocket.emit('join_room', user.id);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ WebSocket desconectado');
      setConnected(false);
    });

    // Eventos de ranking
    newSocket.on('ranking:update', (data) => {
      console.log('📊 Ranking atualizado:', data);
      setRanking(data.ranking);
      
      // Adicionar notificação se outro usuário ganhou XP
      if (data.updatedUser && data.updatedUser.userId !== user.id) {
        addNotification({
          type: 'ranking',
          message: `${data.updatedUser.name} ganhou ${data.updatedUser.xpGained} XP!`,
          user: data.updatedUser,
        });
      }
    });

    newSocket.on('ranking:position_update', (data) => {
      console.log('📍 Posição atualizada:', data);
      setUserPosition(data);
    });

    // Eventos de hábito completado
    newSocket.on('habit_completed', (data) => {
      console.log('✅ Hábito completado:', data);
    });

    // Eventos de level up
    newSocket.on('level_up', (data) => {
      console.log('⬆️ Level up!', data);
      addNotification({
        type: 'level_up',
        message: `Você subiu para o nível ${data.level}! 🎉`,
        data,
      });
    });

    // Eventos de conquistas
    newSocket.on('achievements_unlocked', (data) => {
      console.log('🏆 Conquistas desbloqueadas:', data);
      data.achievements.forEach((achievement) => {
        addNotification({
          type: 'achievement',
          message: `Nova conquista: ${achievement.title}!`,
          data: achievement,
        });
      });
    });

    // Eventos de streak milestone
    newSocket.on('streak_milestone', (data) => {
      console.log('🔥 Streak milestone:', data);
      addNotification({
        type: 'streak',
        message: data.message,
        data,
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [isAuthenticated, user]);

  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, ...notification }]);
    
    // Remover notificação após 5 segundos
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const value = {
    socket,
    connected,
    ranking,
    userPosition,
    notifications,
    removeNotification,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};