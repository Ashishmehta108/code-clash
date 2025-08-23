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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { taskId, codeUrl, imageUrl, language } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!taskId || !codeUrl || !language) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorResponse('Task ID, code (or codeUrl), and language are required', 400));
    }

    // Check if task exists and is active
    const task = await Task.findOne({ _id: taskId, status: 'active' })
      .session(session);

    if (!task) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorResponse('Task not found or not active', 404));
    }

    // Check if user has already submitted for this task
    const existingSubmission = await Submission.findOne({
      user: userId,
      task: taskId,
    }).session(session);

    if (existingSubmission) {
      await session.abortTransaction();
      session.endSession();
      return next(
        new ErrorResponse('You have already submitted a solution for this task', 400)
      );
    }

    // Create submission
    const submissionData = {
      user: userId,
      task: taskId,
      language,
      status: 'pending',
      submittedAt: new Date(),
      codeUrl,
      imageUrl
    };

    const submission = await Submission.create([submissionData], { session });

    // Update task's submissions count (optional)
    task.submissionCount = (task.submissionCount || 0) + 1;
    await task.save({ session });

    await session.commitTransaction();
    session.endSession();

    // In a real app, you would process the submission asynchronously
    // and update the status based on test results

    res.status(201).json({
      success: true,
      data: submission[0],
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

// @desc    Update submission
// @route   PUT /api/submissions/:id
// @access  Private
exports.updateSubmission = async (req, res, next) => {
  try {
    let submission = await Submission.findById(req.params.id);
    const { status, score } = req.body;

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
    submission = await Submission.findByIdAndUpdate(req.params.id, {
      status,
      score
    }, {
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
    const { taskId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // For non-admin users, only allow access to their own submissions
    const query = isAdmin
      ? { task: taskId }
      : { task: taskId, user: userId };

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Get total count
    const total = await Submission.countDocuments(query);

    // Build query
    let submissionsQuery = Submission.find(query)
      .populate({
        path: 'user',
        select: 'username name',
      })
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit);

    // For non-admin users, don't expose other users' code
    if (!isAdmin) {
      submissionsQuery = submissionsQuery.select('-code -codeUrl');
    }

    const submissions = await submissionsQuery;
    const pages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      count: submissions.length,
      total,
      page,
      pages,
      data: submissions,
    });
  } catch (err) {
    next(err);
  }
};
