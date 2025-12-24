/**
 * Prisma Configuration (Prisma 7+)
 * 
 * In Prisma 7, database connection URLs are moved from schema.prisma
 * to this config file. This provides better separation of concerns
 * and allows for different URLs in different environments.
 */

import { defineConfig } from '@prisma/client';

export default defineConfig({
  datasources: {
    db: {
      // Read DATABASE_URL from environment variables
      url: process.env.DATABASE_URL || ''
    }
  }
});
