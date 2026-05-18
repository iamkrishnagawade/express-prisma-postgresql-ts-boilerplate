import { Request, Response } from "express";
import { sendResponse } from "../utils/apiResponse";
import { createUserService } from "../services/user.service";

export const getUsers = async (req: Request, res: Response) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const users = [
    {
      id: 1,
      name: "Krishna",
    },
  ];

  return sendResponse(res, 200, "Users fetched successfully", users, {
    page: 1,
    limit: 10,
    total: 50,
  });
};

export const createUser = async (req: Request, res: Response) => {
  const user = req.body;

  const result = await createUserService(user);
  return sendResponse(res, 201, "User created successfully", result);
};
