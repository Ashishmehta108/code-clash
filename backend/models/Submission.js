const mongoose = require('mongoose');



// if we are executing the frontend code the best way to evaluate is to keep a copy of ui which we want to make and just compare it the code's executed screenshot(by pupeteer) if comparison is >95% then its passed  either we have to check each test case if using llms or manually it will be a lot of work and error prone too as we have to be very precise with the dom elements used by user

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: [true, 'Task ID is required'],
    },
    codeUrl: {
      type: String,
      required: [true, 'Code is required'],
    },

    imageUrl: {
      type: String,
      required: [true, 'Image is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'evaluating', 'passed', 'failed'],
      default: 'pending',
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    feedback: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);


const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
