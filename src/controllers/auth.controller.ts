import { Request, Response } from "express";
import { sendResponse } from "../utils/apiResponse";
import {
  loginUserService,
  registerUserService,
} from "../services/auth.service";
import { prisma } from "../config/prisma";

export const registerUser = async (req: Request, res: Response) => {
  const result = await registerUserService(req.body);
  return sendResponse(res, 201, "User registered successfully", result);
};

export const loginUser = async (req: Request, res: Response) => {
  const result = await loginUserService(req.body);
  return sendResponse(res, 201, "login successfully", result);
};

// Protected controller
export const getMe = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user?.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return sendResponse(res, 200, "User fetched successfully", user);
};
