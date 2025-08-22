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
    assets: {
      logo: {
        type: String,
        default: '',
      },
      fontSize: {
        type: String,
        default: '16px',
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
    //testcases object needs to be changed I guess if we are using llms for code reviewing then its fine otherwise we have to make it precise enough for our dom structure
    testCases: [
      {
        input: {
          type: mongoose.Schema.Types.Mixed,
          required: true,
        },
        expectedOutput: {
          type: mongoose.Schema.Types.Mixed,
          required: true,
        },
        isHidden: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
