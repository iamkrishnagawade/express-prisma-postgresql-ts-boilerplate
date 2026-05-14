import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../validations/auth.validation";
import { loginUser, registerUser } from "../controllers/auth.controller";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(registerUser));
router.post("/login", validate(loginSchema), asyncHandler(loginUser));

export default router;
