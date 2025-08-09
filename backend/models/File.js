// // backend/models/File.js
// const mongoose = require('mongoose');

// const FileSchema = new mongoose.Schema({
//   filename: String,
//   originalName: String,
//   size: Number,
//   mimetype: String,
//   url: String,
//   uploadDate: {
//     type: Date,
//     default: Date.now,
//   },
//   bucket: String,
//   tags: [String], // for AI analysis
// });

// module.exports = mongoose.model('File', FileSchema);


// models/File.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  userId: { type: String, required: true },        // ID of user who uploaded
  fileName: { type: String, required: true },      // Original filename
  filePath: { type: String, required: true },      // Storage path or URL
  category: { type: String, default: 'Uncategorized' }, // AI assigned or manual category
  hash: { type: String, required: true },          // SHA-256 hash for duplicate detection
  size: { type: Number, required: true },          // File size in bytes
  uploadDate: { type: Date, default: Date.now }    // Date of upload
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
