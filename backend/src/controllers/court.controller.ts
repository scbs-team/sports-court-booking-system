import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const createCourt = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim() === "") {
      return res.status(400).json({ 
        success: false,
        error: "Court name is required" 
      });
    }
    
    const court = await prisma.court.create({
      data: { name: name.trim() }
    });
    
    res.status(201).json({
      success: true,
      data: court,
      message: "Court created successfully"
    });
  } catch (err: any) {
    if (err.code === 'P2002') { // Unique constraint violation
      return res.status(409).json({
        success: false,
        error: "Court with this name already exists"
      });
    }
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

export const getCourts = async (req: Request, res: Response) => {
  try {
    const courts = await prisma.court.findMany({
      include: {
        bookings: {
          where: {
            startTime: {
              gte: new Date() // Only show upcoming bookings
            }
          },
          orderBy: {
            startTime: 'asc'
          },
          take: 5 // Limit to 5 upcoming bookings
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    res.json({
      success: true,
      data: courts,
      count: courts.length
    });
  } catch (err: any) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

export const getCourtById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id || !/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: "Valid court ID is required"
      });
    }
    
    const court = await prisma.court.findUnique({
      where: { id: Number(id) },
      include: {
        bookings: {
          where: {
            startTime: {
              gte: new Date(new Date().setDate(new Date().getDate() - 1)) // Last 24 hours + future
            }
          },
          orderBy: {
            startTime: 'asc'
          }
        }
      }
    });
    
    if (!court) {
      return res.status(404).json({
        success: false,
        error: "Court not found"
      });
    }
    
    res.json({
      success: true,
      data: court
    });
  } catch (err: any) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

export const deleteCourt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id || !/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: "Valid court ID is required"
      });
    }
    
    // Check if court has any bookings (active or future)
    const activeBookings = await prisma.booking.count({
      where: {
        courtId: Number(id),
        // REMOVED: status check since we don't have status field
        endTime: {
          gt: new Date() // Only check future bookings
        }
      }
    });
    
    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete court with future bookings"
      });
    }
    
    const court = await prisma.court.delete({
      where: { id: Number(id) }
    });
    
    res.json({
      success: true,
      message: "Court deleted successfully",
      data: court
    });
  } catch (err: any) {
    if (err.code === 'P2025') { // Record not found
      return res.status(404).json({
        success: false,
        error: "Court not found"
      });
    }
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

export const updateCourt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!id || !/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: "Valid court ID is required"
      });
    }
    
    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Court name is required"
      });
    }
    
    const court = await prisma.court.update({
      where: { id: Number(id) },
      data: { name: name.trim() }
    });
    
    res.json({
      success: true,
      message: "Court updated successfully",
      data: court
    });
  } catch (err: any) {
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: "Court not found"
      });
    }
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: "Court with this name already exists"
      });
    }
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};
