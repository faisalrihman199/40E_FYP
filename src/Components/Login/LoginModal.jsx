import React, { useState } from 'react';
import './LoginModal.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginModal = ({ onClose, onLogin, setShowSignupModal }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Both fields are required.");
      return;
    }
    setError('');
    onLogin({ username });
    onClose();
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <button className="login-close-button" onClick={onClose}>×</button>
        <div className="login-icon" role="img" aria-label="login icon">🔐</div>
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtext">Login to unlock all the features of the game</p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
          <div className="password-wrapper w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input w-full"
            />
            <button
              type="button"
              className="toggle-password-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-button">Login</button>
          <div className="login-links">
            <div className="forgot-password-wrapper">
              <button type="button" className="login-link-button forgot">Forgot Password?</button>
            </div>
            <button
              type="button"
              className="login-link-button signup"
              onClick={() => {
                onClose();
                setShowSignupModal(true);
              }}
            >
              Don't have an account? Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
