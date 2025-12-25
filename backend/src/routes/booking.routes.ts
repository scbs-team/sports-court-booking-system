import { Router } from "express";
import { getAvailableCourts, createBooking, getBookings } from "../services/booking.service";

const router = Router();

// Get all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await getBookings();
    res.json(bookings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create booking
router.post("/", async (req, res) => {
  try {
    const booking = await createBooking(req.body);
    res.status(201).json(booking);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/availability", async (req, res) => {
  try {
    const { startTime, endTime } = req.query;
    if (!startTime || !endTime) {
      return res.status(400).json({ error: "startTime and endTime are required" });
    }

    const availableCourts = await getAvailableCourts(startTime as string, endTime as string);
    res.json(availableCourts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
