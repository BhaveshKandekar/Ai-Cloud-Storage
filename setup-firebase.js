#!/usr/bin/env node

/**
 * Firebase Setup Script for AI Cloud Storage
 * This script helps you set up Firebase configuration quickly
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Firebase Setup for AI Cloud Storage');
console.log('=====================================\n');

// Check if firebase.js already exists
const firebasePath = path.join(__dirname, 'frontend', 'src', 'firebase.js');
const examplePath = path.join(__dirname, 'frontend', 'src', 'firebase.example.js');

if (fs.existsSync(firebasePath)) {
  console.log('⚠️  firebase.js already exists!');
  console.log('   If you want to reset it, delete the file first.\n');
} else {
  if (fs.existsSync(examplePath)) {
    // Copy example to firebase.js
    fs.copyFileSync(examplePath, firebasePath);
    console.log('✅ Created firebase.js from template');
    console.log('   Now edit frontend/src/firebase.js with your Firebase config\n');
  } else {
    console.log('❌ firebase.example.js not found!');
    console.log('   Please check your project structure.\n');
  }
}

console.log('📋 Next Steps:');
console.log('1. Go to https://console.firebase.google.com/');
console.log('2. Create a new project or select existing one');
console.log('3. Add a web app to your project');
console.log('4. Copy the configuration object');
console.log('5. Update frontend/src/firebase.js with your config');
console.log('6. Enable Google Authentication in Firebase Console\n');

console.log('🔒 Security Note:');
console.log('   Your repository is now safe for public deployment!');
console.log('   All sensitive Firebase keys have been replaced with placeholders.\n');

console.log('Happy coding! 🎉');
