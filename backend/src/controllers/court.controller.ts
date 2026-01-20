import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export class CourtController {
  /**
   * Create a new court (Admin only)
   */
  static async createCourt(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      
      if (!name || name.trim() === '') {
        res.status(400).json({ 
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Court name is required' 
        });
        return;
      }
      
      const court = await prisma.court.create({
        data: { 
          name: name.trim(),
        }
      });
      
      res.status(201).json({
        success: true,
        data: court,
        message: 'Court created successfully'
      });
    } catch (err: any) {
      if (err.code === 'P2002') {
        res.status(409).json({
          success: false,
          error: 'DUPLICATE_ERROR',
          message: 'Court with this name already exists'
        });
        return;
      }
      res.status(500).json({ 
        success: false,
        error: 'INTERNAL_ERROR',
        message: err.message 
      });
    }
  }

  /**
   * Get all courts
   */
  static async getCourts(req: Request, res: Response): Promise<void> {
    try {
      const { includeBookings, upcomingOnly } = req.query;
      
      const include = includeBookings === 'true' ? {
        bookings: {
          where: upcomingOnly === 'true' ? {
            startTime: {
              gte: new Date()
            }
          } : undefined,
          orderBy: {
            startTime: 'asc' as const
          },
          take: upcomingOnly === 'true' ? 5 : undefined,
          include: {
            user: {
              select: {
                id: true,
                username: true,
              }
            }
          }
        }
      } : undefined;
      
      const courts = await prisma.court.findMany({
        include,
        orderBy: {
          name: 'asc' as const
        }
      });
      
      res.json({
        success: true,
        data: courts,
        count: courts.length,
        metadata: {
          includeBookings: includeBookings === 'true',
          upcomingOnly: upcomingOnly === 'true',
        }
      });
    } catch (err: any) {
      res.status(500).json({ 
        success: false,
        error: 'INTERNAL_ERROR',
        message: err.message 
      });
    }
  }

  /**
   * Get court by ID
   */
  static async getCourtById(req: Request, res: Response): Promise<void> {
    try {
      const courtId = Number(req.params.id);
      
      if (!Number.isInteger(courtId) || courtId <= 0) {
        res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Valid court ID is required'
        });
        return;
      }
      
      const { includeBookings, days = '7' } = req.query;
      const daysInt = parseInt(days as string) || 7;
      
      const include = includeBookings === 'true' ? {
        bookings: {
          where: {
            startTime: {
              gte: new Date(Date.now() - daysInt * 24 * 60 * 60 * 1000)
            }
          },
          orderBy: {
            startTime: 'asc' as const
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
              }
            }
          }
        }
      } : undefined;
      
      const court = await prisma.court.findUnique({
        where: { id: courtId },
        include,
      });
      
      if (!court) {
        res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Court not found'
        });
        return;
      }
      
      res.json({
        success: true,
        data: court
      });
    } catch (err: any) {
      res.status(500).json({ 
        success: false,
        error: 'INTERNAL_ERROR',
        message: err.message 
      });
    }
  }

  /**
   * Delete court (Admin only)
   */
  static async deleteCourt(req: Request, res: Response): Promise<void> {
    try {
      const courtId = Number(req.params.id);
      
      if (!Number.isInteger(courtId) || courtId <= 0) {
        res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Valid court ID is required'
        });
        return;
      }
      
      // Check if court has any future bookings
      const activeBookings = await prisma.booking.count({
        where: {
          courtId: courtId,
          endTime: {
            gt: new Date()
          },
          status: {
            in: ['PENDING', 'CONFIRMED'] as any[]
          }
        }
      });
      
      if (activeBookings > 0) {
        res.status(400).json({
          success: false,
          error: 'CONSTRAINT_VIOLATION',
          message: 'Cannot delete court with future bookings'
        });
        return;
      }
      
      const court = await prisma.court.delete({
        where: { id: courtId }
      });
      
      res.json({
        success: true,
        message: 'Court deleted successfully',
        data: court
      });
    } catch (err: any) {
      if (err.code === 'P2025') {
        res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Court not found'
        });
        return;
      }
      res.status(500).json({ 
        success: false,
        error: 'INTERNAL_ERROR',
        message: err.message 
      });
    }
  }

  /**
   * Update court (Admin only)
   */
  static async updateCourt(req: Request, res: Response): Promise<void> {
    try {
      const courtId = Number(req.params.id);
      const { name } = req.body;
      
      if (!Number.isInteger(courtId) || courtId <= 0) {
        res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Valid court ID is required'
        });
        return;
      }
      
      if (!name || name.trim() === '') {
        res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Court name is required'
        });
        return;
      }
      
      const court = await prisma.court.update({
        where: { id: courtId },
        data: { 
          name: name.trim(),
        }
      });
      
      res.json({
        success: true,
        message: 'Court updated successfully',
        data: court
      });
    } catch (err: any) {
      if (err.code === 'P2025') {
        res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Court not found'
        });
        return;
      }
      if (err.code === 'P2002') {
        res.status(409).json({
          success: false,
          error: 'DUPLICATE_ERROR',
          message: 'Court with this name already exists'
        });
        return;
      }
      res.status(500).json({ 
        success: false,
        error: 'INTERNAL_ERROR',
        message: err.message 
      });
    }
  }

  /**
   * Get court statistics
   */
  static async getCourtStats(req: Request, res: Response): Promise<void> {
    try {
      const courtId = Number(req.params.id);
      
      if (!Number.isInteger(courtId) || courtId <= 0) {
        res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Valid court ID is required'
        });
        return;
      }
      
      const court = await prisma.court.findUnique({
        where: { id: courtId },
        include: {
          _count: {
            select: {
              bookings: {
                where: {
                  startTime: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                  }
                }
              }
            }
          },
          bookings: {
            where: {
              startTime: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              }
            },
            select: {
              status: true,
              startTime: true,
              endTime: true,
            },
            orderBy: {
              startTime: 'desc' as const
            },
            take: 10
          }
        }
      });
      
      if (!court) {
        res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Court not found'
        });
        return;
      }
      
      // Calculate utilization rate
      const totalSlots = 30 * 14; // 30 days * 14 hours/day (8 AM to 10 PM)
      const bookedSlots = court._count.bookings;
      const utilizationRate = totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0;
      
      res.json({
        success: true,
        data: {
          court: {
            id: court.id,
            name: court.name,
          },
          stats: {
            totalBookingsLast30Days: bookedSlots,
            utilizationRate: Math.round(utilizationRate * 100) / 100,
            recentBookings: court.bookings.length,
          },
          recentBookings: court.bookings,
        }
      });
    } catch (err: any) {
      res.status(500).json({ 
        success: false,
        error: 'INTERNAL_ERROR',
        message: err.message 
      });
    }
  }

  /**
   * Get court availability for a specific date
   */
  static async getCourtAvailability(req: Request, res: Response): Promise<void> {
    try {
      const courtId = Number(req.params.id);
      const { date } = req.query;
      
      if (!Number.isInteger(courtId) || courtId <= 0) {
        res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Valid court ID is required'
        });
        return;
      }
      
      const targetDate = date ? new Date(date as string) : new Date();
      targetDate.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(targetDate);
      nextDay.setDate(targetDate.getDate() + 1);
      
      const bookings = await prisma.booking.findMany({
        where: {
          courtId: courtId,
          startTime: {
            gte: targetDate,
            lt: nextDay
          },
          status: {
            in: ['PENDING', 'CONFIRMED'] as any[]
          }
        },
        select: {
          startTime: true,
          endTime: true,
        },
        orderBy: {
          startTime: 'asc' as const
        }
      });
      
      res.json({
        success: true,
        data: {
          courtId: courtId,
          date: targetDate,
          bookings,
          availableSlots: bookings.length < 14 ? 14 - bookings.length : 0 // Assuming 14 slots per day
        }
      });
    } catch (err: any) {
      res.status(500).json({ 
        success: false,
        error: 'INTERNAL_ERROR',
        message: err.message 
      });
    }
  }
}

// Export individual handler functions for compatibility
export const createCourt = CourtController.createCourt.bind(CourtController);
export const getCourts = CourtController.getCourts.bind(CourtController);
export const getCourtById = CourtController.getCourtById.bind(CourtController);
export const deleteCourt = CourtController.deleteCourt.bind(CourtController);
export const updateCourt = CourtController.updateCourt.bind(CourtController);
export const getCourtStats = CourtController.getCourtStats.bind(CourtController);
export const getCourtAvailability = CourtController.getCourtAvailability.bind(CourtController);
