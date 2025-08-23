const { body, param, validationResult } = require('express-validator');
const { isValidObjectId } = require('mongoose');

// Common validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  };
};

// MongoDB ObjectId validation helper
const validateObjectId = (id) => {
  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID format');
  }
  return true;
};

// -------- Validation Rules --------

// Task creation
exports.validateCreateTask = validate([
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),

  body('dependencies')
    .optional({ nullable: true })
    .isArray().withMessage('Dependencies must be an array')
    .custom((deps) => deps.every(dep => typeof dep === 'string'))
    .withMessage('Each dependency must be a string'),

  body('assets')
    .optional({ nullable: true })
    .isObject().withMessage('Assets must be an object'),

  body('assets.logo')
    .optional({ nullable: true })
    .isString().withMessage('Logo must be a string'),

  body('assets.fontSize')
    .optional({ nullable: true })
    .isString().withMessage('Font size must be a string'),

  body('difficulty')
    .optional({ nullable: true })
    .isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be one of: easy, medium, hard'),

  body('points')
    .optional({ nullable: true })
    .isInt({ min: 0 }).withMessage('Points must be a positive integer'),
]);

// Task update
exports.validateUpdateTask = validate([
  param('id')
    .custom(validateObjectId)
    .withMessage('Invalid task ID format'),

  body('title')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),

  body('dependencies')
    .optional({ nullable: true })
    .isArray().withMessage('Dependencies must be an array')
    .custom((deps) => deps.every(dep => typeof dep === 'string'))
    .withMessage('Each dependency must be a string'),

  body('assets')
    .optional({ nullable: true })
    .isObject().withMessage('Assets must be an object'),

  body('difficulty')
    .optional({ nullable: true })
    .isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be one of: easy, medium, hard'),

  body('points')
    .optional({ nullable: true })
    .isInt({ min: 0 }).withMessage('Points must be a positive integer'),
]);

// Task ID only
exports.validateTaskId = validate([
  param('id')
    .custom(validateObjectId)
    .withMessage('Invalid task ID format'),
]);
