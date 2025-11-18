import { User, ParentalControl } from '../models/index.js';
import logger from '../config/logger.js';

class UserController {
  // Get user profile
  async getProfile(req, res) {
    try {
      const userId = req.user.userId;

      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password', 'emailVerificationToken', 'emailVerificationExpires', 'passwordResetToken', 'passwordResetExpires'] },
        include: [
          {
            model: ParentalControl,
            as: 'parentalControl',
            attributes: { exclude: ['pin'] }
          }
        ]
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
      }

      res.status(200).json({
        success: true,
        data: { user }
      });
    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch profile.',
        error: error.message
      });
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const { firstName, lastName, childName, childAge } = req.body;

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
      }

      // Update fields
      if (firstName !== undefined) user.firstName = firstName;
      if (lastName !== undefined) user.lastName = lastName;
      if (childName !== undefined) user.childName = childName;
      if (childAge !== undefined) user.childAge = childAge;

      await user.save();

      logger.info(`Profile updated for user: ${userId}`);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully!',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            childName: user.childName,
            childAge: user.childAge
          }
        }
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile.',
        error: error.message
      });
    }
  }

  // Change password
  async changePassword(req, res) {
    try {
      const userId = req.user.userId;
      const { currentPassword, newPassword } = req.body;

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
      }

      // Verify current password
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect.'
        });
      }

      // Update password
      user.password = newPassword; // Will be hashed by beforeUpdate hook
      await user.save();

      logger.info(`Password changed for user: ${userId}`);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully!'
      });
    } catch (error) {
      logger.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change password.',
        error: error.message
      });
    }
  }

  // Deactivate account
  async deactivateAccount(req, res) {
    try {
      const userId = req.user.userId;
      const { password } = req.body;

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Password is incorrect.'
        });
      }

      // Deactivate account
      user.isActive = false;
      await user.save();

      logger.info(`Account deactivated for user: ${userId}`);

      res.status(200).json({
        success: true,
        message: 'Account deactivated successfully.'
      });
    } catch (error) {
      logger.error('Deactivate account error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to deactivate account.',
        error: error.message
      });
    }
  }

  // Delete account (permanent)
  async deleteAccount(req, res) {
    try {
      const userId = req.user.userId;
      const { password } = req.body;

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Password is incorrect.'
        });
      }

      // Delete user (CASCADE will delete related records)
      await user.destroy();

      logger.info(`Account deleted for user: ${userId}`);

      res.status(200).json({
        success: true,
        message: 'Account deleted permanently.'
      });
    } catch (error) {
      logger.error('Delete account error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete account.',
        error: error.message
      });
    }
  }
}

export default new UserController();
