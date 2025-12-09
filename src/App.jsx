import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Splash from './Pages/Splash';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';

import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';

import Learning from './Pages/Learning';
import Game from './Pages/Game';

import { useAppContext } from './Contexts/AppContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAppContext();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #FFB6C1, #FFE4E1)',
        fontFamily: 'Comic Sans MS, cursive',
        fontSize: '1.5rem',
        color: '#FF1493'
      }}>
        Loading... 🎀
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        
        {/* Protected Routes */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/learning" element={
          <ProtectedRoute>
            <Learning />
          </ProtectedRoute>
        } />
        <Route path="/game" element={
          <ProtectedRoute>
            <Game />
          </ProtectedRoute>
        } />

      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
