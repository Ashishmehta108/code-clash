const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters long'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
      dependencies: [
      {
        type: String,
        trim: true,
      },
    ],

    // Required UI image (main image for the task)
    uiImage: {
      type: String,
      required: [true, 'Please provide a UI image'],
    },

    // Additional assets (logo + multiple images + style props)
    assets: {
      logo: {
        type: String,
        default: '',
      },
      images: [
        {
          type: String, // Cloudinary URLs
        },
      ],
      fontSize: {
        type: String,
        default: '16px',
      },
      fontFamily: {
        type: String,
        default: 'Arial, sans-serif',
      },
    },

    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    points: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
