import React, { useState } from 'react';
import { useAppContext } from '../../Contexts/AppContext';
import './ParentalPinLogin.css';

const ParentalPinLogin = ({ onClose, onSuccess }) => {
  const { verifyParentalPin } = useAppContext();
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handlePinChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      document.getElementById(`pin-${index + 1}`)?.focus();
    }

    // Auto-verify when all 4 digits entered
    if (index === 3 && value) {
      const enteredPin = newPin.join('');
      verifyPin(enteredPin);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      document.getElementById(`pin-${index - 1}`)?.focus();
    }
  };

  const verifyPin = async (enteredPin) => {
    setIsVerifying(true);
    
    try {
      const result = await verifyParentalPin(enteredPin);
      
      if (result.success) {
        setError('');
        const audio = new Audio('/correct.mp3');
        audio.play().catch(() => {});
        setTimeout(() => {
          onSuccess();
        }, 500);
      } else {
        setError(result.message || 'Incorrect PIN. Try again!');
        setIsShaking(true);
        const audio = new Audio('/incorrect.mp3');
        audio.play().catch(() => {});
        setTimeout(() => {
          setPin(['', '', '', '']);
          setIsShaking(false);
          document.getElementById('pin-0')?.focus();
        }, 600);
      }
    } catch (err) {
      console.error('PIN verification error:', err);
      setError('Verification failed. Please try again.');
      setIsShaking(true);
      setTimeout(() => {
        setPin(['', '', '', '']);
        setIsShaking(false);
        document.getElementById('pin-0')?.focus();
      }, 600);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredPin = pin.join('');
    if (enteredPin.length === 4) {
      verifyPin(enteredPin);
    } else {
      setError('Please enter complete 4-digit PIN');
    }
  };

  return (
    <div className="parental-pin-overlay">
      <div className={`parental-pin-modal ${isShaking ? 'shake' : ''}`}>
        <button className="pin-close-btn" onClick={onClose}>✕</button>
        
        <div className="pin-header">
          <div className="pin-icon">🔐</div>
          <h2 className="pin-title">Parental Control</h2>
          <p className="pin-subtitle">Enter your 4-digit PIN to access dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="pin-form">
          <div className="pin-inputs">
            {pin.map((digit, index) => (
              <input
                key={index}
                id={`pin-${index}`}
                type="password"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="pin-input"
                autoFocus={index === 0}
              />
            ))}
          </div>

          {error && (
            <div className="pin-error">
              ⚠️ {error}
            </div>
          )}

          <button type="submit" className="pin-submit-btn" disabled={isVerifying}>
            {isVerifying ? 'Verifying...' : 'Access Dashboard'}
          </button>

          <div className="pin-hint">
            <p className="pin-hint-small">Enter your parental control PIN</p>
          </div>
        </form>

        {/* Decorative elements */}
        <div className="pin-decoration pin-rainbow-1">🌈</div>
        <div className="pin-decoration pin-cloud-1">☁️</div>
        <div className="pin-decoration pin-star-1">⭐</div>
      </div>
    </div>
  );
};

export default ParentalPinLogin;
