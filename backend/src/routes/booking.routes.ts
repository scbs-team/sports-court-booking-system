import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { authMiddleware } from '../middlewares/auth';
import { requireAdmin } from '../middlewares/role';
import {
  createBookingSchema,
  updateBookingStatusSchema,
  getBookingsSchema,
  checkAvailabilitySchema,
} from '../validations/booking.schema';
import {
  createBookingHandler,
<<<<<<< HEAD
  getBookings,
  getBookingById,
  updateBookingStatus,
  checkAvailability,
  deleteBookingHandler,
  getBookingStatsHandler,
  autoCompletePastBookingsHandler,
=======
  confirmBookingHandler,
  cancelBookingHandler,
  completeBookingHandler,
  getBookings,
>>>>>>> bda24ab (api deploy for backend)
} from '../controllers/booking.controller';
import * as bookingService from '../services/booking.service';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management endpoints
 */

/**
<<<<<<< HEAD
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get bookings with filters
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: courtId
 *         schema:
 *           type: string
 *         description: Filter by court ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED, COMPLETED]
 *         description: Filter by booking status
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter bookings from this date
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter bookings to this date
 *     responses:
 *       200:
 *         description: List of bookings
=======
 * @route   GET /bookings
 * @desc    List bookings
 * @access  Public
 */
router.get('/', getBookings);

/**
 * @route   PATCH /bookings/:id/confirm
 * @desc    Confirm a booking (automated)
 * @access  Authenticated users
>>>>>>> bda24ab (api deploy for backend)
 */
router.get('/', authMiddleware, validate(getBookingsSchema), getBookings);

/**
 * @swagger
 * /api/bookings/availability:
 *   get:
 *     summary: Get available courts for a time period
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: startTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start time for availability check
 *       - in: query
 *         name: endTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End time for availability check
 *     responses:
 *       200:
 *         description: List of available courts
 */
router.get('/availability', checkAvailability);

/**
 * @swagger
 * /api/bookings/availability/{courtId}:
 *   get:
 *     summary: Check specific court availability
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: courtId
 *         required: true
 *         schema:
 *           type: string
 *         description: Court ID to check
 *       - in: query
 *         name: startTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start time for availability check
 *       - in: query
 *         name: endTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End time for availability check
 *     responses:
 *       200:
 *         description: Court availability information
 */
<<<<<<< HEAD
router.get('/availability/:courtId', validate(checkAvailabilitySchema), checkAvailability);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courtId
 *               - startTime
 *               - endTime
 *             properties:
 *               courtId:
 *                 type: string
 *                 format: uuid
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Booking created successfully
 */
router.post('/', authMiddleware, validate(createBookingSchema), createBookingHandler);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking details
 */
router.get('/:id', authMiddleware, getBookingById);

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   patch:
 *     summary: Update booking status
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, CANCELLED, COMPLETED]
 *     responses:
 *       200:
 *         description: Booking status updated
 */
router.patch('/:id/status', authMiddleware, validate(updateBookingStatusSchema), updateBookingStatus);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Delete booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Booking ID
 *     responses:
 *       204:
 *         description: Booking deleted successfully
 */
router.delete('/:id', authMiddleware, deleteBookingHandler);

/**
 * @swagger
 * /api/bookings/stats/overview:
 *   get:
 *     summary: Get booking statistics (Admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: courtId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by court ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for statistics
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for statistics
 *     responses:
 *       200:
 *         description: Booking statistics
 */
router.get('/stats/overview', authMiddleware, requireAdmin, getBookingStatsHandler);

/**
 * @swagger
 * /api/bookings/admin/auto-complete:
 *   post:
 *     summary: Auto-complete past bookings (Admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Past bookings auto-completed
 */
router.post('/admin/auto-complete', authMiddleware, requireAdmin, autoCompletePastBookingsHandler);

/**
 * @swagger
 * /api/bookings/available-courts:
 *   get:
 *     summary: Get available courts with options
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: startTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start time
 *       - in: query
 *         name: endTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End time
 *       - in: query
 *         name: excludeCourts
 *         schema:
 *           type: string
 *         description: JSON array of court IDs to exclude
 *       - in: query
 *         name: includeCourts
 *         schema:
 *           type: string
 *         description: JSON array of court IDs to include
 *     responses:
 *       200:
 *         description: Available courts
 */
router.get('/available-courts', async (req, res) => {
  try {
    const { startTime, endTime, excludeCourts, includeCourts } = req.query;
    
    if (!startTime || !endTime) {
      return res.status(400).json({ 
        error: 'VALIDATION_ERROR',
        message: 'startTime and endTime are required' 
      });
    }
    
    const options: any = {};
    
    if (excludeCourts) {
      try {
        options.excludeCourtIds = JSON.parse(excludeCourts as string);
      } catch {
        return res.status(400).json({ 
          error: 'VALIDATION_ERROR',
          message: 'excludeCourts must be a valid JSON array' 
        });
      }
    }
    
    if (includeCourts) {
      try {
        options.includeCourtIds = JSON.parse(includeCourts as string);
      } catch {
        return res.status(400).json({ 
          error: 'VALIDATION_ERROR',
          message: 'includeCourts must be a valid JSON array' 
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
    if (error instanceof Error && 'code' in error) {
      res.status(400).json({
        error: (error as any).code || 'FETCH_AVAILABLE_ERROR',
        message: error.message,
      });
    } else {
      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: 'Failed to fetch available courts',
      });
    }
  }
});
=======
router.patch('/:id/complete', authMiddleware, completeBookingHandler);
>>>>>>> bda24ab (api deploy for backend)

export default router;
