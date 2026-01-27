import express from 'express';
import cors from 'cors';
import bookingRoutes from './routes/booking.routes';
import courtRoutes from './routes/court.routes';
import authRoutes from './routes/auth.routes';

const app = express();

// Basic middleware
const configuredOrigins = (process.env.CORS_ORIGIN ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const defaultOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const allowedOrigins = configuredOrigins.length > 0 ? configuredOrigins : defaultOrigins;

app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/auth', authRoutes);

// Basic 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Basic error handler
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  
  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
  });
});

export default app;
