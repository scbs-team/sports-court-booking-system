import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const result = await authService.signin(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  const users = await authService.getAllUsers();
  res.json(users);
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.id !== req.params.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const user = await authService.updateUser({
      id: req.params.id,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.id !== req.params.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const result = await authService.deleteUser(req.params.id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
