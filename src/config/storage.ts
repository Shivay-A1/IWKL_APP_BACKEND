import { S3Client } from '@aws-sdk/client-s3';

// Simplified storage config for Railway deployment
export const storageConfig = {
  bucket: process.env.AWS_S3_BUCKET || 'iwkl-storage',
  region: process.env.AWS_REGION || 'us-east-1',
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  allowedVideoTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
  allowedDocumentTypes: ['application/pdf'],
  maxFileSize: 10 * 1024 * 1024, // 10MB (reduced for better handling)
  maxImageSize: 5 * 1024 * 1024, // 5MB (reduced for better handling)
};

// S3 client with proper environment variable checking
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});
