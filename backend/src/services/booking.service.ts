import { prisma } from '../lib/prisma';
import { BookingStatus } from '@prisma/client';
import { assertBookingAllowed } from '../domain/booking/booking.guard';
import { canTransition } from '../domain/booking/booking.transitions';

export type CreateBookingInput = {
  courtId: number;
  startTime: Date;
  endTime: Date;
  userId: string;
};

export class BookingService {
  /**
   * Create a new booking with PENDING status
   */
  static async createBooking(input: CreateBookingInput) {
    await assertBookingAllowed(input);

    return prisma.booking.create({
      data: {
        courtId: input.courtId,
        startTime: input.startTime,
        endTime: input.endTime,
        status: BookingStatus.PENDING,
        // TODO: wire userId once relation is added
      },
    });
  }

  /**
   * Generic status updater with validation
   */
  static async updateBookingStatus(bookingId: number, newStatus: BookingStatus) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new Error(`Booking with ID ${bookingId} not found`);
    }

    if (!canTransition(booking.status, newStatus)) {
      throw new Error(`Cannot transition booking from ${booking.status} to ${newStatus}`);
    }

    return prisma.booking.update({
      where: { id: bookingId },
      data: { status: newStatus },
    });
  }

  /**
   * Confirm a booking (PENDING → CONFIRMED)
   */
  static async confirmBooking(bookingId: number) {
    return this.updateBookingStatus(bookingId, BookingStatus.CONFIRMED);
  }

  /**
   * Complete a booking (CONFIRMED → COMPLETED)
   */
  static async completeBooking(bookingId: number) {
    return this.updateBookingStatus(bookingId, BookingStatus.COMPLETED);
  }

  /**
   * Cancel a booking (PENDING/CONFIRMED → CANCELLED)
   */
  static async cancelBooking(bookingId: number) {
    return this.updateBookingStatus(bookingId, BookingStatus.CANCELLED);
  }
}
