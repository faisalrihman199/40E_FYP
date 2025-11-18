import { body, param, query, validationResult } from 'express-validator';

// Validation error handler
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  
  next();
};

// Auth validators
export const registerValidator = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('childName')
    .trim()
    .notEmpty()
    .withMessage('Child name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Child name must be between 2 and 50 characters'),
  body('childAge')
    .isInt({ min: 3, max: 12 })
    .withMessage('Child age must be between 3 and 12'),
  validate
];

export const loginValidator = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate
];

export const verifyEmailValidator = [
  body('token')
    .notEmpty()
    .withMessage('Verification token is required')
    .isLength({ min: 32, max: 128 })
    .withMessage('Invalid token format'),
  validate
];

export const resendVerificationValidator = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  validate
];

export const forgotPasswordValidator = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  validate
];

export const resetPasswordValidator = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  validate
];

export const refreshTokenValidator = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required'),
  validate
];

// User validators
export const updateProfileValidator = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('childName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Child name must be between 2 and 50 characters'),
  body('childAge')
    .optional()
    .isInt({ min: 3, max: 12 })
    .withMessage('Child age must be between 3 and 12'),
  validate
];

export const changePasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  validate
];

export const deactivateAccountValidator = [
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate
];

export const deleteAccountValidator = [
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate
];

// Parental control validators
export const verifyPinValidator = [
  body('pin')
    .notEmpty()
    .withMessage('PIN is required')
    .isLength({ min: 4, max: 6 })
    .withMessage('PIN must be 4-6 digits')
    .matches(/^\d+$/)
    .withMessage('PIN must contain only numbers'),
  validate
];

export const updatePinValidator = [
  body('currentPin')
    .notEmpty()
    .withMessage('Current PIN is required')
    .isLength({ min: 4, max: 6 })
    .withMessage('PIN must be 4-6 digits')
    .matches(/^\d+$/)
    .withMessage('PIN must contain only numbers'),
  body('newPin')
    .notEmpty()
    .withMessage('New PIN is required')
    .isLength({ min: 4, max: 6 })
    .withMessage('PIN must be 4-6 digits')
    .matches(/^\d+$/)
    .withMessage('PIN must contain only numbers'),
  validate
];

export const updateSettingsValidator = [
  body('isEnabled')
    .optional()
    .isBoolean()
    .withMessage('isEnabled must be a boolean'),
  body('sessionTimeLimit')
    .optional()
    .isInt({ min: 5, max: 180 })
    .withMessage('Session time limit must be between 5 and 180 minutes'),
  body('dailyTimeLimit')
    .optional()
    .isInt({ min: 15, max: 480 })
    .withMessage('Daily time limit must be between 15 and 480 minutes'),
  body('allowedDays')
    .optional()
    .isArray()
    .withMessage('Allowed days must be an array')
    .custom((value) => {
      if (value.some(day => day < 0 || day > 6)) {
        throw new Error('Allowed days must be between 0 and 6');
      }
      return true;
    }),
  body('allowedTimeStart')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Invalid time format (HH:MM:SS)'),
  body('allowedTimeEnd')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Invalid time format (HH:MM:SS)'),
  body('blockInappropriateContent')
    .optional()
    .isBoolean()
    .withMessage('blockInappropriateContent must be a boolean'),
  body('requirePinForSettings')
    .optional()
    .isBoolean()
    .withMessage('requirePinForSettings must be a boolean'),
  validate
];

export const clearDataValidator = [
  body('pin')
    .notEmpty()
    .withMessage('PIN is required')
    .isLength({ min: 4, max: 6 })
    .withMessage('PIN must be 4-6 digits')
    .matches(/^\d+$/)
    .withMessage('PIN must contain only numbers'),
  validate
];

// Progress validators
export const logGameSessionValidator = [
  body('gameName')
    .trim()
    .notEmpty()
    .withMessage('Game name is required'),
  body('gameType')
    .isIn(['body_touch', 'object_recognition', 'quiz'])
    .withMessage('Invalid game type'),
  body('score')
    .isInt({ min: 0, max: 100 })
    .withMessage('Score must be between 0 and 100'),
  body('correctAnswers')
    .isInt({ min: 0 })
    .withMessage('Correct answers must be a non-negative integer'),
  body('wrongAnswers')
    .isInt({ min: 0 })
    .withMessage('Wrong answers must be a non-negative integer'),
  body('totalAttempts')
    .isInt({ min: 1 })
    .withMessage('Total attempts must be at least 1'),
  body('durationMinutes')
    .isInt({ min: 0 })
    .withMessage('Duration must be a non-negative integer'),
  validate
];

export const logLearningProgressValidator = [
  body('moduleName')
    .trim()
    .notEmpty()
    .withMessage('Module name is required'),
  body('moduleType')
    .isIn(['body_parts', 'objects', 'scenarios', 'introduction'])
    .withMessage('Invalid module type'),
  body('itemsViewed')
    .isInt({ min: 0 })
    .withMessage('Items viewed must be a non-negative integer'),
  body('durationMinutes')
    .isInt({ min: 0 })
    .withMessage('Duration must be a non-negative integer'),
  body('isCompleted')
    .isBoolean()
    .withMessage('isCompleted must be a boolean'),
  validate
];

export const getGameSessionsValidator = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer'),
  query('gameType')
    .optional()
    .isIn(['body_touch', 'object_recognition', 'quiz'])
    .withMessage('Invalid game type'),
  validate
];

export const getLearningProgressValidator = [
  query('moduleType')
    .optional()
    .isIn(['body_parts', 'objects', 'scenarios', 'introduction'])
    .withMessage('Invalid module type'),
  validate
];

export const getActivityLogsValidator = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer'),
  query('activityType')
    .optional()
    .isIn(['game', 'learning', 'login', 'logout'])
    .withMessage('Invalid activity type'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date format'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date format'),
  validate
];

export const getAnalyticsValidator = [
  query('period')
    .optional()
    .isIn(['7', '30', '90', 'all'])
    .withMessage('Period must be 7, 30, 90, or all'),
  validate
];
