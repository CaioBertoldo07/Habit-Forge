import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import HabitDetail from './pages/HabitDetail';
import Achievements from './pages/Achievements';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import './App.css';
import { io } from 'socket.io-client';
import RewardToast from './components/gamefication/RewardToast';
import { useState, useEffect } from 'react';

// Componente de rota protegida
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const [rewardToast, setRewardToast] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('habit_completed', (data) => setRewardToast(data));
    return () => socket.disconnect();
  }, []);

  return (
    <div className="app">
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        
        {/* Rotas protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/habits"
          element={
            <ProtectedRoute>
              <Habits />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/habits/:id"
          element={
            <ProtectedRoute>
              <HabitDetail />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <Achievements />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect raiz para dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>

      {rewardToast && (
        <RewardToast 
          rewards={rewardToast} 
          onClose={() => setRewardToast(null)} 
        />
      )}
    </div>
  );
}

export default App;