import { Response } from "express";

interface Meta {
  page?: number;
  limit?: number;
  total?: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  meta?: Meta;
  data?: T;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  meta?: Meta
) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
  };

  if (meta) {
    response.meta = meta;
  }

  if (data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};
