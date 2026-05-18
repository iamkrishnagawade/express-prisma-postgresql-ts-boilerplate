import { Router, Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { createUser, getUsers } from "../controllers/user.controller";
import AppError from "../utils/AppError";
import { validate } from "../middlewares/validate.middleware";
import { createUserSchema } from "../validations/user.validation";
import authRoutes from "./auth.routes";

const router = Router();

router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API running",
  });
});

// Test error middleware
router.get("/error", (req: Request, _res: Response) => {
  throw new Error("Test error route");
});

// Test async error
router.get(
  "/async-error",
  asyncHandler(async (req: Request, _res: Response) => {
    throw new Error("Async route error");
  })
);

// Users routes
router.get("/users", asyncHandler(getUsers));
router.post("/users", validate(createUserSchema), asyncHandler(createUser));

// Auth routes
router.use("/auth", authRoutes);

// Test custom error
router.get(
  "/custom-error",
  asyncHandler(async (_req: Request, res: Response) => {
    const user = null;

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
    });
  })
);

export default router;
