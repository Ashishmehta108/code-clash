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
    subTasks: [
      {
        element: {
          type: String, // e.g. "h1", "button", "div"
          required: true,
        },
        text: {
          type: String, // e.g. "Welcome to CodeClash"
          default: "",
        },
        styles: {
          fontSize: {
            type: String, // e.g. "24px" or "2rem"
            default: "",
          },
          color: {
            type: String, // e.g. "#333" or "red"
            default: "",
          },
          fontWeight: {
            type: String, // e.g. "bold", "400"
            default: "",
          },
          backgroundColor: {
            type: String,
            default: "",
          },
          // you can add more CSS-like properties here
        },
        isRequired: {
          type: Boolean,
          default: true,
        },
      },
    ],

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
