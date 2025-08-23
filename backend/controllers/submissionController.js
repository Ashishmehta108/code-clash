const Submission = require('../models/Submission');
const Task = require('../models/Task');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

// @desc    Get all submissions
// @route   GET /api/submissions
// @access  Private/Admin

//
// @desc    Get all submissions
// @route   GET /api/submissions
// @access  Private
exports.getSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find()
      .populate("user", "name email")   // show user info
      .populate("task", "title");       // show task title only

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (err) {
    next(err);
  }
};


// @desc    Get single submission
// @route   GET /api/submissions/:id
// @access  Private


exports.getSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id).populate({
      path: 'user task',
      select: 'username email title',
    });

    if (!submission) {
      return next(
        new ErrorResponse(`No submission with the id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is submission owner or admin
    if (
      submission.user._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse(
          `Not authorized to access submission ${req.params.id}`,
          401
        )
      );
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create submission
// @route   POST /api/submissions
// @access  Private
exports.createSubmission = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

    const task = await Task.findById(req.body.task);

    if (!task) {
      return next(
        new ErrorResponse(`No task with the id of ${req.body.task}`, 404)
      );
    }

    // Check if user already submitted for this task
    const existingSubmission = await Submission.findOne({
      user: req.user.id,
      task: req.body.task,
    });

    if (existingSubmission) {
      return next(
        new ErrorResponse(
          `You have already submitted a solution for this task`,
          400
        )
      );
    }

    const submission = await Submission.create(req.body);

    // TODO: Add code evaluation logic here
    // This would involve:
    // 1. Extracting the code from the submission
    // 2. Running tests against it
    // 3. Updating the submission status and result


    res.status(201).json({
      success: true,
      data: submission,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update submission
// @route   PUT /api/submissions/:id
// @access  Private
exports.updateSubmission = async (req, res, next) => {
  try {
    let submission = await Submission.findById(req.params.id);

    if (!submission) {
      return next(
        new ErrorResponse(`No submission with the id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is submission owner or admin
    if (
      submission.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse(
          `Not authorized to update submission ${req.params.id}`,
          401
        )
      );
    }

    submission = await Submission.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete submission
// @route   DELETE /api/submissions/:id
// @access  Private
exports.deleteSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return next(
        new ErrorResponse(`No submission with the id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is submission owner or admin
    if (
      submission.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse(
          `Not authorized to delete submission ${req.params.id}`,
          401
        )
      );
    }

    // ✅ Use deleteOne instead of remove
    await submission.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};


// @desc    Get submissions for a specific task
// @route   GET /api/tasks/:taskId/submissions
// @access  Private
exports.getSubmissionsForTask = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ task: req.params.taskId })
      .populate({
        path: 'user',
        select: 'username email',
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (err) {
    next(err);
  }
};
