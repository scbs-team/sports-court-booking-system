import { Router } from "express";
import {
  signin,
  register,
  getUsers,
  updateUser,
  deleteUser
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import {
  signinSchema,
  registerSchema,
  updateUserSchema
} from "../validations/auth.schema";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/signin", validate(signinSchema), signin);
router.get("/users", authMiddleware, getUsers);
router.patch("/users/:id", authMiddleware, validate(updateUserSchema), updateUser);
router.delete("/users/:id", authMiddleware, deleteUser);

export default router;
