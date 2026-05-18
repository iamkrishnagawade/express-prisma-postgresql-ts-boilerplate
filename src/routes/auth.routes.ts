import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../validations/auth.validation";
import {
  adminDashboard,
  getMe,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/role.middleware";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(registerUser));
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login success
 */
router.post("/login", validate(loginSchema), asyncHandler(loginUser));

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Current user
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User fetched
 */
router.get("/me", authMiddleware, asyncHandler(getMe));
router.get(
  "/admin",
  authMiddleware,
  authorizeRole("ADMIN", "SUPER_ADMIN"),
  asyncHandler(adminDashboard)
);
router.post("/refresh-token", asyncHandler(refreshAccessToken));
router.post("/logout", asyncHandler(logoutUser));

export default router;
