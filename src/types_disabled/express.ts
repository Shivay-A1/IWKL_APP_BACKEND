import { Request } from 'express';
import { Role } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    mobile: string;
    role: Role;
  };
  userId?: string;
  userRole?: Role;
}

export interface FileRequest extends Request {
  files?: Express.Multer.File[];
}
