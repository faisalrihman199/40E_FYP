import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken
          });

          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      const { accessToken, refreshToken, user } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  }
};

// User Service
export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (updates) => {
    const response = await api.put('/users/profile', updates);
    if (response.data.success) {
      const user = response.data.data.user;
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response.data;
  }
};

// Progress Tracking Service
export const progressService = {
  logGameSession: async (gameData) => {
    const response = await api.post('/progress/game', gameData);
    return response.data;
  },

  logLearningProgress: async (learningData) => {
    const response = await api.post('/progress/learning', learningData);
    return response.data;
  },

  getGameSessions: async (params = {}) => {
    const response = await api.get('/progress/games', { params });
    return response.data;
  },

  getLearningProgress: async (params = {}) => {
    const response = await api.get('/progress/learning', { params });
    return response.data;
  },

  getActivityLogs: async (params = {}) => {
    const response = await api.get('/progress/activities', { params });
    return response.data;
  },

  getAnalytics: async (period = '7') => {
    const response = await api.get('/progress/analytics', { params: { period } });
    return response.data;
  },

  getProgressSummary: async () => {
    const response = await api.get('/progress/summary');
    return response.data;
  }
};

export default api;
