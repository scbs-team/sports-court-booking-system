import express from "express";
import bookingRoutes from "./routes/booking.routes";
import courtRoutes from "./routes/court.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(express.json());

app.use("/api/bookings", bookingRoutes);
app.use("/api/courts", courtRoutes);
app.use("/api/auth", authRoutes);

export default app;

// Create a temporary test route in app.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add this before your routes in app.ts
app.get('/api/test/setup', async (req, res) => {
  try {
    // Create court table with correct case
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS court (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `;
    
    // Create booking table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS booking (
        id SERIAL PRIMARY KEY,
        "courtId" INTEGER NOT NULL REFERENCES court(id),
        "startTime" TIMESTAMP NOT NULL,
        "endTime" TIMESTAMP NOT NULL,
        status VARCHAR(50) DEFAULT 'PENDING',
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Create index
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS booking_courtid_starttime_endtime_idx 
      ON booking ("courtId", "startTime", "endTime");
    `;
    
    res.json({ success: true, message: 'Tables created' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
