import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate =
  (schema: ZodSchema, property: 'body' | 'params' = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[property]);
      next();
    } catch (err: any) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: err.errors,
      });
    }
  };
