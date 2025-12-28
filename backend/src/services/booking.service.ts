import { prisma } from '../lib/prisma';
import { BookingStatus } from '@prisma/client';
import { assertBookingAllowed } from '../domain/booking/booking.guard';

type CreateBookingInput = {
  courtId: number;
  startTime: Date;
  endTime: Date;
  userId: string;
};

export async function createBooking(input: CreateBookingInput) {
  await assertBookingAllowed(input);

  return prisma.booking.create({
    data: {
      courtId: input.courtId,
      startTime: input.startTime,
      endTime: input.endTime,
      status: BookingStatus.PENDING,
      // userId will be wired once relation is added
    },
  });
}

import { assertStatusTransitionAllowed } from '../domain/booking/booking.lifecycle';

export async function confirmBooking(bookingId: number) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) throw new Error('Booking not found');

  assertStatusTransitionAllowed(booking.status, BookingStatus.CONFIRMED);

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.CONFIRMED },
  });
}

import { assertCanCompleteBooking } from '../domain/booking/booking.lifecycle';

export async function completeBooking(bookingId: number) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) throw new Error('Booking not found');

  assertCanCompleteBooking(booking.status, booking.endTime);

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.COMPLETED },
  });
}

import { assertCanCancelBooking } from '../domain/booking/booking.lifecycle';

export async function cancelBooking(bookingId: number) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) throw new Error('Booking not found');

  assertCanCancelBooking(booking.status);

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.CANCELLED },
  });
}
