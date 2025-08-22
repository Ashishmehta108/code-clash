const mongoose = require('mongoose');
const Task = require('../models/Task');
const ErrorResponse = require('../utils/errorResponse');
const { validationResult } = require('express-validator');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
exports.getTasks = async (req, res, next) => {
  try {
    // Build query
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, match => `$${match}`);

    // Parse query string and handle potential JSON parsing errors
    let parsedQuery;
    try {
      parsedQuery = JSON.parse(queryStr);
    } catch (err) {
      return next(new ErrorResponse('Invalid query parameters', 400));
    }

    // Build query with error handling
    let query = Task.find(parsedQuery);

    // Sorting
    if (req.query.sort) {
      try {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
      } catch (err) {
        return next(new ErrorResponse('Invalid sort parameter', 400));
      }
    } else {
      query = query.sort('-createdAt');
    }

    // Field limiting
    if (req.query.fields) {
      try {
        const fields = req.query.fields.split(',').join(' ');
        query = query.select(fields);
      } catch (err) {
        return next(new ErrorResponse('Invalid fields parameter', 400));
      }
    } else {
      query = query.select('-__v');
    }

    // Pagination with validation
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 25));
    const skip = (page - 1) * limit;
    
    try {
      const total = await Task.countDocuments(parsedQuery);
      query = query.skip(skip).limit(limit);

      // Execute query with timeout
      const tasks = await Promise.race([
        query.lean().exec(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Query timeout')), 10000)
        )
      ]);

      // Pagination result
      const pagination = {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
        count: tasks.length
      };

      if (skip + tasks.length < total) {
        pagination.next = {
          page: page + 1,
          limit
        };
      }

      if (skip > 0) {
        pagination.prev = {
          page: page - 1,
          limit
        };
      }

      // Cache control headers
      res.set('Cache-Control', 'public, max-age=60');
      
      res.status(200).json({
        success: true,
        pagination,
        data: tasks,
      });
    } catch (err) {
      if (err.message === 'Query timeout') {
        return next(new ErrorResponse('Database query timeout', 504));
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Public
exports.getTask = async (req, res, next) => {
  try {
    // Validate task ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Invalid task ID format', 400));
    }

    // Build query with optional field selection
    let query = Task.findById(req.params.id).select('-__v');
    
    // Handle field selection if provided
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    }

    // Execute query with timeout
    const task = await Promise.race([
      query.lean().exec(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 5000)
      )
    ]);

    if (!task) {
      return next(
        new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
      );
    }

    // Cache control headers (5 minutes)
    res.set('Cache-Control', 'public, max-age=300');
    res.set('ETag', `"${task._id}"`);
    
    // Handle conditional GET with If-None-Match
    const clientETag = req.get('If-None-Match');
    if (clientETag === `"${task._id}"`) {
      return res.status(304).end();
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private/Admin
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, dependencies, difficulty, points, testCases, assets } = req.body;

    // Validate required fields
    if (!title || !description) {
      return next(new ErrorResponse('Title and description are required', 400));
    }

    // Sanitize and prepare task data
    const taskData = {
      title: title.trim(),
      description: description.trim(),
      dependencies: Array.isArray(dependencies) ? dependencies : [],
      assets: {
        logo: assets?.logo?.trim() || '',
        fontSize: assets?.fontSize?.trim() || '16px',
      },
      difficulty: ['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : 'medium',
      points: Number.isInteger(points) && points >= 0 ? points : 10,
      testCases: Array.isArray(testCases) ? testCases : [],
    };

    // Validate test cases structure if provided
    if (taskData.testCases.length > 0) {
      const isValidTestCases = taskData.testCases.every(testCase => 
        testCase && 
        typeof testCase === 'object' &&
        'input' in testCase &&
        'expectedOutput' in testCase
      );

      if (!isValidTestCases) {
        return next(new ErrorResponse('Invalid test cases format', 400));
      }
    }

    // Check for duplicate task title (case insensitive)
    const existingTask = await Task.findOne({ 
      title: { $regex: new RegExp(`^${taskData.title}$`, 'i') } 
    });

    if (existingTask) {
      return next(new ErrorResponse('Task with this title already exists', 400));
    }

    const task = await Task.create(taskData);

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private/Admin
exports.updateTask = async (req, res, next) => {
  try {
    // Check if task exists
    let task = await Task.findById(req.params.id);
    if (!task) {
      return next(
        new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
      );
    }

    // Prepare update data
    const { title, description, dependencies, difficulty, points, testCases, assets } = req.body;
    const updateData = {};

    // Only update fields that are provided in the request
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (points !== undefined) updateData.points = points;
    
    // Handle dependencies array update
    if (dependencies !== undefined) {
      updateData.dependencies = Array.isArray(dependencies) ? dependencies : [];
    }

    // Handle test cases array update
    if (testCases !== undefined) {
      updateData.testCases = Array.isArray(testCases) ? testCases : [];
    }

    // Handle nested assets update
    if (assets) {
      updateData.assets = {
        ...task.assets.toObject(),
        ...assets
      };
    }

    // Update the task
    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        context: 'query'
      }
    );

    // Fetch the updated task to ensure we have the latest version
    task = await Task.findById(req.params.id);

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
exports.deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    
    // Validate task ID format
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return next(new ErrorResponse('Invalid task ID format', 400));
    }

    // Find the task and populate submissions for reference
    const task = await Task.findById(taskId);

    if (!task) {
      return next(
        new ErrorResponse(`Task not found with id of ${taskId}`, 404)
      );
    }

    // Check if there are any submissions for this task
    const Submission = require('./Submission');
    const submissionCount = await Submission.countDocuments({ task: taskId });
    
    if (submissionCount > 0) {
      return next(
        new ErrorResponse(
          `Cannot delete task with ${submissionCount} submission(s). Delete submissions first.`,
          400
        )
      );
    }

    // Use findByIdAndDelete instead of remove() for better error handling
    const deletedTask = await Task.findByIdAndDelete(taskId);
    
    if (!deletedTask) {
      return next(new ErrorResponse('Error deleting task', 500));
    }

    res.status(200).json({
      success: true,
      data: { id: taskId },
    });
  } catch (err) {
    next(err);
  }
};
