import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, storageConfig } from '../config/storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const uploadToS3 = async (
  file: Buffer,
  key: string,
  contentType: string
): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: storageConfig.bucket,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return `https://${storageConfig.bucket}.s3.${storageConfig.region}.amazonaws.com/${key}`;
};

export const deleteFromS3 = async (key: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: storageConfig.bucket,
    Key: key,
  });

  await s3Client.send(command);
};

export const getSignedS3Url = async (key: string, expiresIn: number = 3600): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: storageConfig.bucket,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
};

export const generateS3Key = (folder: string, fileName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = fileName.split('.').pop();
  return `${folder}/${timestamp}-${randomString}.${extension}`;
};
