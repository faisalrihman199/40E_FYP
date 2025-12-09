import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../Contexts/AppContext';
import './CSS/Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAppContext();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    childName: '',
    childAge: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.firstName || formData.firstName.length < 2) {
      newErrors.firstName = 'First name is required (min 2 characters)';
    }
    
    if (!formData.lastName || formData.lastName.length < 2) {
      newErrors.lastName = 'Last name is required (min 2 characters)';
    }
    
    if (!formData.childName || formData.childName.length < 2) {
      newErrors.childName = 'Child name is required (min 2 characters)';
    }
    
    const age = parseInt(formData.childAge);
    if (!formData.childAge || isNaN(age) || age < 3 || age > 12) {
      newErrors.childAge = 'Child age must be between 3 and 12';
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
      const { confirmPassword, ...registrationData } = formData;
      registrationData.childAge = parseInt(registrationData.childAge);
      
      const result = await register(registrationData);
      
      if (result.success) {
        setMessage({ 
          text: '✅ Registration successful! You can now login.', 
          type: 'success' 
        });
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          childName: '',
          childAge: ''
        });
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setMessage({ text: result.message || 'Registration failed. Please try again.', type: 'error' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage({ text: 'An error occurred. Please try again.', type: 'error' });
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
        <div className="floating-decoration">🎨</div>
        <div className="floating-decoration">🎯</div>
      </div>

      <div className="auth-card signup-card">
        <div className="auth-header">
          <h1 className="auth-title">Join Sakina! 🎉</h1>
          <p className="auth-subtitle">Create an account for safe learning</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Your First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className={errors.firstName ? 'error' : ''}
                disabled={loading}
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Your Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className={errors.lastName ? 'error' : ''}
                disabled={loading}
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className={errors.email ? 'error' : ''}
              disabled={loading}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 8 characters"
                  className={errors.password ? 'error' : ''}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className={errors.confirmPassword ? 'error' : ''}
                disabled={loading}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          </div>

          <div className="divider">
            <span>Child Information</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="childName">Child's Name</label>
              <input
                type="text"
                id="childName"
                name="childName"
                value={formData.childName}
                onChange={handleChange}
                placeholder="Emma"
                className={errors.childName ? 'error' : ''}
                disabled={loading}
              />
              {errors.childName && <span className="error-text">{errors.childName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="childAge">Child's Age</label>
              <input
                type="number"
                id="childAge"
                name="childAge"
                value={formData.childAge}
                onChange={handleChange}
                placeholder="7"
                min="3"
                max="12"
                className={errors.childAge ? 'error' : ''}
                disabled={loading}
              />
              {errors.childAge && <span className="error-text">{errors.childAge}</span>}
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              'Sign Up 🚀'
            )}
          </button>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
