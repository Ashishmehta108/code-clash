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

router.route('/')
  .get(getTasks);

router.route('/:id')
  .get(validateTaskId, getTask);

router.use(protect);

router.route('/')
  .post(authorize('admin'), validateCreateTask, createTask);

router.route('/:id')
  .put(authorize('admin'), validateTaskId, validateUpdateTask, updateTask)
  .delete(authorize('admin'), validateTaskId, deleteTask);

module.exports = router;
