import React, { useState } from 'react';
import './SignupModal.css';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignupModal = ({ onClose, onSignup, setShowLoginModal }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = (data) => {
    onSignup(data);
    onClose();
  };

  return (
    <div className="signup-modal-overlay">
      <div className="signup-modal">
        <button className="signup-close-button" onClick={onClose}>×</button>
        <div className="signup-icon" role="img" aria-label="signup icon">📋</div>
        <h2 className="signup-title">Create Your Account</h2>
        <p className="signup-subtext">Join the mission to learn about safety and play the game!</p>

        <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
          <input className="signup-input" placeholder="First Name" {...register('firstName', { required: true })} />
          {errors.firstName && <p className="signup-error">First name is required</p>}

          <input className="signup-input" placeholder="Last Name" {...register('lastName', { required: true })} />
          {errors.lastName && <p className="signup-error">Last name is required</p>}

          <input className="signup-input" placeholder="Email" type="email" {...register('email', { required: true })} />
          {errors.email && <p className="signup-error">Email is required</p>}

          <div className="password-wrapper w-full">
            <input className="signup-input w-full" placeholder="Password" type={showPassword ? 'text' : 'password'} {...register('password', { required: true })} />
            <button type="button" className="toggle-password-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <p className="signup-error">Password is required</p>}

          <div className="password-wrapper w-full">
            <input className="signup-input w-full" placeholder="Confirm Password" type={showConfirmPassword ? 'text' : 'password'} {...register('confirmPassword', { required: true })} />
            <button type="button" className="toggle-password-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && <p className="signup-error">Please confirm your password</p>}

          <button type="submit" className="signup-button">Sign Up</button>
        </form>

        <button
          type="button"
          className="login-link-button signup mt-5"
          onClick={() => {
            onClose();
            setShowLoginModal(true);
          }}
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
};

export default SignupModal;
