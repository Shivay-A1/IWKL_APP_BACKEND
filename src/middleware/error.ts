import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('=== ERROR HANDLER ===');
  console.error('Error:', err);
  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  console.error('Error stack:', err.stack);
  console.error('===================');

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Simplified error handling without Prisma type checking
  if (err.name === 'PrismaClientKnownRequestError') {
    console.error('Prisma Known Request Error:', (err as any).code, err.message);
    if ((err as any).code === 'P2002') {
      return res.status(409).json({ error: 'A record with this data already exists' });
    }
    if ((err as any).code === 'P2025') {
      return res.status(404).json({ error: 'Record not found' });
    }
  }

  if (err.name === 'PrismaClientValidationError') {
    console.error('Prisma Validation Error:', err.message);
    return res.status(400).json({ 
      error: 'Invalid data provided',
      details: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  console.error('Unhandled error type, returning 500');
  return res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
};
