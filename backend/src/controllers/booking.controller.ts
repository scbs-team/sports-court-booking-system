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

export const getBookings = async (req: Request, res: Response) => {
  try {
    const { courtId, status, fromDate, toDate } = req.query;
    
    const filters = {
      courtId: courtId as string,
      status: status as any,
      fromDate: fromDate ? new Date(fromDate as string) : undefined,
      toDate: toDate ? new Date(toDate as string) : undefined,
    };
    
    const bookings = await bookingService.getBookings(filters);
    res.json(bookings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await bookingService.getBookingById(id);
    
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    res.json(booking);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const booking = await bookingService.updateBookingStatus({
      bookingId: id,
      newStatus: status,
    });
    
    res.json(booking);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const checkAvailability = async (req: Request, res: Response) => {
  try {
    const { courtId, startTime, endTime } = req.query;
    
    if (!courtId || !startTime || !endTime) {
      return res.status(400).json({ 
        error: "courtId, startTime, and endTime are required" 
      });
    }
    
    const availability = await bookingService.checkCourtAvailability(
      courtId as string,
      startTime as string,
      endTime as string
    );
    
    res.json(availability);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
