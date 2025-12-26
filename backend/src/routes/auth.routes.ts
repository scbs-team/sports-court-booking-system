import { Router } from "express";
import {
  signin,
  register,
  getUsers,
  updateUser,
  deleteUser
} from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import {
  signinSchema,
  registerSchema,
  updateUserSchema
} from "../validations/auth.schema";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/signin", validate(signinSchema), signin);
router.get("/users", requireAuth, getUsers);
router.patch("/users/:id", requireAuth, validate(updateUserSchema), updateUser);
router.delete("/users/:id", requireAuth, deleteUser);

export default router;
