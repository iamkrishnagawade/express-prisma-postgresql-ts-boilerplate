import { prisma } from "../config/prisma";

export const createUserService = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  return prisma.user.create({
    data: payload,
  });
};
