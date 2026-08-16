import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('=== VALIDATION ERRORS ===');
    console.log('Errors array:', errors.array());
    const formattedErrors = errors.array().map((error: any) => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));
    console.log('Formatted errors:', formattedErrors);
    console.log('========================');
    return res.status(400).json({ 
      success: false,
      errors: formattedErrors,
      message: 'Validation failed'
    });
  }
  next();
};
