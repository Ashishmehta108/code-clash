const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // temporary local storage
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

// ------------------- Public routes -------------------

// Get all tasks
router.route('/')
  .get(getTasks);

// Get single task
router.route('/:id')
  .get(validateTaskId, getTask);

// ------------------- Protected routes (admin only) -------------------
router.use(protect, authorize('admin'));

// Create a task with file uploads
router.route('/')
  .post(
    upload.fields([
      { name: 'uiImage', maxCount: 1 },      // required UI image
      { name: 'logo', maxCount: 1 },         // optional logo
      { name: 'images', maxCount: 10 },      // multiple asset images
    ]),
    validateCreateTask,
    createTask
  );

// Update task with optional file uploads
router.route('/:id')
  .put(
    validateTaskId,
    upload.fields([
      { name: 'uiImage', maxCount: 1 },
      { name: 'logo', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
    validateUpdateTask,
    updateTask
  )
  .delete(validateTaskId, deleteTask);

module.exports = router;
