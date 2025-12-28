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

export default router;
