<<<<<<< HEAD
import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => 
=======

import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validate =
  (schema: AnyZodObject) =>
>>>>>>> 698b4ed (errors fixed)
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
<<<<<<< HEAD
          error: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: formattedErrors,
=======
          errors: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
>>>>>>> 698b4ed (errors fixed)
        });
      }
      
      // Pass other errors to the next error handler
      next(error);
    }
  };
  
