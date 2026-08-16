import { Router } from 'express';
import * as fileUploadController from '../controllers/file-upload.controller';
import { upload } from '../middleware';

const router = Router();

// Upload file to PostgreSQL database (no auth required for registration)
router.post('/upload', upload.single('file'), fileUploadController.uploadFileToDB);

// Get file from database by ID (no auth - admin panel already protected)
router.get('/:id', fileUploadController.getFileFromDB);

export default router;
