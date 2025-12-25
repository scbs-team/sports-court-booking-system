import prisma from "../lib/prisma";
import { BookingStatus } from "@prisma/client";

interface CreateBookingInput {
  courtId: number;
  startTime: string;
  endTime: string;
}

/**
 * INTERNAL: Check overlap against ACTIVE bookings only
 */
const checkOverlap = async (
  courtId: number,
  startTime: Date,
  endTime: Date
) => {
  const overlap = await prisma.booking.findFirst({
    where: {
      courtId,
      status: {
        in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
      },
      AND: [
        { startTime: { lt: endTime } },
        { endTime: { gt: startTime } },
      ],
    },
  });

  if (overlap) {
    throw new Error("BOOKING_CONFLICT");
  }
};

/**
 * CREATE → always PENDING
 */
export const createBooking = async (data: CreateBookingInput) => {
  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);

  if (startTime >= endTime) {
    throw new Error("INVALID_TIME_RANGE");
  }

  if (startTime < new Date()) {
    throw new Error("PAST_BOOKING_NOT_ALLOWED");
  }

  await checkOverlap(data.courtId, startTime, endTime);

  return prisma.booking.create({
    data: {
      courtId: data.courtId,
      startTime,
      endTime,
      status: BookingStatus.PENDING,
    },
  });
};

/**
 * CONFIRM: PENDING → CONFIRMED
 */
export const confirmBooking = async (id: number) => {
  const booking = await prisma.booking.findUnique({ where: { id } });

  if (!booking) throw new Error("NOT_FOUND");
  if (booking.status !== BookingStatus.PENDING) {
    throw new Error("INVALID_STATUS_TRANSITION");
  }

  await checkOverlap(
    booking.courtId,
    booking.startTime,
    booking.endTime
  );

  return prisma.booking.update({
    where: { id },
    data: { status: BookingStatus.CONFIRMED },
  });
};

/**
 * CANCEL: PENDING | CONFIRMED → CANCELLED
 */
export const cancelBooking = async (id: number) => {
  const booking = await prisma.booking.findUnique({ where: { id } });

  if (!booking) throw new Error("NOT_FOUND");

  if (
    booking.status === BookingStatus.CANCELLED ||
    booking.status === BookingStatus.COMPLETED
  ) {
    throw new Error("INVALID_STATUS_TRANSITION");
  }

  return prisma.booking.update({
    where: { id },
    data: { status: BookingStatus.CANCELLED },
  });
};

/**
 * COMPLETE: CONFIRMED → COMPLETED
 */
export const completeBooking = async (id: number) => {
  const booking = await prisma.booking.findUnique({ where: { id } });

  if (!booking) throw new Error("NOT_FOUND");
  if (booking.status !== BookingStatus.CONFIRMED) {
    throw new Error("INVALID_STATUS_TRANSITION");
  }

  if (new Date() < booking.endTime) {
    throw new Error("BOOKING_NOT_FINISHED");
  }

  return prisma.booking.update({
    where: { id },
    data: { status: BookingStatus.COMPLETED },
  });
};

/**
 * READ
 */
export const getBookings = async () => {
  return prisma.booking.findMany({
    include: { court: true },
    orderBy: { startTime: "asc" },
  });
};
