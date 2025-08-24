const mongoose = require('mongoose');
const Task = require('../models/Task');
const Submission = require('../models/Submission');
const ErrorResponse = require('../utils/errorResponse');
const { validationResult } = require('express-validator');


// =============================
// Task Controllers
// =============================

// Get all tasks
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort('-createdAt').lean();
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    next(err);
  }
};

// Get single task
exports.getTask = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Invalid task ID format', 400));
    }

    let query = Task.findById(req.params.id).select('-__v');
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    }

    const task = await Promise.race([
      query.lean().exec(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Query timeout')), 5000))
    ]);

    if (!task) return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));

    res.set('Cache-Control', 'public, max-age=300');
    res.set('ETag', `"${task._id}"`);
    const clientETag = req.get('If-None-Match');
    if (clientETag === `"${task._id}"`) return res.status(304).end();

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// =============================
// @desc    Create new task
// @route   POST /api/tasks
// @access  Private/Admin
// =============================
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, difficulty, points, assets ,dependencies} = req.body;
    console.log("Images:", req.files.images?.map(f => f.originalname));
    if (!title || !description) {
      return next(new ErrorResponse('Title and description are required', 400));
    }

    const existingTask = await Task.findOne({ title: { $regex: new RegExp(`^${title.trim()}$`, 'i') } });
    if (existingTask) return next(new ErrorResponse('Task with this title already exists', 400));

    // Map uploaded files from middleware
    let uiImageUrl = '';
    let logoUrl = '';
    let imagesArray = [];

    if (req.uploadedFiles?.length) {
      for (const file of req.uploadedFiles) {
        if (file.field === 'uiImage') uiImageUrl = file.url;
        if (file.field === 'logo') logoUrl = file.url;
        if (file.field === 'images') imagesArray.push(file.url);
      }
    }

    if (!uiImageUrl) {
      return next(new ErrorResponse('UI image is required', 400));
    }

    if (!uiImageUrl) return next(new ErrorResponse('UI image is required', 400));

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      uiImage: uiImageUrl,
      dependencies: req.body.dependencies,
      assets: {
        logo: logoUrl,
        images: imagesArray,
        fontSize: assets?.fontSize || '16px',
        fontFamily: assets?.fontFamily || 'Arial, sans-serif',
      },
      difficulty: ['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : 'medium',
      points: Number.isInteger(points) && points >= 0 ? points : 10,
    };


    const task = await Task.create(taskData);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// Update task
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));

    const { title, description, difficulty, points, assets } = req.body;

    if (req.uploadedFiles?.length) {
      for (const file of req.uploadedFiles) {
        if (file.field === 'uiImage') task.uiImage = file.url;
        if (file.field === 'logo') task.assets.logo = file.url;
        if (file.field === 'images') {
          if (!Array.isArray(task.assets.images)) task.assets.images = [];
          task.assets.images.push(file.url);
        }
      }
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (difficulty !== undefined) task.difficulty = difficulty;
    if (points !== undefined) task.points = points;
    if (assets) {
      task.assets.fontSize = assets.fontSize || task.assets.fontSize;
      task.assets.fontFamily = assets.fontFamily || task.assets.fontFamily;
    }

    await task.save();
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// Delete task
exports.deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(taskId)) return next(new ErrorResponse('Invalid task ID format', 400));

    const task = await Task.findById(taskId);
    if (!task) return next(new ErrorResponse(`Task not found with id of ${taskId}`, 404));

    await Submission.deleteMany({ task: taskId });
    await Task.findByIdAndDelete(taskId);

    res.status(200).json({ success: true, message: 'Task and related submissions deleted successfully', data: { id: taskId } });
  } catch (err) {
    next(err);
  }
};
