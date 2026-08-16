// ============================================================================
// ⚠️  REGISTRATION FLOW - DO NOT MODIFY WITHOUT APPROVAL ⚠️
// ============================================================================
// This file contains the critical file upload routes that are currently working.
// Any changes to this file may break the registration system.
//
// BEFORE MAKING CHANGES:
// 1. Read REGISTRATION_FLOW_LOCK.md in project root
// 2. Test thoroughly in development environment
// 3. Get approval from project owner
// 4. Document changes in REGISTRATION_FLOW_LOCK.md
//
// LAST UPDATED: 2026-08-04
// STATUS: ✅ WORKING - LOCKED
// ============================================================================

import { Router } from 'express';
import * as fileUploadController from '../controllers/file-upload.controller';
import { uploadMemory } from '../middleware';

const router = Router();

// Upload file to PostgreSQL database (no auth required for registration)
// Use memory storage to read file as buffer
router.post('/upload', uploadMemory.single('file'), fileUploadController.uploadFileToDB);

// Get file from database by ID (no auth - admin panel already protected)
router.get('/:id', fileUploadController.getFileFromDB);

export default router;
