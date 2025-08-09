const { Client } = require("minio");
require("dotenv").config();

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
});

const BUCKET_NAME = process.env.MINIO_BUCKET || "uploads";

// Remove the async bucket check that might be causing issues
console.log(`ℹ️ MinIO client initialized for bucket: ${BUCKET_NAME}`);

module.exports = {
  minioClient,
  BUCKET_NAME,
};
