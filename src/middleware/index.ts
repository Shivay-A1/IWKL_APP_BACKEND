// Simplified middleware exports for deployment
export { errorHandler, notFound, AppError } from './error';

// Placeholder for other middleware (temporarily disabled)
export const generalLimiter = (req: any, res: any, next: any) => next();
export const authenticate = (req: any, res: any, next: any) => next();
export const authorize = (...roles: string[]) => (req: any, res: any, next: any) => next();
export const validate = (req: any, res: any, next: any) => next();

// Mock upload middleware
export const upload = {
  fields: (fields: any[]) => (req: any, res: any, next: any) => next(),
  single: (fieldName: string) => (req: any, res: any, next: any) => next(),
  array: (fieldName: string, maxCount: number) => (req: any, res: any, next: any) => next()
};

export const uploadSingle = (fieldName: string) => (req: any, res: any, next: any) => next();
export const uploadMultiple = (fieldName: string, maxCount: number) => (req: any, res: any, next: any) => next();
