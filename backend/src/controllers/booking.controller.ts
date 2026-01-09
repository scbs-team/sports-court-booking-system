import { Request, Response } from 'express';
import * as bookingService from '../services/booking.service';
import { BookingServiceError } from '../services/booking.service';

export class BookingController {
  /**
   * Create a new booking
   */
  static async createBooking(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ 
          error: 'Unauthorized',
          message: 'Authentication required'
        });
        return;
      }

      const { courtId, startTime, endTime } = req.body;

      const booking = await bookingService.createBooking({
        courtId,
        startTime,
        endTime,
        userId: req.user.id,
      });

      res.status(201).json({
        success: true,
        data: booking,
        message: 'Booking created successfully'
      });
    } catch (error) {
      if (error instanceof BookingServiceError) {
        const statusCode = this.getStatusCodeForError(error.code);
        res.status(statusCode).json({
          error: error.code || 'BOOKING_ERROR',
          message: error.message,
          details: error.details,
        });
      } else {
        res.status(500).json({
          error: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        });
      }
    }
  }

  /**
   * Get bookings with filters
   */
  static async getBookings(req: Request, res: Response): Promise<void> {
    try {
      const { courtId, status, fromDate, toDate, userId } = req.query;
      
      // Authorization: Users can only see their own bookings unless admin
      let filterUserId = userId as string;
      if (req.user?.role !== 'ADMIN') {
        filterUserId = req.user?.id || '';
      }

      const filters = {
        courtId: courtId as string,
        status: status as any,
        fromDate: fromDate ? new Date(fromDate as string) : undefined,
        toDate: toDate ? new Date(toDate as string) : undefined,
        userId: filterUserId,
      };
      
      const bookings = await bookingService.getBookings(filters);
      
      res.json({
        success: true,
        data: bookings,
        count: bookings.length,
        pagination: {
          page: 1,
          limit: bookings.length,
          total: bookings.length,
        }
      });
    } catch (error) {
      if (error instanceof BookingServiceError) {
        res.status(400).json({
          error: error.code || 'FETCH_ERROR',
          message: error.message,
        });
      } else {
        res.status(500).json({
          error: 'INTERNAL_ERROR',
          message: 'Failed to fetch bookings',
        });
      }
    }
  }

  /**
   * Get booking by ID
   */
  static async getBookingById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const booking = await bookingService.getBookingById(id);
      
      // Authorization check
      if (req.user?.role !== 'ADMIN' && booking.user.id !== req.user?.id) {
        res.status(403).json({
          error: 'FORBIDDEN',
          message: 'You do not have permission to view this booking',
        });
        return;
      }
      
      res.json({
        success: true,
        data: booking,
      });
    } catch (error) {
      if (error instanceof BookingServiceError) {
        const statusCode = error.code === 'BOOKING_NOT_FOUND' ? 404 : 400;
        res.status(statusCode).json({
          error: error.code,
          message: error.message,
        });
      } else {
        res.status(500).json({
          error: 'INTERNAL_ERROR',
          message: 'Failed to fetch booking',
        });
      }
    }
  }

  /**
   * Update booking status
   */
  static async updateBookingStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const booking = await bookingService.updateBookingStatus({
        bookingId: id,
        newStatus: status,
        userId: req.user?.id,
      });
      
      res.json({
        success: true,
        data: booking,
        message: `Booking ${status.toLowerCase()} successfully`,
      });
    } catch (error) {
      if (error instanceof BookingServiceError) {
        const statusCode = this.getStatusCodeForError(error.code);
        res.status(statusCode).json({
          error: error.code || 'UPDATE_ERROR',
          message: error.message,
          details: error.details,
        });
      } else {
        res.status(500).json({
          error: 'INTERNAL_ERROR',
          message: 'Failed to update booking status',
        });
      }
    }
  }

  /**
   * Check court availability
   */
  static async checkAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { courtId, startTime, endTime } = req.query;
      
      if (!courtId || !startTime || !endTime) {
        res.status(400).json({ 
          error: 'VALIDATION_ERROR',
          message: 'courtId, startTime, and endTime are required' 
        });
        return;
      }
      
      const availability = await bookingService.checkCourtAvailability(
        courtId as string,
        startTime as string,
        endTime as string
      );
      
      res.json({
        success: true,
        data: availability,
      });
    } catch (error) {
      if (error instanceof BookingServiceError) {
        res.status(400).json({
          error: error.code || 'AVAILABILITY_ERROR',
          message: error.message,
          details: error.details,
        });
      } else {
        res.status(500).json({
          error: 'INTERNAL_ERROR',
          message: 'Failed to check availability',
        });
      }
    }
  }

  /**
   * Get available courts for time period
   */
  static async getAvailableCourts(req: Request, res: Response): Promise<void> {
    try {
      const { startTime, endTime, excludeCourts, includeCourts } = req.query;
      
      if (!startTime || !endTime) {
        res.status(400).json({ 
          error: 'VALIDATION_ERROR',
          message: 'startTime and endTime are required' 
        });
        return;
      }
      
      const options: any = {};
      
      if (excludeCourts) {
        try {
          options.excludeCourtIds = JSON.parse(excludeCourts as string);
        } catch {
          res.status(400).json({ 
            error: 'VALIDATION_ERROR',
            message: 'excludeCourts must be a valid JSON array' 
          });
          return;
        }
      }
      
      if (includeCourts) {
        try {
          options.includeCourtIds = JSON.parse(includeCourts as string);
        } catch {
          res.status(400).json({ 
            error: 'VALIDATION_ERROR',
            message: 'includeCourts must be a valid JSON array' 
          });
          return;
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
    } catch (error) {
      if (error instanceof BookingServiceError) {
        res.status(400).json({
          error: error.code || 'FETCH_AVAILABLE_ERROR',
          message: error.message,
        });
      } else {
        res.status(500).json({
          error: 'INTERNAL_ERROR',
          message: 'Failed to fetch available courts',
        });
      }
    }
  }

  /**
   * Delete booking
   */
  static async deleteBooking(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      await bookingService.deleteBooking(id, req.user?.id);
      
      res.status(204).send();
    } catch (error) {
      if (error instanceof BookingServiceError) {
        const statusCode = error.code === 'BOOKING_NOT_FOUND' ? 404 : 
                          error.code === 'UNAUTHORIZED' ? 403 : 400;
        res.status(statusCode).json({
          error: error.code,
          message: error.message,
        });
      } else {
        res.status(500).json({
          error: 'INTERNAL_ERROR',
          message: 'Failed to delete booking',
        });
      }
    }
  }

  /**
   * Get booking statistics
   */
  static async getBookingStats(req: Request, res: Response): Promise<void> {
    try {
      const { courtId, startDate, endDate } = req.query;
      
      // Only admins can view stats
      if (req.user?.role !== 'ADMIN') {
        res.status(403).json({
          error: 'FORBIDDEN',
          message: 'Admin access required',
        });
        return;
      }
      
      const stats = await bookingService.getBookingStats(
        courtId as string | undefined,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      if (error instanceof BookingServiceError) {
        res.status(400).json({
          error: error.code || 'STATS_ERROR',
          message: error.message,
        });
      } else {
        res.status(500).json({
          error: 'INTERNAL_ERROR',
          message: 'Failed to fetch booking statistics',
        });
      }
    }
  }

  /**
   * Auto-complete past bookings (admin only)
   */
  static async autoCompletePastBookings(req: Request, res: Response): Promise<void> {
    try {
      if (req.user?.role !== 'ADMIN') {
        res.status(403).json({
          error: 'FORBIDDEN',
          message: 'Admin access required',
        });
        return;
      }
      
      const result = await bookingService.autoCompletePastBookings();
      
      res.json({
        success: true,
        data: result,
        message: `${result.completed} bookings auto-completed`,
      });
    } catch (error) {
      if (error instanceof BookingServiceError) {
        res.status(400).json({
          error: error.code || 'AUTO_COMPLETE_ERROR',
          message: error.message,
        });
      } else {
        res.status(500).json({
          error: 'INTERNAL_ERROR',
          message: 'Failed to auto-complete bookings',
        });
      }
    }
  }

  /**
   * Helper method to map error codes to HTTP status codes
   */
  private static getStatusCodeForError(errorCode?: string): number {
    const errorMap: Record<string, number> = {
      'UNAUTHORIZED': 401,
      'FORBIDDEN': 403,
      'BOOKING_NOT_FOUND': 404,
      'COURT_NOT_FOUND': 404,
      'INVALID_TIME_RANGE': 400,
      'MAX_DURATION_EXCEEDED': 400,
      'MIN_DURATION_NOT_MET': 400,
      'OUTSIDE_BUSINESS_HOURS': 400,
      'CROSS_DAY_BOOKING': 400,
      'MAX_ADVANCE_EXCEEDED': 400,
      'MIN_ADVANCE_NOT_MET': 400,
      'BOOKING_CONFLICT': 409,
      'INVALID_STATUS_TRANSITION': 400,
      'CONCURRENCY_CONFLICT': 409,
      'CANCELLATION_TOO_LATE': 400,
      'COMPLETION_TOO_EARLY': 400,
      'DELETE_NOT_ALLOWED': 400,
    };
    
    return errorMap[errorCode || ''] || 400;
  }
}

// Export individual handler functions for compatibility with existing routes
export const createBookingHandler = BookingController.createBooking.bind(BookingController);
export const getBookings = BookingController.getBookings.bind(BookingController);
export const getBookingById = BookingController.getBookingById.bind(BookingController);
export const updateBookingStatus = BookingController.updateBookingStatus.bind(BookingController);
export const checkAvailability = BookingController.checkAvailability.bind(BookingController);
export const deleteBookingHandler = BookingController.deleteBooking.bind(BookingController);
export const getBookingStatsHandler = BookingController.getBookingStats.bind(BookingController);
export const autoCompletePastBookingsHandler = BookingController.autoCompletePastBookings.bind(BookingController);
