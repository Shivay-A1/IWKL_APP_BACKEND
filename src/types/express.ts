import { Request } from 'express';

// Role types as strings instead of Prisma enum
export type Role = 'SUPER_ADMIN' | 'LEAGUE_ADMIN' | 'TEAM_MANAGER' | 'USER';

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
