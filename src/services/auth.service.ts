import { prisma } from "../config/prisma";
import AppError from "../utils/AppError";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";

export const registerUserService = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    throw new AppError("Email already exist", 404);
  }

  const hashedPassword = await hashPassword(payload.password);

  const user = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
  });

  const token = generateToken({ userId: user.id });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

export const loginUserService = async (payload: {
  email: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isPasswordMatched = await comparePassword(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken({ userId: user.id });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};
