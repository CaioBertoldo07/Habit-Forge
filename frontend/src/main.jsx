import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { WebSocketProvider } from './contexts/WebSocketContexts.jsx'; 
import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <WebSocketProvider> 
          <App />
        </WebSocketProvider> 
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);