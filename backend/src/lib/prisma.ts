/**
 * Prisma Client Singleton
 * 
 * This file exports a single Prisma Client instance to be used
 * throughout the application. Using a singleton pattern prevents
 * multiple client instances in development (with hot reloading).
 * 
 * In production: Creates one client instance
 * In development: Reuses the same client across hot reloads
 */

import { PrismaClient } from '@prisma/client';

// Declare global type for development environment
// This prevents TypeScript errors when attaching prisma to globalThis
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Initialize Prisma Client
 * 
 * In development: Store client on globalThis to survive hot reloads
 * In production: Create a new client instance
 */
export const prisma = globalThis.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'], // Enable logging for debugging
});

// In development, save the client to globalThis
// This prevents creating multiple instances during hot reloading
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
