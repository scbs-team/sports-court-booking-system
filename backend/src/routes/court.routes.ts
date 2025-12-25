import { Router } from "express";
import {
  createCourt,
  getCourts
} from "../controllers/court.controller";

const router = Router();

router.post("/", createCourt);
router.get("/", getCourts);

export default router;
