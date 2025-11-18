# 🚀 Complete Backend Setup Guide

This guide will walk you through setting up the Sakina backend from scratch.

## ⏱️ Estimated Time: 15-20 minutes

---

## Step 1: Install Prerequisites

### 1.1 Install Node.js (if not already installed)

**Windows:**
1. Download from [nodejs.org](https://nodejs.org/) (LTS version)
2. Run installer and follow prompts
3. Verify: `node --version` (should show v18+)

**Mac:**
```bash
brew install node
```

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 1.2 Install PostgreSQL

**Windows:**
1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer (remember the password you set!)
3. Default port: 5432

**Mac:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 1.3 Verify Installations

```bash
node --version    # Should show v18.x or higher
npm --version     # Should show v9.x or higher
psql --version    # Should show PostgreSQL 14+
```

---

## Step 2: Create PostgreSQL Database

### Option A: Using Command Line

**Windows (Command Prompt as Administrator):**
```cmd
cd "C:\Program Files\PostgreSQL\14\bin"
psql -U postgres
```

**Mac/Linux:**
```bash
psql -U postgres
```

**Then create database:**
```sql
CREATE DATABASE sakina_db;
\l                    -- List databases (verify sakina_db exists)
\q                    -- Quit
```

### Option B: Using pgAdmin

1. Open pgAdmin
2. Right-click "Databases" → "Create" → "Database"
3. Name: `sakina_db`
4. Click "Save"

---

## Step 3: Install Backend Dependencies

```bash
cd server
npm install
```

This will install all required packages:
- express (web framework)
- sequelize (ORM)
- pg (PostgreSQL driver)
- bcryptjs (password hashing)
- jsonwebtoken (JWT auth)
- nodemailer (email service)
- And more...

---

## Step 4: Configure Environment Variables

### 4.1 Copy Template

```bash
cp .env.example .env
```

### 4.2 Generate JWT Secrets

**Generate Access Token Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output (64-character string).

**Generate Refresh Token Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy this output too (different from above).

### 4.3 Edit .env File

Open `server/.env` and fill in:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sakina_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here

# JWT Secrets (paste the generated secrets)
JWT_ACCESS_SECRET=paste_64_char_secret_here
JWT_REFRESH_SECRET=paste_different_64_char_secret_here

# Email Configuration (see Step 5 for details)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password_here

# Parental Control
PARENTAL_PIN_DEFAULT=1234
```

---

## Step 5: Configure Email Service

### Option A: Using Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Turn on "2-Step Verification"

2. **Create App Password**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Name it "Sakina Backend"
   - Click "Generate"
   - Copy the 16-character password (remove spaces)

3. **Update .env**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=youremail@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop    # Paste app password
   ```

### Option B: Using SendGrid (Recommended for Production)

1. Sign up at [sendgrid.com](https://sendgrid.com/)
2. Create API Key
3. Update .env:
   ```env
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASSWORD=your_sendgrid_api_key
   ```

### Option C: Using Mailtrap (Testing Only)

1. Sign up at [mailtrap.io](https://mailtrap.io/)
2. Copy SMTP credentials
3. Update .env with Mailtrap settings

---

## Step 6: Test Database Connection

```bash
node -e "
require('dotenv').config();
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  }
);
sequelize.authenticate()
  .then(() => console.log('✅ Database connection successful!'))
  .catch(err => console.error('❌ Connection failed:', err.message));
"
```

**Expected Output:**
```
✅ Database connection successful!
```

**If it fails:**
- Check PostgreSQL is running: `pg_isready` (Mac/Linux) or check Services (Windows)
- Verify DB_PASSWORD matches your PostgreSQL password
- Ensure sakina_db database exists

---

## Step 7: Start the Server

### Development Mode (with auto-restart)

```bash
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000
✅ Database connection established successfully
✅ Database models synchronized
📍 Environment: development
🌐 Frontend URL: http://localhost:5173
📚 API Endpoints:
   - POST   /api/auth/register
   - POST   /api/auth/login
   ...
```

### Production Mode

```bash
npm start
```

---

## Step 8: Test the API

### Option A: Using Postman

1. Install [Postman](https://www.postman.com/downloads/)
2. Import collection: `File` → `Import` → `server/Sakina_API.postman_collection.json`
3. Try "Health Check" request (should return `{"status":"OK"}`)
4. Try "Register" request to create a user
5. Try "Login" request (tokens will auto-save)

### Option B: Using cURL

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "firstName": "John",
    "lastName": "Doe",
    "childName": "Emma",
    "childAge": 7
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Option C: Using Browser

Navigate to: `http://localhost:5000/api/health`

Should see:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 45.123
}
```

---

## Step 9: Verify Database Tables

Check if tables were created:

```bash
psql -U postgres -d sakina_db
```

```sql
\dt                           -- List all tables
SELECT * FROM "Users";        -- View users (should be empty)
\q                            -- Quit
```

**Expected tables:**
- Users
- ParentalControls
- GameSessions
- LearningProgresses
- ActivityLogs

---

## Step 10: Test Email Functionality

1. Register a new user (see Step 8)
2. Check your email inbox for verification email
3. If using Gmail, check Spam folder too
4. Click verification link or copy token
5. Use "Verify Email" endpoint with the token

**Troubleshooting emails:**
- Gmail: Check "Less secure app access" is ON
- Check EMAIL_USER and EMAIL_PASSWORD are correct
- Try Mailtrap for testing (no actual emails sent)

---

## 🎉 Success! Your Backend is Ready

### Next Steps:

1. **Connect Frontend**
   - Update frontend API calls to use `http://localhost:5000/api`
   - Replace localStorage calls with backend API calls

2. **Add More Features**
   - Implement additional game types
   - Add more analytics endpoints
   - Create admin panel

3. **Prepare for Production**
   - Set up environment variables on hosting platform
   - Use PostgreSQL from hosting provider
   - Configure production email service
   - Set up monitoring and logging

---

## 📊 Project Structure

```
server/
├── config/
│   ├── database.js          # Sequelize connection
│   └── logger.js            # Winston logger
├── controllers/
│   ├── authController.js    # Auth logic
│   ├── userController.js    # User management
│   ├── parentalController.js # Parental controls
│   └── progressController.js # Progress tracking
├── middleware/
│   ├── authMiddleware.js    # JWT verification
│   ├── validators.js        # Input validation
│   └── errorHandler.js      # Error handling
├── models/
│   ├── User.js              # User model
│   ├── ParentalControl.js   # Parental control model
│   ├── GameSession.js       # Game session model
│   ├── LearningProgress.js  # Learning progress model
│   ├── ActivityLog.js       # Activity log model
│   └── index.js             # Model associations
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── userRoutes.js        # User endpoints
│   ├── parentalRoutes.js    # Parental endpoints
│   └── progressRoutes.js    # Progress endpoints
├── services/
│   └── emailService.js      # Email templates
├── logs/
│   ├── error.log            # Error logs
│   └── combined.log         # All logs
├── .env                     # Environment variables (DO NOT COMMIT)
├── .env.example             # Template for .env
├── index.js                 # Server entry point
├── package.json             # Dependencies
└── README.md                # API documentation
```

---

## 🆘 Common Issues & Solutions

### Issue: "ECONNREFUSED" database error

**Solution:**
```bash
# Check PostgreSQL is running
pg_isready          # Mac/Linux
# Windows: Check Services for "postgresql-x64-14"

# Start PostgreSQL
brew services start postgresql@14    # Mac
sudo systemctl start postgresql       # Linux
# Windows: Start from Services panel
```

### Issue: Email not sending

**Solution:**
- Verify EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD
- For Gmail: Use App Password, not regular password
- Check spam folder
- Try Mailtrap for testing

### Issue: "Module not found" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 5000 already in use

**Solution:**
```bash
# Find process using port 5000
lsof -ti:5000        # Mac/Linux
netstat -ano | findstr :5000    # Windows

# Kill process or change PORT in .env
```

### Issue: JWT token expired

**Solution:**
- Use the `/api/auth/refresh-token` endpoint
- Access tokens expire in 15 minutes (intentional for security)
- Refresh tokens last 7 days

### Issue: Database sync errors

**Solution:**
```bash
# Drop and recreate database
psql -U postgres
DROP DATABASE sakina_db;
CREATE DATABASE sakina_db;
\q

# Restart server (will recreate tables)
npm run dev
```

---

## 📞 Support

For issues:
1. Check logs in `server/logs/error.log`
2. Review API documentation in `server/README.md`
3. Test with Postman collection
4. Contact: support@sakina-app.com

---

## ✅ Checklist

Before deploying to production, ensure:

- [ ] All environment variables configured
- [ ] Database backups set up
- [ ] Production email service configured
- [ ] SSL/HTTPS enabled
- [ ] Rate limiting configured
- [ ] Logging and monitoring set up
- [ ] Error tracking (e.g., Sentry) integrated
- [ ] API documentation shared with frontend team
- [ ] Security audit completed
- [ ] Load testing performed

---

**Happy Coding! 🚀**
