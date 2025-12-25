import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const createCourt = async (req: Request, res: Response) => {
  const court = await prisma.court.create({
    data: {
      name: req.body.name
    }
  });

  res.status(201).json(court);
};

export const getCourts = async (_req: Request, res: Response) => {
  const courts = await prisma.court.findMany();
  res.json(courts);
};
