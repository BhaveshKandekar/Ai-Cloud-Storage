const admin = require('firebase-admin');

// Initialize Firebase Admin with environment variables
let serviceAccount;
try {
  // Try to load from environment variables first (for production)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  } else {
    // Fallback to file (for local development)
    serviceAccount = require('./serviceAccountKey.json');
  }
} catch (error) {
  console.error('❌ Firebase configuration error:', error.message);
  console.log('ℹ️ Make sure to set FIREBASE_SERVICE_ACCOUNT_KEY environment variable for production');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
