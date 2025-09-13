# Environment Variables Configuration

This document outlines all the environment variables needed for deploying the AI Cloud Storage application.

## Backend Environment Variables (Render/Production)

Set these in your Render dashboard under Environment Variables:

### Database
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-cloud-storage?retryWrites=true&w=majority
```

### Firebase Admin (Backend)
```
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}
```
**Note**: This should be the entire JSON content of your Firebase service account key file as a single string.

### MinIO/Object Storage
```
MINIO_ENDPOINT=your-minio-endpoint.com
MINIO_PORT=443
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET=uploads
```

### AI Categorization (Optional)
```
AI_API_KEY=your-openai-api-key
AI_API_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-3.5-turbo
```

## Frontend Environment Variables (Vercel/Production)

Set these in your Vercel dashboard under Environment Variables:

### Firebase Client (Frontend)
```
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### API Configuration
```
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
```

## Local Development

For local development, create a `.env` file in the backend directory:

```env
MONGO_URI=mongodb://localhost:27017/ai-cloud-storage
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET=uploads
AI_API_KEY=your-openai-api-key
AI_API_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-3.5-turbo
```

And a `.env` file in the frontend directory:

```env
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_API_BASE_URL=http://localhost:5000/api
```

## How to Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Download the JSON file
6. Copy the entire JSON content and paste it as the `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable

## Security Notes

- Never commit `.env` files to version control
- Use different Firebase projects for development and production
- Rotate API keys regularly
- Use strong, unique passwords for all services
