import app from './app';
import { prisma } from './lib/prisma';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Database connected successfully');

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`API URL: http://localhost:${PORT}/api`);
    });

    // Graceful shutdown
    const gracefulShutdown = async () => {
      console.log('\nReceived shutdown signal');
      
      server.close(async () => {
        console.log('HTTP server closed');
        
        await prisma.$disconnect();
        console.log('Database connection closed');
        
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();
