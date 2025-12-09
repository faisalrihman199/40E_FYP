import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService, progressService } from '../services/api';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [instructed, setInstructed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const initUser = () => {
      const storedUser = authService.getCurrentUser();
      const isAuth = authService.isAuthenticated();
      
      if (storedUser && isAuth) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    initUser();
  }, []);

  // Auth functions
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, data: response.data };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setInstructed(false);
    }
  };

  const getUser = () => user;

  // Parental control functions
  const verifyParentalPin = async (pin) => {
    try {
      const response = await parentalService.verifyPin(pin);
      return response;
    } catch (error) {
      console.error('PIN verification error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'PIN verification failed.' 
      };
    }
  };

  const getParentalDashboard = async () => {
    try {
      const response = await parentalService.getDashboard();
      return response;
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      throw error;
    }
  };

  // Alias for getDashboard (same function, different name)
  const getDashboard = getParentalDashboard;

  const updateParentalSettings = async (settings) => {
    try {
      const response = await parentalService.updateSettings(settings);
      return response;
    } catch (error) {
      console.error('Settings update error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update settings.' 
      };
    }
  };

  const updateParentalPin = async (currentPin, newPin) => {
    try {
      const response = await parentalService.updatePin(currentPin, newPin);
      return response;
    } catch (error) {
      console.error('PIN update error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update PIN.' 
      };
    }
  };

  const clearAllData = async (pin) => {
    try {
      const response = await parentalService.clearData(pin);
      return response;
    } catch (error) {
      console.error('Clear data error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to clear data.' 
      };
    }
  };

  // Progress tracking functions
  const logGameActivity = async (gameData) => {
    try {
      console.log('Logging game activity:', gameData);
      const response = await progressService.logGameSession(gameData);
      console.log('Game activity logged:', response);
      return response;
    } catch (error) {
      console.error('Log game error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to log game activity.' 
      };
    }
  };

  const logLearningActivity = async (learningData) => {
    try {
      console.log('Logging learning activity:', learningData);
      const response = await progressService.logLearningProgress(learningData);
      console.log('Learning activity logged:', response);
      return response;
    } catch (error) {
      console.error('Log learning error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to log learning activity.' 
      };
    }
  };

  const getProgressSummary = async () => {
    try {
      const response = await progressService.getProgressSummary();
      return response;
    } catch (error) {
      console.error('Progress summary error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch progress.' 
      };
    }
  };

  const getAnalytics = async (period = '7') => {
    try {
      const response = await progressService.getAnalytics(period);
      return response;
    } catch (error) {
      console.error('Analytics error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch analytics.' 
      };
    }
  };

  const contextValue = {
    // State
    user,
    isAuthenticated,
    loading,
    instructed,
    setInstructed,
    
    // Auth functions
    login,
    register,
    logout,
    getUser,
    

    
    // Progress functions
    logGameActivity,
    logLearningActivity,
    getProgressSummary,
    getAnalytics,
    
    // Services (for direct access if needed)
    authService,
    userService,

    progressService
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

const useAppContext = () => useContext(AppContext);

export { AppProvider, useAppContext, AppContext };
