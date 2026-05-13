import { Request, Response } from "express";
import { sendResponse } from "../utils/apiResponse";

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
