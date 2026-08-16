import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    mobile: string;
    role: string;
  };
  userId?: string;
  userRole?: string;
}

export interface FileRequest extends Request {
  files?: Express.Multer.File[];
}
