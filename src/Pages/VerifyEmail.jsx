import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../Contexts/AppContext';
import './CSS/Auth.css';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { authService } = useAppContext();
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. No token provided.');
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        
        if (response.success) {
          setStatus('success');
          setMessage('🎉 Email verified successfully! You can now login.');
          
          // Start countdown
          const interval = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(interval);
                navigate('/login');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          return () => clearInterval(interval);
        } else {
          setStatus('error');
          setMessage(response.message || 'Email verification failed. The link may be expired or invalid.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage(error.response?.data?.message || 'An error occurred during verification. Please try again or contact support.');
      }
    };

    verifyEmail();
  }, [searchParams, authService, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="floating-decoration">🌈</div>
        <div className="floating-decoration">☁️</div>
        <div className="floating-decoration">⭐</div>
        <div className="floating-decoration">✨</div>
        <div className="floating-decoration">💫</div>
        <div className="floating-decoration">🎨</div>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">
            {status === 'verifying' && '⏳ Verifying Email...'}
            {status === 'success' && '✅ Email Verified!'}
            {status === 'error' && '❌ Verification Failed'}
          </h1>
        </div>

        <div className="verification-content">
          {status === 'verifying' && (
            <div className="verification-loading">
              <div className="spinner-large"></div>
              <p>Please wait while we verify your email address...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="verification-success">
              <div className="success-icon">🎉</div>
              <p className="verification-message">{message}</p>
              <p className="verification-redirect">
                Redirecting to login in <strong>{countdown}</strong> seconds...
              </p>
              <button 
                className="auth-button"
                onClick={() => navigate('/login')}
              >
                Go to Login Now
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="verification-error">
              <div className="error-icon">😞</div>
              <p className="verification-message">{message}</p>
              <div className="verification-actions">
                <button 
                  className="auth-button"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up Again
                </button>
                <button 
                  className="auth-button secondary"
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
