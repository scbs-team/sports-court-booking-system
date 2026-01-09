import { prisma } from '../../lib/prisma';
import { BookingStatus } from '@prisma/client';
import { BookingConflictCheck } from './booking.types';

export async function hasBookingConflict({
  courtId,
  startTime,
  endTime,
  excludeBookingId,
}: BookingConflictCheck): Promise<boolean> {
  const conflict = await prisma.booking.findFirst({
    where: {
      courtId,
      status: {
        in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
      },
      ...(excludeBookingId && {
        id: { not: excludeBookingId },
      }),
      AND: [
        { startTime: { lt: endTime } },
        { endTime: { gt: startTime } },
      ],
    },
  });

  return Boolean(conflict);
}
