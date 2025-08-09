const express = require('express');
const multer = require('multer');
const { Readable } = require('stream');
const crypto = require('crypto');
const { minioClient, BUCKET_NAME } = require('../config/minio');
const admin = require('../config/firebase');
const File = require('../models/File'); // Import your Mongoose File model
const { categorizeFile } = require('../services/aiCategorization'); // Import AI categorization service

const router = express.Router();
const upload = multer(); // in-memory

// Middleware to verify Firebase token
async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.userId = decodedToken.uid;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Upload file - with duplicate detection, metadata saving, and AI categorization
router.post('/uploads', verifyToken, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const userId = req.userId;
    const originalName = req.file.originalname;
    const size = req.file.size;
    const buffer = req.file.buffer;
    const mimetype = req.file.mimetype;

    // Calculate SHA-256 hash of the file buffer
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    // Check if file with same hash already exists for this user
    const existingFile = await File.findOne({ userId, hash });
    if (existingFile) {
      return res.status(409).json({ 
        message: 'File already exists.', 
        file: existingFile,
        duplicateType: 'hash',
        canReplace: true
      });
    }

    // Check if file with same name already exists for this user
    const existingFileName = await File.findOne({ userId, fileName: originalName });
    if (existingFileName) {
      return res.status(409).json({ 
        message: 'File with same name already exists.', 
        file: existingFileName,
        duplicateType: 'filename',
        canReplace: true
      });
    }

    // Step 3: AI Auto Categorization
    let category = 'Uncategorized';
    try {
      console.log('🤖 Starting AI categorization for:', originalName);
      category = await categorizeFile({
        mimetype,
        fileName: originalName,
        buffer
      });
      console.log('✅ AI categorization completed:', category);
    } catch (categorizationError) {
      console.error('⚠️ AI categorization failed:', categorizationError.message);
      // Continue with upload even if categorization fails
      category = 'Other';
    }

    // Prepare MinIO file path
    const filePath = `${userId}/${originalName}`;

    // Upload file to MinIO
    const fileStream = Readable.from(buffer);
    await minioClient.putObject(BUCKET_NAME, filePath, fileStream, size);

    // Save file metadata to MongoDB with AI-generated category
    const newFile = new File({
      userId,
      fileName: originalName,
      filePath,
      category, // AI-assigned category
      hash,
      size,
      uploadDate: new Date(),
    });
    await newFile.save();

    res.status(200).json({ 
      message: '✅ File uploaded successfully', 
      file: newFile,
      aiCategory: category // Include the AI category in response
    });
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

// Replace existing file - new route for handling duplicates
router.post('/uploads/replace', verifyToken, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  if (!req.body.existingFileId) return res.status(400).json({ error: 'existingFileId is required' });

  try {
    const userId = req.userId;
    const originalName = req.file.originalname;
    const size = req.file.size;
    const buffer = req.file.buffer;
    const mimetype = req.file.mimetype;
    const existingFileId = req.body.existingFileId;

    // Verify the existing file belongs to this user
    const existingFile = await File.findOne({ _id: existingFileId, userId });
    if (!existingFile) {
      return res.status(404).json({ error: 'Existing file not found or access denied' });
    }

    // Calculate new hash
    const newHash = crypto.createHash('sha256').update(buffer).digest('hex');

    // Step 3: AI Auto Categorization
    let category = 'Uncategorized';
    try {
      console.log('🤖 Starting AI categorization for replacement:', originalName);
      category = await categorizeFile({
        mimetype,
        fileName: originalName,
        buffer
      });
      console.log('✅ AI categorization completed for replacement:', category);
    } catch (categorizationError) {
      console.error('⚠️ AI categorization failed for replacement:', categorizationError.message);
      category = 'Other';
    }

    // Remove old file from MinIO
    await minioClient.removeObject(BUCKET_NAME, existingFile.filePath);

    // Upload new file to MinIO
    const fileStream = Readable.from(buffer);
    await minioClient.putObject(BUCKET_NAME, existingFile.filePath, fileStream, size);

    // Update file metadata in MongoDB
    existingFile.fileName = originalName;
    existingFile.category = category;
    existingFile.hash = newHash;
    existingFile.size = size;
    existingFile.uploadDate = new Date();
    await existingFile.save();

    res.status(200).json({ 
      message: '✅ File replaced successfully', 
      file: existingFile,
      aiCategory: category
    });
  } catch (err) {
    console.error('❌ File replacement error:', err);
    res.status(500).json({ error: 'File replacement failed', details: err.message });
  }
});

