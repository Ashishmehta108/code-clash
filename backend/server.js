const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
// const morgan = require('morgan');
// const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/errorHandler');
dotenv.config();
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const submissionRoutes = require('./routes/submissions');
// const uploadRouter = require('./routes/uploadRoute');
// const upload = require('./middleware/multer');
// const { uploadImage } = require('./controllers/uploadController');


// read line 40 Task.js model 
//read line 5 submission.js model
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('combined'));
// }

// app.use(fileupload({
//   limits: { fileSize: 10 * 1024 * 1024 },
// }));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/submissions', submissionRoutes);
// app.use("/api/upload", uploadRouter)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB()
});



app.use(errorHandler);

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;
