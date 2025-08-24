const express = require('express');
const router = express.Router();
const upload = require("../middleware/multer");
const { uploadImage } = require("../controllers/uploadController")
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


router.route('/')
  .post(

    upload.fields([
      { name: 'uiImage', maxCount: 1 },
      { name: 'logo', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
    validateCreateTask,
    uploadImage,
    createTask
  );

router.route('/:id')
  .put(
    validateTaskId,
    upload.fields([
      { name: 'uiImage', maxCount: 1 },
      { name: 'logo', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
    uploadImage,
    validateUpdateTask,
    updateTask
  )
  .delete(validateTaskId, deleteTask);

module.exports = router;
