import { Router } from "express";
import * as courtController from "../controllers/court.controller";

const router = Router();

// GET /api/courts - Get all courts
router.get("/", courtController.getCourts);

// POST /api/courts - Create a new court
router.post("/", courtController.createCourt);

// GET /api/courts/:id - Get court by ID
router.get("/:id", courtController.getCourtById);

// PUT /api/courts/:id - Update court
router.put("/:id", courtController.updateCourt);

// DELETE /api/courts/:id - Delete court
router.delete("/:id", courtController.deleteCourt);

// GET /api/courts/:id/bookings - Get bookings for specific court (with date filters)
router.get("/:id/bookings", async (req, res) => {
  try {
    const courtId = Number(req.params.id);
    const { startDate, endDate, status } = req.query;
    
    if (!Number.isInteger(courtId) || courtId <= 0) {
      return res.status(400).json({
        success: false,
        error: "Valid court ID is required"
      });
    }
    
    const prisma = await import("../lib/prisma").then(m => m.default);
    
    const where: any = {
      courtId: courtId
    };
    
    // Status filter
    if (status && ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status as string)) {
      where.status = status;
    }
    
    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = new Date(startDate as string);
      if (endDate) where.startTime.lte = new Date(endDate as string);
    }
    
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        court: true,
      },
      orderBy: {
        startTime: 'asc'
      }
    });
    
    res.json({
      success: true,
      data: bookings,
      count: bookings.length,
      courtId: courtId
    });
  } catch (err: any) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// GET /api/courts/:id/availability - Get court availability for a date
router.get("/:id/availability", async (req, res) => {
  try {
    const courtId = Number(req.params.id);
    const { date } = req.query;
    
    if (!Number.isInteger(courtId) || courtId <= 0) {
      return res.status(400).json({
        success: false,
        error: "Valid court ID is required"
      });
    }
    
    const targetDate = date ? new Date(date as string) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const prisma = await import("../lib/prisma").then(m => m.default);
    
    // Get all active bookings for this court on the target date
    const bookings = await prisma.booking.findMany({
      where: {
        courtId: courtId,
        status: {
          in: ["PENDING", "CONFIRMED"] as any[]
        },
        startTime: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });
    
    // Generate availability slots (8 AM to 10 PM, 1-hour slots)
    const availableSlots = [];
    const businessHours = { start: 8, end: 22 };
    
    for (let hour = businessHours.start; hour < businessHours.end; hour++) {
      const slotStart = new Date(startOfDay);
      slotStart.setHours(hour, 0, 0, 0);
      
      const slotEnd = new Date(startOfDay);
      slotEnd.setHours(hour + 1, 0, 0, 0);
      
      // Check if this slot overlaps with any booking
      const isBooked = bookings.some((booking: { startTime: Date; endTime: Date }) => 
        booking.startTime < slotEnd && booking.endTime > slotStart
      );
      
      availableSlots.push({
        startTime: slotStart.toISOString(),
        endTime: slotEnd.toISOString(),
        available: !isBooked,
        hour: `${hour}:00 - ${hour + 1}:00`
      });
    }
    
    res.json({
      success: true,
      data: {
        date: startOfDay.toISOString().split('T')[0],
        courtId: courtId,
        availableSlots,
        bookings
      }
    });
  } catch (err: any) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

export default router;
