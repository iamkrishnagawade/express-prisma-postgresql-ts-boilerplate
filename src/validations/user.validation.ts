import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().min(3, "Invalid email address"),
    password: z.string().min(6, "Password must me at least 6 characters"),
  }),
});
