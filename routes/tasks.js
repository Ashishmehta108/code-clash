const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');
const {
  validateCreateTask,
  validateUpdateTask,
  validateTaskId
} = require('../middleware/validators/taskValidator');

// Public routes
router.route('/')
  .get(getTasks);

router.route('/:id')
  .get(validateTaskId, getTask);

// Protected routes (admin only)
router.use(protect, authorize('admin'));

router.route('/')
  .post(validateCreateTask, createTask);

router.route('/:id')
  .put(validateTaskId, validateUpdateTask, updateTask)
  .delete(validateTaskId, deleteTask);

module.exports = router;
