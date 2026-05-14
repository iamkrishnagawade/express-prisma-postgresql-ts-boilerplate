import { Request, Response } from "express";
import { sendResponse } from "../utils/apiResponse";
import {
  loginUserService,
  registerUserService,
} from "../services/auth.service";

export const registerUser = async (req: Request, res: Response) => {
  const result = await registerUserService(req.body);
  return sendResponse(res, 201, "User registered successfully", result);
};

export const loginUser = async (req: Request, res: Response) => {
  const result = await loginUserService(req.body);
  return sendResponse(res, 201, "login successfully", result);
};
