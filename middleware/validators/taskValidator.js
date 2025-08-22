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

    const errorMessages = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));

    return res.status(400).json({
      success: false,
      errors: errorMessages
    });
  };
};

// Validate MongoDB ObjectId
const validateObjectId = (id) => {
  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID format');
  }
  return true;
};

// Task creation validation rules
exports.validateCreateTask = validate([
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot be more than 100 characters'),
    
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),
    
  body('dependencies')
    .optional({ checkFalsy: true })
    .isArray().withMessage('Dependencies must be an array')
    .custom((deps) => {
      if (!Array.isArray(deps)) return true;
      return deps.every(dep => typeof dep === 'string');
    }).withMessage('Each dependency must be a string'),
    
  body('assets')
    .optional({ checkFalsy: true })
    .isObject().withMessage('Assets must be an object')
    .customSanitizer(assets => {
      if (!assets) return {};
      return assets;
    }),
    
  body('assets.logo')
    .optional({ checkFalsy: true })
    .isString().withMessage('Logo must be a string'),
    
  body('assets.fontSize')
    .optional({ checkFalsy: true })
    .isString().withMessage('Font size must be a string'),
    
  body('difficulty')
    .optional({ checkFalsy: true })
    .isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be one of: easy, medium, hard'),
    
  body('points')
    .optional({ checkFalsy: true })
    .isInt({ min: 0 }).withMessage('Points must be a positive integer'),
    
  body('testCases')
    .optional({ checkFalsy: true })
    .isArray().withMessage('Test cases must be an array')
    .custom((testCases) => {
      if (!Array.isArray(testCases)) return true;
      return testCases.every(testCase => 
        testCase && 
        typeof testCase === 'object' &&
        'input' in testCase &&
        'expectedOutput' in testCase
      );
    }).withMessage('Each test case must have input and expectedOutput')
]);

// Task update validation rules
exports.validateUpdateTask = validate([
  param('id')
    .custom(validateObjectId)
    .withMessage('Invalid task ID format'),
    
  body('title')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Title cannot be more than 100 characters'),
    
  body('dependencies')
    .optional({ checkFalsy: true })
    .isArray().withMessage('Dependencies must be an array')
    .custom((deps) => {
      if (!Array.isArray(deps)) return true;
      return deps.every(dep => typeof dep === 'string');
    }).withMessage('Each dependency must be a string'),
    
  body('assets')
    .optional({ checkFalsy: true })
    .isObject().withMessage('Assets must be an object'),
    
  body('difficulty')
    .optional({ checkFalsy: true })
    .isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be one of: easy, medium, hard'),
    
  body('points')
    .optional({ checkFalsy: true })
    .isInt({ min: 0 }).withMessage('Points must be a positive integer')
]);

// Task ID validation
exports.validateTaskId = validate([
  param('id')
    .custom(validateObjectId)
    .withMessage('Invalid task ID format')
]);
