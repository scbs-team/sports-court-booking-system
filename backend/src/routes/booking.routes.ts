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
