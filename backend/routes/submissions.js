const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const {
  getSubmissions,
  getSubmission,
  createSubmission,
  updateSubmission,
  deleteSubmission,
  getSubmissionsForTask,
} = require('../controllers/submissionController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router
  .route('/')
  .get(authorize('admin'), getSubmissions)
  .post(createSubmission);

router
  .route('/:id')
  .get(getSubmission)
  .put(updateSubmission)
  .delete(deleteSubmission);

router.get('/task/:taskId', getSubmissionsForTask);

// Get current user's submissions
router.get('/me', async (req, res, next) => {
  try {
    const submissions = await Submission.find({ user: req.user.id })
      .populate('task', 'title')
      .sort('-submittedAt');
    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (err) {
    res.json({
      success: false,

    })
  }
});

module.exports = router;
