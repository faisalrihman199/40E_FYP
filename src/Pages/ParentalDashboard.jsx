import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../Contexts/AppContext';
import './ParentalDashboard.css';

const ParentalDashboard = () => {
  const navigate = useNavigate();
  const { getDashboard, user, updateParentalPin, clearAllData: clearDataAPI } = useAppContext();
  const [dashboardData, setDashboardData] = useState({
    totalGamesPlayed: 0,
    totalLearningModules: 0,
    averageScore: 0,
    totalTimeSpent: 0,
    gameHistory: [],
    learningHistory: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinData, setPinData] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: ''
  });
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');
  const [showClearDataModal, setShowClearDataModal] = useState(false);
  const [clearDataPin, setClearDataPin] = useState('');
  const [clearDataError, setClearDataError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getDashboard();
      
      console.log('Dashboard API response:', response);
      
      // The API returns { success: true, data: {...} }
      // The data property contains the actual dashboard data
      const apiData = response.data || response;
      
      console.log('Dashboard data:', apiData);
      
      // Transform API response to match dashboard format
      setDashboardData({
        totalGamesPlayed: apiData.gameStats?.totalGames || 0,
        totalLearningModules: apiData.learningStats?.totalModules || 0,
        averageScore: Math.round(parseFloat(apiData.gameStats?.averageScore || 0)),
        totalTimeSpent: (apiData.gameStats?.totalGameTime || 0) + (apiData.learningStats?.totalLearningTime || 0),
        gameHistory: apiData.recentActivities?.filter(a => a.activityType === 'game') || [],
        learningHistory: apiData.recentActivities?.filter(a => a.activityType === 'learning') || [],
        recentActivity: apiData.recentActivities || []
      });
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalTime = (log) => {
    const totalMinutes = log.reduce((sum, item) => sum + (item.duration || 0), 0);
    return Math.round(totalMinutes);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleLogout = () => {
    const audio = new Audio('/button_click.mp3');
    audio.play().catch(() => {});
    navigate('/');
  };

  const clearAllData = () => {
    setShowClearDataModal(true);
    setClearDataPin('');
    setClearDataError('');
  };

  const handleClearDataSubmit = async (e) => {
    e.preventDefault();
    setClearDataError('');

    if (clearDataPin.length !== 4) {
      setClearDataError('PIN must be 4 digits');
      return;
    }

    if (window.confirm('Are you sure you want to clear all child progress data? This action cannot be undone.')) {
      try {
        const result = await clearDataAPI(clearDataPin);
        
        if (result.success) {
          alert('All progress data has been cleared successfully!');
          setShowClearDataModal(false);
          loadDashboardData(); // Reload dashboard to show cleared data
        } else {
          setClearDataError(result.message || 'Failed to clear data. Please check your PIN.');
        }
      } catch (error) {
        setClearDataError('An error occurred. Please try again.');
      }
    }
  };

  const handleChangePinClick = () => {
    setShowPinModal(true);
    setPinData({ currentPin: '', newPin: '', confirmPin: '' });
    setPinError('');
    setPinSuccess('');
  };

  const handlePinChange = (e) => {
    const { name, value } = e.target;
    // Only allow 4 digits
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPinData(prev => ({ ...prev, [name]: value }));
      setPinError('');
    }
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    setPinError('');
    setPinSuccess('');

    // Validation
    if (pinData.currentPin.length !== 4) {
      setPinError('Current PIN must be 4 digits');
      return;
    }
    if (pinData.newPin.length !== 4) {
      setPinError('New PIN must be 4 digits');
      return;
    }
    if (pinData.newPin !== pinData.confirmPin) {
      setPinError('New PIN and confirmation do not match');
      return;
    }
    if (pinData.currentPin === pinData.newPin) {
      setPinError('New PIN must be different from current PIN');
      return;
    }

    try {
      const result = await updateParentalPin(
        pinData.currentPin,
        pinData.newPin
      );

      if (result.success) {
        setPinSuccess('PIN changed successfully!');
        setTimeout(() => {
          setShowPinModal(false);
        }, 2000);
      } else {
        setPinError(result.message || 'Failed to change PIN. Please check your current PIN.');
      }
    } catch (error) {
      setPinError('An error occurred. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="parental-dashboard">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.5rem',
          color: '#FF1493'
        }}>
          Loading Dashboard... 🎀
        </div>
      </div>
    );
  }

  return (
    <div className="parental-dashboard">
      {error && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#ff4d4d',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '10px',
          zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {error}
        </div>
      )}
      {/* Background decorations */}
      <div className="dashboard-bg-glow pink"></div>
      <div className="dashboard-bg-glow cyan"></div>
      
      <div className="dashboard-rainbow dashboard-rainbow-1">🌈</div>
      <div className="dashboard-rainbow dashboard-rainbow-2">🌈</div>
      <div className="dashboard-cloud dashboard-cloud-1">☁️</div>
      <div className="dashboard-cloud dashboard-cloud-2">☁️</div>
      <div className="dashboard-star dashboard-star-1">⭐</div>
      <div className="dashboard-star dashboard-star-2">✨</div>
      <div className="dashboard-star dashboard-star-3">💫</div>

      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-logo">
            <span className="dashboard-logo-icon">👨‍👩‍👧‍👦</span>
            <div>
              <h1 className="dashboard-title">Parental Dashboard</h1>
              <p className="dashboard-subtitle">Monitor your child's learning journey</p>
            </div>
          </div>
          <button className="dashboard-logout-btn" onClick={handleLogout}>
            🏠 Back to Home
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card stat-card-games">
          <div className="stat-icon">🎮</div>
          <div className="stat-info">
            <h3 className="stat-number">{dashboardData.totalGamesPlayed}</h3>
            <p className="stat-label">Games Played</p>
          </div>
        </div>

        <div className="stat-card stat-card-learning">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3 className="stat-number">{dashboardData.totalLearningModules}</h3>
            <p className="stat-label">Lessons Completed</p>
          </div>
        </div>

        <div className="stat-card stat-card-score">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <h3 className="stat-number">{dashboardData.averageScore}%</h3>
            <p className="stat-label">Average Score</p>
          </div>
        </div>

        <div className="stat-card stat-card-time">
          <div className="stat-icon">⏰</div>
          <div className="stat-info">
            <h3 className="stat-number">{dashboardData.totalTimeSpent}</h3>
            <p className="stat-label">Minutes Spent</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Recent Activity */}
        <div className="dashboard-card activity-card">
          <h2 className="card-title">
            <span className="card-title-icon">📊</span>
            Recent Activity
          </h2>
          <div className="activity-list">
            {dashboardData.recentActivity.length > 0 ? (
              dashboardData.recentActivity.slice(0, 10).map((activity, index) => (
                <div key={activity.id || index} className="activity-item">
                  <div className="activity-icon">{activity.activityType === 'game' ? '🎮' : '📚'}</div>
                  <div className="activity-details">
                    <p className="activity-name">{activity.activityName}</p>
                    <p className="activity-time">{formatDate(activity.timestamp)}</p>
                  </div>
                  <div className="activity-badge">
                    {activity.score !== undefined && (
                      <span className={`score-badge ${activity.score >= 70 ? 'score-good' : 'score-fair'}`}>
                        {activity.score}%
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p className="empty-icon">📭</p>
                <p className="empty-text">No activity yet. Start learning or playing games!</p>
              </div>
            )}
          </div>
        </div>



        {/* Settings */}
        <div className="dashboard-card settings-card">
          <h2 className="card-title">
            <span className="card-title-icon">⚙️</span>
            Quick Settings
          </h2>
          <div className="settings-actions">
            <button className="settings-btn settings-btn-warning" onClick={clearAllData}>
              🗑️ Clear All Progress Data
            </button>
            <button className="settings-btn settings-btn-primary" onClick={handleChangePinClick}>
              🔒 Change PIN
            </button>
          </div>
        </div>
      </div>

      {/* Change PIN Modal */}
      {showPinModal && (
        <div className="modal-overlay" onClick={() => setShowPinModal(false)}>
          <div className="modal-content pin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🔒 Change Parental PIN</h2>
              <button className="modal-close" onClick={() => setShowPinModal(false)}>×</button>
            </div>
            
            <form onSubmit={handlePinSubmit} className="pin-form">
              {pinError && (
                <div className="pin-message pin-error">
                  {pinError}
                </div>
              )}
              
              {pinSuccess && (
                <div className="pin-message pin-success">
                  ✅ {pinSuccess}
                </div>
              )}

              <div className="pin-input-group">
                <label htmlFor="currentPin">Current PIN</label>
                <input
                  type="password"
                  id="currentPin"
                  name="currentPin"
                  value={pinData.currentPin}
                  onChange={handlePinChange}
                  maxLength={4}
                  placeholder="••••"
                  className="pin-input"
                  autoFocus
                />
              </div>

              <div className="pin-input-group">
                <label htmlFor="newPin">New PIN</label>
                <input
                  type="password"
                  id="newPin"
                  name="newPin"
                  value={pinData.newPin}
                  onChange={handlePinChange}
                  maxLength={4}
                  placeholder="••••"
                  className="pin-input"
                />
              </div>

              <div className="pin-input-group">
                <label htmlFor="confirmPin">Confirm New PIN</label>
                <input
                  type="password"
                  id="confirmPin"
                  name="confirmPin"
                  value={pinData.confirmPin}
                  onChange={handlePinChange}
                  maxLength={4}
                  placeholder="••••"
                  className="pin-input"
                />
              </div>

              <div className="pin-modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowPinModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={pinSuccess}>
                  Change PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clear Data Modal */}
      {showClearDataModal && (
        <div className="modal-overlay" onClick={() => setShowClearDataModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowClearDataModal(false)}>×</button>
            <h3>Clear All Progress Data</h3>
            <p className="modal-warning">⚠️ This will permanently delete all game sessions and learning progress!</p>
            
            <form onSubmit={handleClearDataSubmit} className="pin-form">
              {clearDataError && <div className="pin-message pin-error">{clearDataError}</div>}
              
              <div className="pin-input-group">
                <label htmlFor="clearDataPin">Enter PIN to Confirm</label>
                <input
                  type="password"
                  id="clearDataPin"
                  value={clearDataPin}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 4 && /^\d*$/.test(value)) {
                      setClearDataPin(value);
                      setClearDataError('');
                    }
                  }}
                  maxLength={4}
                  placeholder="••••"
                  className="pin-input"
                  autoFocus
                />
              </div>

              <div className="pin-modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowClearDataModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit btn-danger">
                  Clear All Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentalDashboard;
