import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        // TypeScript now knows this is a ZodError
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));
        
        return res.status(400).json({
          error: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: formattedErrors,
        });
      }
      
      // Pass other errors to the next error handler
      next(error);
    }
  };
  