# 🚀 AI Cloud Storage

A modern, AI-powered cloud storage solution with intelligent file categorization, duplicate detection, and advanced analytics.

## ✨ Features

- **🤖 AI-Powered File Categorization** - Automatically categorize files using machine learning
- **🔍 Duplicate Detection** - Find and manage duplicate files intelligently
- **📊 Advanced Analytics** - Comprehensive storage analytics and insights
- **🔐 Secure Authentication** - Firebase-based user authentication
- **☁️ Scalable Storage** - MinIO-based object storage
- **📱 Modern UI** - React-based responsive frontend
- **🔄 Real-time Updates** - Live file synchronization

## 🏗️ Architecture

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Storage**: MinIO (S3-compatible)
- **Authentication**: Firebase
- **AI Services**: OpenAI/Google AI APIs

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- MinIO Server
- Firebase Project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-cloud-storage.git
   cd ai-cloud-storage
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   
   # Frontend
   cd ../frontend
   # Update firebase.js with your Firebase config
   ```

4. **Start the application**
   ```bash
   # Start backend (from backend directory)
   npm start
   
   # Start frontend (from frontend directory)
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
MONGO_URI=mongodb://localhost:27017/ai-cloud-storage
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=your_access_key
MINIO_SECRET_KEY=your_secret_key
MINIO_BUCKET=uploads
PORT=5000
NODE_ENV=development
```

### Firebase Setup

1. **Create a Firebase project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project" and follow the setup wizard

2. **Configure Firebase for Web**:
   - In your Firebase project, click the web icon (</>) to add a web app
   - Register your app with a nickname
   - Copy the configuration object

3. **Update Firebase configuration**:
   - **Quick Setup**: Run `node setup-firebase.js` to automatically create firebase.js
   - **Manual Setup**: Copy `frontend/src/firebase.example.js` to `frontend/src/firebase.js`
   - Replace the placeholder values with your actual Firebase config:
     ```javascript
     const firebaseConfig = {
       apiKey: "your-actual-api-key",
       authDomain: "your-project-id.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-project-id.appspot.com",
       messagingSenderId: "your-sender-id",
       appId: "your-app-id"
     };
     ```

4. **Enable Authentication**:
   - In Firebase Console, go to Authentication > Sign-in method
   - Enable Google sign-in provider
   - Add your authorized domains

5. **Backend Firebase Admin** (optional):
   - Go to Project Settings > Service accounts
   - Generate new private key
   - Download `serviceAccountKey.json` and place it in `backend/config/`

### MinIO Setup

1. Start MinIO server
2. Create a bucket named "uploads"
3. Update environment variables with your MinIO credentials

## 📁 Project Structure

```
ai-cloud-storage/
├── backend/                 # Node.js backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── utils/              # Utility functions
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── assets/         # Static assets
│   └── public/             # Public assets
├── storage/                # MinIO storage configuration
└── nginx/                  # Nginx configuration
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Docker Deployment

```bash
docker-compose up -d
```

### Manual Deployment

1. Build the frontend: `npm run build`
2. Start the backend: `npm start`
3. Configure your reverse proxy (Nginx)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/ai-cloud-storage/issues)
- 📚 Documentation: [Wiki](https://github.com/yourusername/ai-cloud-storage/wiki)

## 🙏 Acknowledgments

- OpenAI for AI categorization services
- Firebase for authentication
- MinIO for object storage
- React and Node.js communities

---

⭐ **Star this repository if you find it helpful!**
