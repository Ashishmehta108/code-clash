const express = require('express');
const router = express.Router();
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

// Get all submissions for a specific task
router.get('/task/:taskId', getSubmissionsForTask);

module.exports = router;
