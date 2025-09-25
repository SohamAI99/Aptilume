# Aptilume Backend Server

This is the backend server for the Aptilume application, built with Node.js, Express, and Firebase Admin SDK.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Firebase:
   - Go to Firebase Console > Project Settings > Service Accounts
   - Generate a new private key
   - Save it as `firebase-service-account.json` in this directory

3. Configure Environment Variables:
   - Copy `.env.example` to `.env`
   - Update values as needed

4. Start the server:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update user

### Quizzes
- `GET /api/quizzes/:id` - Get quiz by ID
- `GET /api/quizzes` - Get all quizzes (with optional filters)
- `POST /api/quizzes` - Create a new quiz
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz

### Attempts
- `GET /api/attempts/:id` - Get attempt by ID
- `POST /api/attempts` - Create a new attempt
- `PUT /api/attempts/:id` - Update attempt
- `GET /api/attempts/user/:userId` - Get attempts by user

### Results
- `GET /api/results/:id` - Get result by ID
- `POST /api/results` - Create a new result
- `GET /api/results/user/:userId` - Get results by user

## Environment Variables

Create a `.env` file with the following variables:
- `PORT` - Server port (default: 5001)

## Development

For development, the server runs on port 5001 by default.
Health check endpoint: `http://localhost:5001/health`

## Security Notice

**Important**: Never commit actual credentials to the repository.
The `firebase-service-account.json` file should never be committed to version control.