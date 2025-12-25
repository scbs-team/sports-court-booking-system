import { Request, Response } from "express";
import * as bookingService from "../services/booking.service";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json(booking);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getBookings = async (_req: Request, res: Response) => {
  const bookings = await bookingService.getBookings();
  res.json(bookings);
};
