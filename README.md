# URL Shortener Application

## Overview

This URL Shortener is a full-stack web application that allows users to create shortened versions of long URLs. It features user authentication, custom short URL creation, and a dashboard to view shortened URLs.

## Features

- User registration and login
- URL shortening with optional custom aliases
- Dashboard to view and manage shortened URLs
- Responsive design using Tailwind CSS

## Tech Stack

### Frontend

- React
- React Router for navigation
- Axios for API requests
- Tailwind CSS for styling

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication

## Project Structure

The project is divided into two main directories:

- `frontend/`: Contains the React application
- `backend/`: Contains the Express.js server

## Setup and Installation

### Prerequisites

- Node.js (v14 or later)
- MongoDB

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:

   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=4000
   BASE_URL=http://localhost:4000
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following content:

   ```
   VITE_API_BASE_URL=http://localhost:4000/api
   VITE_SHORTEN_BASE_URL=http://localhost:4000
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Usage

1. Register a new account or log in to an existing one.
2. On the home page, enter a long URL to shorten.
3. Optionally, provide a custom alias for the shortened URL.
4. Click "Shorten URL" to generate a short link.
5. View your shortened URLs on the dashboard.

## API Endpoints

- `POST /api/register`: Register a new user
- `POST /api/login`: Log in a user
- `GET /api/verify-token`: Verify JWT token
- `POST /api/shorten`: Create a shortened URL
- `GET /api/dashboard`: Get user's shortened URLs
- `GET /:shortUrl`: Redirect to the original URL

## File Structure

### Backend

```
backend/
├── index.js
├── package.json
└── .env
```

### Frontend

```
frontend/
├── src/
│   ├── api.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── UserContext.jsx
│   ├── hooks/
│   │   ├── useLogin.jsx
│   │   ├── useLogout.jsx
│   │   ├── useRegister.jsx
│   │   └── useUser.jsx
│   └── pages/
│       ├── Dashboard.jsx
│       ├── Layout.jsx
│       ├── Login.jsx
│       ├── Register.jsx
│       └── URLShortener.jsx
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── .env
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
