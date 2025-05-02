# SnapCode Backend API

A secure, scalable backend API for the SnapCode snippet design tool. This backend handles user authentication, snippet storage, and export generation.

## Tech Stack

- **Runtime**: Node.js (v20+)
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ORM)
- **Authentication**: Google OAuth 2.0 + JWT
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest
- **Export Generation**: Puppeteer

## Features

### Authentication
- Google OAuth 2.0 integration
- JWT-based authentication with refresh tokens
- Protected routes with middleware validation

### Snippet Management
- Create, read, update, and delete code snippets
- Support for JavaScript, Python, and HTML
- Custom styling options (theme, font, background, padding, shadow)

### Export Generation
- Generate PNG exports of code snippets
- Store exports in MongoDB GridFS
- Retrieve exports by ID

### User Profiles
- Store user information from Google OAuth
- Track user's snippets

## API Endpoints

### Authentication
- `GET /api/auth/google` - Redirect to Google consent screen
- `GET /api/auth/google/callback` - Handle Google OAuth callback
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile

### Snippets
- `POST /api/snippets` - Create new snippet
- `GET /api/snippets` - List user's snippets
- `GET /api/snippets/:id` - Get snippet by ID
- `PUT /api/snippets/:id` - Update snippet
- `DELETE /api/snippets/:id` - Delete snippet

### Exports
- `POST /api/export/png` - Generate PNG export
- `GET /api/export/png/:id` - Get PNG export by ID
- `GET /api/export` - List user's exports

## Setup Instructions

### Prerequisites
- Node.js (v20+)
- MongoDB
- Google OAuth credentials

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/snapcode
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:3000
   NODE_ENV=development
   ```
4. Start the development server:
   ```
   npm run dev
   ```

### API Documentation
Once the server is running, you can access the Swagger documentation at:
```
http://localhost:4000/api-docs
```

## Testing
Run the test suite with:
```
npm test
```

## Production Deployment
Build the project for production:
```
npm run build
```

Start the production server:
```
npm start
```# snapcode-backend
