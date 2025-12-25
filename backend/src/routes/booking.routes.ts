import { Router } from "express";
import {
  createBooking,
  getBookings
} from "../controllers/booking.controller";
import { validate } from "../middlewares/validate";
import { createBookingSchema } from "../validations/booking.schema";

const router = Router();

router.post("/", validate(createBookingSchema), createBooking);
router.get("/", getBookings);

export default router;
