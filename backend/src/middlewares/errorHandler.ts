import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[${new Date().toISOString()}] Error:`, {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.code || 'APP_ERROR',
      message: error.message,
      details: error.details,
      timestamp: new Date().toISOString(),
      path: req.path,
    });
  }

  // Handle Zod validation errors
  if (error.name === 'ZodError') {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      details: (error as any).errors,
      timestamp: new Date().toISOString(),
    });
  }

  // Handle Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;
    
    if (prismaError.code === 'P2002') {
      return res.status(409).json({
        error: 'DUPLICATE_ENTRY',
        message: 'A record with this value already exists',
        field: prismaError.meta?.target?.[0],
        timestamp: new Date().toISOString(),
      });
    }
    
    if (prismaError.code === 'P2025') {
      return res.status(404).json({
        error: 'RECORD_NOT_FOUND',
        message: 'The requested record was not found',
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Default error response
  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : error.message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
  });
};
