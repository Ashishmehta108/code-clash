# CodeClash Backend

Backend for CodeClash - A coding challenge platform built with Node.js, Express, and MongoDB.

## Features

- User authentication (JWT)
- Task management
- Code submission and evaluation
- RESTful API
- File uploads
- Pagination, filtering, and sorting

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add the following:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   NODE_ENV=development
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task (admin only)
- `PUT /api/tasks/:id` - Update task (admin only)
- `DELETE /api/tasks/:id` - Delete task (admin only)

### Submissions
- `GET /api/submissions` - Get all submissions (admin only)
- `GET /api/submissions/:id` - Get single submission
- `POST /api/submissions` - Create submission
- `PUT /api/submissions/:id` - Update submission
- `DELETE /api/submissions/:id` - Delete submission
- `GET /api/submissions/task/:taskId` - Get submissions for a task

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT
- `JWT_EXPIRE` - JWT expiration time
- `NODE_ENV` - Environment (development/production)

## Development

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## License

MIT
