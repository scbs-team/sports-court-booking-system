
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
import * as bookingController from "../controllers/booking.controller";
import { validate } from "../middlewares/validate";
import { createBookingSchema } from "../validations/booking.schema";

const router = Router();

// GET /api/bookings - Get all bookings
router.get("/", bookingController.getBookings);

// POST /api/bookings - Create a new booking (with validation)
router.post("/", validate(createBookingSchema), bookingController.createBooking);

// GET /api/bookings/availability - Get available courts for a time period
router.get("/availability", async (req, res) => {
  try {
    const { startTime, endTime } = req.query;
    
    if (!startTime || !endTime) {
      return res.status(400).json({ 
        error: "startTime and endTime are required" 
      });
    }
    
    const bookingService = await import("../services/booking.service");
    const availableCourts = await bookingService.getAvailableCourts(
      startTime as string,
      endTime as string
    );
    
    res.json(availableCourts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
