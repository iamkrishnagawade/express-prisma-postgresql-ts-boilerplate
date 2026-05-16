import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../validations/auth.validation";
import {
  adminDashboard,
  getMe,
  loginUser,
  registerUser,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/role.middleware";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(registerUser));
router.post("/login", validate(loginSchema), asyncHandler(loginUser));
router.get("/me", authMiddleware, asyncHandler(getMe));
router.get(
  "/admin",
  authMiddleware,
  authorizeRole("ADMIN", "SUPER_ADMIN"),
  asyncHandler(adminDashboard),
);

export default router;
