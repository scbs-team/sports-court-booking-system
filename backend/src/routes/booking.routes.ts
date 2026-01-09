
import { Router } from 'express';
import {
  createBookingHandler,
  confirmBookingHandler,
  cancelBookingHandler,
  completeBookingHandler,
} from '../controllers/booking.controller';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

/**
 * @route   POST /bookings
 * @desc    Create a new booking
 * @access  Authenticated users
 */
router.post('/', authMiddleware, createBookingHandler);

/**
 * @route   PATCH /bookings/:id/confirm
 * @desc    Confirm a booking (automated)
 * @access  Authenticated users
 */
router.patch('/:id/confirm', authMiddleware, confirmBookingHandler);

/**
 * @route   PATCH /bookings/:id/cancel
 * @desc    Cancel a booking
 * @access  Authenticated users
 */
router.patch('/:id/cancel', authMiddleware, cancelBookingHandler);

/**
 * @route   PATCH /bookings/:id/complete
 * @desc    Complete a booking
 * @access  Authenticated users
 */
router.patch('/:id/complete', authMiddleware, completeBookingHandler);
import { Router } from "express";
import { validate } from "../middlewares/validate";
import { 
  createBookingSchema, 
  updateBookingStatusSchema,
  getBookingsSchema 
} from "../validations/booking.schema";

const router = Router();

// Import booking service
import * as bookingService from "../services/booking.service";

// GET /api/bookings - Get all bookings with optional filters
router.get("/", validate(getBookingsSchema), async (req, res) => {
  try {
    const { courtId, status, fromDate, toDate } = req.query;
    
    const bookings = await bookingService.getBookings({
      courtId: courtId as string,
      status: status as any,
      fromDate: fromDate ? new Date(fromDate as string) : undefined,
      toDate: toDate ? new Date(toDate as string) : undefined,
    });
    
    res.json(bookings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings/availability - Get available courts for a time period
router.get("/availability", async (req, res) => {
  try {
    const { startTime, endTime, excludeCourts, includeCourts } = req.query;
    
    if (!startTime || !endTime) {
      return res.status(400).json({ 
        error: "startTime and endTime are required" 
      });
    }
    
    // Parse optional arrays
    const options: any = {};
    
    if (excludeCourts) {
      try {
        options.excludeCourtIds = JSON.parse(excludeCourts as string);
      } catch {
        return res.status(400).json({ error: "excludeCourts must be a valid JSON array" });
      }
    }
    
    if (includeCourts) {
      try {
        options.includeCourtIds = JSON.parse(includeCourts as string);
      } catch {
        return res.status(400).json({ error: "includeCourts must be a valid JSON array" });
      }
    }
    
    const availableCourts = await bookingService.getAvailableCourts(
      startTime as string,
      endTime as string,
      options
    );
    
    res.json(availableCourts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings/availability/:courtId - Check specific court availability
router.get("/availability/:courtId", async (req, res) => {
  try {
    const { courtId } = req.params;
    const { startTime, endTime, excludeBookingId } = req.query;
    
    if (!startTime || !endTime) {
      return res.status(400).json({ 
        error: "startTime and endTime are required" 
      });
    }
    
    const availability = await bookingService.checkCourtAvailability(
      courtId,
      startTime as string,
      endTime as string,
      excludeBookingId as string | undefined
    );
    
    res.json(availability);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/bookings/:id - Get booking by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await bookingService.getBookingById(id);
    
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    res.json(booking);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/bookings - Create a new booking (with validation)
router.post("/", validate(createBookingSchema), async (req, res) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json(booking);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/bookings/:id/status - Update booking status
router.patch("/:id/status", validate(updateBookingStatusSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const booking = await bookingService.updateBookingStatus({
      bookingId: id,
      newStatus: status,
    });
    
    res.json(booking);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/bookings/:id - Delete booking
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Note: Add admin authentication here when auth is implemented
    // if (!req.user?.isAdmin) {
    //   return res.status(403).json({ error: "Unauthorized" });
    // }
    
    await bookingService.deleteBooking(id);
    
    res.status(204).send();
  } catch (err: any) {
    if (err.message.includes("not found") || err.code === "P2025") {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings/stats/overview - Get booking statistics
router.get("/stats/overview", async (req, res) => {
  try {
    const { courtId, startDate, endDate } = req.query;
    
    const stats = await bookingService.getBookingStats(
      courtId as string | undefined,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );
    
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
