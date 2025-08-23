# CodeClash - Coding Challenge Platform

A modern web application for practicing coding challenges, built with React and Vite.

## Features

- User authentication (login/register)
- Browse coding challenges by difficulty
- Submit solutions to challenges
- View submission history and results
- Real-time code execution feedback

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see backend README for setup)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

2. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

- `/src` - Source code
  - `/components` - Reusable UI components
  - `/contexts` - React context providers
  - `/pages` - Page components
  - `/services` - API service layer
  - `/utils` - Utility functions

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- React 18
- React Router 6
- Axios for API requests
- Tailwind CSS for styling
- Vite for build tooling
