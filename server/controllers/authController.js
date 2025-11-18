import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User, ParentalControl } from '../models/index.js';
import emailService from '../services/emailService.js';
import logger from '../config/logger.js';

class AuthController {
  // Register new user
  async register(req, res) {
    try {
      const { email, password, firstName, lastName, childName, childAge } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered. Please login or use a different email.'
        });
      }

      // Generate email verification token
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');
      const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create user
      const user = await User.create({
        email,
        password, // Will be hashed by beforeCreate hook
        firstName,
        lastName,
        childName,
        childAge,
        emailVerificationToken,
        emailVerificationExpires,
        isEmailVerified: false
      });

      // Create default parental control settings
      await ParentalControl.create({
        userId: user.id,
        pin: process.env.PARENTAL_PIN_DEFAULT || '1234',
        isEnabled: true,
        sessionTimeLimit: 30,
        dailyTimeLimit: 120,
        allowedDays: [0, 1, 2, 3, 4, 5, 6], // All days
        allowedTimeStart: '08:00:00',
        allowedTimeEnd: '20:00:00',
        blockInappropriateContent: true,
        requirePinForSettings: true
      });

      // Send verification email
      try {
        await emailService.sendVerificationEmail(email, emailVerificationToken, firstName);
      } catch (emailError) {
        logger.error('Failed to send verification email:', emailError);
        // Don't fail registration if email fails
      }

      logger.info(`New user registered: ${email}`);

      res.status(201).json({
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
        data: {
          userId: user.id,
          email: user.email,
          firstName: user.firstName,
          childName: user.childName
        }
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed. Please try again.',
        error: error.message
      });
    }
  }

  // Verify email
  async verifyEmail(req, res) {
    try {
      const { token } = req.body;

      const user = await User.findOne({
        where: {
          emailVerificationToken: token,
          isEmailVerified: false
        }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired verification token.'
        });
      }

      // Check if token is expired
      if (new Date() > user.emailVerificationExpires) {
        return res.status(400).json({
          success: false,
          message: 'Verification token has expired. Please request a new one.'
        });
      }

      // Update user
      user.isEmailVerified = true;
      user.emailVerificationToken = null;
      user.emailVerificationExpires = null;
      await user.save();

      // Send welcome email
      try {
        await emailService.sendWelcomeEmail(user.email, user.firstName, user.childName);
      } catch (emailError) {
        logger.error('Failed to send welcome email:', emailError);
      }

      logger.info(`Email verified for user: ${user.email}`);

      res.status(200).json({
        success: true,
        message: 'Email verified successfully! You can now login.',
        data: {
          email: user.email,
          firstName: user.firstName
        }
      });
    } catch (error) {
      logger.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Email verification failed. Please try again.',
        error: error.message
      });
    }
  }

  // Resend verification email
  async resendVerification(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: 'Email is already verified.'
        });
      }

      // Generate new token
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');
      const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      user.emailVerificationToken = emailVerificationToken;
      user.emailVerificationExpires = emailVerificationExpires;
      await user.save();

      // Send verification email
      await emailService.sendVerificationEmail(email, emailVerificationToken, user.firstName);

      logger.info(`Verification email resent to: ${email}`);

      res.status(200).json({
        success: true,
        message: 'Verification email sent! Please check your inbox.'
      });
    } catch (error) {
      logger.error('Resend verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to resend verification email.',
        error: error.message
      });
    }
  }

  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been deactivated. Please contact support.'
        });
      }

      // Check if email is verified
      if (!user.isEmailVerified) {
        return res.status(403).json({
          success: false,
          message: 'Please verify your email before logging in.',
          requiresVerification: true,
          email: user.email
        });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT tokens
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

      logger.info(`User logged in: ${email}`);

      res.status(200).json({
        success: true,
        message: 'Login successful!',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            childName: user.childName,
            childAge: user.childAge
          },
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed. Please try again.',
        error: error.message
      });
    }
  }

  // Refresh access token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token is required.'
        });
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      // Find user
      const user = await User.findByPk(decoded.userId);

      if (!user || !user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Invalid refresh token.'
        });
      }

      // Generate new access token
      const newAccessToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
      );

      res.status(200).json({
        success: true,
        data: {
          accessToken: newAccessToken
        }
      });
    } catch (error) {
      logger.error('Refresh token error:', error);
      res.status(403).json({
        success: false,
        message: 'Invalid or expired refresh token.',
        error: error.message
      });
    }
  }

  // Forgot password
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        // Don't reveal if user exists
        return res.status(200).json({
          success: true,
          message: 'If your email is registered, you will receive a password reset link.'
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      user.passwordResetToken = resetToken;
      user.passwordResetExpires = resetExpires;
      await user.save();

      // Send reset email
      await emailService.sendPasswordResetEmail(email, resetToken, user.firstName);

      logger.info(`Password reset email sent to: ${email}`);

      res.status(200).json({
        success: true,
        message: 'If your email is registered, you will receive a password reset link.'
      });
    } catch (error) {
      logger.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process password reset request.',
        error: error.message
      });
    }
  }

  // Reset password
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      const user = await User.findOne({
        where: {
          passwordResetToken: token
        }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token.'
        });
      }

      // Check if token is expired
      if (new Date() > user.passwordResetExpires) {
        return res.status(400).json({
          success: false,
          message: 'Reset token has expired. Please request a new one.'
        });
      }

      // Update password
      user.password = newPassword; // Will be hashed by beforeUpdate hook
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await user.save();

      logger.info(`Password reset for user: ${user.email}`);

      res.status(200).json({
        success: true,
        message: 'Password reset successfully! You can now login with your new password.'
      });
    } catch (error) {
      logger.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'Password reset failed. Please try again.',
        error: error.message
      });
    }
  }

  // Logout (client-side token removal, but we can log it)
  async logout(req, res) {
    try {
      const userId = req.user.userId;
      
      logger.info(`User logged out: ${userId}`);

      res.status(200).json({
        success: true,
        message: 'Logged out successfully.'
      });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed.',
        error: error.message
      });
    }
  }
}

export default new AuthController();
