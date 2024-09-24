# URL Shortener Application

## Overview

This URL Shortener is a full-stack web application that allows users to create shortened versions of long URLs. It features user authentication, custom short URL creation, and a dashboard to view and manage shortened URLs.

## Features

- User registration and login
- URL shortening with optional custom aliases
- Dashboard to view and manage shortened URLs
- QR code generation for shortened URLs
- Sharing functionality for shortened URLs
- Responsive design using Tailwind CSS

## Tech Stack

### Frontend

- React with Vite
- React Router for navigation
- Axios for API requests
- Tailwind CSS for styling
- Framer Motion for animations
- QRCode.react for QR code generation

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing
- shortid for generating short URLs

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
6. Manage your shortened URLs (edit, delete, generate QR code, share).

## API Endpoints

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Log in a user
- `GET /api/auth/verify-token`: Verify JWT token
- `POST /api/urls/shorten`: Create a shortened URL
- `GET /api/urls`: Get user's shortened URLs
- `PUT /api/urls/:id`: Update a shortened URL
- `DELETE /api/urls/:id`: Delete a shortened URL
- `GET /:shortUrl`: Redirect to the original URL

## File Structure

### Backend

```
backend/
├── controllers/
│   ├── url.js
│   └── user.js
├── middlewares/
│   └── verifyToken.js
├── models/
│   ├── Url.js
│   └── User.js
├── routes/
│   ├── user.js
│   ├── url.js
│   └── redirect.js
├── .env
├── index.js
└── package.json
```

### Frontend

```
frontend/
├── src/
│ ├── components/
│ │ ├── DeleteConfirmationModal.jsx
│ │ ├── EditURLModal.jsx
│ │ ├── QRCodeModal.jsx
│ │ └── URLCard.jsx
│ ├── context/
│ │ ├── URLsContext.jsx
│ │ └── UserContext.jsx
│ ├── hooks/
│ │ ├── useLogin.jsx
│ │ ├── useLogout.jsx
│ │ ├── useRegister.jsx
│ │ ├── useURLs.jsx
│ │ └── useUser.jsx
│ ├── pages/
│ │ ├── Dashboard.jsx
│ │ ├── Layout.jsx
│ │ ├── Login.jsx
│ │ ├── Register.jsx
│ │ └── URLShortener.jsx
│ ├── api.js
│ ├── App.jsx
│ └── main.jsx
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
