// Lazy imports to prevent startup crashes
let prisma: any = null;
let authConfig: any = null;
let s3Client: any = null;
let storageConfig: any = null;

export const getPrisma = () => {
  if (!prisma) {
    try {
      prisma = require('./database').default;
    } catch (error) {
      console.warn('Database module failed to load:', error);
      return null;
    }
  }
  return prisma;
};

export const getAuthConfig = () => {
  if (!authConfig) {
    try {
      authConfig = require('./auth').authConfig;
    } catch (error) {
      console.warn('Auth config failed to load:', error);
      return null;
    }
  }
  return authConfig;
};

export const getS3Client = () => {
  if (!s3Client) {
    try {
      const module = require('./storage');
      s3Client = module.s3Client;
      storageConfig = module.storageConfig;
    } catch (error) {
      console.warn('Storage module failed to load:', error);
      return null;
    }
  }
  return s3Client;
};

export const getStorageConfig = () => {
  if (!storageConfig) {
    try {
      storageConfig = require('./storage').storageConfig;
    } catch (error) {
      console.warn('Storage config failed to load:', error);
      return null;
    }
  }
  return storageConfig;
};
