const { Client } = require('minio');
require('dotenv').config();

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

const BUCKET_NAME = process.env.MINIO_BUCKET || 'uploads';

// ✅ Ensure the bucket exists or create it
async function ensureBucketExists() {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
      console.log(`✅ Bucket "${BUCKET_NAME}" created successfully.`);
    } else {
      console.log(`ℹ️ Bucket "${BUCKET_NAME}" already exists.`);
    }
  } catch (error) {
    console.error('❌ Failed to ensure bucket exists:', error);
  }
}

// Immediately check on load
ensureBucketExists();

module.exports = {
  minioClient,
  BUCKET_NAME,
};
