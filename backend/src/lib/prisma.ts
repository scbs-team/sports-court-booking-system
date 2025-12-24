/**
 * Prisma Client Singleton (Prisma 7)
 * 
 * This file exports a single Prisma Client instance to be used
 * throughout the application. Using a singleton pattern prevents
 * multiple client instances in development (with hot reloading).
 * 
 * In Prisma 7: Pass database URL via withAccelerator or adapter
 * In production: Creates one client instance
 * In development: Reuses the same client across hot reloads
 */

import { PrismaClient, withAccelerator } from '@prisma/client';

// Declare global type for development environment
// This prevents TypeScript errors when attaching prisma to globalThis
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Initialize Prisma Client with Prisma 7 configuration
 * 
 * In Prisma 7, we use withAccelerator to pass the database URL
 * from environment variables instead of hardcoding in schema.prisma
 */
export const prisma = globalThis.prisma || withAccelerator(new PrismaClient({
  log: ['query', 'error', 'warn'], // Enable logging for debugging
}), {
  // Pass the database connection URL from environment
  accelerateUrl: process.env.DATABASE_URL
});

// In development, save the client to globalThis
// This prevents creating multiple instances during hot reloading
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
