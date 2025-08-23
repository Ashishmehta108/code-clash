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
  // see all submissions for all tasks
  .get(authorize('admin'), getSubmissions)
  //creates a submission
  .post(createSubmission)
  //updates a submission
  .put(updateSubmission);

router
  .route('/:id')
  // get a single submission by id
  .get(getSubmission)
  // update submission status, result, score, feedback, executionTime
  .put(updateSubmission)
  // delete a submission
  .delete(deleteSubmission);

// Get all submissions for a specific task
router.get('/task/:taskId', getSubmissionsForTask);

module.exports = router;
