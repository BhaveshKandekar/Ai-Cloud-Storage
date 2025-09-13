const admin = require('firebase-admin');

// Initialize Firebase Admin with environment variables
let serviceAccount;

// Check if we're in production (Render sets NODE_ENV=production)
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  // Production: Must use environment variable
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    console.error('❌ FIREBASE_SERVICE_ACCOUNT_KEY environment variable is required for production');
    console.log('ℹ️ Please set the Firebase service account key as an environment variable in Render');
    process.exit(1);
  }
  
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  } catch (error) {
    console.error('❌ Invalid FIREBASE_SERVICE_ACCOUNT_KEY JSON format:', error.message);
    process.exit(1);
  }
} else {
  // Development: Try environment variable first, then fallback to file
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch (error) {
      console.error('❌ Invalid FIREBASE_SERVICE_ACCOUNT_KEY JSON format:', error.message);
      process.exit(1);
    }
  } else {
    try {
      serviceAccount = require('./serviceAccountKey.json');
    } catch (error) {
      console.error('❌ Firebase configuration error:', error.message);
      console.log('ℹ️ For local development, either:');
      console.log('   1. Set FIREBASE_SERVICE_ACCOUNT_KEY environment variable, or');
      console.log('   2. Place serviceAccountKey.json in backend/config/ directory');
      process.exit(1);
    }
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log('✅ Firebase Admin initialized successfully');
module.exports = admin;
