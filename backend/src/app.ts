import express from 'express';
import bookingRoutes from './routes/booking.routes';
import courtRoutes from './routes/court.routes';
import authRoutes from './routes/auth.routes';

const app = express();

// Basic middleware
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
