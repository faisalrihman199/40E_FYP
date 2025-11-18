# Sakina Web - Backend API

Complete Node.js/Express backend for the Sakina child safety learning application with PostgreSQL database, JWT authentication, and comprehensive parental controls.

## 🚀 Features

- ✅ **User Authentication**: Register, login, email verification, password reset
- ✅ **JWT Tokens**: Access tokens (15min) and refresh tokens (7 days)
- ✅ **Email Service**: Verification emails, password reset, welcome messages
- ✅ **Parental Controls**: PIN-based authentication, time limits, activity restrictions
- ✅ **Progress Tracking**: Game sessions, learning modules, activity logs
- ✅ **Analytics Dashboard**: Comprehensive stats and charts for parents
- ✅ **Security**: Helmet, CORS, rate limiting, bcrypt hashing, input validation
- ✅ **Logging**: Winston logger with file and console outputs

## 📋 Prerequisites

- **Node.js**: v18+ 
- **PostgreSQL**: v14+
- **npm** or **yarn**
- **SMTP Email Service**: Gmail, SendGrid, etc.

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Set Up PostgreSQL Database

```bash
# Create a new PostgreSQL database
createdb sakina_db

# Or using psql
psql -U postgres
CREATE DATABASE sakina_db;
\q
```

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sakina_db
DB_USER=postgres
DB_PASSWORD=your_database_password

# JWT Secrets (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_ACCESS_SECRET=your_access_token_secret_here
JWT_REFRESH_SECRET=your_refresh_token_secret_here

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# Parental Control
PARENTAL_PIN_DEFAULT=1234

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Generate JWT Secrets

```bash
# Generate access token secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate refresh token secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the generated secrets to your `.env` file.

### 5. Gmail App Password Setup (if using Gmail)

1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Navigate to Security > App Passwords
4. Generate a new app password for "Mail"
5. Use this password in `EMAIL_PASSWORD` (not your regular password)

## 🏃 Running the Server

### Development Mode

```bash
npm run dev
```

Server will run on `http://localhost:5000` with auto-restart on file changes.

### Production Mode

```bash
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "parent@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "childName": "Emma",
  "childAge": 7
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "parent@example.com",
  "password": "SecurePass123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful!",
  "data": {
    "user": {
      "id": "uuid",
      "email": "parent@example.com",
      "firstName": "John",
      "childName": "Emma"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

#### Verify Email
```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification_token_from_email"
}
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "parent@example.com"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123"
}
```

#### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

### User Endpoints (Requires Authentication)

All requests must include JWT token:
```
Authorization: Bearer <access_token>
```

#### Get Profile
```http
GET /api/users/profile
```

#### Update Profile
```http
PUT /api/users/profile
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "childName": "Emma",
  "childAge": 8
}
```

#### Change Password
```http
PUT /api/users/change-password
Content-Type: application/json

