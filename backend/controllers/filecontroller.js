const minioClient = require('../services/minioClient');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');
const metadataPath = path.join(__dirname, '../metadata.json');

const uploadFile = async (req, res) => {
  const file = req.file;
  const fileId = uuid();

  minioClient.fPutObject('user-files', fileId, file.path, (err) => {
    if (err) return res.status(500).json({ error: err });

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8') || '[]');
    metadata.push({
      id: fileId,
      originalName: file.originalname,
      size: file.size,
      type: file.mimetype,
      uploadedAt: new Date(),
    });
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    res.json({ message: 'File uploaded', id: fileId });
  });
};

const getFiles = (req, res) => {
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8') || '[]');
  res.json(metadata);
};

const downloadFile = (req, res) => {
  const { id } = req.params;
  minioClient.getObject('user-files', id, (err, stream) => {
    if (err) return res.status(404).json({ error: 'File not found' });
    stream.pipe(res);
  });
};

const getStorageAnalytics = (req, res) => {
  try {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8') || '[]');
    
    // Calculate total storage used
    const totalSize = metadata.reduce((sum, file) => sum + (file.size || 0), 0);
    
    // Get file count
    const fileCount = metadata.length;
    
    // Categorize files by type
    const categories = {};
    metadata.forEach(file => {
      const type = file.type || 'unknown';
      let category = 'Other';
      
      if (type.startsWith('image/')) category = 'Images';
      else if (type.startsWith('video/')) category = 'Videos';
      else if (type.startsWith('audio/')) category = 'Audio';
      else if (type.includes('pdf')) category = 'PDFs';
      else if (type.includes('document') || type.includes('word') || type.includes('excel')) category = 'Documents';
      else if (type.includes('text/')) category = 'Text';
      else if (type.includes('application/')) category = 'Applications';
      
      if (!categories[category]) {
        categories[category] = { count: 0, size: 0 };
      }
      categories[category].count++;
      categories[category].size += file.size || 0;
    });
    
    // Get recent uploads (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentUploads = metadata.filter(file => {
      const uploadDate = new Date(file.uploadedAt);
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
        name: file.originalName,
        size: formatBytes(file.size),
        uploadedAt: file.uploadedAt
      }))
    };
    
    res.json(analytics);
  } catch (error) {
    console.error('Error getting storage analytics:', error);
    res.status(500).json({ error: 'Failed to get storage analytics' });
  }
};

module.exports = { uploadFile, getFiles, downloadFile, getStorageAnalytics };
