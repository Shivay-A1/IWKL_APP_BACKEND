import { Request } from 'express';

// Simple Role enum for TypeScript
export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  LEAGUE_ADMIN = 'LEAGUE_ADMIN',
  TEAM_MANAGER = 'TEAM_MANAGER',
  USER = 'USER'
}

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
