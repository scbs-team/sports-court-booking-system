import { Router } from "express";
import { validate } from "../middlewares/validate";
import { authMiddleware } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/role";
import {
  createBookingSchema,
  updateBookingStatusSchema,
  getBookingsSchema,
  checkAvailabilitySchema,
} from "../validations/booking.schema";
import {
  createBookingHandler,
  getBookings,
  getBookingById,
  updateBookingStatus,
  checkAvailability,
  deleteBookingHandler,
  getBookingStatsHandler,
  autoCompletePastBookingsHandler,
} from "../controllers/booking.controller";
import * as bookingService from "../services/booking.service";

const router = Router();

router.get("/", authMiddleware, validate(getBookingsSchema), getBookings);

router.get("/availability", checkAvailability);
router.get("/availability/:courtId", validate(checkAvailabilitySchema), checkAvailability);

router.get("/available-courts", async (req, res) => {
  try {
    const { startTime, endTime, excludeCourts, includeCourts } = req.query;

    if (!startTime || !endTime) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "startTime and endTime are required",
      });
    }

    const options: any = {};

    if (excludeCourts) {
      try {
        options.excludeCourtIds = JSON.parse(excludeCourts as string);
      } catch {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "excludeCourts must be a valid JSON array",
        });
      }
    }

    if (includeCourts) {
      try {
        options.includeCourtIds = JSON.parse(includeCourts as string);
      } catch {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "includeCourts must be a valid JSON array",
        });
      }
    }

    const availableCourts = await bookingService.getAvailableCourts(
      startTime as string,
      endTime as string,
      options
    );

    res.json({
      success: true,
      data: availableCourts,
      count: availableCourts.length,
    });
  } catch (error: any) {
    if (error instanceof Error && "code" in error) {
      res.status(400).json({
        error: (error as any).code || "FETCH_AVAILABLE_ERROR",
        message: error.message,
      });
    } else {
      res.status(500).json({
        error: "INTERNAL_ERROR",
        message: "Failed to fetch available courts",
      });
    }
  }
});

router.get("/stats/overview", authMiddleware, requireAdmin, getBookingStatsHandler);
router.post("/admin/auto-complete", authMiddleware, requireAdmin, autoCompletePastBookingsHandler);

router.post("/", authMiddleware, validate(createBookingSchema), createBookingHandler);
router.get("/:id", authMiddleware, getBookingById);
router.patch("/:id/status", authMiddleware, validate(updateBookingStatusSchema), updateBookingStatus);
router.delete("/:id", authMiddleware, deleteBookingHandler);

export default router;
