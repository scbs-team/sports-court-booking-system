import prisma from "../lib/prisma";

interface CreateBookingInput {
  courtId: number;
  startTime: string;
  endTime: string;
}

export const createBooking = async (data: CreateBookingInput) => {
  const overlap = await prisma.booking.findFirst({
    where: {
      courtId: data.courtId,
      AND: [
        { startTime: { lt: new Date(data.endTime) } },
        { endTime: { gt: new Date(data.startTime) } },
      ],
    },
  });

  if (overlap) {
    throw new Error("Time slot already booked");
  }

  return prisma.booking.create({
    data: {
      courtId: data.courtId,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
    },
  });
};

export const getBookings = async () => {
  return prisma.booking.findMany({
    include: { court: true },
  });
};

export const getAvailableCourts = async (startTime: string, endTime: string) => {
  const bookedCourtIds = (
    await prisma.booking.findMany({
      where: {
        AND: [
          { startTime: { lt: new Date(endTime) } },
          { endTime: { gt: new Date(startTime) } },
        ],
      },
      select: { courtId: true },
    })
  ).map((b) => b.courtId);

  return prisma.court.findMany({
    where: { id: { notIn: bookedCourtIds } },
  });
};
