import { Request, Response, NextFunction } from 'express';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Authentication required',
    });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'FORBIDDEN',
      message: 'Admin access required',
    });
  }

  next();
};
