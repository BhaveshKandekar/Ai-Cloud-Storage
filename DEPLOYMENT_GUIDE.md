# 🚀 Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Security Measures Completed
- [x] `.gitignore` file created to protect sensitive data
- [x] Environment variables template created (`.env.example`)
- [x] Firebase API keys will be updated before deployment
- [x] Database credentials will be configured via environment variables
- [x] MinIO credentials will be configured via environment variables

### 🔒 Sensitive Information Protected
- Environment variables (`.env` files)
- Firebase service account keys
- Database connection strings
- MinIO access keys and secrets
- API keys for AI services
- User upload directories
- Test files with potential sensitive data

## 🌐 GitHub Deployment Steps

### Step 1: Initialize Git Repository
```bash
# Navigate to your project directory
cd ai-cloud-storage

# Initialize git repository
git init

# Add all files (excluding those in .gitignore)
git add .

# Make initial commit
git commit -m "Initial commit: AI Cloud Storage project"
```

### Step 2: Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Repository name: `ai-cloud-storage`
5. Description: `AI-powered cloud storage with intelligent categorization`
6. Choose **Public** or **Private** (recommend private for production)
7. **DO NOT** initialize with README, .gitignore, or license (we already have these)
8. Click "Create repository"

### Step 3: Connect and Push to GitHub
```bash
# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ai-cloud-storage.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 4: Firebase Configuration (Already Secured!)
✅ **Firebase configuration has been secured for public deployment!**

The `frontend/src/firebase.js` file now contains placeholder values instead of real API keys. To use the application:

1. **Copy the template**: `cp frontend/src/firebase.example.js frontend/src/firebase.js`
2. **Get your Firebase config**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Copy the configuration object
3. **Replace placeholder values** in `frontend/src/firebase.js` with your actual Firebase config
4. **Enable Google Authentication** in Firebase Console

**Your repository is now safe for public deployment!** 🎉

### Step 5: Environment Setup for Production
1. Create production environment variables
2. Set up production MongoDB instance
3. Configure production MinIO server
4. Update all API endpoints for production

## 🐳 Docker Deployment

### Local Docker Testing
```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in background
docker-compose up -d
```

### Production Docker Deployment
```bash
# Build production images
docker build -t ai-cloud-storage-backend ./backend
docker build -t ai-cloud-storage-frontend ./frontend

# Run with production environment
docker run -d --name backend -p 5000:5000 --env-file .env ai-cloud-storage-backend
docker run -d --name frontend -p 3000:3000 ai-cloud-storage-frontend
```

## ☁️ Cloud Deployment Options

### Option 1: Heroku
```bash
# Install Heroku CLI
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set MINIO_ENDPOINT=your_minio_endpoint
heroku config:set MINIO_ACCESS_KEY=your_access_key
heroku config:set MINIO_SECRET_KEY=your_secret_key

# Deploy
git push heroku main
```

### Option 2: AWS
1. Deploy backend to AWS EC2 or Lambda
2. Deploy frontend to AWS S3 + CloudFront
3. Use AWS RDS for MongoDB
4. Use AWS S3 for MinIO replacement

### Option 3: Google Cloud Platform
1. Deploy backend to Cloud Run
2. Deploy frontend to Firebase Hosting
3. Use Cloud Firestore for database
4. Use Cloud Storage for file storage

## 🔧 Production Configuration

### Environment Variables (Production)
```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_production_mongodb_uri
MINIO_ENDPOINT=your_production_minio_endpoint
MINIO_PORT=443
MINIO_USE_SSL=true
MINIO_ACCESS_KEY=your_production_access_key
MINIO_SECRET_KEY=your_production_secret_key
MINIO_BUCKET=uploads
JWT_SECRET=your_very_secure_jwt_secret
```

### Security Headers
```javascript
// Add to your Express app
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### SSL/HTTPS Setup
```bash
# Install SSL certificate
# Configure Nginx reverse proxy
# Redirect HTTP to HTTPS
```

## 📊 Monitoring and Logging

### Application Monitoring
- Use PM2 for process management
- Implement health check endpoints
- Set up error tracking (Sentry)
- Monitor API response times

### Logging
```javascript
// Implement structured logging
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## 🚨 Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify file upload/download functionality
- [ ] Test user authentication
- [ ] Check AI categorization service
- [ ] Verify duplicate detection
- [ ] Test analytics dashboard
- [ ] Monitor error logs
- [ ] Set up automated backups
- [ ] Configure monitoring alerts

## 🆘 Troubleshooting

### Common Issues
1. **CORS errors**: Check frontend URL in backend CORS configuration
2. **Database connection**: Verify MongoDB URI and network access
3. **File upload failures**: Check MinIO credentials and bucket permissions
4. **Authentication issues**: Verify Firebase configuration

### Debug Commands
```bash
# Check backend logs
docker logs backend

# Check frontend logs
docker logs frontend

# Test database connection
mongo your_mongodb_uri

# Test MinIO connection
mc config host add myminio your_minio_endpoint your_access_key your_secret_key
```

## 📞 Support

If you encounter issues during deployment:
1. Check the logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all services (MongoDB, MinIO) are running
4. Check network connectivity and firewall settings

---

**Happy Deploying! 🎉**
