const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import models
const User = require('../models/User');
const Task = require('../models/Task');

// Sample users
const users = [
  {
    username: 'admin',
    email: 'admin@codeclash.com',
    password: 'admin123',
    role: 'admin',
  },
    {
      username: 'user1',
      email: 'user1@codeclash.com',
      password: 'password123',
    },
  {
    username: 'user2',
    email: 'user2@codeclash.com',
    password: 'password123',
  },
];

// Sample tasks
const tasks = [
  {
    title: 'Build a Navbar',
    description: 'Create a responsive navigation bar with a logo and menu items.',
    dependencies: ['react', 'styled-components'],
    assets: {
      logo: 'logo.png',
      fontSize: '16px',
    },
    difficulty: 'easy',
    points: 10,
    testCases: [
      {
        input: {},
        expectedOutput: 'A navbar component with logo and menu items',
        isHidden: false,
      },
    ],
    assets: {
      logo: 'logo.png',
      fontSize: '16px',
    },
  },
  {
    title: 'Implement Authentication',
    description: 'Create user authentication with JWT.',
    dependencies: ['express', 'jsonwebtoken', 'bcryptjs'],
    difficulty: 'medium',
    points: 20,
    testCases: [
      {
        input: { username: 'test', password: 'test123' },
        expectedOutput: 'JWT token',
        isHidden: true,
        
      },
    ],
  },
];

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});

    // Hash passwords
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );

    // Insert users
    const createdUsers = await User.insertMany(hashedUsers);
    console.log('Users seeded:', createdUsers);

    // Insert tasks
    const createdTasks = await Task.insertMany(tasks);
    console.log('Tasks seeded:', createdTasks);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany({});
    await Task.deleteMany({});

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error('Error destroying data:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
