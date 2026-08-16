import { Response } from 'express';
import { AuthRequest } from '../types/express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const uploadFileToDB = async (req: AuthRequest, res: Response, next: any) => {
  try {
    console.log('[DB UPLOAD] Request received')
    console.log('[DB UPLOAD] req.file:', req.file ? 'File present' : 'No file')
    console.log('[DB UPLOAD] req.body:', req.body)
    
    if (!req.file) {
      console.log('[DB UPLOAD] No file uploaded')
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { fileType } = req.body;
    if (!fileType) {
      console.log('[DB UPLOAD] No fileType provided')
      return res.status(400).json({ error: 'File type is required' });
    }

    console.log('[DB UPLOAD] File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      fileType: fileType
    })

    // Convert file to base64
    const base64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    console.log('[DB UPLOAD] Saving to database...')

    // Save to PostgreSQL database
    const uploadedFile = await prisma.uploadedFile.create({
      data: {
        fileName: req.file.originalname,
        fileType: fileType,
        mimeType: mimeType,
        fileData: base64,
        fileSize: req.file.size
      }
    });

    console.log('[DB UPLOAD] File saved to database:', uploadedFile.id)

    // Return the full URL that can be used to retrieve the file
    const backendUrl = 'https://iwkl-backend-lg6t-production.up.railway.app';
    const fullUrl = `${backendUrl}/api/files/${uploadedFile.id}`;
    res.json({ 
      success: true, 
      fileId: uploadedFile.id,
      url: fullUrl
    });
  } catch (error) {
    console.error('[DB UPLOAD] File upload error:', error);
    console.error('[DB UPLOAD] Error details:', JSON.stringify(error, null, 2))
    res.status(500).json({ error: 'Failed to upload file', details: (error as Error).message });
  }
};

export const getFileFromDB = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { id } = req.params;

    console.log('[DB GET] Fetching file:', id)

    const file = await prisma.uploadedFile.findUnique({
      where: { id }
    });

    if (!file) {
      console.log('[DB GET] File not found:', id)
      return res.status(404).json({ error: 'File not found' });
    }

    console.log('[DB GET] File found:', file.fileName)

    // Convert base64 back to buffer
    const buffer = Buffer.from(file.fileData, 'base64');

    // Add comprehensive CORS headers to allow frontend to access files
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // Send the file with appropriate content type
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${file.fileName}"`);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(buffer);
  } catch (error) {
    console.error('[DB GET] Error fetching file:', error);
    res.status(500).json({ error: 'Failed to fetch file', details: (error as Error).message });
  }
};
