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
    const { id } = req.params;
    const { startDate, endDate } = req.query; // REMOVED: status
    
    if (!id || !/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: "Valid court ID is required"
      });
    }
    
    const prisma = await import("../lib/prisma").then(m => m.default);
    
    const where: any = {
      courtId: Number(id)
    };
    
    // REMOVED: status filter since we don't have status field anymore
    // if (status) {
    //   where.status = status;
    // }
    
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
      courtId: id
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
    const { id } = req.params;
    const { date } = req.query;
    
    if (!id || !/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: "Valid court ID is required"
      });
    }
    
    const targetDate = date ? new Date(date as string) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
    
    const prisma = await import("../lib/prisma").then(m => m.default);
    
    // Get all bookings for this court on the target date
    // REMOVED: status filter
    const bookings = await prisma.booking.findMany({
      where: {
        courtId: Number(id),
        // REMOVED: status filter
        startTime: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });
    
    // Generate availability slots (assuming 1-hour slots from 8 AM to 10 PM)
    const availableSlots = [];
    const businessHours = { start: 8, end: 22 }; // 8 AM to 10 PM
    
    for (let hour = businessHours.start; hour < businessHours.end; hour++) {
      const slotStart = new Date(startOfDay);
      slotStart.setHours(hour, 0, 0, 0);
      
      const slotEnd = new Date(startOfDay);
      slotEnd.setHours(hour + 1, 0, 0, 0);
      
      // Check if this slot is booked
      const isBooked = bookings.some(booking => 
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
        courtId: id,
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
