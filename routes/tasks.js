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
//get all tasks
router.route('/')
  .get(getTasks);

//get single task
router.route('/:id')
  .get(validateTaskId, getTask);

// Protected routes (admin only)

router.use(protect, authorize('admin'));

//create a task
router.route('/')
  .post(validateCreateTask, createTask);

//update and delete a task
router.route('/:id')
  .put(validateTaskId, validateUpdateTask, updateTask)
  .delete(validateTaskId, deleteTask);

module.exports = router;
