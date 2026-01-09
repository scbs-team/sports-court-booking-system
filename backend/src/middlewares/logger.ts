import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, url, ip } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    const logLevel = statusCode >= 500 ? 'ERROR' : 
                     statusCode >= 400 ? 'WARN' : 'INFO';

    console.log(`[${new Date().toISOString()}] ${logLevel}: ${method} ${url} ${statusCode} ${duration}ms - ${ip}`);
  });

  next();
};
