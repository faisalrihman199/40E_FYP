import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../Contexts/AppContext';
import './CSS/Auth.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { authService } = useAppContext();
  
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [emailSent, setEmailSent] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const result = await authService.forgotPassword(email);
      
      if (result.success) {
        setEmailSent(true);
        setMessage({ 
          text: '✅ Password reset link sent! Please check your email.', 
          type: 'success' 
        });
        setEmail('');
      } else {
        setMessage({ 
          text: result.message || 'Failed to send reset link. Please try again.', 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage({ 
        text: error.response?.data?.message || 'An error occurred. Please try again.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="floating-decoration">🌈</div>
        <div className="floating-decoration">☁️</div>
        <div className="floating-decoration">⭐</div>
        <div className="floating-decoration">✨</div>
        <div className="floating-decoration">💫</div>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Forgot Password? 🔑</h1>
          <p className="auth-subtitle">
            {emailSent 
              ? 'Check your email for reset instructions'
              : 'Enter your email to reset your password'
            }
          </p>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="auth-form">
            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({});
                }}
                placeholder="your.email@example.com"
                className={errors.email ? 'error' : ''}
                disabled={loading}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                'Send Reset Link 📧'
              )}
            </button>

            <div className="auth-footer">
              <p>
                Remember your password?{' '}
                <Link to="/login" className="auth-link">
                  Back to Login
                </Link>
              </p>
            </div>
          </form>
        ) : (
          <div className="email-sent-confirmation">
            <div className="success-icon">📧</div>
            <p className="verification-message">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="auth-subtitle">
              Please check your inbox and click the link to reset your password.
            </p>
            <div className="verification-actions">
              <button 
                className="auth-button"
                onClick={() => navigate('/login')}
              >
                Back to Login
              </button>
              <button 
                className="auth-button secondary"
                onClick={() => setEmailSent(false)}
              >
                Try Another Email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
