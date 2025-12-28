import { Router } from 'express';
import {
  createBookingHandler,
  confirmBookingHandler,
  cancelBookingHandler,
  completeBookingHandler,
} from '../controllers/booking.controller';
import { authMiddleware } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
  createBookingSchema,
  bookingIdParamSchema,
} from '../validations/booking.schema';

const router = Router();

router.post(
  '/',
  authMiddleware,
  validate(createBookingSchema),
  createBookingHandler,
);

router.post(
  '/:id/confirm',
  authMiddleware,
  validate(bookingIdParamSchema, 'params'),
  confirmBookingHandler,
);

router.post(
  '/:id/cancel',
  authMiddleware,
  validate(bookingIdParamSchema, 'params'),
  cancelBookingHandler,
);

router.post(
  '/:id/complete',
  authMiddleware,
  validate(bookingIdParamSchema, 'params'),
  completeBookingHandler,
);

export default router;