{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass123"
}
```

### Parental Control Endpoints (Requires Authentication)

#### Verify PIN
```http
POST /api/parental/verify-pin
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "pin": "1234"
}
```

#### Get Dashboard
```http
GET /api/parental/dashboard
Authorization: Bearer <access_token>
```

Response includes:
- Child info (name, age)
- Game statistics (total games, average score, time spent)
- Learning statistics (modules completed, time spent)
- Recent activities (last 20)
- Weekly progress chart
- Today's usage time
- Parental control settings

#### Update Settings
```http
PUT /api/parental/settings
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "sessionTimeLimit": 30,
  "dailyTimeLimit": 120,
  "allowedDays": [0, 1, 2, 3, 4, 5, 6],
  "allowedTimeStart": "08:00:00",
  "allowedTimeEnd": "20:00:00"
}
```

#### Update PIN
```http
PUT /api/parental/update-pin
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "currentPin": "1234",
  "newPin": "5678"
}
```

#### Clear All Data
```http
POST /api/parental/clear-data
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "pin": "1234"
}
```

### Progress Tracking Endpoints (Requires Authentication)

#### Log Game Session
```http
POST /api/progress/game
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "gameName": "Body Parts Touch Game",
  "gameType": "body_touch",
  "score": 85,
  "correctAnswers": 17,
  "wrongAnswers": 3,
  "totalAttempts": 20,
  "durationMinutes": 5
}
```

#### Log Learning Progress
```http
POST /api/progress/learning
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "moduleName": "Body Parts Learning",
  "moduleType": "body_parts",
  "itemsViewed": 10,
  "durationMinutes": 8,
  "isCompleted": true
}
```

#### Get Game Sessions
```http
GET /api/progress/games?limit=20&offset=0&gameType=body_touch
Authorization: Bearer <access_token>
```

#### Get Learning Progress
```http
GET /api/progress/learning?moduleType=body_parts
Authorization: Bearer <access_token>
```

#### Get Activity Logs
```http
GET /api/progress/activities?limit=50&activityType=game&startDate=2024-01-01
Authorization: Bearer <access_token>
```

#### Get Analytics
```http
GET /api/progress/analytics?period=7
Authorization: Bearer <access_token>
```

Period options: `7`, `30`, `90`, `all` (days)

#### Get Progress Summary
```http
GET /api/progress/summary
Authorization: Bearer <access_token>
```

## 🗄️ Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (Unique)
- `password` (Bcrypt hashed)
- `firstName`, `lastName`
- `childName`, `childAge`
- `isEmailVerified`
- Email verification tokens
- Password reset tokens
- `lastLogin`, `isActive`

### ParentalControl Table
- `id` (UUID, Primary Key)
- `userId` (Foreign Key → Users)
- `pin` (Bcrypt hashed)
- `sessionTimeLimit`, `dailyTimeLimit`
- `allowedDays` (Array)
- `allowedTimeStart`, `allowedTimeEnd`
- Content blocking settings

### GameSession Table
- `id` (UUID, Primary Key)
- `userId` (Foreign Key → Users)
- `gameName`, `gameType`
- `score`, `correctAnswers`, `wrongAnswers`
- `totalAttempts`, `durationMinutes`
- `completedAt`

### LearningProgress Table
- `id` (UUID, Primary Key)
- `userId` (Foreign Key → Users)
- `moduleName`, `moduleType`
- `itemsViewed`, `durationMinutes`
- `isCompleted`, `completedAt`

### ActivityLog Table
- `id` (UUID, Primary Key)
- `userId` (Foreign Key → Users)
- `activityType`, `activityName`
- `score`, `durationMinutes`
- `details` (JSONB)
- `timestamp`

## 🔒 Security Features

1. **Password Hashing**: Bcrypt with salt rounds (10)
2. **PIN Hashing**: Bcrypt for parental PINs
3. **JWT Tokens**: Short-lived access tokens, long-lived refresh tokens
4. **Rate Limiting**: 100 requests per 15 minutes per IP
5. **Helmet**: Security headers
6. **CORS**: Configured for frontend origin
7. **Input Validation**: Express-validator for all inputs
8. **SQL Injection Protection**: Sequelize ORM parameterized queries

## 📊 Logging

Logs are stored in:
- `server/logs/error.log` - Error logs only
- `server/logs/combined.log` - All logs

Console output in development mode with colorization.

## 🧪 Testing

```bash
# Install development dependencies
npm install --save-dev

# Run tests (when implemented)
npm test
```

## 🚀 Deployment

### Heroku Deployment

```bash
# Install Heroku CLI
heroku create sakina-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_ACCESS_SECRET=your_secret
heroku config:set EMAIL_HOST=smtp.gmail.com
# ... set all other env vars

# Deploy
git push heroku main
```

### Docker Deployment

```bash
# Build image
docker build -t sakina-backend .

# Run container
docker run -p 5000:5000 --env-file .env sakina-backend
```

## 📝 Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment (development/production) | No | development |
| `FRONTEND_URL` | Frontend application URL | Yes | - |
| `DB_HOST` | PostgreSQL host | Yes | - |
| `DB_PORT` | PostgreSQL port | No | 5432 |
| `DB_NAME` | Database name | Yes | - |
| `DB_USER` | Database username | Yes | - |
| `DB_PASSWORD` | Database password | Yes | - |
| `JWT_ACCESS_SECRET` | Access token secret (64+ chars) | Yes | - |
| `JWT_REFRESH_SECRET` | Refresh token secret (64+ chars) | Yes | - |
| `EMAIL_HOST` | SMTP host | Yes | - |
| `EMAIL_PORT` | SMTP port | Yes | - |
| `EMAIL_USER` | SMTP username/email | Yes | - |
| `EMAIL_PASSWORD` | SMTP password/app password | Yes | - |
| `PARENTAL_PIN_DEFAULT` | Default PIN for new accounts | No | 1234 |

## 🆘 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Ensure PostgreSQL is running and credentials in `.env` are correct.

### Email Not Sending
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```
**Solution**: If using Gmail, enable 2FA and create an App Password.

### JWT Token Expired
```
Token expired. Please refresh your token.
```
**Solution**: Use the `/api/auth/refresh-token` endpoint with your refresh token.

### CORS Error
```
Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:5173' has been blocked
```
**Solution**: Ensure `FRONTEND_URL` in `.env` matches your frontend URL exactly.

## 📖 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Sequelize ORM](https://sequelize.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io/)
- [Nodemailer](https://nodemailer.com/)

## 👥 Support

For issues or questions, contact: support@sakina-app.com

## 📄 License

MIT License - see LICENSE file for details
