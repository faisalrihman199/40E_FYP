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

export const refreshTokenValidator = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required'),
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
