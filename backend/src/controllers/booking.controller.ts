import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';

export async function createBookingHandler(req: Request, res: Response) {
  try {
    const booking = await BookingService.createBooking({
      courtId: req.body.courtId,
      startTime: new Date(req.body.startTime),
      endTime: new Date(req.body.endTime),
      userId: req.user.id, // from auth middleware
    });

    res.status(201).json(booking);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function confirmBookingHandler(req: Request, res: Response) {
  try {
    const booking = await BookingService.confirmBooking(Number(req.params.id));
    res.json(booking);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function cancelBookingHandler(req: Request, res: Response) {
  try {
    const booking = await BookingService.cancelBooking(Number(req.params.id));
    res.json(booking);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function completeBookingHandler(req: Request, res: Response) {
  try {
    const booking = await BookingService.completeBooking(Number(req.params.id));
    res.json(booking);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