// List files (unchanged)
router.get('/files', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get files from MongoDB with full metadata
    const userFiles = await File.find({ userId }).sort({ uploadDate: -1 });
    
    // Generate presigned URLs for each file
    const filesWithUrls = await Promise.all(
      userFiles.map(async (file) => {
        try {
          const url = await minioClient.presignedGetObject(
            BUCKET_NAME,
            file.filePath,
            60 * 60
          );
          
          return {
            name: file.fileName,
            size: file.size,
            category: file.category,
            uploadDate: file.uploadDate,
            lastModified: file.uploadDate,
            url,
            hash: file.hash
          };
        } catch (error) {
          console.error(`Error generating URL for file ${file.fileName}:`, error);
          return {
            name: file.fileName,
            size: file.size,
            category: file.category,
            uploadDate: file.uploadDate,
            lastModified: file.uploadDate,
            url: null,
            hash: file.hash,
            error: 'Failed to generate download URL'
          };
        }
      })
    );
    
    res.status(200).json(filesWithUrls);
  } catch (err) {
    console.error('❌ Error listing files:', err);
    res.status(500).json({ error: 'Failed to fetch files', details: err.message });
  }
});

// Delete file (unchanged)
router.delete('/files', verifyToken, async (req, res) => {
  try {
    const { fileName } = req.body;
    if (!fileName) return res.status(400).json({ error: 'fileName is required in body' });

    const userId = req.userId;
    
    // Find the file in MongoDB first
    const fileDoc = await File.findOne({ userId, fileName });
    if (!fileDoc) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete from MinIO
    await minioClient.removeObject(BUCKET_NAME, fileDoc.filePath);
    
    // Delete from MongoDB
    await File.findByIdAndDelete(fileDoc._id);
    
    res.status(200).json({ message: '✅ File deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting file:', err);
    res.status(500).json({ error: 'Failed to delete file', details: err.message });
  }
});

// Get storage analytics
router.get('/analytics', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get all files for this user
    const userFiles = await File.find({ userId });
    
    // Calculate total storage used
    const totalSize = userFiles.reduce((sum, file) => sum + (file.size || 0), 0);
    
    // Get file count
    const fileCount = userFiles.length;
    
    // Categorize files by AI-generated category
    const categories = {};
    userFiles.forEach(file => {
      const category = file.category || 'Uncategorized';
      if (!categories[category]) {
        categories[category] = { count: 0, size: 0 };
      }
      categories[category].count++;
      categories[category].size += file.size || 0;
    });
    
    // Get recent uploads (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentUploads = userFiles.filter(file => {
      const uploadDate = new Date(file.uploadDate);
      return uploadDate >= sevenDaysAgo;
    });
    
    // Convert to MB/GB for display
    const formatBytes = (bytes) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    const analytics = {
      totalSize,
      totalSizeFormatted: formatBytes(totalSize),
      fileCount,
      categories: Object.entries(categories).map(([name, data]) => ({
        name,
        count: data.count,
        size: data.size,
        sizeFormatted: formatBytes(data.size),
        percentage: totalSize > 0 ? ((data.size / totalSize) * 100).toFixed(1) : 0
      })),
      recentUploads: recentUploads.length,
      recentUploadsList: recentUploads.slice(0, 5).map(file => ({
        name: file.fileName,
        size: formatBytes(file.size),
        category: file.category,
        uploadedAt: file.uploadDate
      }))
    };
    
    res.json(analytics);
  } catch (error) {
    console.error('Error getting storage analytics:', error);
    res.status(500).json({ error: 'Failed to get storage analytics' });
  }
});

module.exports = router;
